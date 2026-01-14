const steps = [
  {
    number: '01',
    title: 'Food Upload',
    description: 'Donors register and upload details about surplus food including images, quantity, and pickup location.',
  },
  {
    number: '02',
    title: 'NGO Request',
    description: 'Verified NGOs browse available food and submit requests based on their community needs and capacity.',
  },
  {
    number: '03',
    title: 'Admin Approval',
    description: 'Platform administrators review and approve requests, matching the right food with the right organizations.',
  },
  {
    number: '04',
    title: 'Volunteer Assignment',
    description: 'Admins assign verified volunteers based on location and availability for efficient pickup and delivery.',
  },
  {
    number: '05',
    title: 'Pickup & Transit',
    description: 'Volunteers collect food from donors with real-time status updates and navigate to NGO location.',
  },
  {
    number: '06',
    title: 'Delivery Confirmation',
    description: 'NGO confirms receipt, volunteer marks completion, and impact data is recorded in the system.',
  },
];

const WorkflowSection = () => {
  return (
    <section id="workflow" className="section-full bg-secondary/30 relative py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A comprehensive workflow ensuring transparency at every step
          </p>
        </div>

        {/* Workflow Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative gradient-card rounded-2xl p-8 border border-border card-hover group overflow-hidden"
            >
              {/* Step number */}
              <span className="text-6xl lg:text-7xl font-bold text-primary/20 absolute top-4 right-4 group-hover:text-primary/30 transition-colors">
                {step.number}
              </span>

              {/* Left accent border */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/50 group-hover:bg-primary transition-colors" />

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-xl font-semibold text-foreground mb-3 mt-4">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;
