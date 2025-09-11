interface CivicLinkLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const CivicLinkLogo = ({ className = "", size = "md" }: CivicLinkLogoProps) => {
  const sizeClasses = {
    sm: "h-8",
    md: "h-16",
    lg: "h-20"
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 400 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
      >
        {/* Logo Symbol */}
        <g>
          {/* Interlocking circles with theme colors */}
          <circle
            cx="35"
            cy="45"
            r="25"
            fill="hsl(210 100% 60%)"
            opacity="0.9"
          />
          <circle
            cx="55"
            cy="45"
            r="25"
            fill="hsl(8 90% 65%)"
            opacity="0.8"
          />
          {/* Central connecting element */}
          <rect
            x="30"
            y="35"
            width="30"
            height="20"
            rx="10"
            fill="hsl(0 0% 98%)"
          />
          {/* Highlight accent */}
          <path
            d="M25 30 L65 30 L60 40 L30 40 Z"
            fill="hsl(210 100% 70%)"
            opacity="0.6"
          />
        </g>

        {/* Text */}
        <text
          x="90"
          y="35"
          fill="hsl(0 0% 98%)"
          fontSize="28"
          fontWeight="700"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          Civic
        </text>
        <text
          x="90"
          y="65"
          fill="hsl(210 100% 60%)"
          fontSize="28"
          fontWeight="700"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          Link
        </text>
        
        {/* Subtle accent line */}
        <rect
          x="90"
          y="70"
          width="120"
          height="2"
          fill="hsl(8 90% 65%)"
          rx="1"
        />
      </svg>
    </div>
  );
};