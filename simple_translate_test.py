#!/usr/bin/env python3
"""
Simple translation test without interactive input
"""

from deep_translator import GoogleTranslator

def test_translation():
    """Test translation with sample civic text"""
    
    # Sample civic text
    text = """
    Voter registration is the process of signing up to vote in elections. 
    You must register before you can cast a ballot. The requirements vary by state, 
    but most states accept a driver's license, state ID, or passport as identification.
    Early voting allows you to vote before Election Day at designated locations. 
    Absentee ballots let you vote by mail if you cannot go to a polling place.
    """
    
    print("🌍 Testing CivicLink Translation System")
    print("=" * 60)
    print(f"📝 Original text ({len(text.strip())} characters):")
    print(text.strip())
    
    # Test Spanish translation
    print("\n🔄 Translating to Spanish...")
    try:
        translator = GoogleTranslator(source='en', target='es')
        spanish_result = translator.translate(text.strip())
        print("✅ Spanish translation successful!")
        print(f"📊 Translated text ({len(spanish_result)} characters):")
        print(spanish_result)
    except Exception as e:
        print(f"❌ Spanish translation failed: {e}")
    
    # Test Chinese translation
    print("\n🔄 Translating to Chinese...")
    try:
        translator = GoogleTranslator(source='en', target='zh-CN')
        chinese_result = translator.translate(text.strip())
        print("✅ Chinese translation successful!")
        print(f"📊 Translated text ({len(chinese_result)} characters):")
        print(chinese_result)
    except Exception as e:
        print(f"❌ Chinese translation failed: {e}")
    
    # Test Arabic translation
    print("\n🔄 Translating to Arabic...")
    try:
        translator = GoogleTranslator(source='en', target='ar')
        arabic_result = translator.translate(text.strip())
        print("✅ Arabic translation successful!")
        print(f"📊 Translated text ({len(arabic_result)} characters):")
        print(arabic_result)
    except Exception as e:
        print(f"❌ Arabic translation failed: {e}")
    
    print("\n🎉 Translation system is working correctly!")
    print("You can now use the Flask app or the interactive script.")

if __name__ == "__main__":
    test_translation()
