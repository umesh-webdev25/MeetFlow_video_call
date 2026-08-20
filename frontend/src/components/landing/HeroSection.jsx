import React, { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { ArrowRight, Play, Sparkles, Zap, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import CubesBackground from "./CubesBackground";

const HeroSection = () => {
  const controls = useAnimation();
  const containerRef = useRef(null);

  useEffect(() => {
    controls.start("visible");
  }, [controls]);

  const floatingVariants = {
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 4,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-gradient-to-b from-white via-brand-50/30 to-white">
      {/* Animated Gradient Orbs */}
      <div className="absolute top-0 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-brand-primary/10 via-purple-500/5 to-transparent rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-0 -right-40 w-[500px] h-[500px] bg-gradient-to-tl from-blue-600/10 via-cyan-500/5 to-transparent rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: '10s' }} />
      
      {/* 1. Dot Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #2563EB 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}
      />

      {/* 2. Soft Ambient Blue Glow */}
      <div className="absolute top-[50%] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-r from-brand-primary/15 via-purple-500/10 to-brand-primary/15 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      {/* 3. Interactive 3D Cubes Background */}
      <CubesBackground color="#2563eb" opacity={0.18} count={30} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Trust Indicator / Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-brand-100 rounded-full mb-8 shadow-lg shadow-brand-primary/5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-bold text-brand-primary tracking-wide">
                <Sparkles className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
                Now with AI-powered meeting summaries
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-slate-900 tracking-tight leading-[1.05] mb-6">
              Meetings made{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-blue-600 to-purple-600">
                effortless
              </span>
              <span className="block text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-slate-700 mt-2">
                with intelligent automation.
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          >
            <p className="text-lg md:text-xl xl:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              MeetFlow combines intelligent scheduling, <span className="text-brand-primary font-semibold">AI-powered</span> video calling, 
              and automated meeting management into one seamless platform. 
              <span className="block mt-1 text-slate-500">No more context switching. No more missed meetings.</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/signup"
              className="relative overflow-hidden group inline-flex items-center justify-center gap-2 w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-brand-primary to-blue-700 text-white rounded-full text-lg font-bold transition-all shadow-lg shadow-brand-primary/30 hover:shadow-xl hover:shadow-brand-primary/40 hover:-translate-y-1 hover:scale-105"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/25 to-transparent"></div>
            </Link>

            <Link
              to="#how-it-works"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-10 py-5 bg-white/80 backdrop-blur-sm text-slate-800 border-2 border-slate-200 rounded-full text-lg font-bold hover:bg-white hover:border-brand-200 hover:text-brand-primary hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <Play className="w-5 h-5" />
              See How It Works
            </Link>
          </motion.div>

          {/* Trusted by / Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
            className="mt-16 pt-16 border-t border-slate-200/50"
          >
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">
              Trusted by innovative teams worldwide
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {[
                { label: "Active Users", value: "10M+", icon: Zap },
                { label: "Meetings Hosted", value: "500M+", icon: Play },
                { label: "Uptime", value: "99.99%", icon: Shield },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                    <div className="text-xs text-slate-500 font-medium">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;