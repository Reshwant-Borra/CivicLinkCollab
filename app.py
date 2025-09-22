from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

# Initialize Flask app
app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///civiclink.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db = SQLAlchemy(app)
CORS(app)

# Import and register blueprints
try:
    from src.pages.TranslationAssistant import translation_assistant_bp
    app.register_blueprint(translation_assistant_bp)
except ImportError as e:
    print(f"Warning: Could not import TranslationAssistant: {e}")

try:
    from src.pages.HelpAndLanguage import help_language_bp
    app.register_blueprint(help_language_bp)
except ImportError as e:
    print(f"Warning: Could not import HelpAndLanguage: {e}")

try:
    from backend.routes.translations import translations_bp
    app.register_blueprint(translations_bp)
except ImportError as e:
    print(f"Warning: Could not import translations routes: {e}")

# Import models to ensure they're registered
try:
    from backend.models.Translation import Base
    # Create database tables
    with app.app_context():
        Base.metadata.create_all(db.engine)
except ImportError as e:
    print(f"Warning: Could not import Translation model: {e}")

@app.route('/')
def index():
    """Home page"""
    return render_template('index.html')

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return {'status': 'healthy', 'message': 'CivicLink Translation Service is running'}

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
