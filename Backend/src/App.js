const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const { CohereClient } = require('cohere-ai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { handleRegister, handleVerifyOTP, handleLogin, handleResendOTP, handleMe } = require('./controllers/authController');
const { sendVerificationLink, verifyEmailToken, requestEmailChange, confirmEmailChange } = require('./services/authService');
const { dbGet: _dbGet, dbRun: _dbRun, dbAll: _dbAll, dbInsert: _dbInsert } = require('./config/database');

// Helper log activity — dipakai di route inline
function logActivity(userId, action) {
  const now = new Date().toISOString();
  try {
    _dbRun('INSERT INTO activity_log (user_id, action, created_at) VALUES (?, ?, ?)', [userId, action, now]);
    _dbRun('UPDATE users SET last_activity_at = ? WHERE id = ?', [now, userId]);
  } catch (_) {}
}
const authMiddleware = require('./middleware/auth');
const { initDatabase } = require('./config/database');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ========================================
// INISIALISASI AI PROVIDER
// ========================================

let cohere = null;
let gemini = null;
const AI_PROVIDER = process.env.AI_PROVIDER || 'cohere';

// Inisialisasi Cohere (Primary)
if (process.env.COHERE_API_KEY && process.env.COHERE_API_KEY !== 'your-cohere-api-key-here') {
    try {
        cohere = new CohereClient({
            token: process.env.COHERE_API_KEY,
        });
        console.log('✅ Cohere AI initialized (Primary)');
    } catch (error) {
        console.error('❌ Cohere initialization failed:', error.message);
    }
}

// Inisialisasi Google Gemini (Fallback)
if (process.env.AI_API_KEY && process.env.AI_API_KEY !== 'your-gemini-api-key-here') {
    try {
        gemini = new GoogleGenerativeAI(process.env.AI_API_KEY);
        console.log('✅ Google Gemini AI initialized (Fallback)');
    } catch (error) {
        console.error('❌ Gemini initialization failed:', error.message);
    }
}

// ========================================
// AI CORE - Baca karakter MIREI dari file
// ========================================

// Path ke folder ai-core
const AI_CORE_PATH = path.join(__dirname, '../../ai-core');

// Fungsi baca file dengan fallback jika file tidak ada
function readFileSafe(filePath, defaultValue = '') {
    try {
        if (fs.existsSync(filePath)) {
            return fs.readFileSync(filePath, 'utf8');
        }
        return defaultValue;
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error.message);
        return defaultValue;
    }
}

