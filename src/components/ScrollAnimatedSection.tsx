import { ReactNode } from 'react';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';

interface ScrollAnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'scale-in';
  delay?: number;
}

export const ScrollAnimatedSection = ({ 
  children, 
  className = '', 
  animation = 'fade-up',
  delay = 0
}: ScrollAnimatedSectionProps) => {
  const { ref, isVisible } = useScrollAnimation();

  const animationClasses = {
    'fade-up': isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8',
    'fade-in': isVisible ? 'animate-fade-in' : 'opacity-0',
    'slide-left': isVisible ? 'animate-slide-in-left' : 'opacity-0 -translate-x-8',
    'slide-right': isVisible ? 'animate-slide-in-right' : 'opacity-0 translate-x-8',
    'scale-in': isVisible ? 'animate-scale-in' : 'opacity-0 scale-95'
  };

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        animationClasses[animation],
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};