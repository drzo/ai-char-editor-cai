import axios from 'axios';
import { Character } from '../types/character';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export async function fetchCharacterAIProfile(url: string): Promise<Character> {
  try {
    const id = extractCharacterId(url);
    const response = await api.get(`/chat/character/info/${id}/`);
    
    if (!response.data?.character) {
      throw new Error('Invalid character data received');
    }

    const { character } = response.data;
    return {
      name: character.participant__name || '',
      description: character.description || '',
      personality: character.definition?.personality || '',
      first_message: character.greeting || '',
      avatar: character.avatar_file_name ? 
        `/api/uploads/avatars/${character.avatar_file_name}` : 
        undefined,
      example_conversations: character.definition?.example_conversations || []
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch character profile');
    }
    throw error;
  }
}

function extractCharacterId(url: string): string {
  if (!url?.trim()) {
    throw new Error('Please provide a valid Character.AI URL or ID');
  }

  // Handle direct ID input
  if (/^[a-zA-Z0-9_-]+$/.test(url.trim())) {
    return url.trim();
  }

  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    let characterId = '';

    if (pathParts.includes('character')) {
      characterId = pathParts[pathParts.indexOf('character') + 1] || '';
    } else if (pathParts.includes('chat')) {
      characterId = pathParts[pathParts.indexOf('chat') + 1] || '';
    } else if (urlObj.searchParams.has('char')) {
      characterId = urlObj.searchParams.get('char') || '';
    }

    if (!characterId) {
      throw new Error('Could not extract character ID from URL');
    }

    return characterId.split('/')[0];
  } catch (error) {
    throw new Error('Invalid Character.AI URL format');
  }
}