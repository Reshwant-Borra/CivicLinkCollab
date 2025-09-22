// Translation service using DeepL API

interface TranslationResult {
  translated: string;
  quality?: number;
  provider: string;
}

interface DeepLResponse {
  translations: Array<{
    text: string;
    detected_source_language: string;
  }>;
}

// Language code mapping for DeepL
const LANGUAGE_CODE_MAP: Record<string, string> = {
  'en': 'EN',
  'es': 'ES',
  'zh': 'ZH',
  'ar': 'AR',
  'hi': 'HI',
  'ko': 'KO',
  'vi': 'VI',
  'tl': 'TL', // Tagalog
  'fr': 'FR',
  'de': 'DE',
  'ja': 'JA',
  'pt': 'PT',
  'ru': 'RU'
};

// Main translation function using DeepL
export const translateText = async (
  text: string, 
  targetLang: string
): Promise<TranslationResult> => {
  console.log('translateText called with:', { text, targetLang });
  
  const targetLanguageCode = LANGUAGE_CODE_MAP[targetLang] || targetLang.toUpperCase();
  console.log('Target language code:', targetLanguageCode);
  
  // Skip translation if target language is English
  if (targetLanguageCode === 'EN') {
    console.log('Skipping translation - target is English');
    return {
      translated: text,
      quality: 1.0,
      provider: 'deepl'
    };
  }

  // Get DeepL API key from environment variables
  const apiKey = import.meta.env.VITE_DEEPL_API_KEY;
  console.log('API Key found:', !!apiKey);
  
  if (!apiKey) {
    console.error('DeepL API key not found');
    throw new Error('DeepL API key not found. Please set VITE_DEEPL_API_KEY in your environment variables.');
  }

  try {
    console.log('Making DeepL API request...');
    const requestBody = new URLSearchParams({
      text: text,
      target_lang: targetLanguageCode,
      source_lang: 'EN'
    });
    console.log('Request body:', requestBody.toString());
    
    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: requestBody
    });

    console.log('DeepL API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepL API error response:', errorText);
      throw new Error(`DeepL API error: ${response.status} - ${errorText}`);
    }

    const data: DeepLResponse = await response.json();
    console.log('DeepL API response data:', data);
    
    if (data.translations && data.translations.length > 0) {
      const result = {
        translated: data.translations[0].text,
        quality: 0.95, // DeepL is generally high quality
        provider: 'deepl'
      };
      console.log('Translation successful:', result);
      return result;
    }

    throw new Error('No translation returned from DeepL');
  } catch (error) {
    console.error('DeepL translation failed:', error);
    throw error;
  }
};