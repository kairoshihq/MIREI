const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const { CohereClient } = require('cohere-ai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { handleRegister, handleVerifyOTP, handleLogin, handleResendOTP } = require('./controllers/authController');

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
    const { message } = req.body;
    let sessionId = req.headers['x-session-id'];
    
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

module.exports = app;