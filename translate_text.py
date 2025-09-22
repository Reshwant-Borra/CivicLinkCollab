#!/usr/bin/env python3
"""
Standalone translation script for testing large text translation
Usage: python translate_text.py
"""

from deep_translator import GoogleTranslator
import re

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
        
        # Chunk large text for better performance
        chunks = chunk_text(text)
        translated_chunks = []
        total_chars = len(text)
        
        print(f"Translating {total_chars} characters in {len(chunks)} chunks to {target_language}")
        
        # Use Google Translator
        translator = GoogleTranslator(source=source_language, target=target_language)
        
        for i, chunk in enumerate(chunks):
            try:
                translated_chunk = translator.translate(chunk)
                translated_chunks.append(translated_chunk)
                print(f"✓ Translated chunk {i+1}/{len(chunks)}")
            except Exception as e:
                print(f"✗ Error translating chunk {i+1}: {str(e)}")
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

def main():
    """Interactive translation interface"""
    print("🌍 CivicLink Translation Assistant")
    print("=" * 50)
    
    # Language options
    languages = {
        '1': ('es', 'Spanish'),
        '2': ('zh-CN', 'Chinese (Simplified)'),
        '3': ('ar', 'Arabic'),
        '4': ('hi', 'Hindi'),
        '5': ('ko', 'Korean'),
        '6': ('vi', 'Vietnamese'),
        '7': ('tl', 'Filipino')
    }
    
    print("\nAvailable languages:")
    for key, (code, name) in languages.items():
        print(f"  {key}. {name}")
    
    # Get user input
    while True:
        try:
            choice = input("\nSelect target language (1-7): ").strip()
            if choice in languages:
                target_lang, lang_name = languages[choice]
                break
            else:
                print("Invalid choice. Please select 1-7.")
        except KeyboardInterrupt:
            print("\nGoodbye!")
            return
    
    print(f"\nSelected: {lang_name}")
    
    # Get text to translate
    print("\nEnter the text you want to translate:")
    print("(Press Ctrl+Z then Enter on Windows, or Ctrl+D on Mac/Linux when done)")
    
    try:
        lines = []
        while True:
            try:
                line = input()
                lines.append(line)
            except EOFError:
                break
        text = '\n'.join(lines)
    except KeyboardInterrupt:
        print("\nGoodbye!")
        return
    
    if not text.strip():
        print("No text provided. Exiting.")
        return
    
    print(f"\n📝 Original text ({len(text)} characters):")
    print("-" * 50)
    print(text[:200] + "..." if len(text) > 200 else text)
    
    print(f"\n🔄 Translating to {lang_name}...")
    print("-" * 50)
    
    # Perform translation
    result = translate_text_efficient(text, target_lang)
    
    if result.get('success'):
        print(f"\n✅ Translation completed!")
        print(f"📊 Quality Score: {result['quality_score']:.1%}")
        print(f"📦 Chunks Processed: {result['chunks_processed']}")
        print(f"📏 Total Characters: {result['total_characters']:,}")
        
        print(f"\n🌍 Translated text:")
        print("=" * 50)
        print(result['translated_text'])
        
        # Save option
        save = input("\n💾 Save translation to file? (y/n): ").strip().lower()
        if save == 'y':
            filename = f"translation_{target_lang}_{len(text)}.txt"
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(f"Original ({result['source_language']}):\n")
                f.write(result['original_text'])
                f.write(f"\n\nTranslated ({result['target_language']}):\n")
                f.write(result['translated_text'])
                f.write(f"\n\nQuality Score: {result['quality_score']:.1%}")
                f.write(f"\nChunks Processed: {result['chunks_processed']}")
                f.write(f"\nTotal Characters: {result['total_characters']:,}")
            print(f"✅ Translation saved to {filename}")
    else:
        print(f"❌ Translation failed: {result.get('error', 'Unknown error')}")

if __name__ == "__main__":
    main()
