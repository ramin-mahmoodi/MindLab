import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, Users, Star } from 'lucide-react';

const tests = [
  {
    title: 'Personality Assessment',
    description: 'Discover your Big Five personality traits and understand what drives your behavior.',
    duration: '15 min',
    participants: '12.4K',
    rating: 4.9,
    gradient: 'from-primary/20 to-accent/20',
    popular: true,
  },
  {
    title: 'IQ & Cognitive Test',
    description: 'Measure your logical reasoning, pattern recognition, and problem-solving skills.',
    duration: '25 min',
    participants: '8.2K',
    rating: 4.8,
    gradient: 'from-accent/20 to-primary/20',
    popular: false,
  },
  {
    title: 'Emotional Intelligence',
    description: 'Evaluate your ability to recognize, understand, and manage emotions effectively.',
    duration: '12 min',
    participants: '9.1K',
    rating: 4.9,
    gradient: 'from-primary/20 to-cyan-500/20',
    popular: true,
  },
  {
    title: 'Anxiety Screening',
    description: 'A confidential assessment to understand your anxiety levels and coping mechanisms.',
    duration: '8 min',
    participants: '15.3K',
    rating: 4.7,
    gradient: 'from-cyan-500/20 to-accent/20',
    popular: false,
  },
];

const TestsSection = () => {
  return (
    <section id="tests" className="py-24 bg-secondary/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(220_20%_18%/0.5)_1px,transparent_1px),linear-gradient(90deg,hsl(220_20%_18%/0.5)_1px,transparent_1px)] bg-[size:40px_40px] opacity-50" />

      <div className="container relative z-10 px-4 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <span className="text-primary text-sm font-medium uppercase tracking-wider">Popular Tests</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mt-4">
              Explore Our <span className="gradient-text">Assessments</span>
            </h2>
          </div>
          <Button variant="heroOutline" size="lg">
            View All Tests
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Tests Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {tests.map((test, index) => (
            <div
              key={test.title}
              className="group relative rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${test.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative z-10 p-6 lg:p-8">
                {/* Popular Badge */}
                {test.popular && (
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-medium mb-4">
                    <Star className="w-3 h-3 fill-primary" />
                    Popular
                  </div>
                )}

                <h3 className="text-xl lg:text-2xl font-display font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                  {test.title}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {test.description}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {test.duration}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    {test.participants}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    {test.rating}
                  </div>
                </div>

                <Button variant="hero" className="w-full sm:w-auto">
                  Start Test
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestsSection;
