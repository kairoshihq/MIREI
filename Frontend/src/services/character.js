import api from './api';

const CHARACTER_ENDPOINTS = {
  LIST: '/characters',
  DETAIL: '/characters/:id',
  MY_CHARACTERS: '/characters/my',
  CREATE: '/characters',
  UPDATE: '/characters/:id',
  DELETE: '/characters/:id'
};

export const character = {
  // Get all characters (public)
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `${CHARACTER_ENDPOINTS.LIST}${queryString ? `?${queryString}` : ''}`;
    return await api.get(endpoint);
  },

  // Get single character by ID
  getById: async (characterId) => {
    const endpoint = CHARACTER_ENDPOINTS.DETAIL.replace(':id', characterId);
    return await api.get(endpoint);
  },

  // Get characters created by current user
  getMyCharacters: async () => {
    return await api.get(CHARACTER_ENDPOINTS.MY_CHARACTERS);
  },

  // Create new character
  create: async (characterData) => {
    return await api.post(CHARACTER_ENDPOINTS.CREATE, characterData);
  },

  // Update character
  update: async (characterId, characterData) => {
    const endpoint = CHARACTER_ENDPOINTS.UPDATE.replace(':id', characterId);
    return await api.put(endpoint, characterData);
  },

  // Delete character
  delete: async (characterId) => {
    const endpoint = CHARACTER_ENDPOINTS.DELETE.replace(':id', characterId);
    return await api.delete(endpoint);
  },

  // Get character's greeting message (untuk welcome chat)
  getGreeting: async (characterId) => {
    const character = await character.getById(characterId);
    return character.greeting || `Halo! Saya ${character.name}. Ada yang bisa saya bantu?`;
  }
};

// Contoh data karakter (mock - untuk development sebelum backend ready)
export const mockCharacters = [
  {
    id: '1',
    name: 'Mirei',
    avatar: '/assets/avatars/mirei.png',
    description: 'Asisten virtual yang ramah dan ceria',
    greeting: 'Halo! Aku Mirei, senang berteman denganmu!',
    personality: 'Friendly, helpful, energetic'
  }
];