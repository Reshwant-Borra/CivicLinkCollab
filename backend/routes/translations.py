from flask import Blueprint, request, jsonify, current_app
from sqlalchemy import and_, or_, func, desc, asc
from sqlalchemy.orm import sessionmaker
from backend.models.Translation import Translation, LanguageEnum, CategoryEnum, DifficultyEnum
from backend.middleware.auth import auth_required, authorize_roles
from deep_translator import GoogleTranslator, DeepLTranslator
import re
import logging
from datetime import datetime
from typing import Dict, List, Optional, Tuple

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

translations_bp = Blueprint('translations', __name__, url_prefix='/api/translations')

# Translation service configuration
TRANSLATION_SERVICES = {
    'google': GoogleTranslator,
    'deepl': DeepLTranslator
}

# Language mapping for deep-translator
LANGUAGE_MAPPING = {
    'es': 'spanish',
    'zh': 'zh-CN',  # Chinese Simplified
    'ar': 'arabic',
    'hi': 'hindi',
    'ko': 'korean',
    'vi': 'vietnamese',
    'tl': 'filipino'
}

def get_db_session():
    """Get database session"""
    from app import db
    return db.session

def chunk_text(text: str, max_chunk_size: int = 5000) -> List[str]:
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

def translate_text_efficient(text: str, target_language: str, source_language: str = 'auto') -> Dict:
    """
    Efficiently translate large text using deep-translator with chunking.
    Returns translation result with quality indicators.
    """
    try:
        # Clean and validate input
        text = text.strip()
        if not text:
            return {'error': 'Empty text provided'}
        
        # Map language codes
        target_lang = LANGUAGE_MAPPING.get(target_language, target_language)
        
        # Chunk large text for better performance
        chunks = chunk_text(text)
        translated_chunks = []
        total_chars = len(text)
        
        logger.info(f"Translating {total_chars} characters in {len(chunks)} chunks to {target_lang}")
        
        # Use Google Translator for better free tier performance
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
            'timestamp': datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Translation error: {str(e)}")
        return {'error': f'Translation failed: {str(e)}'}

def calculate_quality_score(original: str, translated: str, target_lang: str) -> float:
    """
    Calculate a simple quality score based on text characteristics.
    Higher score indicates better translation quality.
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

@translations_bp.route('/', methods=['GET'])
def get_translations():
    """Get translations with filtering and search"""
    try:
        db = get_db_session()
        
        # Parse query parameters
        page = int(request.args.get('page', 1))
        limit = min(int(request.args.get('limit', 20)), 100)
        language = request.args.get('language')
        category = request.args.get('category')
        search = request.args.get('search', '').strip()
        verified = request.args.get('verified')
        
        # Build query
        query = db.query(Translation)
        
        # Apply filters
        if language and language in [lang.value for lang in LanguageEnum]:
            query = query.filter(Translation.language == language)
        
        if category and category in [cat.value for cat in CategoryEnum]:
            query = query.filter(Translation.category == category)
        
        if verified is not None:
            verified_bool = verified.lower() == 'true'
            query = query.filter(Translation.verified == verified_bool)
        
        # Text search
        if search:
            search_filter = or_(
                Translation.english.ilike(f'%{search}%'),
                Translation.translated.ilike(f'%{search}%'),
                Translation.explanation.ilike(f'%{search}%')
            )
            query = query.filter(search_filter)
        
        # Get total count
        total = query.count()
        
        # Apply pagination and ordering
        translations = query.order_by(desc(Translation.usage_count), desc(Translation.created_at))\
                          .offset((page - 1) * limit)\
                          .limit(limit)\
                          .all()
        
        return jsonify({
            'translations': [t.to_dict() for t in translations],
            'pagination': {
                'page': page,
                'limit': limit,
                'total': total,
                'pages': (total + limit - 1) // limit
            }
        })
        
    except Exception as e:
        logger.error(f"Get translations error: {str(e)}")
        return jsonify({'error': 'Server error'}), 500

@translations_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get translation categories and counts"""
    try:
        db = get_db_session()
        
        # Get category statistics
        categories = db.query(
            Translation.category,
            Translation.language,
            func.count(Translation.id).label('count'),
            func.sum(func.cast(Translation.verified, Integer)).label('verified')
        ).group_by(Translation.category, Translation.language).all()
        
        # Organize by category
        category_stats = {}
        for cat, lang, count, verified in categories:
            if cat not in category_stats:
                category_stats[cat] = {
                    'category': cat,
                    'languages': [],
                    'total_count': 0,
                    'total_verified': 0
                }
            
            category_stats[cat]['languages'].append({
                'language': lang,
                'count': count,
                'verified': verified or 0
            })
            category_stats[cat]['total_count'] += count
            category_stats[cat]['total_verified'] += verified or 0
        
        return jsonify({'categories': list(category_stats.values())})
        
    except Exception as e:
        logger.error(f"Get categories error: {str(e)}")
        return jsonify({'error': 'Server error'}), 500

@translations_bp.route('/<int:translation_id>', methods=['GET'])
def get_translation(translation_id):
    """Get single translation by ID"""
    try:
        db = get_db_session()
        
        translation = db.query(Translation).filter(Translation.id == translation_id).first()
        
        if not translation:
            return jsonify({'error': 'Translation not found'}), 404
        
        # Increment usage count
        translation.increment_usage()
        db.commit()
        
        return jsonify({'translation': translation.to_dict()})
        
    except Exception as e:
        logger.error(f"Get translation error: {str(e)}")
        return jsonify({'error': 'Server error'}), 500

