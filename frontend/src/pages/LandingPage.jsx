import React, { useEffect } from "react";
import Navbar from "../components/landing/Navbar";
import HeroSection from "../components/landing/HeroSection";
import TrustedBy from "../components/landing/TrustedBy";
import SolutionsTabs from "../components/landing/SolutionsTabs";
import Testimonials from "../components/landing/Testimonials";
import Statistics from "../components/landing/Statistics";
import Blog from "../components/landing/Blog";
import FAQ from "../components/landing/FAQ";
import BottomCTA from "../components/landing/BottomCTA";
import Footer from "../components/landing/Footer";

const LandingPage = () => {
  // Ensure we start at the top of the page when this mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="font-sans bg-slate-50 text-slate-900 selection:bg-primary selection:text-white">
      <Navbar />
      <main>
        <HeroSection />
        <TrustedBy />
        <SolutionsTabs />
        <Testimonials />
        <Statistics />
        <Blog />
        <FAQ />
        <BottomCTA />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
