#!/usr/bin/env python3
"""
Simplified Flask app for translation functionality without database
"""

from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from deep_translator import GoogleTranslator
import re
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# All supported languages from deep-translator (133 languages)
ALL_LANGUAGES = [
    'afrikaans', 'albanian', 'amharic', 'arabic', 'armenian', 'assamese', 'aymara', 'azerbaijani',
    'bambara', 'basque', 'belarusian', 'bengali', 'bhojpuri', 'bosnian', 'bulgarian', 'catalan',
    'cebuano', 'chichewa', 'chinese (simplified)', 'chinese (traditional)', 'corsican', 'croatian',
    'czech', 'danish', 'dhivehi', 'dogri', 'dutch', 'english', 'esperanto', 'estonian', 'ewe',
    'filipino', 'finnish', 'french', 'frisian', 'galician', 'georgian', 'german', 'greek', 'guarani',
    'gujarati', 'haitian creole', 'hausa', 'hawaiian', 'hebrew', 'hindi', 'hmong', 'hungarian',
    'icelandic', 'igbo', 'ilocano', 'indonesian', 'irish', 'italian', 'japanese', 'javanese',
    'kannada', 'kazakh', 'khmer', 'kinyarwanda', 'konkani', 'korean', 'krio', 'kurdish (kurmanji)',
    'kurdish (sorani)', 'kyrgyz', 'lao', 'latin', 'latvian', 'lingala', 'lithuanian', 'luganda',
    'luxembourgish', 'macedonian', 'maithili', 'malagasy', 'malay', 'malayalam', 'maltese', 'maori',
    'marathi', 'meiteilon (manipuri)', 'mizo', 'mongolian', 'myanmar', 'nepali', 'norwegian',
    'odia (oriya)', 'oromo', 'pashto', 'persian', 'polish', 'portuguese', 'punjabi', 'quechua',
    'romanian', 'russian', 'samoan', 'sanskrit', 'scots gaelic', 'sepedi', 'serbian', 'sesotho',
    'shona', 'sindhi', 'sinhala', 'slovak', 'slovenian', 'somali', 'spanish', 'sundanese',
    'swahili', 'swedish', 'tajik', 'tamil', 'tatar', 'telugu', 'thai', 'tigrinya', 'tsonga',
    'turkish', 'turkmen', 'twi', 'ukrainian', 'urdu', 'uyghur', 'uzbek', 'vietnamese', 'welsh',
    'xhosa', 'yiddish', 'yoruba', 'zulu'
]

