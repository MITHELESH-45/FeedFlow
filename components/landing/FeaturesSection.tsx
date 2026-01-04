import { CheckCircle2, MapPin, Bell, BarChart3, Users, Clock } from 'lucide-react';

const features = [
  {
    icon: CheckCircle2,
    title: 'Verified Donations',
    description: 'Every food donation is verified and tracked from donor to recipient. Complete audit trail ensures accountability.',
  },
  {
    icon: MapPin,
    title: 'Location Tracking',
    description: 'Real-time location integration helps volunteers navigate efficiently between pickup and delivery points.',
  },
  {
    icon: Bell,
    title: 'Instant Notifications',
    description: 'In-platform alerts keep all stakeholders informed at every step of the donation journey.',
  },
  {
    icon: BarChart3,
    title: 'Impact Analytics',
    description: 'Comprehensive reports and dashboards showing food saved, meals delivered, and community impact.',
  },
  {
    icon: Users,
    title: 'Role-Based Access',
    description: 'Dedicated dashboards for Donors, NGOs, Volunteers, and Admins with controlled permissions.',
  },
  {
    icon: Clock,
    title: 'Time-Sensitive Handling',
    description: 'Expiry tracking and priority matching ensures food reaches recipients while still fresh and safe.',
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="section-full bg-background relative py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Our Key Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive digital solutions for transparent food redistribution
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="gradient-card rounded-2xl p-8 border border-border card-hover group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/30 transition-colors">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              {/* Link */}
              <a
                href="#"
                className="inline-flex items-center gap-2 text-primary mt-6 text-sm font-medium hover:gap-3 transition-all"
              >
                Learn More
                <span>→</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
