export type AIProvider = 'OPENAI' | 'ANTHROPIC' | 'GEMINI' | 'SIMULATION';

export interface AISettings {
  aiName: string;
  provider: AIProvider;
  baseUrl: string;
  apiKey: string;
  model: string;
  autoFetchOnCountrySelect: boolean;
}

const STORAGE_KEY = 'BROADCAST_HUD_AI_SETTINGS';

export const DEFAULT_AI_SETTINGS: AISettings = {
  aiName: 'GLOBAL INFERENCE GATEWAY',
  provider: 'OPENAI',
  baseUrl: 'https://api.openai.com/v1',
  apiKey: '',
  model: 'gpt-4o-mini',
  autoFetchOnCountrySelect: false,
};

export const getAiSettings = (): AISettings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_AI_SETTINGS, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load AI settings from localStorage', e);
  }
  return DEFAULT_AI_SETTINGS;
};

export const saveAiSettings = (settings: AISettings): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save AI settings to localStorage', e);
  }
};