# Language mapping for common civic languages (with flags and native names)
CIVIC_LANGUAGES = {
    'english': {'flag': '🇺🇸', 'native': 'English', 'code': 'en'},
    'spanish': {'flag': '🇪🇸', 'native': 'Español', 'code': 'es'},
    'chinese (simplified)': {'flag': '🇨🇳', 'native': '中文', 'code': 'zh'},
    'arabic': {'flag': '🇸🇦', 'native': 'العربية', 'code': 'ar'},
    'hindi': {'flag': '🇮🇳', 'native': 'हिन्दी', 'code': 'hi'},
    'korean': {'flag': '🇰🇷', 'native': '한국어', 'code': 'ko'},
    'vietnamese': {'flag': '🇻🇳', 'native': 'Tiếng Việt', 'code': 'vi'},
    'filipino': {'flag': '🇵🇭', 'native': 'Tagalog', 'code': 'tl'},
    'french': {'flag': '🇫🇷', 'native': 'Français', 'code': 'fr'},
    'german': {'flag': '🇩🇪', 'native': 'Deutsch', 'code': 'de'},
    'portuguese': {'flag': '🇵🇹', 'native': 'Português', 'code': 'pt'},
    'japanese': {'flag': '🇯🇵', 'native': '日本語', 'code': 'ja'},
    'russian': {'flag': '🇷🇺', 'native': 'Русский', 'code': 'ru'},
    'italian': {'flag': '🇮🇹', 'native': 'Italiano', 'code': 'it'},
    'dutch': {'flag': '🇳🇱', 'native': 'Nederlands', 'code': 'nl'},
    'swedish': {'flag': '🇸🇪', 'native': 'Svenska', 'code': 'sv'},
    'norwegian': {'flag': '🇳🇴', 'native': 'Norsk', 'code': 'no'},
    'danish': {'flag': '🇩🇰', 'native': 'Dansk', 'code': 'da'},
    'finnish': {'flag': '🇫🇮', 'native': 'Suomi', 'code': 'fi'},
    'polish': {'flag': '🇵🇱', 'native': 'Polski', 'code': 'pl'},
    'czech': {'flag': '🇨🇿', 'native': 'Čeština', 'code': 'cs'},
    'hungarian': {'flag': '🇭🇺', 'native': 'Magyar', 'code': 'hu'},
    'romanian': {'flag': '🇷🇴', 'native': 'Română', 'code': 'ro'},
    'bulgarian': {'flag': '🇧🇬', 'native': 'Български', 'code': 'bg'},
    'greek': {'flag': '🇬🇷', 'native': 'Ελληνικά', 'code': 'el'},
    'turkish': {'flag': '🇹🇷', 'native': 'Türkçe', 'code': 'tr'},
    'hebrew': {'flag': '🇮🇱', 'native': 'עברית', 'code': 'he'},
    'persian': {'flag': '🇮🇷', 'native': 'فارسی', 'code': 'fa'},
    'urdu': {'flag': '🇵🇰', 'native': 'اردو', 'code': 'ur'},
    'bengali': {'flag': '🇧🇩', 'native': 'বাংলা', 'code': 'bn'},
    'tamil': {'flag': '🇮🇳', 'native': 'தமிழ்', 'code': 'ta'},
    'telugu': {'flag': '🇮🇳', 'native': 'తెలుగు', 'code': 'te'},
    'marathi': {'flag': '🇮🇳', 'native': 'मराठी', 'code': 'mr'},
    'gujarati': {'flag': '🇮🇳', 'native': 'ગુજરાતી', 'code': 'gu'},
    'punjabi': {'flag': '🇮🇳', 'native': 'ਪੰਜਾਬੀ', 'code': 'pa'},
    'thai': {'flag': '🇹🇭', 'native': 'ไทย', 'code': 'th'},
    'indonesian': {'flag': '🇮🇩', 'native': 'Bahasa Indonesia', 'code': 'id'},
    'malay': {'flag': '🇲🇾', 'native': 'Bahasa Melayu', 'code': 'ms'},
    'swahili': {'flag': '🇰🇪', 'native': 'Kiswahili', 'code': 'sw'},
    'amharic': {'flag': '🇪🇹', 'native': 'አማርኛ', 'code': 'am'},
    'hausa': {'flag': '🇳🇬', 'native': 'Hausa', 'code': 'ha'},
    'yoruba': {'flag': '🇳🇬', 'native': 'Yorùbá', 'code': 'yo'},
    'igbo': {'flag': '🇳🇬', 'native': 'Igbo', 'code': 'ig'},
    'zulu': {'flag': '🇿🇦', 'native': 'isiZulu', 'code': 'zu'},
    'xhosa': {'flag': '🇿🇦', 'native': 'isiXhosa', 'code': 'xh'},
    'afrikaans': {'flag': '🇿🇦', 'native': 'Afrikaans', 'code': 'af'}
}

def chunk_text(text: str, max_chunk_size: int = 5000) -> list:
    """
    Split large text into chunks for efficient translation.
    Tries to break at sentence boundaries when possible.
    """
    if len(text) <= max_chunk_size:
        return [text]
    
    chunks = []
    sentences = re.split(r'(?<=[.!?])\s+', text)
    current_chunk = ""
    
    for sentence in sentences:
        if len(current_chunk + sentence) <= max_chunk_size:
            current_chunk += sentence + " "
        else:
            if current_chunk:
                chunks.append(current_chunk.strip())
            current_chunk = sentence + " "
    
    if current_chunk:
        chunks.append(current_chunk.strip())
    
    return chunks

