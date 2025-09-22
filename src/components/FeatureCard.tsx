import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <Card className="p-6 bg-gradient-card backdrop-blur-sm border-border/50 shadow-card hover-lift group">
      <div className="flex items-start space-x-4">
        <div className="text-3xl group-hover:scale-110 transition-bounce animate-float">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-all duration-300">
            {title}
          </h3>
          <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/90 transition-all duration-300">
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
};