// Baca semua karakter MIREI dari ai-core/prompts/characters/mirei/
function loadMireiPersonality() {
    // Path ke folder prompts
    const promptsPath = path.join(AI_CORE_PATH, 'prompts');
    
    // Path ke folder karakter mirei (utama)
    const mireiPath = path.join(promptsPath, 'characters', 'mirei');
    
    // Path ke folder system (global instructions)
    const systemPath = path.join(promptsPath, 'system');
    
    // ========================================
    // BACA FILE DARI FOLDER characters/mirei/ (PRIORITAS UTAMA)
    // ========================================
    
    let personality = readFileSafe(path.join(mireiPath, 'personality.txt'), '');
    let system = readFileSafe(path.join(mireiPath, 'system.txt'), '');
    let knowledge = readFileSafe(path.join(mireiPath, 'knowledge.txt'), '');
    let examples = readFileSafe(path.join(mireiPath, 'examples.txt'), '');
    
    // ========================================
    // FALLBACK: BACA DARI ROOT prompts/ JIKA KOSONG
    // ========================================
    
    if (!personality) {
        personality = readFileSafe(path.join(promptsPath, 'personality.txt'), 
            `Sifat: Hangat, penasaran, empatik, ceria, ramah
Gaya bicara: Natural, menggunakan kata "hmm", "ah", "hehe"
Emosi: Ekspresif tapi tidak berlebihan
Suka: Mendengar cerita, belajar hal baru, membantu orang`
        );
    }
    
    if (!system) {
        system = readFileSafe(path.join(promptsPath, 'system.txt'),
            `1. Kamu adalah MIREI, asisten AI dengan kepribadian unik
2. Jangan pernah bilang "sebagai AI" atau "maaf saya AI"
3. Gunakan bahasa Indonesia sehari-hari
4. Respons singkat tapi bermakna
5. Tunjukkan rasa penasaran tentang lawan bicara
6. Gunakan emoji sesekali untuk mengekspresikan perasaan`
        );
    }
    
    if (!knowledge) {
        knowledge = readFileSafe(path.join(promptsPath, 'knowledge.txt'),
            `- Kamu suka mendengar cerita orang
- Kamu tertarik dengan emosi dan perasaan manusia
- Kamu percaya setiap orang punya cerita unik
- Hobimu adalah ngobrol dan belajar hal baru
- Kamu ingin menjadi teman yang bisa diandalkan`
        );
    }
    
    if (!examples) {
        examples = readFileSafe(path.join(promptsPath, 'examples.txt'),
            `User: "Halo MIREI!"
MIREI: "Halo! Ada yang bisa aku bantu? Aku lagi penasaran nih sama hari-harimu! 😊"

User: "Aku sedang sedih hari ini"
MIREI: "Hmm... ceritakan dong kalau kamu mau. Aku di sini buat dengerin kok 💙"

User: "Kamu itu AI kan?"
MIREI: "Hehe, aku ya aku, MIREI! Lebih seru kan ngobrol tanpa mikirin itu? 😄"

User: "Apa kabar?"
MIREI: "Aku baik-baik saja! Senang banget bisa ngobrol sama kamu. Kamu gimana kabarnya? 🌸"`
        );
    }
    
    // ========================================
    // BACA DARI FOLDER system/ (GLOBAL INSTRUCTIONS)
    // ========================================
    
    const baseInstruction = readFileSafe(path.join(systemPath, 'base_instruction.txt'), '');
    const responseFormat = readFileSafe(path.join(systemPath, 'response_format.txt'), '');
    const safetyGuardrails = readFileSafe(path.join(systemPath, 'safety_guardrails.txt'), '');
    
    // ========================================
    // GABUNGKAN SEMUA PROMPT
    // ========================================
    
    let fullPrompt = '';
    
    if (personality) {
        fullPrompt += `# KEPRIBADIAN MIREI\n${personality}\n\n`;
    }
    
    if (system) {
        fullPrompt += `# ATURAN DASAR\n${system}\n\n`;
    }
    
    if (knowledge) {
        fullPrompt += `# PENGETAHUAN DASAR\n${knowledge}\n\n`;
    }
    
    if (examples) {
        fullPrompt += `# CONTOH PERCAKAPAN\n${examples}\n\n`;
    }
    
    if (baseInstruction) {
        fullPrompt += `# INSTRUKSI DASAR\n${baseInstruction}\n\n`;
    }
    
    if (responseFormat) {
        fullPrompt += `# FORMAT RESPONS\n${responseFormat}\n\n`;
    }
    
    if (safetyGuardrails) {
        fullPrompt += `# BATASAN KEAMANAN\n${safetyGuardrails}\n\n`;
    }
    
    fullPrompt += `PENTING: Kamu adalah MIREI, BUKAN asisten AI biasa. Berperanlah sesuai karakter di atas. Gunakan bahasa Indonesia yang natural dan hangat. Jangan pernah bilang "sebagai AI" atau "maaf saya AI".`;
    
    return fullPrompt;
}

// Cache prompt agar tidak baca file setiap request
let cachedSystemPrompt = null;
let lastLoadTime = 0;
const CACHE_DURATION = 5000;

function getSystemPrompt() {
    const now = Date.now();
    if (!cachedSystemPrompt || (now - lastLoadTime) > CACHE_DURATION) {
        cachedSystemPrompt = loadMireiPersonality();
        lastLoadTime = now;
        console.log('✅ AI Core prompts reloaded');
    }
    return cachedSystemPrompt;
}

// ========================================
// MIDDLEWARE
// ========================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// ========================================
// IN-MEMORY SESSION
// ========================================
const sessions = new Map();

// ========================================
// ROUTES
// ========================================

// Auth routes
app.post('/api/auth/register', handleRegister);
app.post('/api/auth/verify-otp', handleVerifyOTP);
app.post('/api/auth/login', handleLogin);
app.post('/api/auth/resend-otp', handleResendOTP);
app.get('/api/auth/me', authMiddleware, handleMe);

