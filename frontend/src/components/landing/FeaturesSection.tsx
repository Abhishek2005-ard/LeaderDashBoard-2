import React from 'react';
import { Target, Activity, Zap } from 'lucide-react';

const features = [
  {
    title: 'Lead Tracking & Status',
    description: 'Easily monitor lead progression. Set status states such as New, Contacted, Qualified, and Lost to keep your sales funnel perfectly organized.',
    icon: Target,
    color: 'text-accent',
    bg: 'bg-accent/10'
  },
  {
    title: 'Search, Filters & Analytics',
    description: 'Locate leads instantly with debounced search. Filter by source (Website, Instagram, Referral) and sort chronologically for quick insights.',
    icon: Activity,
    color: 'text-secondary',
    bg: 'bg-secondary/10'
  },
  {
    title: 'Secure Team Collaboration',
    description: 'Manage the pipeline together with Role-Based Access Control (RBAC). Restrict creation and permanent deletion privileges to authorized roles.',
    icon: Zap,
    color: 'text-primary',
    bg: 'bg-primary/10'
  }
];

export const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 tracking-tight">
            The clean, efficient operating system for lead management
          </h2>
          <p className="text-lg text-neutral">
            Eliminate bloated spreadsheets and complex legacy CRMs. Smart Leads provides simple, structured lead workflows for your entire team.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-8 rounded-2xl border border-neutral/10 bg-surface shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-32 bg-gradient-to-bl from-neutral/5 to-transparent rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
              <div className={`inline-flex p-3 rounded-xl ${feature.bg} mb-6 relative z-10`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3 relative z-10">{feature.title}</h3>
              <p className="text-neutral leading-relaxed relative z-10">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
