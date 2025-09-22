import { 
  Search, 
  Share2, 
  MessageCircle, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  HelpCircle,
  Filter,
  SortAsc,
  RefreshCw,
  ExternalLink,
  Clock,
  Eye,
  Share
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect, useCallback, useRef } from "react";

// Types
interface Claim {
  id: number;
  claim: string;
  verdict: "true" | "false" | "misleading" | "unverified";
  explanation: string;
  sources: string[];
  language: string;
  community: string;
  viewCount?: number;
  shareCount?: number;
  recentMentions24h?: number;
  createdAt?: string;
  externalSources?: string[];
}

interface TrendingRumor {
  claim: string;
  language: string;
  community: string;
  trendScore?: number;
}

// Mock data with enhanced properties
const initialFactCheckData: Claim[] = [
  {
    id: 1,
    claim: "You can vote by text message",
    verdict: "false",
    explanation: "Voting by text message is not allowed in any US state. You must vote in person or by mail-in ballot.",
    sources: ["Federal Election Commission", "National Association of Secretaries of State"],
    language: "English",
    community: "General",
    viewCount: 1250,
    shareCount: 45,
    recentMentions24h: 12,
    createdAt: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    claim: "Early voting is available in all states",
    verdict: "misleading",
    explanation: "Early voting availability varies by state. Some states offer early voting, others only allow absentee voting.",
    sources: ["Ballotpedia", "National Conference of State Legislatures"],
    language: "English", 
    community: "General",
    viewCount: 890,
    shareCount: 23,
    recentMentions24h: 8,
    createdAt: "2024-01-14T15:45:00Z"
  },
  {
    id: 3,
    claim: "You need a photo ID to vote",
    verdict: "misleading",
    explanation: "ID requirements vary by state. Some states require photo ID, others accept non-photo ID or have no ID requirement.",
    sources: ["Brennan Center for Justice", "National Conference of State Legislatures"],
    language: "English",
    community: "General",
    viewCount: 2100,
    shareCount: 67,
    recentMentions24h: 25,
    createdAt: "2024-01-13T09:20:00Z"
  }
];

const initialTrendingRumors: TrendingRumor[] = [
  {
    claim: "Voting machines are connected to the internet",
    language: "Spanish",
    community: "Latino Community",
    trendScore: 95
  },
  {
    claim: "You can vote multiple times",
    language: "Chinese", 
    community: "Asian American Community",
    trendScore: 87
  },
  {
    claim: "Mail-in ballots are not secure",
    language: "Arabic",
    community: "Middle Eastern Community",
    trendScore: 92
  }
];

// Utility functions
const getVerdictColor = (verdict: string) => {
  switch (verdict) {
    case "true":
      return "bg-green-100 text-green-800 border-green-200";
    case "false":
      return "bg-red-100 text-red-800 border-red-200";
    case "misleading":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "unverified":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getVerdictIcon = (verdict: string) => {
  switch (verdict) {
    case "true":
      return CheckCircle;
    case "false":
      return XCircle;
    case "misleading":
      return AlertTriangle;
    case "unverified":
      return Clock;
    default:
      return HelpCircle;
  }
};

// Custom hooks
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const useServerSentEvents = (url: string, onMessage: (data: any) => void) => {
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!url) return;

    const eventSource = new EventSource(url);
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
    };

    return () => {
      eventSource.close();
    };
  }, [url, onMessage]);

  return () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
  };
};

