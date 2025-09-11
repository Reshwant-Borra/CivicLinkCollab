import { Calendar, Clock, MapPin, Share2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const deadlineData = [
  {
    title: "Voter Registration Deadline",
    date: "October 16, 2025",
    daysLeft: 45,
    status: "upcoming",
    description: "Last day to register to vote in the upcoming election",
  },
  {
    title: "Mail-in Ballot Request",
    date: "October 30, 2025",
    daysLeft: 59,
    status: "upcoming",
    description: "Request your absentee ballot by this date",
  },
  {
    title: "Early Voting Begins",
    date: "November 1, 2025",
    daysLeft: 61,
    status: "upcoming",
    description: "First day you can vote early in person",
  },
  {
    title: "Election Day",
    date: "November 5, 2025",
    daysLeft: 65,
    status: "election",
    description: "General Election Day - polls open 7AM to 7PM",
  },
];

export default function Deadlines() {
  const [zipCode, setZipCode] = useState("");
  const [pollingLocation] = useState({
    name: "Washington Elementary School",
    address: "123 Democracy Ave, Hometown, ST 12345",
    hours: "7:00 AM - 7:00 PM",
    distance: "0.8 miles",
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-warning text-warning-foreground";
      case "election":
        return "bg-primary text-primary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Polling Place & Deadlines</h1>
            <p className="text-muted-foreground">
              Find your voting location and stay on top of important dates
            </p>
          </div>

          {/* ZIP Code Input */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Find Your Polling Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 mb-4">
                <Input
                  placeholder="Enter your ZIP code"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="flex-1"
                />
                <Button>
                  Search
                </Button>
                <Button variant="outline">
                  Auto-detect
                </Button>
              </div>

              {/* Polling Location Result */}
              {zipCode && (
                <div className="mt-6 p-4 bg-muted rounded-lg border">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{pollingLocation.name}</h3>
                      <p className="text-muted-foreground mb-2">{pollingLocation.address}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {pollingLocation.hours}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {pollingLocation.distance}
                        </span>
                      </div>
                    </div>
                    <div className="h-16 w-16 bg-primary/10 rounded-lg flex items-center justify-center">
                      <MapPin className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share via SMS
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Important Deadlines */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Important Deadlines</h2>
            <div className="space-y-4">
              {deadlineData.map((deadline) => (
                <Card key={deadline.title} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{deadline.title}</h3>
                          <Badge className={getStatusColor(deadline.status)}>
                            {deadline.daysLeft} days left
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-2">
                          {deadline.description}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {deadline.date}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="flex-1 sm:flex-none">
              <Share2 className="h-5 w-5 mr-2" />
              Share All Dates via SMS
            </Button>
            <Button variant="outline" size="lg" className="flex-1 sm:flex-none">
              <Calendar className="h-5 w-5 mr-2" />
              Add to Calendar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}