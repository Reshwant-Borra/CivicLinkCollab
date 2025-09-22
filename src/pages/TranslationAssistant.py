from flask import Blueprint, render_template, request, jsonify, session
from backend.routes.translations import translate_text_efficient, LANGUAGE_MAPPING
import logging

logger = logging.getLogger(__name__)

translation_assistant_bp = Blueprint('translation_assistant', __name__)

# Sample translation data (in a real app, this would come from the database)
TRANSLATION_DATA = [
    {
        'english': 'Voter Registration',
        'translated': 'Registro de Votantes',
        'language': 'Spanish',
        'explanation': 'The process of signing up to vote in elections. You must register before you can cast a ballot.',
        'audio_url': '/audio/voter-registration-es.mp3'
    },
    {
        'english': 'Polling Place',
        'translated': 'Lugar de Votación',
        'language': 'Spanish', 
        'explanation': 'The physical location where you go to vote on Election Day or during early voting.',
        'audio_url': '/audio/polling-place-es.mp3'
    },
    {
        'english': 'Ballot',
        'translated': 'Boleta Electoral',
        'language': 'Spanish',
        'explanation': 'The paper or electronic form where you mark your choices for candidates and issues.',
        'audio_url': '/audio/ballot-es.mp3'
    },
    {
        'english': 'Early Voting',
        'translated': 'Votación Anticipada',
        'language': 'Spanish',
        'explanation': 'Voting before Election Day at designated locations. Dates and locations vary by state.',
        'audio_url': '/audio/early-voting-es.mp3'
    },
    {
        'english': 'Absentee Ballot',
        'translated': 'Voto por Correo',
        'language': 'Spanish',
        'explanation': 'A ballot that you can request to vote by mail instead of going to a polling place.',
        'audio_url': '/audio/absentee-ballot-es.mp3'
    }
]

LANGUAGES = [
    {'code': 'es', 'name': 'Spanish', 'flag': '🇪🇸'},
    {'code': 'zh', 'name': 'Chinese', 'flag': '🇨🇳'},
    {'code': 'ar', 'name': 'Arabic', 'flag': '🇸🇦'},
    {'code': 'hi', 'name': 'Hindi', 'flag': '🇮🇳'},
    {'code': 'ko', 'name': 'Korean', 'flag': '🇰🇷'},
    {'code': 'vi', 'name': 'Vietnamese', 'flag': '🇻🇳'},
    {'code': 'tl', 'name': 'Tagalog', 'flag': '🇵🇭'}
]

@translation_assistant_bp.route('/translation-assistant')
def translation_assistant():
    """Render the translation assistant page"""
    search_term = request.args.get('search', '').strip()
    selected_language = request.args.get('language', 'Spanish')
    
    # Filter translations based on search term
    filtered_terms = TRANSLATION_DATA
    if search_term:
        search_lower = search_term.lower()
        filtered_terms = [
            term for term in TRANSLATION_DATA
            if (search_lower in term['english'].lower() or
                search_lower in term['translated'].lower() or
                search_lower in term['explanation'].lower())
        ]
    
    return render_template('translation_assistant.html',
                         translation_data=filtered_terms,
                         languages=LANGUAGES,
                         search_term=search_term,
                         selected_language=selected_language)

@translation_assistant_bp.route('/api/translate-text', methods=['POST'])
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
        
        if 'error' in result:
            return jsonify(result), 400
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Translation API error: {str(e)}")
        return jsonify({'error': 'Translation failed'}), 500

@translation_assistant_bp.route('/api/search-translations', methods=['GET'])
def search_translations():
    """API endpoint for searching translations"""
    try:
        search_term = request.args.get('q', '').strip()
        language = request.args.get('language', '')
        
        # Filter translations
        filtered_terms = TRANSLATION_DATA
        
        if search_term:
            search_lower = search_term.lower()
            filtered_terms = [
                term for term in filtered_terms
                if (search_lower in term['english'].lower() or
                    search_lower in term['translated'].lower() or
                    search_lower in term['explanation'].lower())
            ]
        
        if language:
            filtered_terms = [
                term for term in filtered_terms
                if term['language'].lower() == language.lower()
            ]
        
        return jsonify({
            'translations': filtered_terms,
            'total': len(filtered_terms)
        })
        
    except Exception as e:
        logger.error(f"Search translations error: {str(e)}")
        return jsonify({'error': 'Search failed'}), 500
