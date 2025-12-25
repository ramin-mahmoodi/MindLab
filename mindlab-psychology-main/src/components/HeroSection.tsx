import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,hsl(174_72%_56%/0.15),transparent_50%)]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      
      {/* Floating Elements */}
      <div className="absolute top-32 left-[10%] w-20 h-20 border border-primary/30 rounded-2xl rotate-12 animate-float opacity-40" />
      <div className="absolute top-48 right-[15%] w-16 h-16 border border-accent/30 rounded-full animate-float-delayed opacity-40" />
      <div className="absolute bottom-32 left-[20%] w-12 h-12 bg-primary/20 rounded-lg rotate-45 animate-float opacity-40" />
      <div className="absolute bottom-48 right-[10%] w-24 h-24 border border-primary/20 rounded-3xl -rotate-12 animate-float-delayed opacity-40" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(220_20%_18%/0.3)_1px,transparent_1px),linear-gradient(90deg,hsl(220_20%_18%/0.3)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />

      <div className="container relative z-10 px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8 animate-fade-up">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Discover Your Mind's Potential</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6 animate-fade-up-delayed">
            Unlock the Secrets of{' '}
            <span className="gradient-text">Your Psychology</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up-delayed" style={{ animationDelay: '0.4s' }}>
            Take scientifically validated psychological assessments and gain deep insights into your personality, cognitive abilities, and mental well-being.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up-delayed" style={{ animationDelay: '0.6s' }}>
            <Button variant="glow" size="xl">
              Take Free Assessment
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="heroOutline" size="xl">
              Explore All Tests
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-xl mx-auto mt-16 animate-fade-up-delayed" style={{ animationDelay: '0.8s' }}>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-display font-bold text-foreground">50K+</div>
              <div className="text-sm text-muted-foreground mt-1">Tests Taken</div>
            </div>
            <div className="text-center border-x border-border">
              <div className="text-3xl sm:text-4xl font-display font-bold text-foreground">15+</div>
              <div className="text-sm text-muted-foreground mt-1">Assessments</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-display font-bold text-foreground">98%</div>
              <div className="text-sm text-muted-foreground mt-1">Accuracy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
