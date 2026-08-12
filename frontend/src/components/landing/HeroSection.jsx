import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import CubesBackground from "./CubesBackground";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-white ">
      {/* 1. React Bits Re-skinned: Dot Grid Background (faint #DBEAFE on #FFFFFF) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #DBEAFE 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* 2. Soft Ambient Blue Glow (anchored behind where the product visual will go below) */}
      <div className="absolute top-[60%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-primary/20 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      {/* 3. Interactive 3D Cubes Background */}
      <CubesBackground color="#64748b" opacity={0.22} count={24} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Trust Indicator / Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 border border-brand-100 rounded-full mb-8 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
              </span>
              <span className="text-sm font-bold text-brand-primary tracking-wide">
                Simple scheduling. Powerful meetings.
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-6">
              Meetings made{" "}
              {/* Gradient text accent on a single word per instructions */}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-hover">
                simple
              </span>.
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          >
            <p className="text-lg md:text-xl xl:text-2xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              MeetFlow combines intelligent meeting scheduling, high-quality video calling, and centralized management into one premium platform.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {/* Primary CTA with Shine effect */}
            <Link
              to="/signup"
              className="relative overflow-hidden group inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-brand-primary text-white rounded-full text-base font-bold transition-all shadow-sm shadow-brand-primary/20 hover:shadow-md hover:bg-brand-hover hover:-translate-y-0.5"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              {/* Shine sweep */}
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </Link>

            {/* Secondary CTA */}
            <Link
              to="#how-it-works"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-white text-brand-primary border-2 border-brand-100 rounded-full text-base font-bold hover:bg-brand-50 hover:border-brand-200 transition-all"
            >
              <Play className="w-4 h-4" />
              See How It Works
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