// API functions
const searchFacts = async (query: string): Promise<Claim[]> => {
  try {
    const response = await fetch(`/api/facts/search?q=${encodeURIComponent(query)}`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Search API error:', error);
  }
  return [];
};

const fetchTrendingFacts = async (): Promise<Claim[]> => {
  try {
    const response = await fetch('/api/facts/trending');
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Trending API error:', error);
  }
  return [];
};

const submitClaim = async (claim: string): Promise<Claim | null> => {
  try {
    const response = await fetch('/api/facts/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ claim }),
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Submit API error:', error);
  }
  return null;
};

const fetchExternalSources = async (query: string): Promise<string[]> => {
  try {
    const response = await fetch(`/api/facts/external?q=${encodeURIComponent(query)}`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('External sources API error:', error);
  }
  return [];
};

// Highlight search matches
const highlightSearchMatch = (text: string, searchTerm: string) => {
  if (!searchTerm.trim()) return text;
  
  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, index) => 
    regex.test(part) ? (
      <mark key={index} className="bg-yellow-200 px-1 rounded">
        {part}
      </mark>
    ) : part
  );
};

// Calculate trend score fallback
const calculateTrendScore = (claim: Claim): number => {
  const viewWeight = 0.4;
  const shareWeight = 0.4;
  const mentionWeight = 0.2;
  
  const normalizedViews = Math.min((claim.viewCount || 0) / 1000, 1);
  const normalizedShares = Math.min((claim.shareCount || 0) / 100, 1);
  const normalizedMentions = Math.min((claim.recentMentions24h || 0) / 50, 1);
  
  return Math.round(
    (normalizedViews * viewWeight + 
     normalizedShares * shareWeight + 
     normalizedMentions * mentionWeight) * 100
  );
};

export default function FactCheckHub() {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [submissionText, setSubmissionText] = useState("");
  const [claims, setClaims] = useState<Claim[]>(initialFactCheckData);
  const [trendingRumors, setTrendingRumors] = useState<TrendingRumor[]>(initialTrendingRumors);
  const [filteredClaims, setFilteredClaims] = useState<Claim[]>(initialFactCheckData);
  const [expandedSources, setExpandedSources] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRefreshIndicator, setShowRefreshIndicator] = useState(false);
  const [searchResults, setSearchResults] = useState<Claim[]>([]);
  const [externalSources, setExternalSources] = useState<string[]>([]);
  const [showExternalSources, setShowExternalSources] = useState<number | null>(null);

  // Filter and sort state
  const [selectedCommunity, setSelectedCommunity] = useState<string>("all");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [selectedVerdict, setSelectedVerdict] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  // Debounced search
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Get unique values for filters
  const communities = Array.from(new Set(claims.map(c => c.community)));
  const languages = Array.from(new Set(claims.map(c => c.language)));
  const verdicts = Array.from(new Set(claims.map(c => c.verdict)));

  // Real-time updates via SSE
  const handleNewClaim = useCallback((newClaim: Claim) => {
    setClaims(prev => [newClaim, ...prev]);
    setShowRefreshIndicator(true);
    setTimeout(() => setShowRefreshIndicator(false), 3000);
  }, []);

  useServerSentEvents('/api/facts/stream', handleNewClaim);

  // Search effect
  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      searchFacts(debouncedSearchTerm).then(results => {
        if (results.length > 0) {
          setSearchResults(results);
          setFilteredClaims(results);
        } else {
          // Fallback to local filtering
          const filtered = claims.filter(item =>
            item.claim.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            item.explanation.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
          );
          setFilteredClaims(filtered);
          setSearchResults([]);
        }
      });
    } else {
      setSearchResults([]);
      applyFiltersAndSort();
    }
  }, [debouncedSearchTerm, claims]);

  // Filter and sort effect
  const applyFiltersAndSort = useCallback(() => {
    let filtered = [...claims];

    // Apply filters
    if (selectedCommunity !== "all") {
      filtered = filtered.filter(c => c.community === selectedCommunity);
    }
    if (selectedLanguage !== "all") {
      filtered = filtered.filter(c => c.language === selectedLanguage);
    }
    if (selectedVerdict !== "all") {
      filtered = filtered.filter(c => c.verdict === selectedVerdict);
    }

    // Apply sorting
    switch (sortBy) {
      case "trending":
        filtered.sort((a, b) => {
          const scoreA = calculateTrendScore(a);
          const scoreB = calculateTrendScore(b);
          return scoreB - scoreA;
        });
        break;
      case "newest":
        filtered.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA;
        });
        break;
      case "most-shared":
        filtered.sort((a, b) => (b.shareCount || 0) - (a.shareCount || 0));
        break;
    }

    setFilteredClaims(filtered);
  }, [claims, selectedCommunity, selectedLanguage, selectedVerdict, sortBy]);

  useEffect(() => {
    if (!debouncedSearchTerm.trim()) {
      applyFiltersAndSort();
    }
  }, [applyFiltersAndSort, debouncedSearchTerm]);

  // Load trending data
  useEffect(() => {
    fetchTrendingFacts().then(trending => {
      if (trending.length > 0) {
        setClaims(prev => [...trending, ...prev]);
      }
    });
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleSubmit = async () => {
    if (submissionText.trim() && !isSubmitting) {
      setIsSubmitting(true);
      
      // Create pending claim
      const pendingClaim: Claim = {
        id: Date.now(),
        claim: submissionText,
        verdict: "unverified",
        explanation: "This claim is being reviewed by our fact-checking team.",
        sources: [],
        language: "English",
        community: "General",
        viewCount: 0,
        shareCount: 0,
        recentMentions24h: 0,
        createdAt: new Date().toISOString()
      };

      // Add to list immediately
      setClaims(prev => [pendingClaim, ...prev]);
      setSubmissionText("");

      // Submit to backend
      try {
        const result = await submitClaim(submissionText);
        if (result) {
          // Replace pending claim with verified result
          setClaims(prev => prev.map(c => 
            c.id === pendingClaim.id ? result : c
          ));
        }
      } catch (error) {
        console.error('Failed to submit claim:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleShare = async (claim: Claim) => {
    const shareText = `Fact Check: "${claim.claim}" - ${claim.verdict.toUpperCase()}\n\n${claim.explanation}`;
    const shareUrl = `${window.location.origin}/fact-check/${claim.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Fact Check',
          text: shareText,
          url: shareUrl
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    }
  };

  const handleWhatsAppShare = (claim: Claim) => {
    const text = `Fact Check: "${claim.claim}" - ${claim.verdict.toUpperCase()}\n\n${claim.explanation}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleSMSShare = (claim: Claim) => {
    const text = `Fact Check: "${claim.claim}" - ${claim.verdict.toUpperCase()}\n\n${claim.explanation}`;
    const url = `sms:?body=${encodeURIComponent(text)}`;
    window.open(url);
  };

  const handleExternalSources = async (claim: Claim) => {
    if (showExternalSources === claim.id) {
      setShowExternalSources(null);
      return;
    }

    setShowExternalSources(claim.id);
    const sources = await fetchExternalSources(claim.claim);
    setExternalSources(sources);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Fact-Check Hub</h1>
            <p className="text-muted-foreground">
              Verify voting information and combat misinformation
            </p>
            {showRefreshIndicator && (
              <div className="flex items-center justify-center gap-2 mt-2 text-sm text-green-600">
                <RefreshCw className="h-4 w-4 animate-spin" />
                New fact-checks available
              </div>
            )}
          </div>

          {/* Search/Submit Bar */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search or Submit a Claim
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  placeholder="Search existing fact-checks..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full"
                />
                <div className="flex gap-3">
                  <Textarea
                    placeholder="Paste a rumor or question here..."
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    className="flex-1"
                    rows={3}
                  />
                  <Button 
                    onClick={handleSubmit} 
                    className="self-end"
                    disabled={isSubmitting || !submissionText.trim()}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filter and Sort Controls */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter & Sort
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Select value={selectedCommunity} onValueChange={setSelectedCommunity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Community" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Communities</SelectItem>
                    {communities.map(community => (
                      <SelectItem key={community} value={community}>
                        {community}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Languages</SelectItem>
                    {languages.map(language => (
                      <SelectItem key={language} value={language}>
                        {language}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedVerdict} onValueChange={setSelectedVerdict}>
                  <SelectTrigger>
                    <SelectValue placeholder="Verdict" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Verdicts</SelectItem>
                    {verdicts.map(verdict => (
                      <SelectItem key={verdict} value={verdict}>
                        {verdict.charAt(0).toUpperCase() + verdict.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trending">Trending</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="most-shared">Most Shared</SelectItem>
                  </SelectContent>
                </Select>

                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedCommunity("all");
                    setSelectedLanguage("all");
                    setSelectedVerdict("all");
                    setSortBy("newest");
                    setSearchTerm("");
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Trending Rumors */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Trending Rumors by Community
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trendingRumors.map((rumor, index) => (
                  <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-medium flex-1">{rumor.claim}</p>
                      {rumor.trendScore && (
                        <Badge variant="secondary" className="ml-2">
                          {rumor.trendScore}%
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline">{rumor.language}</Badge>
                      <span>{rumor.community}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Fact-Check Cards */}
          <div className="space-y-6">
            {filteredClaims.map((claim) => {
              const VerdictIcon = getVerdictIcon(claim.verdict);
              const trendScore = calculateTrendScore(claim);
              
              return (
                <Card key={claim.id} className="hover:shadow-lg transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      {/* Main Content */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <VerdictIcon className="h-5 w-5 flex-shrink-0" />
                          <Badge className={`${getVerdictColor(claim.verdict)} flex-shrink-0`}>
                            {claim.verdict.charAt(0).toUpperCase() + claim.verdict.slice(1)}
                          </Badge>
                          <Badge variant="outline" className="flex-shrink-0">{claim.language}</Badge>
                          <Badge variant="outline" className="flex-shrink-0">{claim.community}</Badge>
                          {sortBy === "trending" && (
                            <Badge variant="secondary" className="flex-shrink-0">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              {trendScore}%
                            </Badge>
                          )}
                        </div>
                        
                        <h3 className="text-lg font-semibold mb-3 leading-relaxed">
                          {highlightSearchMatch(claim.claim, searchTerm)}
                        </h3>
                        
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          {highlightSearchMatch(claim.explanation, searchTerm)}
                        </p>
                        
                        {/* Stats */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {claim.viewCount || 0} views
                          </div>
                          <div className="flex items-center gap-1">
                            <Share className="h-4 w-4" />
                            {claim.shareCount || 0} shares
                          </div>
                          {claim.createdAt && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {new Date(claim.createdAt).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                        
                        {/* Sources */}
                        <div className="mb-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setExpandedSources(
                              expandedSources === claim.id ? null : claim.id
                            )}
                            className="mr-2"
                          >
                            See Sources ({claim.sources.length})
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExternalSources(claim)}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            External Sources
                          </Button>
                          
                          {expandedSources === claim.id && (
                            <div className="mt-3 p-3 bg-muted rounded-lg">
                              <ul className="text-sm space-y-1">
                                {claim.sources.map((source, index) => (
                                  <li key={index} className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></span>
                                    {source}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {showExternalSources === claim.id && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <h4 className="text-sm font-medium mb-2 text-blue-900">External Sources</h4>
                              {externalSources.length > 0 ? (
                                <ul className="text-sm space-y-1">
                                  {externalSources.map((source, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                      <ExternalLink className="h-3 w-3 text-blue-600 flex-shrink-0" />
                                      <a 
                                        href={source} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline truncate"
                                      >
                                        {source}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-sm text-blue-700">No external sources found</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Share Buttons */}
                      <div className="flex flex-col gap-2 lg:min-w-[200px]">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleShare(claim)}
                          className="w-full"
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleWhatsAppShare(claim)}
                          className="w-full"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          WhatsApp
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSMSShare(claim)}
                          className="w-full"
                        >
                          SMS
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* No Results */}
          {filteredClaims.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No fact-checks found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search terms, or submit a new claim for verification.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedCommunity("all");
                    setSelectedLanguage("all");
                    setSelectedVerdict("all");
                    setSearchTerm("");
                  }}
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}