def translate_text_efficient(text: str, target_language: str, source_language: str = 'auto'):
    """
    Efficiently translate large text using deep-translator with chunking.
    """
    try:
        # Clean and validate input
        text = text.strip()
        if not text:
            return {'error': 'Empty text provided'}
        
        # Use language name directly (deep-translator accepts language names)
        target_lang = target_language
        
        # Chunk large text for better performance
        chunks = chunk_text(text)
        translated_chunks = []
        total_chars = len(text)
        
        logger.info(f"Translating {total_chars} characters in {len(chunks)} chunks to {target_lang}")
        
        # Use Google Translator
        translator = GoogleTranslator(source=source_language, target=target_lang)
        
        for i, chunk in enumerate(chunks):
            try:
                translated_chunk = translator.translate(chunk)
                translated_chunks.append(translated_chunk)
                logger.info(f"Translated chunk {i+1}/{len(chunks)}")
            except Exception as e:
                logger.error(f"Error translating chunk {i+1}: {str(e)}")
                # Fallback: return original chunk if translation fails
                translated_chunks.append(chunk)
        
        # Combine translated chunks
        translated_text = " ".join(translated_chunks)
        
        # Calculate quality indicators
        quality_score = calculate_quality_score(text, translated_text, target_language)
        
        return {
            'original_text': text,
            'translated_text': translated_text,
            'source_language': source_language,
            'target_language': target_language,
            'chunks_processed': len(chunks),
            'total_characters': total_chars,
            'quality_score': quality_score,
            'translation_service': 'google',
            'success': True
        }
        
    except Exception as e:
        logger.error(f"Translation error: {str(e)}")
        return {'error': f'Translation failed: {str(e)}', 'success': False}

def calculate_quality_score(original: str, translated: str, target_lang: str) -> float:
    """
    Calculate a simple quality score based on text characteristics.
    """
    try:
        # Basic quality indicators
        length_ratio = len(translated) / len(original) if len(original) > 0 else 0
        
        # Penalize extremely short or long translations
        if length_ratio < 0.1 or length_ratio > 3.0:
            length_score = 0.3
        elif 0.5 <= length_ratio <= 2.0:
            length_score = 1.0
        else:
            length_score = 0.7
        
        # Check for common translation artifacts
        artifact_penalty = 0
        artifacts = ['[', ']', '...', '??', '!!']
        for artifact in artifacts:
            if artifact in translated:
                artifact_penalty += 0.1
        
        # Check for proper sentence structure
        sentence_score = 1.0
        if not translated.endswith(('.', '!', '?')):
            sentence_score = 0.8
        
        # Combine scores
        quality_score = (length_score + sentence_score - artifact_penalty) / 2
        return max(0.0, min(1.0, quality_score))
        
    except Exception:
        return 0.5  # Default moderate score

@app.route('/')
def index():
    """Home page"""
    return render_template('index.html')

@app.route('/translation-assistant')
def translation_assistant():
    """Translation assistant page"""
    return render_template('translation_assistant.html')

@app.route('/help-language')
def help_language():
    """Help and language settings page"""
    return render_template('help_language.html')

@app.route('/api/translate-text', methods=['POST'])
def translate_text_api():
    """API endpoint for translating text"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        text = data.get('text', '').strip()
        target_language = data.get('target_language', 'es')
        source_language = data.get('source_language', 'auto')
        
        if not text:
            return jsonify({'error': 'Text is required'}), 400
        
        # Perform translation using the efficient translation function
        result = translate_text_efficient(text, target_language, source_language)
        
        if not result.get('success'):
            return jsonify(result), 400
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Translation API error: {str(e)}")
        return jsonify({'error': 'Translation failed'}), 500

@app.route('/api/languages', methods=['GET'])
def get_languages():
    """Get all supported languages"""
    return jsonify({
        'all_languages': ALL_LANGUAGES,
        'civic_languages': CIVIC_LANGUAGES,
        'total_count': len(ALL_LANGUAGES)
    })

@app.route('/api/translate-civic-term', methods=['POST'])
def translate_civic_term():
    """Translate a specific civic term to different languages"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        term = data.get('term', '').strip()
        target_language = data.get('target_language', 'spanish')
        
        if not term:
            return jsonify({'error': 'Term is required'}), 400
        
        # Perform translation
        result = translate_text_efficient(term, target_language)
        
        if not result.get('success'):
            return jsonify(result), 400
        
        return jsonify({
            'original_term': term,
            'translated_term': result['translated_text'],
            'target_language': target_language,
            'quality_score': result['quality_score']
        })
        
    except Exception as e:
        logger.error(f"Civic term translation error: {str(e)}")
        return jsonify({'error': 'Translation failed'}), 500

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy', 
        'message': 'CivicLink Translation Service is running',
        'translation_service': 'deep-translator (Google)',
        'total_languages': len(ALL_LANGUAGES),
        'civic_languages': len(CIVIC_LANGUAGES)
    })

if __name__ == '__main__':
    print("🌍 Starting CivicLink Translation Service...")
    print("📡 Translation service: deep-translator (Google)")
    print(f"🌐 Total supported languages: {len(ALL_LANGUAGES)}")
    print(f"🏛️ Civic languages with flags: {len(CIVIC_LANGUAGES)}")
    print("🚀 Server starting at http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)
