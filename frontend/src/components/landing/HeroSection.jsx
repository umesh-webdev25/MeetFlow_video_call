import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import MagneticButton from "./MagneticButton";
import ScrollReveal from "./ScrollReveal";
import { useThemeStore } from "../../store/useThemeStore";

const HeroSection = () => {
  const { scrollY } = useScroll();
  const rotateX = useTransform(scrollY, [0, 500], [20, 0]);
  const scale = useTransform(scrollY, [0, 500], [0.9, 1]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.5]);
  const { theme } = useThemeStore();

  return (
    <section className="relative min-h-screen pt-32 pb-20 flex flex-col items-center justify-center overflow-hidden bg-white">
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center mt-12">
        <ScrollReveal>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 shadow-sm mb-8">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
            <span className="text-sm font-medium text-slate-700">MeetFlow V2.0 is now live</span>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-slate-900 mb-6 leading-tight">
            Video meetings that <br className="hidden md:block" />
            <span className="text-primary">
              actually work.
            </span>
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Experience ultra-low latency, crystal-clear 4K video, and seamless collaboration with the most minimalist and secure meeting platform ever built.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <MagneticButton className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-full text-base font-semibold hover:bg-blue-700 transition-colors shadow-lg">
              Start for free
            </MagneticButton>
            <MagneticButton className="w-full sm:w-auto px-8 py-4 bg-slate-50 text-slate-900 rounded-full text-base font-semibold border border-slate-200 hover:border-slate-300 hover:bg-slate-100 transition-colors shadow-sm">
              Watch demo
            </MagneticButton>
          </div>
        </ScrollReveal>
      </div>

     {/* 3D Dashboard Preview */}
      <div className="relative w-full max-w-[1400px] mx-auto mt-20 px-6">
        <div
          className="rounded-2xl shadow-2xl border border-slate-200 overflow-hidden bg-white relative"
        >
          <img
            src={theme === "MeetFlow-dark" ? "/landing/dashbord-dark.png" : "/landing/dashbord-white.png"}
            alt="MeetFlow Dashboard"
            className="w-full h-auto block"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
