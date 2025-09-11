import { BarChart3, Users, FileText, Download, MessageSquare, TrendingUp, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const topQuestions = [
  { question: "Where is my polling place?", count: 45, language: "Spanish" },
  { question: "Can I vote by mail?", count: 32, language: "Chinese" },
  { question: "What ID do I need?", count: 28, language: "Arabic" },
  { question: "When is early voting?", count: 24, language: "English" },
  { question: "How do I register?", count: 19, language: "Hindi" }
];

const claimSubmissions = [
  { id: 1, claim: "Voting machines are hacked", status: "pending", submitted: "2 hours ago" },
  { id: 2, claim: "You can vote online", status: "verified", submitted: "1 day ago" },
  { id: 3, claim: "Early voting is not secure", status: "in-progress", submitted: "3 days ago" }
];

const contentLibrary = [
  { title: "Voter Registration Guide", type: "PDF", language: "Spanish", downloads: 234 },
  { title: "Polling Place Finder", type: "Graphic", language: "Chinese", downloads: 189 },
  { title: "ID Requirements", type: "Video", language: "Arabic", downloads: 156 },
  { title: "Early Voting Dates", type: "Infographic", language: "English", downloads: 298 }
];

const analyticsData = {
  totalUsers: 1250,
  languagesUsed: 8,
  factChecksCompleted: 45,
  topMisinformationTopics: [
    { topic: "Voting Security", percentage: 35 },
    { topic: "ID Requirements", percentage: 28 },
    { topic: "Mail-in Ballots", percentage: 22 },
    { topic: "Early Voting", percentage: 15 }
  ]
};

export default function OrganizerPortal() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-success text-success-foreground";
      case "pending":
        return "bg-warning text-warning-foreground";
      case "in-progress":
        return "bg-primary text-primary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return CheckCircle;
      case "pending":
        return Clock;
      case "in-progress":
        return AlertCircle;
      default:
        return Clock;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Organizer Portal</h1>
            <p className="text-muted-foreground">
              Partner dashboard for community organizers and ambassadors
            </p>
          </div>

          {/* Analytics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Users className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{analyticsData.totalUsers}</p>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{analyticsData.languagesUsed}</p>
                    <p className="text-sm text-muted-foreground">Languages</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{analyticsData.factChecksCompleted}</p>
                    <p className="text-sm text-muted-foreground">Fact-Checks</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">98%</p>
                    <p className="text-sm text-muted-foreground">Accuracy Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="claims">Claims</TabsTrigger>
              <TabsTrigger value="content">Content Library</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              {/* Top Community Questions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Top Community Questions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topQuestions.map((question, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{question.question}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" size="sm">{question.language}</Badge>
                            <span className="text-sm text-muted-foreground">{question.count} times asked</span>
                          </div>
                        </div>
                        <div className="w-16 bg-primary/20 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${(question.count / 45) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="claims" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Claim Submissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {claimSubmissions.map((submission) => {
                      const StatusIcon = getStatusIcon(submission.status);
                      return (
                        <div key={submission.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium mb-1">{submission.claim}</p>
                            <p className="text-sm text-muted-foreground">Submitted {submission.submitted}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={getStatusColor(submission.status)}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {submission.status}
                            </Badge>
                            <Button variant="outline" size="sm">Review</Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Content Library</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {contentLibrary.map((item, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{item.title}</h3>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" size="sm">{item.type}</Badge>
                              <Badge variant="outline" size="sm">{item.language}</Badge>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {item.downloads} downloads
                        </p>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Misinformation Topics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.topMisinformationTopics.map((topic, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{topic.topic}</span>
                          <span>{topic.percentage}%</span>
                        </div>
                        <Progress value={topic.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