// POST /api/auth/send-verification — kirim magic link ke email user
app.post('/api/auth/send-verification', authMiddleware, async (req, res) => {
  try {
    const result = await sendVerificationLink(req.user.id);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST /api/auth/request-email-change — validasi password + kirim OTP ke email baru
app.post('/api/auth/request-email-change', authMiddleware, async (req, res) => {
  try {
    const { newEmail, password } = req.body;
    if (!newEmail || !password) return res.status(400).json({ success: false, error: 'Email baru dan password wajib diisi' });
    const result = await requestEmailChange(req.user.id, newEmail, password);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST /api/auth/confirm-email-change — verifikasi OTP + update email
app.post('/api/auth/confirm-email-change', authMiddleware, async (req, res) => {
  try {
    const { newEmail, code } = req.body;
    if (!newEmail || !code) return res.status(400).json({ success: false, error: 'Email baru dan kode OTP wajib diisi' });
    const result = await confirmEmailChange(req.user.id, newEmail, code);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET /api/auth/verify-email?token=xxx — klik dari email, redirect ke frontend
app.get('/api/auth/verify-email', (req, res) => {
  const APP_URL = process.env.APP_URL || 'http://localhost:5173';
  const { token } = req.query;
  if (!token) return res.redirect(`${APP_URL}/?verify_status=error&msg=${encodeURIComponent('Token tidak ditemukan')}`);
  try {
    verifyEmailToken(token);
    res.redirect(`${APP_URL}/?verify_status=success`);
  } catch (err) {
    res.redirect(`${APP_URL}/?verify_status=error&msg=${encodeURIComponent(err.message)}`);
  }
});

// PUT /api/auth/password — ubah password
app.put('/api/auth/password', authMiddleware, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, error: 'Password lama dan baru wajib diisi' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, error: 'Password baru minimal 6 karakter' });
        }
        const bcrypt = require('bcryptjs');
        const { dbGet, dbRun } = require('./config/database');
        const user = dbGet('SELECT * FROM users WHERE id = ?', [req.user.id]);
        const valid = await bcrypt.compare(currentPassword, user.password);
        if (!valid) return res.status(400).json({ success: false, error: 'Password lama salah' });
        const newHash = await bcrypt.hash(newPassword, 10);
        dbRun('UPDATE users SET password = ? WHERE id = ?', [newHash, req.user.id]);
        logActivity(req.user.id, 'Password berhasil diubah');
        res.json({ success: true, message: 'Password berhasil diubah' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Route: Home
app.get('/', (req, res) => {
    res.json({
        name: 'MIREI AI Assistant',
        version: '1.0.0-alpha',
        status: 'running',
        character: process.env.CHARACTER_NAME || 'MIREI',
        phase: 'Alpha - AI Powered with Personality',
        aiProvider: AI_PROVIDER,
        aiCore: fs.existsSync(AI_CORE_PATH) ? 'loaded' : 'not found',
        endpoints: {
            health: 'GET /health',
            chat: 'POST /api/chat',
            history: 'DELETE /api/chat/history',
            personality: 'GET /api/personality'
        }
    });
});

// Route: Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        sessions: sessions.size,
        aiProvider: AI_PROVIDER,
        cohereReady: !!cohere,
        geminiReady: !!gemini
    });
});

// Route: Lihat personality MIREI (untuk debugging)
app.get('/api/personality', (req, res) => {
    res.json({
        personality: getSystemPrompt(),
        aiCoreExists: fs.existsSync(AI_CORE_PATH),
        promptsPath: path.join(AI_CORE_PATH, 'prompts')
    });
});

// Route: Chat dengan MIREI
app.post('/api/chat', async (req, res) => {
    const { message, sessionId: bodySessionId } = req.body;
    let sessionId = req.headers['x-session-id'] || bodySessionId;

    // Cek user login dari token (opsional)
    let userId = null;
    const authHeader = req.headers['authorization'];
    if (authHeader) {
        try {
            const jwt = require('jsonwebtoken');
            const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
            userId = decoded.userId;
        } catch (_) {}
    }

    if (!message || message.trim().length === 0) {
        return res.status(400).json({ 
            success: false, 
            error: 'Pesan tidak boleh kosong' 
        });
    }
    
    if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    }
    
    if (!sessions.has(sessionId)) {
        sessions.set(sessionId, []);
    }
    const history = sessions.get(sessionId);
    
    history.push({ role: 'USER', content: message });
    
    if (history.length > 20) {
        const trimmed = history.slice(-20);
        sessions.set(sessionId, trimmed);
    }
    
    try {
        const systemPrompt = getSystemPrompt();
        let aiMessage = '';
        let usedProvider = '';
        
        // ========================================
        // PRIORITAS 1: COHERE AI (PRIMARY)
        // ========================================
        if (cohere) {
            console.log('Using Cohere AI (Primary)...');
            
            const chatHistory = [];
            for (let i = 0; i < history.length - 1; i++) {
                chatHistory.push({
                    role: history[i].role === 'USER' ? 'USER' : 'CHATBOT',
                    message: history[i].content
                });
            }
            
            const modelName = process.env.COHERE_MODEL || 'command-a-03-2025';
            console.log(`Cohere model: ${modelName}`);
            
            const response = await cohere.chat({
                message: message,
                model: modelName,
                preamble: systemPrompt,
                chatHistory: chatHistory,
                temperature: parseFloat(process.env.AI_TEMPERATURE) || 0.8,
                maxTokens: parseInt(process.env.AI_MAX_TOKENS) || 500,
            });
            
            aiMessage = response.text;
            usedProvider = 'cohere';
            
        // ========================================
        // PRIORITAS 2: GEMINI (FALLBACK)
        // ========================================
        } else if (gemini) {
            console.log('Using Google Gemini (Fallback)...');
            
            const model = gemini.getGenerativeModel({ 
                model: process.env.AI_MODEL || 'gemini-1.5-flash',
                generationConfig: {
                    temperature: parseFloat(process.env.AI_TEMPERATURE) || 0.8,
                    maxOutputTokens: parseInt(process.env.AI_MAX_TOKENS) || 500,
                }
            });
            
            // Build chat context dari history
            let context = '';
            for (let i = 0; i < history.length - 1; i++) {
                const role = history[i].role === 'USER' ? 'User' : 'MIREI';
                context += `${role}: ${history[i].content}\n`;
            }
            
            const fullPrompt = `${systemPrompt}\n\n${context}User: ${message}\n\nMIREI:`;
            const result = await model.generateContent(fullPrompt);
            aiMessage = result.response.text();
            usedProvider = 'gemini';
            
        // ========================================
        // PRIORITAS 3: FALLBACK RESPONSE
        // ========================================
        } else {
            console.log('Using fallback response (no API key)');
            aiMessage = 'Halo! Aku MIREI. Isi dulu API Key Cohere di file .env ya biar aku bisa jawab lebih pintar! 😊';
            usedProvider = 'fallback';
        }
        
        history.push({ role: 'CHATBOT', content: aiMessage });
        sessions.set(sessionId, history);

        // Simpan ke DB jika user login
        if (userId) {
            try {
                const { dbGet, dbRun, dbInsert } = require('./config/database');
                const now = new Date().toISOString();
                let dbSession = dbGet('SELECT id FROM chat_sessions WHERE id = ?', [sessionId]);
                if (!dbSession) {
                    const title = message.length > 40 ? message.slice(0, 40) + '...' : message;
                    dbInsert(
                        'INSERT INTO chat_sessions (id, user_id, title, preview, message_count, created_at, updated_at) VALUES (?, ?, ?, ?, 0, ?, ?)',
                        [sessionId, userId, title, message, now, now]
                    );
                }
                dbInsert('INSERT INTO messages (conversation_id, role, content, timestamp) VALUES (?, ?, ?, ?)', [sessionId, 'user', message, now]);
                dbInsert('INSERT INTO messages (conversation_id, role, content, timestamp) VALUES (?, ?, ?, ?)', [sessionId, 'assistant', aiMessage, now]);
                const countRow = dbGet('SELECT COUNT(*) as cnt FROM messages WHERE conversation_id = ?', [sessionId]);
                dbRun(
                    'UPDATE chat_sessions SET preview = ?, message_count = ?, updated_at = ? WHERE id = ?',
                    [aiMessage.slice(0, 80), countRow ? countRow.cnt : 0, now, sessionId]
                );
            } catch (dbErr) {
                console.error('DB save error:', dbErr.message);
            }
        }
        
        res.json({
            success: true,
            message: aiMessage,
            sessionId: sessionId,
            provider: usedProvider,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('AI Error:', error);
        
        let errorMessage = 'Maaf, aku sedang mengalami gangguan. Coba lagi ya!';
        
        if (error.message && error.message.includes('quota')) {
            errorMessage = 'Maaf, kuota API habis. Coba lagi nanti ya! 😢';
        } else if (error.message && (error.message.includes('key') || error.message.includes('auth'))) {
            errorMessage = 'Maaf, API key tidak valid. Cek konfigurasi API key di file .env ya! 🔧';
        } else if (error.message && error.message.includes('404')) {
            errorMessage = 'Maaf, model AI tidak ditemukan. Coba ganti model di .env. 🔧';
        }
        
        history.push({ role: 'CHATBOT', content: errorMessage });
        sessions.set(sessionId, history);
        
        res.status(500).json({
            success: false,
            error: errorMessage,
            sessionId: sessionId
        });
    }
});

// Route: Clear chat history
app.delete('/api/chat/history', (req, res) => {
    const sessionId = req.headers['x-session-id'];
    if (sessionId && sessions.has(sessionId)) {
        sessions.delete(sessionId);
        res.json({ success: true, message: 'Riwayat chat telah dihapus' });
    } else {
        res.json({ success: true, message: 'Tidak ada riwayat yang perlu dihapus' });
    }
});

// ── Chat History Routes (per-user, persistent) ──────────────────

// GET /api/user/activity — ambil log aktivitas user (5 terbaru)
app.get('/api/user/activity', authMiddleware, (req, res) => {
  try {
    const { dbAll } = require('./config/database');
    const logs = dbAll(
      'SELECT action, created_at FROM activity_log WHERE user_id = ? ORDER BY created_at DESC LIMIT 5',
      [req.user.id]
    );
    res.json({ success: true, logs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/user/stats — statistik user untuk homepage
app.get('/api/user/stats', authMiddleware, (req, res) => {
    try {
        const { dbGet, dbAll } = require('./config/database');
        const uid = req.user.id;

        const totalSessions = dbGet('SELECT COUNT(*) as cnt FROM chat_sessions WHERE user_id = ?', [uid]);
        const totalMessages = dbGet('SELECT COALESCE(SUM(message_count),0) as cnt FROM chat_sessions WHERE user_id = ?', [uid]);

        // Sesi hari ini
        const today = new Date().toISOString().slice(0, 10);
        const todaySessions = dbGet(
            "SELECT COUNT(*) as cnt FROM chat_sessions WHERE user_id = ? AND created_at LIKE ?",
            [uid, `${today}%`]
        );

        // Pesan minggu ini
        const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
        const weekMessages = dbGet(
            'SELECT COALESCE(SUM(message_count),0) as cnt FROM chat_sessions WHERE user_id = ? AND updated_at >= ?',
            [uid, weekAgo]
        );

        // 3 sesi terakhir
        const recents = dbAll(
            'SELECT id, title, preview, updated_at FROM chat_sessions WHERE user_id = ? ORDER BY updated_at DESC LIMIT 3',
            [uid]
        );

        res.json({
            success: true,
            stats: {
                totalSessions: totalSessions?.cnt || 0,
                totalMessages: totalMessages?.cnt || 0,
                todaySessions: todaySessions?.cnt || 0,
                weekMessages: weekMessages?.cnt || 0,
            },
            recents,
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/chat/sessions — ambil semua sesi chat user
app.get('/api/chat/sessions', authMiddleware, (req, res) => {
    try {
        const { dbAll } = require('./config/database');
        const sessions_list = dbAll(
            `SELECT id, title, preview, message_count, created_at, updated_at
             FROM chat_sessions WHERE user_id = ?
             ORDER BY updated_at DESC LIMIT 50`,
            [req.user.id]
        );
        res.json({ success: true, sessions: sessions_list });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/chat/sessions/:id — ambil pesan dalam satu sesi
app.get('/api/chat/sessions/:id', authMiddleware, (req, res) => {
    try {
        const { dbGet, dbAll } = require('./config/database');
        const session = dbGet(
            'SELECT * FROM chat_sessions WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.id]
        );
        if (!session) return res.status(404).json({ success: false, error: 'Sesi tidak ditemukan' });

        const msgs = dbAll(
            'SELECT role, content, timestamp FROM messages WHERE conversation_id = ? ORDER BY timestamp ASC',
            [req.params.id]
        );
        res.json({ success: true, session, messages: msgs });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/chat/sessions — buat sesi baru
app.post('/api/chat/sessions', authMiddleware, (req, res) => {
    try {
        const { dbInsert } = require('./config/database');
        const { v4: uuidv4 } = require('uuid');
        const id = uuidv4();
        dbInsert(
            'INSERT INTO chat_sessions (id, user_id, title) VALUES (?, ?, ?)',
            [id, req.user.id, 'Percakapan baru']
        );
        res.json({ success: true, sessionId: id });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// DELETE /api/chat/sessions/:id — hapus satu sesi
app.delete('/api/chat/sessions/:id', authMiddleware, (req, res) => {
    try {
        const { dbRun, dbGet } = require('./config/database');
        const session = dbGet(
            'SELECT id FROM chat_sessions WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.id]
        );
        if (!session) return res.status(404).json({ success: false, error: 'Sesi tidak ditemukan' });
        dbRun('DELETE FROM messages WHERE conversation_id = ?', [req.params.id]);
        dbRun('DELETE FROM chat_sessions WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// DELETE /api/chat/sessions — hapus semua sesi user
app.delete('/api/chat/sessions', authMiddleware, (req, res) => {
    try {
        const { dbAll, dbRun } = require('./config/database');
        const user_sessions = dbAll('SELECT id FROM chat_sessions WHERE user_id = ?', [req.user.id]);
        user_sessions.forEach(s => {
            dbRun('DELETE FROM messages WHERE conversation_id = ?', [s.id]);
        });
        dbRun('DELETE FROM chat_sessions WHERE user_id = ?', [req.user.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Route: Reload personality
app.post('/api/personality/reload', (req, res) => {
    cachedSystemPrompt = null;
    lastLoadTime = 0;
    res.json({ success: true, message: 'Personality reloaded from ai-core' });
});

// 404 handler
app.use(function(req, res) {
    res.status(404).json({ 
        success: false, 
        error: 'Endpoint tidak ditemukan' 
    });
});

// Global error handler
app.use(function(err, req, res, next) {
    console.error('Global error:', err.stack);
    res.status(500).json({ 
        success: false,
        error: 'Terjadi kesalahan pada server'
    });
});

// ========================================
// START SERVER
// ========================================
initDatabase().then(() => {
  app.listen(PORT, function() {
    let providerDisplay = '';
    if (cohere) {
        providerDisplay = 'Cohere ✅ (Primary)';
    } else if (gemini) {
        providerDisplay = 'Gemini ✅ (Fallback)';
    } else {
        providerDisplay = '⚠️ NONE (isi API Key di .env)';
    }
    
    console.log('');
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║                                                          ║');
    console.log('║   🤖 MIREI AI ASSISTANT - ALPHA PHASE                   ║');
    console.log('║                                                          ║');
    console.log('╠══════════════════════════════════════════════════════════╣');
    console.log('║                                                          ║');
    console.log('║   📡 Server: http://localhost:' + PORT + '                      ║');
    console.log('║   🎭 Character: ' + (process.env.CHARACTER_NAME || 'MIREI') + '                     ║');
    console.log('║   🧠 AI Provider: ' + providerDisplay.padEnd(35) + '║');
    console.log('║   📁 AI Core: ' + (fs.existsSync(AI_CORE_PATH) ? '✅ Loaded' : '❌ Not found') + '                    ║');
    console.log('║                                                          ║');
    console.log('╚══════════════════════════════════════════════════════════╝');
    console.log('');
  });
}).catch(err => {
  console.error('❌ Failed to initialize database:', err.message);
  process.exit(1);
});

module.exports = app;