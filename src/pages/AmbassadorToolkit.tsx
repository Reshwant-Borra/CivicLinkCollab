import { Trophy, Share2, MessageCircle, Users, Download, Play, Image, FileText, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const leaderboard = [
  { name: "Maria Rodriguez", points: 1250, community: "Latino Community", rank: 1 },
  { name: "Ahmed Hassan", points: 1100, community: "Middle Eastern Community", rank: 2 },
  { name: "Li Wei", points: 980, community: "Asian American Community", rank: 3 },
  { name: "Sarah Johnson", points: 850, community: "General Community", rank: 4 },
  { name: "Priya Patel", points: 720, community: "South Asian Community", rank: 5 }
];

const contentPacks = [
  {
    title: "Voter Registration Drive",
    type: "Instagram Carousel",
    icon: Image,
    description: "5-slide carousel explaining voter registration process",
    downloads: 234,
    languages: ["Spanish", "English", "Chinese"]
  },
  {
    title: "Polling Place Finder",
    type: "WhatsApp Graphic",
    icon: Share2,
    description: "Shareable graphic with QR code to polling place finder",
    downloads: 189,
    languages: ["Arabic", "Spanish", "Hindi"]
  },
  {
    title: "Early Voting Explained",
    type: "TikTok Script",
    icon: Video,
    description: "30-second video script about early voting benefits",
    downloads: 156,
    languages: ["English", "Spanish", "Vietnamese"]
  },
  {
    title: "ID Requirements Guide",
    type: "PDF Guide",
    icon: FileText,
    description: "Comprehensive guide to ID requirements by state",
    downloads: 298,
    languages: ["English", "Chinese", "Arabic"]
  }
];

const trainingModules = [
  { title: "Fact-Checking Basics", completed: true, progress: 100 },
  { title: "Community Outreach", completed: true, progress: 100 },
  { title: "Social Media Best Practices", completed: false, progress: 60 },
  { title: "Crisis Communication", completed: false, progress: 0 }
];

export default function AmbassadorToolkit() {
  const currentUser = { name: "You", points: 650, rank: 6 };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Ambassador Toolkit</h1>
            <p className="text-muted-foreground">
              Gamified platform for community ambassadors and volunteers
            </p>
          </div>

          {/* User Stats */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Trophy className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{currentUser.name}</h2>
                    <p className="text-muted-foreground">Rank #{currentUser.rank} • {currentUser.points} points</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Next milestone</p>
                  <p className="text-lg font-semibold">750 points</p>
                  <Progress value={(currentUser.points / 750) * 100} className="w-32 mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Ambassador Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.map((ambassador) => (
                    <div key={ambassador.rank} className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                        {ambassador.rank}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{ambassador.name}</p>
                        <p className="text-sm text-muted-foreground">{ambassador.community}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{ambassador.points}</p>
                        <p className="text-xs text-muted-foreground">points</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Training Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Training Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trainingModules.map((module, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{module.title}</span>
                        <Badge variant={module.completed ? "default" : "secondary"}>
                          {module.completed ? "Completed" : "In Progress"}
                        </Badge>
                      </div>
                      <Progress value={module.progress} className="h-2" />
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4">
                  <Play className="h-4 w-4 mr-2" />
                  Continue Training
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Content Packs */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Shareable Content Packs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contentPacks.map((pack, index) => {
                  const IconComponent = pack.icon;
                  return (
                    <Card key={index} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{pack.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{pack.description}</p>
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="outline" size="sm">{pack.type}</Badge>
                            <span className="text-xs text-muted-foreground">{pack.downloads} downloads</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {pack.languages.map((lang) => (
                              <Badge key={lang} variant="secondary" size="sm">{lang}</Badge>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                            <Button variant="outline" size="sm">
                              <Share2 className="h-4 w-4 mr-2" />
                              Share
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button size="lg" className="flex-1 sm:flex-none">
              <MessageCircle className="h-5 w-5 mr-2" />
              Invite Peers to SMS Line
            </Button>
            <Button variant="outline" size="lg" className="flex-1 sm:flex-none">
              <Users className="h-5 w-5 mr-2" />
              Request Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
