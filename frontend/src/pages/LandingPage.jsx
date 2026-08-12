import React, { useEffect } from "react";
import Navbar from "../components/landing/Navbar";
import HeroSection from "../components/landing/HeroSection";
import HeroProductVisual from "../components/landing/HeroProductVisual";
import Storytelling from "../components/landing/Storytelling";
import BentoGridFeatures from "../components/landing/BentoGridFeatures";
import SchedulingExperience from "../components/landing/SchedulingExperience";
import VideoMeetingExperience from "../components/landing/VideoMeetingExperience";
import DashboardShowcase from "../components/landing/DashboardShowcase";
import SolutionsTabs from "../components/landing/SolutionsTabs";
import HowItWorks from "../components/landing/HowItWorks";
import Testimonials from "../components/landing/Testimonials";
import BottomCTA from "../components/landing/BottomCTA";
import Footer from "../components/landing/Footer";

const LandingPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="font-sans bg-white text-slate-900 selection:bg-brand-primary selection:text-white">
      <Navbar />
      <main>
        <HeroSection />
        {/* <HeroProductVisual /> */}
        <VideoMeetingExperience />
        <Storytelling />
        <BentoGridFeatures />
        <SchedulingExperience />
        <DashboardShowcase />
        <SolutionsTabs />
        <HowItWorks />
        {/* <Testimonials /> */}
        <BottomCTA />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
