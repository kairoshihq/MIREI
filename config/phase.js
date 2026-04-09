// ★★★ ACTIVE PHASE - GANTI INI UNTUK PINDAH FASE ★★★
// Cara pindah fase:
// 1. Ubah variable di bawah ini
// 2. Atau run: npm run phase:beta
// 3. Atau run: make phase-beta

const ACTIVE_PHASE = process.env.MIREI_PHASE || 'alpha';

const phases = {
  alpha: {
    name: 'Origin Alpha',
    version: '1.0.0',
    description: 'Basic character-based AI chat',
    features: {
      chat: true,
      streaming: false,
      voice: false,
      vectorMemory: false,
      multiAgent: false,
      'live2dAvatar': false
    },
    limits: {
      maxContextLength: 4000,
      maxMessagesPerSession: 100,
      maxConcurrentUsers: 100,
      maxCharacters: 5
    },
    database: {
      version: 'v1',
      collections: ['users', 'chats', 'characters']
    }
  },
  
  beta: {
    name: 'Beta Foundation',
    version: '1.0.1',
    description: 'Improved chat with memory and voice capabilities',
    features: {
      chat: true,
      streaming: true,
      voice: true,
      vectorMemory: true,
      multiAgent: false,
      'live2dAvatar': false
    },
    limits: {
      maxContextLength: 8000,
      maxMessagesPerSession: 500,
      maxConcurrentUsers: 1000,
      maxCharacters: 20
    },
    database: {
      version: 'v2',
      collections: ['users', 'chats', 'characters', 'voice_sessions', 'embeddings']
    }
  },
  
  essence: {
    name: 'Essence Intelligence',
    version: '1.0.2',
    description: 'Full AI assistant with Live2D avatar and multi-agent system',
    features: {
      chat: true,
      streaming: true,
      voice: true,
      vectorMemory: true,
      multiAgent: true,
      'live2dAvatar': true
    },
    limits: {
      maxContextLength: 16000,
      maxMessagesPerSession: 2000,
      maxConcurrentUsers: 10000,
      maxCharacters: 100
    },
    database: {
      version: 'v3',
      collections: ['users', 'chats', 'characters', 'voice_sessions', 'embeddings', 'agents', 'memories']
    }
  }
};

const currentConfig = phases[ACTIVE_PHASE];

if (!currentConfig) {
  throw new Error(`Invalid phase: ${ACTIVE_PHASE}. Valid phases: alpha, beta, nexus`);
}

module.exports = {
  phase: ACTIVE_PHASE,
  ...currentConfig,
  
  // Helper methods
  isFeatureEnabled(featureName) {
    return this.features[featureName] === true;
  },
  
  getLimit(limitName) {
    return this.limits[limitName];
  }
};