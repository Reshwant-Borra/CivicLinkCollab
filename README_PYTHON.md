# CivicLink Translation Service - Python Implementation

This is a Python Flask implementation of the CivicLink translation service using the `deep-translator` library for efficient large text translation.

## Features

- **Efficient Large Text Translation**: Automatic text chunking for better performance
- **Quality Indicators**: Translation quality scoring and metrics
- **Multi-language Support**: Spanish, Chinese, Arabic, Hindi, Korean, Vietnamese, Tagalog
- **Accessibility Features**: High contrast mode, large text, audio support
- **Search & Filtering**: Advanced search capabilities for civic terms
- **Translation Verification**: Quality assurance workflow for translations

## Installation

1. **Install Python Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   SECRET_KEY=your-secret-key-here
   DATABASE_URL=sqlite:///civiclink.db
   # For PostgreSQL: postgresql://username:password@localhost/civiclink
   ```

3. **Run the Application**:
   ```bash
   python app.py
   ```

   The application will be available at `http://localhost:5000`

## API Endpoints

### Translation Endpoints

- `POST /api/translations/translate` - Translate text using deep-translator
- `GET /api/translations` - Get translations with filtering
- `GET /api/translations/categories` - Get translation categories
- `GET /api/translations/:id` - Get single translation
- `POST /api/translations` - Create new translation (organizers only)
- `PUT /api/translations/:id/verify` - Verify translation (organizers only)
- `POST /api/translations/:id/feedback` - Submit feedback on translation

### Frontend Routes

- `/` - Home page
- `/translation-assistant` - Translation interface
- `/help-language` - Help and language settings
- `/health` - Health check endpoint

## Key Components

### 1. Translation Model (`backend/models/Translation.py`)
- SQLAlchemy model for translation data
- Support for multiple languages and categories
- Quality tracking and user feedback
- Usage analytics

### 2. Translation Routes (`backend/routes/translations.py`)
- Efficient text chunking for large documents
- Quality scoring algorithm
- Multiple translation services support
- Comprehensive API endpoints

### 3. Frontend Templates
- **Translation Assistant** (`templates/translation_assistant.html`):
  - Large text input with real-time translation
  - Quality indicators and metrics
  - Search and filtering capabilities
  - Copy and save functionality

- **Help & Language Settings** (`templates/help_language.html`):
  - Language selection with native names
  - Accessibility settings (high contrast, large text, audio)
  - FAQ accordion
  - SMS shortcodes reference
  - Contact support form

## Translation Features

### Efficient Large Text Processing
- **Automatic Chunking**: Splits large text into optimal chunks (5000 chars)
- **Sentence Boundary Detection**: Breaks at sentence endings when possible
- **Quality Scoring**: Calculates translation quality based on multiple factors
- **Progress Tracking**: Shows chunks processed and total characters

### Quality Indicators
- **Length Ratio**: Compares original vs translated text length
- **Artifact Detection**: Identifies common translation errors
- **Sentence Structure**: Validates proper sentence endings
- **Overall Score**: Combined quality metric (0-100%)

### Supported Languages
- Spanish (es)
- Chinese Simplified (zh)
- Arabic (ar)
- Hindi (hi)
- Korean (ko)
- Vietnamese (vi)
- Tagalog (tl)

## Database Schema

The `Translation` model includes:
- Basic translation data (english, translated, language, explanation)
- Categorization (voting, registration, identification, etc.)
- Quality tracking (verified, verified_by, verified_at)
- Usage analytics (usage_count, feedback)
- Metadata (tags, difficulty, context, related_terms)

## Usage Examples

### Translate Large Text
```python
from backend.routes.translations import translate_text_efficient

result = translate_text_efficient(
    text="Your large civic document text here...",
    target_language="es",
    source_language="auto"
)

print(f"Translated: {result['translated_text']}")
print(f"Quality Score: {result['quality_score']}")
print(f"Chunks Processed: {result['chunks_processed']}")
```

### Search Translations
```python
# Search for translations
GET /api/translations?search=voter&language=es&verified=true

# Get translation categories
GET /api/translations/categories

# Get translation statistics
GET /api/translations/stats/overview
```

## Development

### Running Tests
```bash
pytest
```

### Database Migrations
```bash
# Create new migration
flask db migrate -m "Description"

# Apply migrations
flask db upgrade
```

### Adding New Languages
1. Add language code to `LanguageEnum` in `Translation.py`
2. Add mapping to `LANGUAGE_MAPPING` in `translations.py`
3. Update frontend language lists in templates

## Performance Optimizations

- **Text Chunking**: Prevents API timeouts for large documents
- **Caching**: Translation results can be cached for repeated requests
- **Database Indexing**: Optimized queries with proper indexes
- **Async Processing**: Background processing for large translations

## Security Features

- **Input Validation**: Comprehensive validation for all inputs
- **Rate Limiting**: Prevents abuse of translation endpoints
- **Authentication**: Role-based access for admin functions
- **SQL Injection Protection**: Parameterized queries

## Monitoring & Analytics

- **Usage Tracking**: Monitor translation usage and popular terms
- **Quality Metrics**: Track translation quality over time
- **Performance Monitoring**: API response times and error rates
- **User Feedback**: Collect and analyze user feedback on translations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.
