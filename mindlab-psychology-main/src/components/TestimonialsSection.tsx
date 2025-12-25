import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'Graduate Student',
    content: 'MindLab helped me understand my learning style and cognitive strengths. The personality assessment was incredibly accurate and insightful.',
    rating: 5,
    avatar: 'SM',
  },
  {
    name: 'David Chen',
    role: 'HR Manager',
    content: 'We use MindLab for team assessments. The emotional intelligence tests have been invaluable for improving our workplace dynamics.',
    rating: 5,
    avatar: 'DC',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Therapist',
    content: 'As a mental health professional, I recommend MindLab to my clients. The screening tools are scientifically validated and user-friendly.',
    rating: 5,
    avatar: 'ER',
  },
];

const TestimonialsSection = () => {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />

      <div className="container relative z-10 px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary text-sm font-medium uppercase tracking-wider">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mt-4 mb-6">
            Trusted by <span className="gradient-text">Thousands</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Join over 50,000 individuals who have discovered valuable insights about themselves.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="group relative p-6 lg:p-8 rounded-2xl card-gradient border border-border hover:border-primary/50 transition-all duration-300"
            >
              {/* Quote Icon */}
              <Quote className="w-8 h-8 text-primary/30 mb-4" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                ))}
              </div>

              {/* Content */}
              <p className="text-muted-foreground leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
