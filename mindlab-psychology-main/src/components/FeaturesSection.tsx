import { Brain, Target, Shield, Zap, LineChart, Users } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Cognitive Analysis',
    description: 'Measure memory, attention, and problem-solving capabilities with precision assessments.',
  },
  {
    icon: Target,
    title: 'Personality Insights',
    description: 'Discover your unique personality traits through validated psychological frameworks.',
  },
  {
    icon: Shield,
    title: 'Mental Health Check',
    description: 'Screen for anxiety, depression, and stress levels with clinically-backed tools.',
  },
  {
    icon: Zap,
    title: 'Instant Results',
    description: 'Get detailed analysis and personalized recommendations immediately after completion.',
  },
  {
    icon: LineChart,
    title: 'Progress Tracking',
    description: 'Monitor your psychological growth over time with comprehensive dashboards.',
  },
  {
    icon: Users,
    title: 'Expert Support',
    description: 'Access guidance from licensed psychologists for deeper understanding.',
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,hsl(174_72%_56%/0.05),transparent_50%)]" />

      <div className="container relative z-10 px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary text-sm font-medium uppercase tracking-wider">Features</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mt-4 mb-6">
            Comprehensive Mind <span className="gradient-text">Assessment</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Our platform combines cutting-edge psychology with intuitive design to provide you with meaningful insights about yourself.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative p-6 rounded-2xl card-gradient border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Hover Glow */}
              <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-display font-semibold mb-2 text-foreground group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
