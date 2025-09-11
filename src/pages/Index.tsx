import { Button } from "@/components/ui/button";
import { WaitlistForm } from "@/components/WaitlistForm";
import { FeatureCard } from "@/components/FeatureCard";
import { ScrollAnimatedSection } from "@/components/ScrollAnimatedSection";
import { CivicLinkLogo } from "@/components/CivicLinkLogo";
import { Link } from "react-router-dom";

const Index = () => {
  const scrollToWaitlist = () => {
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-50 smooth-gradient"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <div className="mb-8 animate-fade-in">
              <CivicLinkLogo 
                size="lg"
                className="mx-auto mb-8 animate-float"
              />
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 animate-fade-in-up">
              Voting, Made Clear.
              <br />
              <span className="bg-gradient-primary bg-clip-text text-transparent animate-glow">
                For Every Community.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed animate-fade-in-delay-1">
              Feeling overwhelmed by the voting process? Get simple, trusted, and personalized election information in your language. Sign up to be the first to use CivicLink.
            </p>
            <div className="animate-fade-in-delay-2 flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="hero" 
                size="lg" 
                onClick={scrollToWaitlist}
                className="text-lg px-12 py-4 hover-scale animate-glow"
              >
                Join the Waitlist
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                asChild
                className="text-lg px-12 py-4 hover-scale"
              >
                <Link to="/app">Try the App</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <ScrollAnimatedSection animation="fade-up">
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
              The Problem We Solve
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Navigating elections can be tough. For millions of voters, language barriers, confusing rules, and a flood of misinformation make it even harder. It's not about a lack of interest; it's about a lack of accessible tools. The result is a persistent gap in civic participation that leaves communities unheard.
            </p>
          </div>
        </section>
      </ScrollAnimatedSection>

      {/* What is CivicLink Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-subtle">
        <div className="max-w-6xl mx-auto">
          <ScrollAnimatedSection animation="fade-up">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                What is CivicLink?
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                CivicLink is your trusted, all-in-one guide to voting. We're a nonpartisan service built to give you the clear, factual information you need, right on your phone. Our mission is to make sure you can vote with total confidence.
              </p>
            </div>
          </ScrollAnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            <ScrollAnimatedSection animation="fade-up" delay={100}>
              <FeatureCard
                icon="💬"
                title="Your Personal SMS Info Line"
                description="Have a question? Just text us! Send your ZIP code to get instant, personalized answers about your polling location, hours, registration deadlines, and what you need to bring."
              />
            </ScrollAnimatedSection>
            <ScrollAnimatedSection animation="fade-up" delay={200}>
              <FeatureCard
                icon="🌐"
                title="Answers in Your Language"
                description="Get on-demand, high-quality translations of essential election information, like ballot measures and voting instructions, in plain language that's easy to understand."
              />
            </ScrollAnimatedSection>
            <ScrollAnimatedSection animation="fade-up" delay={300}>
              <FeatureCard
                icon="✅"
                title="A Misinformation Filter"
                description="See a confusing rumor on social media or in a group chat? Our rapid-response system helps you verify claims about candidates, policies, and voting procedures, so you know what to trust."
              />
            </ScrollAnimatedSection>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <ScrollAnimatedSection animation="scale-in">
        <section id="waitlist" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <WaitlistForm />
          </div>
        </section>
      </ScrollAnimatedSection>

      {/* Community Organizers Section */}
      <ScrollAnimatedSection animation="fade-up">
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-subtle">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
              Are You a Community Organizer?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              CivicLink is also a powerful toolkit for the leaders who serve our communities. We build tools to save you time, make your outreach more effective, and empower you to fight misinformation.
            </p>
            <ScrollAnimatedSection animation="scale-in" delay={200}>
              <Button variant="accent" size="lg" className="text-lg px-8 py-3 hover-scale">
                Become a Partner
              </Button>
            </ScrollAnimatedSection>
          </div>
        </section>
      </ScrollAnimatedSection>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <CivicLinkLogo 
            size="sm"
            className="mx-auto mb-4 opacity-60"
          />
          <p className="text-sm text-muted-foreground">
            CivicLink is a nonpartisan platform dedicated to making voting accessible for all communities.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;