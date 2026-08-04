import React from "react";
import { motion } from "framer-motion";
import { LOGOS } from "../../data/landingData";
import ScrollReveal from "./ScrollReveal";

const TrustedBy = () => {
  return (
    <section className="py-16 border-y border-slate-200 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
        <ScrollReveal>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">
            Trusted by innovative teams worldwide
          </p>
        </ScrollReveal>
      </div>

      <div className="relative flex overflow-x-hidden group">
        <motion.div
          className="flex whitespace-nowrap items-center min-w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 20,
          }}
        >
          {/* Duplicate logos for infinite scroll effect */}
          {[...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS].map((logo, index) => (
            <div
              key={index}
              className="flex items-center justify-center w-48 mx-8 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            >
              <img src={logo.url} alt={logo.name} className="h-8 object-contain" />
            </div>
          ))}
        </motion.div>
        
        {/* Gradients to fade edges */}
        <div className="absolute top-0 left-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
      </div>
    </section>
  );
};

export default TrustedBy;
