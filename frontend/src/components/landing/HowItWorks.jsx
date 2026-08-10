import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const HowItWorks = () => {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const scaleXDesktop = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const scaleYMobile = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const steps = [
    { num: "01", title: "Create", desc: "Sign up and create your MeetFlow account in seconds." },
    { num: "02", title: "Schedule", desc: "Choose a date, time, and participants with one click." },
    { num: "03", title: "Invite", desc: "Share the meeting link or send automated calendar invites." },
    { num: "04", title: "Meet", desc: "Join the high-quality video call directly from your browser." },
  ];

  return (
    <section ref={containerRef} className="py-24 md:py-32 bg-white relative" id="how-it-works">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">
              Four steps to better meetings.
            </h2>
            <p className="text-xl text-slate-600">
              We eliminated the friction so you can focus on the conversation.
            </p>
          </motion.div>
        </div>

        <div className="relative max-w-5xl mx-auto">
          
          {/* Background Line (Desktop Horizontal) */}
          <div className="hidden md:block absolute top-[28px] left-0 right-0 h-[2px] bg-slate-100 z-0"></div>
          
          {/* Animated Fill Line (Desktop Horizontal) */}
          <motion.div 
            className="hidden md:block absolute top-[28px] left-0 right-0 h-[2px] bg-brand-primary origin-left z-0"
            style={{ scaleX: scaleXDesktop }}
          />

          {/* Background Line (Mobile Vertical) */}
          <div className="block md:hidden absolute left-[28px] top-0 bottom-0 w-[2px] bg-slate-100 z-0"></div>
          
          {/* Animated Fill Line (Mobile Vertical) */}
          <motion.div 
            className="block md:hidden absolute left-[28px] top-0 bottom-0 w-[2px] bg-brand-primary origin-top z-0"
            style={{ scaleY: scaleYMobile }}
          />

          <div className="flex flex-col md:flex-row justify-between relative z-10 gap-12 md:gap-4">
            {steps.map((step, idx) => {
              // Calculate rough trigger point for each step based on index
              const stepTrigger = idx / (steps.length - 1);
              
              // Color transition for the number circle based on scroll
              const bg = useTransform(
                scrollYProgress,
                [Math.max(0, stepTrigger - 0.2), stepTrigger],
                ["#F8FAFC", "#2563EB"] // slate-50 to brand-primary
              );
              
              const border = useTransform(
                scrollYProgress,
                [Math.max(0, stepTrigger - 0.2), stepTrigger],
                ["#E2E8F0", "#2563EB"] // slate-200 to brand-primary
              );

              const color = useTransform(
                scrollYProgress,
                [Math.max(0, stepTrigger - 0.2), stepTrigger],
                ["#64748B", "#FFFFFF"] // slate-500 to white
              );

              return (
                <div key={idx} className="flex md:flex-col items-center md:text-center gap-6 md:gap-8 flex-1">
                  
                  <motion.div 
                    style={{ backgroundColor: bg, borderColor: border, color: color }}
                    className="w-14 h-14 rounded-full border-2 flex items-center justify-center font-bold text-lg shrink-0 shadow-sm transition-colors duration-200"
                  >
                    {step.num}
                  </motion.div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-sm text-slate-600 px-0 md:px-4">{step.desc}</p>
                  </div>
                  
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
