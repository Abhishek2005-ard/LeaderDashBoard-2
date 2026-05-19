import React, { useEffect } from 'react';
import { Navbar } from '../components/landing/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { TrustedCompanies } from '../components/landing/TrustedCompanies';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { CtaBanner } from '../components/landing/CtaBanner';
import { Footer } from '../components/landing/Footer';

export const Landing: React.FC = () => {
  useEffect(() => {
    // Optionally add scroll interactions or set document title here
    document.title = 'Smart Leads | Lead Management Dashboard';
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <main>
        <HeroSection />
        <TrustedCompanies />
        <FeaturesSection />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
};
