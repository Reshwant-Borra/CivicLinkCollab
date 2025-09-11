import { Search, Volume2, Flag, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const translationData = [
  {
    english: "Voter Registration",
    translated: "Registro de Votantes",
    language: "Spanish",
    explanation: "The process of signing up to vote in elections. You must register before you can cast a ballot.",
    audioUrl: "/audio/voter-registration-es.mp3"
  },
  {
    english: "Polling Place",
    translated: "Lugar de Votación",
    language: "Spanish", 
    explanation: "The physical location where you go to vote on Election Day or during early voting.",
    audioUrl: "/audio/polling-place-es.mp3"
  },
  {
    english: "Ballot",
    translated: "Boleta Electoral",
    language: "Spanish",
    explanation: "The paper or electronic form where you mark your choices for candidates and issues.",
    audioUrl: "/audio/ballot-es.mp3"
  },
  {
    english: "Early Voting",
    translated: "Votación Anticipada",
    language: "Spanish",
    explanation: "Voting before Election Day at designated locations. Dates and locations vary by state.",
    audioUrl: "/audio/early-voting-es.mp3"
  },
  {
    english: "Absentee Ballot",
    translated: "Voto por Correo",
    language: "Spanish",
    explanation: "A ballot that you can request to vote by mail instead of going to a polling place.",
    audioUrl: "/audio/absentee-ballot-es.mp3"
  }
];

const languages = [
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "vi", name: "Vietnamese", flag: "🇻🇳" },
  { code: "tl", name: "Tagalog", flag: "🇵🇭" }
];

export default function TranslationAssistant() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("Spanish");
  const [filteredTerms, setFilteredTerms] = useState(translationData);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim() === "") {
      setFilteredTerms(translationData);
    } else {
      const filtered = translationData.filter(item =>
        item.english.toLowerCase().includes(term.toLowerCase()) ||
        item.translated.toLowerCase().includes(term.toLowerCase()) ||
        item.explanation.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredTerms(filtered);
    }
  };

  const playAudio = (audioUrl: string) => {
    // In a real app, this would play the audio file
    console.log("Playing audio:", audioUrl);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Translation Assistant</h1>
            <p className="text-muted-foreground">
              Search civic terms in your language with plain explanations
            </p>
          </div>

          {/* Search Bar */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search Civic Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 mb-4">
                <Input
                  placeholder="Search civic terms in your language..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="flex-1"
                />
              </div>
              
              {/* Language Selection */}
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <Button
                    key={lang.code}
                    variant={selectedLanguage === lang.name ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedLanguage(lang.name)}
                    className="flex items-center gap-2"
                  >
                    <span>{lang.flag}</span>
                    {lang.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Translation Cards */}
          <div className="space-y-4">
            {filteredTerms.map((term, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{term.english}</h3>
                        <Badge variant="secondary">{term.language}</Badge>
                      </div>
                      <p className="text-xl font-medium text-primary mb-3">
                        {term.translated}
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        {term.explanation}
                      </p>
                    </div>
                    <div className="ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => playAudio(term.audioUrl)}
                        className="flex items-center gap-2"
                      >
                        <Volume2 className="h-4 w-4" />
                        Listen
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Flag className="h-4 w-4 mr-2" />
                      Report Translation Issue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {filteredTerms.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No translations found</h3>
                <p className="text-muted-foreground">
                  Try searching for different terms or check back later as we add more translations.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
