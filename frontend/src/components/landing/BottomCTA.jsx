import React from "react";
import { Link } from "react-router-dom";
import MagneticButton from "./MagneticButton";
import ScrollReveal from "./ScrollReveal";

const BottomCTA = () => {
  return (
    <section className="relative py-32 bg-slate-50 border-t border-slate-200 overflow-hidden">
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <ScrollReveal>
          <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-slate-900 mb-8 leading-tight">
            Ready to upgrade your <br />
            <span className="text-primary">
              remote meetings?
            </span>
          </h2>
        </ScrollReveal>
        
        <ScrollReveal delay={0.1}>
          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
            Join thousands of modern teams holding high-quality, secure video calls with MeetFlow today. Setup takes less than 60 seconds.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="w-full sm:w-auto">
              <MagneticButton className="w-full sm:w-auto px-10 py-5 bg-primary text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors shadow-xl">
                Start your free trial
              </MagneticButton>
            </Link>
            <MagneticButton className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 rounded-full text-lg font-semibold border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors shadow-sm">
              Contact Sales
            </MagneticButton>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default BottomCTA;
