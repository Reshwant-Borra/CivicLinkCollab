# Translation Service Setup

This application uses **DeepL API** for all translation features:

- **Translation Assistant page** - DeepL for high-quality text translation
- **Global page translations** - DeepL for automatic page translation

## Setup Instructions

### DeepL API Setup (Required)

1. Go to [DeepL API](https://www.deepl.com/pro-api) and sign up for a free account
2. Get your API key from the DeepL dashboard
3. Create a `.env` file in the root directory with:
   ```
   VITE_DEEPL_API_KEY=your_deepl_api_key_here
   ```
4. Restart your development server

**Note**: DeepL free tier includes 500,000 characters per month, which should be sufficient for most use cases.

## How It Works

### Translation Assistant Page
- Uses DeepL API for high-quality text translation
- Provides quality scores and provider information
- Professional-grade translation accuracy

### Global Page Translation
- Uses DeepL API for automatic page translation
- Caches translations to avoid repeated API calls
- Translates all text elements on the page when enabled

## Troubleshooting

### Connection Refused Errors
The previous errors were caused by trying to connect to a local backend server that wasn't running. This has been fixed by using DeepL API.

### DeepL API Key Issues
- Make sure your API key is correctly set in the `.env` file
- Verify the API key is active in your DeepL dashboard
- Check that you haven't exceeded your monthly character limit
- Ensure the API key has the correct format (starts with a letter/number)

### Common Issues
- **"DeepL API key not found"**: Make sure you've created the `.env` file with your API key
- **"DeepL API error: 403"**: Check your API key and usage limits
- **"DeepL API error: 429"**: You've hit the rate limit, wait a moment and try again

## Environment Variables

Create a `.env` file in your project root with:

```env
# Required for all translation features
VITE_DEEPL_API_KEY=your_deepl_api_key_here
```

## Testing

1. **Translation Assistant**: Go to `/language` and try translating some text
2. **Global Translation**: Enable the "Translate entire page" toggle and navigate between pages

The service provides high-quality translations with professional accuracy.
