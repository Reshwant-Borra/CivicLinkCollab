import { Home, Calendar, Shield, Languages, HelpCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navigationItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Calendar, label: "Deadlines", href: "/deadlines" },
  { icon: Shield, label: "Fact-Check", href: "/fact-check" },
  { icon: Languages, label: "Language", href: "/language" },
  { icon: HelpCircle, label: "Help", href: "/help" },
];

export default function BottomNavigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
      <div className="flex items-center justify-around px-2 py-2">
        {navigationItems.map(({ icon: Icon, label, href }) => {
          const isActive = location.pathname === href;
          
          return (
            <Link
              key={href}
              to={href}
              className={cn(
                "flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all duration-200 min-w-0 flex-1",
                "hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label={label}
            >
              <Icon size={20} className="mb-1 shrink-0" />
              <span className="text-xs font-medium truncate">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}