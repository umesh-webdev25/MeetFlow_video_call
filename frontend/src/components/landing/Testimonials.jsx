import React from "react";
import { motion } from "framer-motion";
import { TESTIMONIALS } from "../../data/landingData";
import ScrollReveal from "./ScrollReveal";

const Testimonials = () => {
  return (
    <section id="customers" className="py-24 bg-primary rounded-t-[3rem] -mt-8 relative z-20">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              Trusted by remote teams worldwide
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, idx) => (
            <ScrollReveal key={testimonial.id} delay={idx * 0.1}>
              <div className="bg-white rounded-3xl overflow-hidden group hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <motion.img
                    src={testimonial.image}
                    alt={testimonial.company}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 bg-white p-2 rounded-lg">
                    <img src={testimonial.logo} alt="logo" className="h-6 w-auto object-contain" />
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-4">{testimonial.company}</h4>
                    <p className="text-slate-600 italic">"{testimonial.quote}"</p>
                  </div>
                  <button className="mt-8 text-primary font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all w-fit">
                    Read full story <span className="text-lg">→</span>
                  </button>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
