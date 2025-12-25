import { Button } from '@/components/ui/button';
import { ArrowRight, Brain } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,hsl(174_72%_56%/0.1),transparent_60%)]" />

      <div className="container relative z-10 px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-8">
            <Brain className="w-8 h-8 text-primary" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-6">
            Ready to Understand{' '}
            <span className="gradient-text">Your Mind?</span>
          </h2>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Start your journey of self-discovery today. Our assessments take just minutes to complete and provide insights that last a lifetime.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="glow" size="xl">
              Start Free Assessment
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="heroOutline" size="xl">
              Learn More
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-12 pt-12 border-t border-border">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              100% Free to Start
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              No Credit Card Required
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              Instant Results
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
