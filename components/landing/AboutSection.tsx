import { Target, Eye, Heart } from 'lucide-react';

const AboutSection = () => {
  return (
    <section id="about" className="section-full bg-background relative py-20 lg:py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-primary/5 rounded-l-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              We are committed to{' '}
              <span className="text-gradient">eliminating food waste</span>{' '}
              while feeding communities
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              FeedFlow represents a paradigm shift in food redistribution. Through our platform, 
              we connect restaurants, event organizers, and households with NGOs and shelters, 
              ensuring that surplus food reaches those who need it most.
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Our workflow-driven approach ensures complete transparency, accountability, and 
              traceability at every step—from the moment food is donated until it reaches the 
              recipient's hands.
            </p>

            {/* Values */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Mission-Driven</h4>
                  <p className="text-sm text-muted-foreground">Zero food waste, zero hunger</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Eye className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Complete Transparency</h4>
                  <p className="text-sm text-muted-foreground">Track every donation in real-time</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Community First</h4>
                  <p className="text-sm text-muted-foreground">Connecting hearts through food</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="aspect-square max-w-lg mx-auto">
              {/* Decorative circles */}
              <div className="absolute inset-0 rounded-full border border-primary/20" />
              <div className="absolute inset-8 rounded-full border border-primary/30" />
              <div className="absolute inset-16 rounded-full border border-primary/40" />
              <div className="absolute inset-24 rounded-full gradient-accent opacity-20 animate-pulse-slow" />
              
              {/* Center content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl lg:text-8xl font-bold text-gradient mb-2">100%</div>
                  <p className="text-muted-foreground font-medium">Transparency</p>
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute top-8 right-0 glass-card px-4 py-3 rounded-lg animate-float">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-sm text-foreground">Verified NGOs</span>
                </div>
              </div>
              <div className="absolute bottom-8 left-0 glass-card px-4 py-3 rounded-lg animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-accent" />
                  <span className="text-sm text-foreground">Safe Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
