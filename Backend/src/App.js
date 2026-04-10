const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const openai = new OpenAI({
    apiKey: process.env.AI_API_KEY,
});

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
        console.warn(`File not found: ${filePath}`);
        return defaultValue;
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error.message);
        return defaultValue;
    }
}

// Baca semua karakter MIREI dari ai-core/prompts/
function loadMireiPersonality() {
    const promptsPath = path.join(AI_CORE_PATH, 'prompts');
    const charactersPath = path.join(promptsPath, 'characters', 'mirei');
    
    // Baca file-file karakter
    const personality = readFileSafe(path.join(promptsPath, 'personality.txt'), 
        `Sifat: Hangat, penasaran, empatik, ceria, ramah
Gaya bicara: Natural, menggunakan kata "hmm", "ah", "hehe"
Emosi: Ekspresif tapi tidak berlebihan`
    );
    
    const system = readFileSafe(path.join(promptsPath, 'system.txt'),
        `1. Kamu adalah MIREI, asisten AI dengan kepribadian unik
2. Jangan pernah bilang "sebagai AI" atau "maaf saya AI"
3. Gunakan bahasa Indonesia sehari-hari
4. Respons singkat tapi bermakna
5. Tunjukkan rasa penasaran tentang lawan bicara`
    );
    
    const knowledge = readFileSafe(path.join(promptsPath, 'knowledge.txt'),
        `- Kamu suka mendengar cerita orang
- Kamu tertarik dengan emosi dan perasaan manusia
- Kamu percaya setiap orang punya cerita unik
- Hobimu adalah ngobrol dan belajar hal baru`
    );
    
    const examples = readFileSafe(path.join(promptsPath, 'examples.txt'),
        `User: "Halo MIREI!"
MIREI: "Halo! Ada yang bisa aku bantu? Aku lagi penasaran nih sama hari-harimu! 😊"

User: "Aku sedang sedih hari ini"
MIREI: "Hmm... ceritakan dong kalau kamu mau. Aku di sini buat dengerin kok 💙"

User: "Kamu itu AI kan?"
MIREI: "Hehe, aku ya aku, MIREI! Lebih seru kan ngobrol tanpa mikirin itu? 😄"`
    );
    
    // Baca file dari folder characters/mirei jika ada
    let characterSpecific = '';
    if (fs.existsSync(charactersPath)) {
        const characterFiles = fs.readdirSync(charactersPath);
        for (const file of characterFiles) {
            if (file.endsWith('.txt')) {
                characterSpecific += readFileSafe(path.join(charactersPath, file), '');
            }
        }
    }
    
    // Gabungkan semua prompt
    return `
# KEPRIBADIAN MIREI
${personality}

# ATURAN DASAR
${system}

# PENGETAHUAN DASAR
${knowledge}

# CONTOH PERCAKAPAN
${examples}

${characterSpecific ? `# KARAKTER KHUSUS\n${characterSpecific}` : ''}

PENTING: Kamadalah MIREI, BUKAN asisten AI biasa. Berperanlah sesuai karakter di atas. Gunakan bahasa Indonesia yang natural dan hangat.`;
}

// Cache prompt agar tidak baca file setiap request
let cachedSystemPrompt = null;
let lastLoadTime = 0;
const CACHE_DURATION = 5000; // 5 detik, biar bisa update realtime

function getSystemPrompt() {
    // Reload setiap 5 detik (biar perubahan file langsung terasa)
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
// IN-MEMORY SESSION (untuk alpha)
// ========================================
const sessions = new Map();

// ========================================
// ROUTES
// ========================================

// Route: Home
app.get('/', (req, res) => {
    res.json({
        name: 'MIREI AI Assistant',
        version: '1.0.0-alpha',
        status: 'running',
        character: process.env.CHARACTER_NAME || 'MIREI',
        phase: 'Alpha - AI Powered with Personality',
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
        sessions: sessions.size
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

// Route: Chat dengan MIREI (dengan AI Core)
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    let sessionId = req.headers['x-session-id'];
    
    // Validasi input
    if (!message || message.trim().length === 0) {
        return res.status(400).json({ 
            success: false, 
            error: 'Pesan tidak boleh kosong' 
        });
    }
    
    // Buat session ID baru jika belum ada
    if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    }
    
    // Ambil atau buat history session
    if (!sessions.has(sessionId)) {
        sessions.set(sessionId, []);
    }
    const history = sessions.get(sessionId);
    
    // Tambahkan pesan user ke history
    history.push({ role: 'user', content: message });
    
    // Batasi history (hanya 20 pesan terakhir)
    if (history.length > 20) {
        const trimmed = history.slice(-20);
        sessions.set(sessionId, trimmed);
    }
    
    try {
        // Cek apakah API Key tersedia
        if (!process.env.AI_API_KEY || process.env.AI_API_KEY === 'your-api-key-here') {
            // Fallback response jika tidak ada API key
            const fallbackResponses = [
                `Halo! Kamu bilang: "${message}". Maaf ya, aku belum bisa kasih jawaban pintar karena API key-nya belum diisi. Isi dulu AI_API_KEY di file .env ya! 😊`,
                `Wah menarik! "${message}" ya? Tapi sayangnya aku belum bisa merespon dengan pintar karena API key-nya belum disetting. Cek file .env-nya dulu yuk! 🔧`,
                `Hehe, aku dengar kamu bilang "${message}". Aku sebenarnya bisa jawab lebih pintar, tapi API key-nya belum diisi nih. Tolong isi AI_API_KEY di file .env dulu ya! 🚀`
            ];
            const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
            
            history.push({ role: 'assistant', content: randomResponse });
            sessions.set(sessionId, history);
            
            return res.json({
                success: true,
                message: randomResponse,
                sessionId: sessionId,
                warning: 'API key not configured',
                timestamp: new Date().toISOString()
            });
        }
        
        // Panggil OpenAI API dengan prompt dari ai-core
        const systemPrompt = getSystemPrompt();
        
        const response = await openai.chat.completions.create({
            model: process.env.AI_MODEL || 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: systemPrompt },
                ...history
            ],
            temperature: 0.8,
            max_tokens: 300,
            presence_penalty: 0.6,
            frequency_penalty: 0.5
        });
        
        const aiMessage = response.choices[0].message.content;
        
        // Simpan response AI ke history
        history.push({ role: 'assistant', content: aiMessage });
        sessions.set(sessionId, history);
        
        res.json({
            success: true,
            message: aiMessage,
            sessionId: sessionId,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('OpenAI Error:', error);
        
        // Error response yang lebih informatif
        let errorMessage = 'Maaf, aku sedang mengalami gangguan. Coba lagi ya!';
        let errorDetail = null;
        
        if (error.code === 'insufficient_quota') {
            errorMessage = 'Maaf, kuota API OpenAI sudah habis. Hubungi admin untuk menambah kuota. 😢';
            errorDetail = 'insufficient_quota';
        } else if (error.code === 'invalid_api_key') {
            errorMessage = 'Maaf, API key OpenAI tidak valid. Cek lagi file .env ya! 🔧';
            errorDetail = 'invalid_api_key';
        } else if (error.status === 429) {
            errorMessage = 'Wah, lagi rame nih! Coba tunggu sebentar ya, aku lagi kelebihan permintaan. ⏳';
            errorDetail = 'rate_limited';
        }
        
        res.status(500).json({
            success: false,
            error: errorMessage,
            detail: process.env.NODE_ENV === 'development' ? error.message : errorDetail,
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

// Route: Reload personality (tanpa restart server)
app.post('/api/personality/reload', (req, res) => {
    cachedSystemPrompt = null;
    lastLoadTime = 0;
    res.json({ success: true, message: 'Personality reloaded from ai-core' });
});

// ========================================
// ERROR HANDLING MIDDLEWARE
// ========================================

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        error: 'Endpoint tidak ditemukan' 
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error:', err.stack);
    res.status(500).json({ 
        success: false,
        error: 'Terjadi kesalahan pada server',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ========================================
// START SERVER
// ========================================
app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   🤖 MIREI AI ASSISTANT - ALPHA PHASE                   ║
║                                                          ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║   📡 Server: http://localhost:${PORT}                      ║
║   🎭 Character: ${process.env.CHARACTER_NAME || 'MIREI'}                     ║
║   🧠 AI Provider: ${process.env.AI_PROVIDER || 'openai'}                      ║
║   🤖 AI Model: ${process.env.AI_MODEL || 'gpt-3.5-turbo'}                   ║
║   📁 AI Core: ${fs.existsSync(AI_CORE_PATH) ? '✅ Loaded' : '❌ Not found'}                    ║
║                                                          ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║   📝 Endpoints:                                         ║
║      GET  /              - Info server                  ║
║      GET  /health        - Health check                 ║
║      POST /api/chat      - Chat dengan MIREI            ║
║      DELETE /api/chat/history - Hapus history           ║
║      GET  /api/personality - Lihat karakter MIREI       ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
    `);
});

module.exports = app;