@translations_bp.route('/translate', methods=['POST'])
def translate_text():
    """Translate text using deep-translator"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        text = data.get('text', '').strip()
        target_language = data.get('target_language', 'es')
        source_language = data.get('source_language', 'auto')
        
        if not text:
            return jsonify({'error': 'Text is required'}), 400
        
        if target_language not in [lang.value for lang in LanguageEnum]:
            return jsonify({'error': 'Invalid target language'}), 400
        
        # Perform translation
        result = translate_text_efficient(text, target_language, source_language)
        
        if 'error' in result:
            return jsonify(result), 400
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Translation error: {str(e)}")
        return jsonify({'error': 'Translation failed'}), 500

@translations_bp.route('/', methods=['POST'])
@auth_required
@authorize_roles(['organizer', 'admin'])
def create_translation():
    """Create a new translation (organizers only)"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate required fields
        required_fields = ['english', 'translated', 'language', 'explanation', 'category']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Validate language and category
        if data['language'] not in [lang.value for lang in LanguageEnum]:
            return jsonify({'error': 'Invalid language'}), 400
        
        if data['category'] not in [cat.value for cat in CategoryEnum]:
            return jsonify({'error': 'Invalid category'}), 400
        
        db = get_db_session()
        
        # Create translation
        translation = Translation(
            english=data['english'],
            translated=data['translated'],
            language=data['language'],
            explanation=data['explanation'],
            category=data['category'],
            audio_url=data.get('audio_url'),
            context=data.get('context'),
            difficulty=data.get('difficulty', 'beginner'),
            tags=data.get('tags', []),
            verified=True,
            verified_by=request.user_id,
            verified_at=datetime.utcnow()
        )
        
        db.add(translation)
        db.commit()
        db.refresh(translation)
        
        return jsonify({
            'message': 'Translation created successfully',
            'translation': translation.to_dict()
        }), 201
        
    except Exception as e:
        logger.error(f"Create translation error: {str(e)}")
        return jsonify({'error': 'Server error'}), 500

@translations_bp.route('/<int:translation_id>/verify', methods=['PUT'])
@auth_required
@authorize_roles(['organizer', 'admin'])
def verify_translation(translation_id):
    """Verify a translation (organizers only)"""
    try:
        data = request.get_json()
        
        if not data or 'verified' not in data:
            return jsonify({'error': 'verified field is required'}), 400
        
        db = get_db_session()
        
        translation = db.query(Translation).filter(Translation.id == translation_id).first()
        
        if not translation:
            return jsonify({'error': 'Translation not found'}), 404
        
        translation.verified = data['verified']
        translation.verified_by = request.user_id
        translation.verified_at = datetime.utcnow()
        
        db.commit()
        
        return jsonify({
            'message': f"Translation {'verified' if data['verified'] else 'unverified'} successfully",
            'translation': translation.to_dict()
        })
        
    except Exception as e:
        logger.error(f"Verify translation error: {str(e)}")
        return jsonify({'error': 'Server error'}), 500

@translations_bp.route('/<int:translation_id>/feedback', methods=['POST'])
@auth_required
def submit_feedback(translation_id):
    """Submit feedback on a translation"""
    try:
        data = request.get_json()
        
        if not data or 'helpful' not in data:
            return jsonify({'error': 'helpful field is required'}), 400
        
        db = get_db_session()
        
        translation = db.query(Translation).filter(Translation.id == translation_id).first()
        
        if not translation:
            return jsonify({'error': 'Translation not found'}), 404
        
        # Add feedback
        success = translation.add_feedback(
            user_id=request.user_id,
            helpful=data['helpful'],
            comment=data.get('comment')
        )
        
        if not success:
            return jsonify({'error': 'Feedback already submitted'}), 400
        
        db.commit()
        
        return jsonify({'message': 'Feedback submitted successfully'})
        
    except Exception as e:
        logger.error(f"Submit feedback error: {str(e)}")
        return jsonify({'error': 'Server error'}), 500

@translations_bp.route('/stats/overview', methods=['GET'])
def get_translation_stats():
    """Get translation statistics overview"""
    try:
        db = get_db_session()
        
        # Get basic statistics
        total_translations = db.query(Translation).count()
        verified_translations = db.query(Translation).filter(Translation.verified == True).count()
        total_usage = db.query(func.sum(Translation.usage_count)).scalar() or 0
        
        # Get language and category counts
        languages = db.query(Translation.language).distinct().all()
        categories = db.query(Translation.category).distinct().all()
        
        verification_rate = (verified_translations / total_translations * 100) if total_translations > 0 else 0
        
        stats = {
            'total_translations': total_translations,
            'verified_translations': verified_translations,
            'total_usage': total_usage,
            'language_count': len(languages),
            'category_count': len(categories),
            'verification_rate': round(verification_rate, 2)
        }
        
        return jsonify({'stats': stats})
        
    except Exception as e:
        logger.error(f"Get translation stats error: {str(e)}")
        return jsonify({'error': 'Server error'}), 500
