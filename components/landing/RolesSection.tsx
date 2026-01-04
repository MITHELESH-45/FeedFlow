import { Store, Building2, Truck, ShieldCheck } from 'lucide-react';

const roles = [
  {
    icon: Store,
    title: 'Donors',
    subtitle: 'Restaurants, Events & Households',
    features: [
      'Register and upload surplus food',
      'Track donation status in real-time',
      'View assigned NGO and volunteer',
      'Cancel donations before approval',
    ],
    color: 'from-emerald-500 to-green-600',
  },
  {
    icon: Building2,
    title: 'NGOs',
    subtitle: 'Shelters & Food Banks',
    features: [
      'Browse available food donations',
      'Submit requests with urgency level',
      'Track delivery progress',
      'Confirm receipt and give feedback',
    ],
    color: 'from-teal-500 to-cyan-600',
  },
  {
    icon: Truck,
    title: 'Volunteers',
    subtitle: 'Delivery Heroes',
    features: [
      'View assigned delivery tasks',
      'Navigate to pickup locations',
      'Mark pickup and arrival status',
      'Complete delivery workflow',
    ],
    color: 'from-green-500 to-emerald-600',
  },
  {
    icon: ShieldCheck,
    title: 'Admins',
    subtitle: 'Platform Controllers',
    features: [
      'Approve NGO registrations',
      'Review and approve food requests',
      'Assign volunteers to deliveries',
      'Monitor reports and analytics',
    ],
    color: 'from-lime-500 to-green-600',
  },
];

const RolesSection = () => {
  return (
    <section className="py-20 lg:py-32 bg-secondary/20">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Built for Everyone
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Dedicated experiences for every stakeholder in the food donation ecosystem
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {roles.map((role) => (
            <div
              key={role.title}
              className="gradient-card rounded-2xl p-8 border border-border card-hover group"
            >
              <div className="flex items-start gap-6">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <role.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-1">
                    {role.title}
                  </h3>
                  <p className="text-primary text-sm mb-4">{role.subtitle}</p>

                  <ul className="space-y-2">
                    {role.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-muted-foreground text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RolesSection;
