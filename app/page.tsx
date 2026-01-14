"use client";

import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import StatsSection from "@/components/landing/StatsSection";
import AboutSection from "@/components/landing/AboutSection";
import WorkflowSection from "@/components/landing/WorkflowSection";
import RolesSection from "@/components/landing/RolesSection";
import Footer from "@/components/landing/Footer";

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <AboutSection />
      <WorkflowSection />
      <RolesSection />
      <Footer />
    </div>
  );
}
