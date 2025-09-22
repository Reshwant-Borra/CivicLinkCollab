from flask import Blueprint, render_template, request, jsonify, session
import logging

logger = logging.getLogger(__name__)

help_language_bp = Blueprint('help_language', __name__)

# FAQ data
FAQ_DATA = [
    {
        'question': 'How do I find my polling place?',
        'answer': 'Enter your ZIP code in the polling place finder on the Deadlines page. You can also text your address to our SMS line for instant results.',
        'language': 'English'
    },
    {
        'question': 'What documents do I need to vote?',
        'answer': 'Requirements vary by state. Most states accept a driver\'s license, state ID, or passport. Some states allow utility bills or bank statements. Check your state\'s specific requirements.',
        'language': 'English'
    },
    {
        'question': 'Can I vote by mail?',
        'answer': 'Yes, in most states you can request an absentee ballot. Some states require a reason, others allow no-excuse absentee voting. Check your state\'s rules and deadlines.',
        'language': 'English'
    },
    {
        'question': '¿Dónde puedo votar?',
        'answer': 'Ingrese su código postal en el buscador de lugares de votación en la página de Fechas Importantes. También puede enviar su dirección por SMS para obtener resultados instantáneos.',
        'language': 'Spanish'
    },
    {
        'question': '我需要什么文件才能投票？',
        'answer': '要求因州而异。大多数州接受驾驶执照、州身份证或护照。一些州允许使用水电费账单或银行对账单。请查看您所在州的具体要求。',
        'language': 'Chinese'
    }
]

# SMS Shortcodes
SMS_SHORTCODES = [
    {'code': 'VOTE', 'description': 'Find your polling place', 'example': 'Text VOTE 12345'},
    {'code': 'DEADLINE', 'description': 'Get important voting deadlines', 'example': 'Text DEADLINE'},
    {'code': 'REGISTER', 'description': 'Check registration status', 'example': 'Text REGISTER'},
    {'code': 'ID', 'description': 'Learn about ID requirements', 'example': 'Text ID'},
    {'code': 'EARLY', 'description': 'Find early voting locations', 'example': 'Text EARLY 12345'}
]

# Languages
LANGUAGES = [
    {'code': 'en', 'name': 'English', 'flag': '🇺🇸', 'native': 'English'},
    {'code': 'es', 'name': 'Spanish', 'flag': '🇪🇸', 'native': 'Español'},
    {'code': 'zh', 'name': 'Chinese', 'flag': '🇨🇳', 'native': '中文'},
    {'code': 'ar', 'name': 'Arabic', 'flag': '🇸🇦', 'native': 'العربية'},
    {'code': 'hi', 'name': 'Hindi', 'flag': '🇮🇳', 'native': 'हिन्दी'},
    {'code': 'ko', 'name': 'Korean', 'flag': '🇰🇷', 'native': '한국어'},
    {'code': 'vi', 'name': 'Vietnamese', 'flag': '🇻🇳', 'native': 'Tiếng Việt'},
    {'code': 'tl', 'name': 'Tagalog', 'flag': '🇵🇭', 'native': 'Tagalog'}
]

@help_language_bp.route('/help-language')
def help_language():
    """Render the help and language settings page"""
    # Get current settings from session or defaults
    selected_language = session.get('selected_language', 'en')
    high_contrast = session.get('high_contrast', False)
    large_text = session.get('large_text', False)
    audio_enabled = session.get('audio_enabled', True)
    
    return render_template('help_language.html',
                         faq_data=FAQ_DATA,
                         sms_shortcodes=SMS_SHORTCODES,
                         languages=LANGUAGES,
                         selected_language=selected_language,
                         high_contrast=high_contrast,
                         large_text=large_text,
                         audio_enabled=audio_enabled)

@help_language_bp.route('/api/update-language', methods=['POST'])
def update_language():
    """Update user's language preference"""
    try:
        data = request.get_json()
        
        if not data or 'language' not in data:
            return jsonify({'error': 'Language is required'}), 400
        
        language = data['language']
        
        # Validate language code
        valid_languages = [lang['code'] for lang in LANGUAGES]
        if language not in valid_languages:
            return jsonify({'error': 'Invalid language code'}), 400
        
        # Save to session
        session['selected_language'] = language
        
        return jsonify({
            'message': 'Language updated successfully',
            'language': language
        })
        
    except Exception as e:
        logger.error(f"Update language error: {str(e)}")
        return jsonify({'error': 'Failed to update language'}), 500

@help_language_bp.route('/api/update-accessibility', methods=['POST'])
def update_accessibility():
    """Update user's accessibility settings"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Update session with new settings
        if 'high_contrast' in data:
            session['high_contrast'] = bool(data['high_contrast'])
        
        if 'large_text' in data:
            session['large_text'] = bool(data['large_text'])
        
        if 'audio_enabled' in data:
            session['audio_enabled'] = bool(data['audio_enabled'])
        
        return jsonify({
            'message': 'Accessibility settings updated successfully',
            'settings': {
                'high_contrast': session.get('high_contrast', False),
                'large_text': session.get('large_text', False),
                'audio_enabled': session.get('audio_enabled', True)
            }
        })
        
    except Exception as e:
        logger.error(f"Update accessibility error: {str(e)}")
        return jsonify({'error': 'Failed to update accessibility settings'}), 500

@help_language_bp.route('/api/contact-support', methods=['POST'])
def contact_support():
    """Handle contact support form submission"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        subject = data.get('subject', '').strip()
        message = data.get('message', '').strip()
        
        # Validate required fields
        if not all([name, email, subject, message]):
            return jsonify({'error': 'All fields are required'}), 400
        
        # In a real app, this would send an email or create a support ticket
        logger.info(f"Support request from {name} ({email}): {subject}")
        
        return jsonify({
            'message': 'Support request submitted successfully. We\'ll get back to you soon!'
        })
        
    except Exception as e:
        logger.error(f"Contact support error: {str(e)}")
        return jsonify({'error': 'Failed to submit support request'}), 500
