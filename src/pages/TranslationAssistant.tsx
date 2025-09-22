import { Languages, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";


export default function TranslationAssistant() {
  const [selectedLanguage, setSelectedLanguage] = useState("spanish");
  
  // Custom text translation states
  const [customText, setCustomText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationResult, setTranslationResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Language data states
  const [allLanguages, setAllLanguages] = useState<string[]>([]);
  const [civicLanguages, setCivicLanguages] = useState<any>({});
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(true);

  // Fetch languages from API
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_BASE_URL}/api/languages`);
        const data = await response.json();
        
        setAllLanguages(data.all_languages || []);
        setCivicLanguages(data.civic_languages || {});
        setIsLoadingLanguages(false);
      } catch (error) {
        console.error('Failed to fetch languages:', error);
        setIsLoadingLanguages(false);
        toast({
          title: "Warning",
          description: "Could not load all languages. Using default set.",
          variant: "destructive",
        });
      }
    };

    fetchLanguages();
  }, [toast]);


  const handleCustomTranslation = async () => {
    if (!customText.trim()) {
      toast({
        title: "Error",
        description: "Please enter text to translate",
        variant: "destructive",
      });
      return;
    }

    setIsTranslating(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE_URL}/api/translate-text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: customText,
          target_language: selectedLanguage,
          source_language: 'auto'
        })
      });

      const result = await response.json();

      if (result.error) {
        toast({
          title: "Translation Error",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      setTranslatedText(result.translated_text);
      setTranslationResult(result);
      
      const languageName = civicLanguages[selectedLanguage]?.native || selectedLanguage;
      toast({
        title: "Translation Complete",
        description: `Translated to ${languageName} with ${Math.round(result.quality_score * 100)}% quality`,
      });
    } catch (error) {
      console.error('Translation error:', error);
      toast({
        title: "Translation Error",
        description: "Failed to translate text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Translation copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Translation Assistant</h1>
            <p className="text-muted-foreground">
              Translate any text to over 133 languages with high-quality results
            </p>
          </div>


          {/* Custom Text Translation Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages className="h-5 w-5" />
                Translate Your Own Text
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Language Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Target Language:</label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a language..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {/* Popular Civic Languages */}
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted">
                        Popular Civic Languages
                      </div>
                      {Object.entries(civicLanguages).map(([key, lang]: [string, any]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            <span>{lang.native}</span>
                            <span className="text-muted-foreground text-xs">({key})</span>
                          </div>
                        </SelectItem>
                      ))}
                      
                      {/* All Languages */}
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted mt-2">
                        All Languages ({allLanguages.length})
                      </div>
                      {allLanguages.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          <div className="flex items-center gap-2">
                            <span className="capitalize">{lang}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Enter text to translate:
                  </label>
                  <Textarea
                    placeholder="Paste or type any text you want to translate..."
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    className="min-h-[120px] resize-none"
                    maxLength={5000}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {customText.length}/5000 characters
                  </div>
              </div>
              
                <div className="flex gap-3">
                  <Button
                    onClick={handleCustomTranslation}
                    disabled={isTranslating || !customText.trim()}
                    className="flex-1"
                  >
                    {isTranslating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Translating...
                      </>
                    ) : (
                      <>
                        <Languages className="h-4 w-4 mr-2" />
                        Translate to {civicLanguages[selectedLanguage]?.native || selectedLanguage}
                      </>
                    )}
                  </Button>
              </div>

                {/* Translation Results */}
                {translatedText && (
                  <Card className="mt-6 border-2 border-primary/20 bg-primary/5">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Languages className="h-5 w-5 text-primary" />
                          Translation Result
                        </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                          onClick={() => copyToClipboard(translatedText)}
                        className="flex items-center gap-2"
                      >
                          {copied ? (
                            <>
                              <Check className="h-4 w-4" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4" />
                              Copy
                            </>
                          )}
                      </Button>
                    </div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-background p-4 rounded-lg border-2 border-dashed border-muted-foreground/20 mb-4">
                        <p className="text-base leading-relaxed font-medium">{translatedText}</p>
                  </div>
                  
                      {translationResult && (
                        <div className="flex flex-wrap gap-4 text-sm">
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <span>Quality: {Math.round(translationResult.quality_score * 100)}%</span>
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <span>Characters: {translationResult.total_characters?.toLocaleString() || customText.length}</span>
                          </Badge>
                          {translationResult.chunks_processed && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <span>Chunks: {translationResult.chunks_processed}</span>
                            </Badge>
                          )}
                          <Badge variant="outline" className="flex items-center gap-1">
                            <span>Service: {translationResult.translation_service}</span>
                          </Badge>
                  </div>
                      )}
                </CardContent>
              </Card>
                )}
          </div>
              </CardContent>
            </Card>

        </div>
      </div>
    </div>
  );
}
