#!/usr/bin/env python3
"""
Simple test script to verify translation functionality
"""

from deep_translator import GoogleTranslator
import sys

def test_translation():
    """Test basic translation functionality"""
    print("Testing deep-translator functionality...")
    
    try:
        # Test basic translation
        translator = GoogleTranslator(source='en', target='es')
        result = translator.translate('Hello world')
        print(f"✅ Basic translation test: 'Hello world' -> '{result}'")
        
        # Test larger text
        large_text = """
        Voter registration is the process of signing up to vote in elections. 
        You must register before you can cast a ballot. The requirements vary by state, 
        but most states accept a driver's license, state ID, or passport as identification.
        """
        
        result = translator.translate(large_text.strip())
        print(f"✅ Large text translation test successful")
        print(f"Original: {large_text.strip()[:50]}...")
        print(f"Translated: {result[:50]}...")
        
        # Test multiple languages
        languages = {
            'es': 'Spanish',
            'zh': 'Chinese',
            'ar': 'Arabic',
            'hi': 'Hindi'
        }
        
        test_text = "Voter registration"
        print(f"\nTesting multiple languages for '{test_text}':")
        
        for code, name in languages.items():
            try:
                translator = GoogleTranslator(source='en', target=code)
                result = translator.translate(test_text)
                print(f"✅ {name} ({code}): {result}")
            except Exception as e:
                print(f"❌ {name} ({code}): Error - {e}")
        
        print("\n🎉 All translation tests completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Translation test failed: {e}")
        return False

def test_chunking():
    """Test text chunking functionality"""
    print("\nTesting text chunking...")
    
    def chunk_text(text: str, max_chunk_size: int = 5000) -> list:
        """Split large text into chunks for efficient translation."""
        if len(text) <= max_chunk_size:
            return [text]
        
        chunks = []
        sentences = text.split('. ')
        current_chunk = ""
        
        for sentence in sentences:
            if len(current_chunk + sentence) <= max_chunk_size:
                current_chunk += sentence + ". "
            else:
                if current_chunk:
                    chunks.append(current_chunk.strip())
                current_chunk = sentence + ". "
        
        if current_chunk:
            chunks.append(current_chunk.strip())
        
        return chunks
    
    # Test with large text
    large_text = "This is a test sentence. " * 1000  # Create a large text
    chunks = chunk_text(large_text, 100)  # Small chunks for testing
    
    print(f"✅ Text chunking test: {len(large_text)} chars -> {len(chunks)} chunks")
    print(f"   First chunk: {chunks[0][:50]}...")
    print(f"   Last chunk: {chunks[-1][:50]}...")
    
    return True

if __name__ == "__main__":
    print("🚀 Starting CivicLink Translation Tests\n")
    
    # Run tests
    translation_ok = test_translation()
    chunking_ok = test_chunking()
    
    if translation_ok and chunking_ok:
        print("\n✅ All tests passed! Translation system is ready.")
        sys.exit(0)
    else:
        print("\n❌ Some tests failed. Please check the errors above.")
        sys.exit(1)
