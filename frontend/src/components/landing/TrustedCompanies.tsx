import React from 'react';

export const TrustedCompanies: React.FC = () => {
  return (
    <section className="py-12 border-y border-neutral/10 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm font-medium text-neutral mb-8 uppercase tracking-wider">
          Trusted by innovative sales teams worldwide
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale">
          {/* Company Logos Placeholders */}
          {['Acme Corp', 'GlobalTech', 'Nexus', 'Starlight', 'Apex', 'Quantum'].map((company) => (
            <div key={company} className="text-xl font-bold font-mono text-primary flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-neutral/20"></div>
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
