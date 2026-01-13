import { useEffect, useState, useRef } from 'react';

const stats = [
  { value: 15000, suffix: '+', label: 'Meals Donated' },
  { value: 500, suffix: '+', label: 'Active Donors' },
  { value: 120, suffix: '+', label: 'Partner NGOs' },
  { value: 98, suffix: '%', label: 'Delivery Success' },
];

const useCountUp = (end: number, duration: number = 2000, startOnView: boolean = true) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startOnView) {
      setHasStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.5 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [hasStarted, startOnView]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [hasStarted, end, duration]);

  return { count, elementRef };
};

const StatCard = ({ value, suffix, label }: { value: number; suffix: string; label: string }) => {
  const { count, elementRef } = useCountUp(value);

  return (
    <div
      ref={elementRef}
      className="glass-card rounded-2xl p-8 text-center card-hover"
    >
      <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-2">
        {count.toLocaleString()}
        <span className="text-primary">{suffix}</span>
      </div>
      <p className="text-muted-foreground text-lg">{label}</p>
    </div>
  );
};

const StatsSection = () => {
  return (
    <section id="impact" className="py-20 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
