import { ArrowRight, Utensils, Heart, Shield } from 'lucide-react';
import Link from "next/link";
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section id="home" className="section-full gradient-hero relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" />
      
      <div className="container mx-auto px-4 lg:px-8 pt-24 lg:pt-32 pb-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">Reducing Food Waste, One Meal at a Time</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <span className="text-foreground">Transparent</span>
            <br />
            <span className="text-gradient">Food Donation</span>
            <br />
            <span className="text-foreground">Platform</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Connecting restaurants, donors, NGOs, and volunteers to ensure surplus food reaches those who need it most. 
            Complete transparency from donation to delivery.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Button asChild size="lg" className="gradient-accent text-primary-foreground font-semibold px-8 py-6 text-lg hover:opacity-90 transition-all shadow-glow">
              <Link href="/login">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
      
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center justify-center gap-3 glass-card px-6 py-4 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Utensils className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Food Tracking</span>
            </div>
            <div className="flex items-center justify-center gap-3 glass-card px-6 py-4 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">NGO Network</span>
            </div>
            <div className="flex items-center justify-center gap-3 glass-card px-6 py-4 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Verified Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 rounded-full bg-primary animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
