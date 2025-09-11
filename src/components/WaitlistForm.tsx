import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface FormData {
  email: string;
  phone: string;
  zipCode: string;
  language: string;
  isOrganizer: boolean;
}

export const WaitlistForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    phone: "",
    zipCode: "",
    language: "",
    isOrganizer: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("Sending waitlist data:", formData);
      
      const { data, error } = await supabase.functions.invoke('join-waitlist', {
        body: {
          email: formData.email,
          phone: formData.phone,
          zipCode: formData.zipCode,
          language: formData.language || "Not specified",
          isOrganizer: formData.isOrganizer,
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to join waitlist');
      }

      toast({
        title: "Welcome to CivicLink! 🎉",
        description: "You're now on our waitlist. Redirecting to the app...",
      });

      // Redirect to the main app after successful waitlist submission
      setTimeout(() => {
        navigate('/app');
      }, 2000);

      setFormData({
        email: "",
        phone: "",
        zipCode: "",
        language: "",
        isOrganizer: false,
      });
    } catch (error) {
      console.error("Error submitting to webhook:", error);
      toast({
        title: "Submission Error",
        description: "There was an issue submitting your information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="p-8 bg-gradient-card backdrop-blur-sm border-border/50 shadow-card hover-glow transition-all duration-300">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-foreground mb-2">Join the Waitlist</h3>
          <p className="text-muted-foreground">
            Be the first to get access when we launch in Georgia, Florida, and New Jersey.
          </p>
        </div>

        <div className="space-y-4">
          <div className="animate-fade-in-delay-1">
            <Label htmlFor="email" className="text-foreground font-medium">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="mt-1 bg-input border-border focus:border-primary focus:ring-primary transition-all duration-300 hover:shadow-primary/20 focus:shadow-primary/30"
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div className="animate-fade-in-delay-2">
            <Label htmlFor="phone" className="text-foreground font-medium">
              Phone Number (for SMS updates) *
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="mt-1 bg-input border-border focus:border-primary focus:ring-primary transition-all duration-300 hover:shadow-primary/20 focus:shadow-primary/30"
              placeholder="(555) 123-4567"
              required
            />
          </div>

          <div className="animate-fade-in-delay-2">
            <Label htmlFor="zipCode" className="text-foreground font-medium">
              Your 5-Digit ZIP Code *
            </Label>
            <Input
              id="zipCode"
              type="text"
              value={formData.zipCode}
              onChange={(e) => handleInputChange("zipCode", e.target.value)}
              className="mt-1 bg-input border-border focus:border-primary focus:ring-primary transition-all duration-300 hover:shadow-primary/20 focus:shadow-primary/30"
              placeholder="12345"
              maxLength={5}
              pattern="[0-9]{5}"
              required
            />
          </div>

          <div className="animate-fade-in-delay-3">
            <Label htmlFor="language" className="text-foreground font-medium">
              Preferred Language
            </Label>
            <Select value={formData.language} onValueChange={(value) => handleInputChange("language", value)}>
              <SelectTrigger className="mt-1 bg-input border-border focus:border-primary focus:ring-primary transition-all duration-300 hover:shadow-primary/20">
                <SelectValue placeholder="Select your preferred language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="spanish">Español (Spanish)</SelectItem>
                <SelectItem value="french">Français (French)</SelectItem>
                <SelectItem value="portuguese">Português (Portuguese)</SelectItem>
                <SelectItem value="mandarin">中文 (Mandarin)</SelectItem>
                <SelectItem value="arabic">العربية (Arabic)</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 animate-fade-in-delay-3">
            <Checkbox
              id="organizer"
              checked={formData.isOrganizer}
              onCheckedChange={(checked) => handleInputChange("isOrganizer", checked as boolean)}
              className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all duration-300"
            />
            <Label htmlFor="organizer" className="text-sm text-foreground cursor-pointer hover:text-primary transition-all duration-300">
              I am a community organizer interested in partnership opportunities
            </Label>
          </div>
        </div>

        <div className="animate-scale-in">
          <Button
            type="submit"
            variant="hero"
            size="lg"
            className="w-full hover-scale"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Joining..." : "Join the Waitlist"}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center animate-fade-in-delay-3">
          By joining, you agree to receive updates about CivicLink. You can unsubscribe at any time.
        </p>
      </form>
    </Card>
  );
};