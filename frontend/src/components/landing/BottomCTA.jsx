import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const BottomCTA = () => {
  return (
    <section className="relative py-32 overflow-hidden bg-white border-t border-slate-100">
      
      {/* Background Dot Grid Texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #DBEAFE 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Ambient Blue Glow to bookend the page */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight mb-6">
            Bring your meetings into one flow.
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Schedule, meet, and manage everything from one simple platform. Your next meeting starts here.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="relative overflow-hidden group inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-brand-primary text-white rounded-full text-base font-bold transition-all shadow-sm shadow-brand-primary/20 hover:shadow-md hover:bg-brand-hover hover:-translate-y-0.5"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </Link>
            
            <Link
              to="/demo"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border-2 border-slate-200 rounded-full text-base font-bold hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              Schedule a Demo
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BottomCTA;
