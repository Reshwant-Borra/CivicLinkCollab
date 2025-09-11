import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface QuickActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  variant?: "primary" | "accent" | "default";
  className?: string;
}

export default function QuickActionCard({
  icon: Icon,
  title,
  description,
  href,
  variant = "default",
  className,
}: QuickActionCardProps) {
  const variants = {
    primary: "bg-gradient-to-br from-civic-navy to-civic-navy-light text-white hover:shadow-lg hover:shadow-civic-navy/25 hover:scale-[1.02]",
    accent: "bg-gradient-to-br from-civic-teal to-civic-teal-light text-white hover:shadow-lg hover:shadow-civic-teal/25 hover:scale-[1.02]",
    default: "bg-card text-card-foreground border border-border hover:border-primary/20 hover:shadow-md hover:scale-[1.01]",
  };

  return (
    <Link
      to={href}
      className={cn(
        "block p-6 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        variants[variant],
        className
      )}
    >
      <div className="flex items-start space-x-4">
        <div className={cn(
          "p-3 rounded-lg shrink-0",
          variant === "default" 
            ? "bg-primary/10 text-primary" 
            : "bg-white/20 text-white"
        )}>
          <Icon size={24} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className={cn(
            "text-sm leading-relaxed",
            variant === "default" ? "text-muted-foreground" : "text-white/90"
          )}>
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}