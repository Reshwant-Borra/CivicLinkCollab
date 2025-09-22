#!/usr/bin/env python3
"""
Get all supported languages from deep-translator
"""

from deep_translator import GoogleTranslator

def get_all_languages():
    """Get all supported languages from GoogleTranslator"""
    translator = GoogleTranslator()
    languages = translator.get_supported_languages()
    
    print(f"Total supported languages: {len(languages)}")
    print("\nAll languages:")
    for i, lang in enumerate(languages, 1):
        print(f"{i:3d}. {lang}")
    
    return languages

if __name__ == "__main__":
    get_all_languages()
