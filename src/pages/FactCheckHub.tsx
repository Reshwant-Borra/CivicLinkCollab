import { Search, Share2, MessageCircle, TrendingUp, CheckCircle, AlertTriangle, XCircle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const factCheckData = [
  {
    id: 1,
    claim: "You can vote by text message",
    verdict: "false",
    explanation: "Voting by text message is not allowed in any US state. You must vote in person or by mail-in ballot.",
    sources: ["Federal Election Commission", "National Association of Secretaries of State"],
    language: "English",
    community: "General"
  },
  {
    id: 2,
    claim: "Early voting is available in all states",
    verdict: "misleading",
    explanation: "Early voting availability varies by state. Some states offer early voting, others only allow absentee voting.",
    sources: ["Ballotpedia", "National Conference of State Legislatures"],
    language: "English", 
    community: "General"
  },
  {
    id: 3,
    claim: "You need a photo ID to vote",
    verdict: "misleading",
    explanation: "ID requirements vary by state. Some states require photo ID, others accept non-photo ID or have no ID requirement.",
    sources: ["Brennan Center for Justice", "National Conference of State Legislatures"],
    language: "English",
    community: "General"
  }
];

const trendingRumors = [
  {
    claim: "Voting machines are connected to the internet",
    language: "Spanish",
    community: "Latino Community"
  },
  {
    claim: "You can vote multiple times",
    language: "Chinese", 
    community: "Asian American Community"
  },
  {
    claim: "Mail-in ballots are not secure",
    language: "Arabic",
    community: "Middle Eastern Community"
  }
];

const getVerdictColor = (verdict: string) => {
  switch (verdict) {
    case "true":
      return "bg-success text-success-foreground";
    case "false":
      return "bg-destructive text-destructive-foreground";
    case "misleading":
      return "bg-warning text-warning-foreground";
    default:
      return "bg-muted text-muted-foreground";
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
    default:
      return HelpCircle;
  }
};

export default function FactCheckHub() {
  const [searchTerm, setSearchTerm] = useState("");
  const [submissionText, setSubmissionText] = useState("");
  const [filteredClaims, setFilteredClaims] = useState(factCheckData);
  const [expandedSources, setExpandedSources] = useState<number | null>(null);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim() === "") {
      setFilteredClaims(factCheckData);
    } else {
      const filtered = factCheckData.filter(item =>
        item.claim.toLowerCase().includes(term.toLowerCase()) ||
        item.explanation.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredClaims(filtered);
    }
  };

  const handleSubmit = () => {
    if (submissionText.trim()) {
      // In a real app, this would submit to a backend
      console.log("Submitting claim:", submissionText);
      setSubmissionText("");
    }
  };

  const shareClaim = (claim: any) => {
    // In a real app, this would open sharing options
    console.log("Sharing claim:", claim);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Fact-Check Hub</h1>
            <p className="text-muted-foreground">
              Verify voting information and combat misinformation
            </p>
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
                />
                <div className="flex gap-3">
                  <Textarea
                    placeholder="Paste a rumor or question here..."
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    className="flex-1"
                    rows={3}
                  />
                  <Button onClick={handleSubmit} className="self-end">
                    Submit
                  </Button>
                </div>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {trendingRumors.map((rumor, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-medium flex-1">{rumor.claim}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" size="sm">{rumor.language}</Badge>
                      <span>{rumor.community}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Fact-Check Cards */}
          <div className="space-y-4">
            {filteredClaims.map((claim) => {
              const VerdictIcon = getVerdictIcon(claim.verdict);
              return (
                <Card key={claim.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <VerdictIcon className="h-5 w-5" />
                          <Badge className={getVerdictColor(claim.verdict)}>
                            {claim.verdict.charAt(0).toUpperCase() + claim.verdict.slice(1)}
                          </Badge>
                          <Badge variant="outline">{claim.language}</Badge>
                        </div>
                        <h3 className="text-lg font-semibold mb-3">{claim.claim}</h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          {claim.explanation}
                        </p>
                        
                        {/* Sources */}
                        <div className="mb-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setExpandedSources(
                              expandedSources === claim.id ? null : claim.id
                            )}
                          >
                            See Sources ({claim.sources.length})
                          </Button>
                          {expandedSources === claim.id && (
                            <div className="mt-2 p-3 bg-muted rounded-lg">
                              <ul className="text-sm space-y-1">
                                {claim.sources.map((source, index) => (
                                  <li key={index} className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                                    {source}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Share Buttons */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => shareClaim(claim)}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        WhatsApp
                      </Button>
                      <Button variant="outline" size="sm">
                        SMS
                      </Button>
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
                <p className="text-muted-foreground">
                  Try searching for different terms or submit a new claim for verification.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
