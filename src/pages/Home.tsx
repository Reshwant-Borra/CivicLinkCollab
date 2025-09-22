import { MapPin, Calendar, Shield, Languages, ChevronRight } from "lucide-react";
import QuickActionCard from "@/components/QuickActionCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import civicHeroImage from "@/assets/civic-hero.jpg";

const quickActions = [
  {
    icon: MapPin,
    title: "Where Do I Vote?",
    description: "Find your polling location, hours, and what to bring",
    href: "/polling",
    variant: "primary" as const,
  },
  {
    icon: Calendar,
    title: "Important Deadlines",
    description: "Registration cutoffs, early voting, and mail-in ballot dates",
    href: "/deadlines",
    variant: "accent" as const,
  },
  {
    icon: Shield,
    title: "Check a Claim",
    description: "Verify voting information and fact-check rumors",
    href: "/fact-check",
    variant: "default" as const,
  },
  {
    icon: Languages,
    title: "Language Support",
    description: "Access voting materials in your preferred language",
    href: "/language",
    variant: "default" as const,
  },
];

const onboardingSlides = [
  {
    title: "Translate Civic Terms",
    description: "Get voting information in your native language with plain explanations",
    icon: Languages,
  },
  {
    title: "Fact-Check Claims",
    description: "Verify voting information from trusted, nonpartisan sources",
    icon: Shield,
  },
  {
    title: "SMS Info Line",
    description: "Text questions and get instant answers about voting in your area",
    icon: MapPin,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${civicHeroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-civic-navy/90 via-civic-navy/80 to-civic-navy/70" />
        </div>
        
        <div className="relative z-10 px-4 py-16">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              CivicLink
            </h1>
            <p className="text-xl md:text-2xl font-medium mb-8 text-white/90">
              Helping every voice be heard, no matter the language.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-civic-navy hover:bg-white/90 font-semibold px-8"
              >
                Get Started
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                className="bg-white text-civic-navy hover:bg-white/90 font-semibold px-8"
              >
                Learn More
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickActions.map((action) => (
              <QuickActionCard
                key={action.title}
                icon={action.icon}
                title={action.title}
                description={action.description}
                href={action.href}
                variant={action.variant}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Onboarding Carousel */}
      <section className="px-4 py-12 bg-muted">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">
            How CivicLink Helps You
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {onboardingSlides.map((slide, index) => (
              <Card key={slide.title} className="text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                    <slide.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">
                    {slide.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {slide.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-gradient-to-r from-civic-navy/5 to-civic-teal/5 border-civic-navy/20">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold mb-4">
                Nonpartisan • Privacy-First • Community-Driven
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                CivicLink is committed to providing accurate, nonpartisan voting information. 
                We don't endorse candidates or parties—we simply help every eligible citizen participate in democracy.
              </p>
              <Button variant="outline" asChild>
                <a href="/about">Learn About Our Mission</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}