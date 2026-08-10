import React, { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { AlertCircle, Lightbulb, CalendarPlus, UserPlus, Video, LayoutDashboard, BarChart3 } from "lucide-react";

const Storytelling = () => {
  const containerRef = useRef(null);
  
  // Track scroll progress through this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  // Smooth out the progress line
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const steps = [
    { id: "PROBLEM", icon: AlertCircle, title: "Managing meetings is fragmented.", desc: "Juggling between calendars, video apps, and messaging tools wastes time and causes context switching." },
    { id: "SOLUTION", icon: Lightbulb, title: "A unified platform.", desc: "MeetFlow brings scheduling, video meetings, and team management together in one clean interface." },
    { id: "PLAN", icon: CalendarPlus, title: "Schedule easily.", desc: "Find the perfect time and create meetings in seconds without the back-and-forth." },
    { id: "INVITE", icon: UserPlus, title: "Share and invite.", desc: "Send meeting links or invite participants directly from your dashboard." },
    { id: "MEET", icon: Video, title: "Join high-quality calls.", desc: "Experience ultra-low latency, crystal clear video meetings directly in your browser." },
    { id: "MANAGE", icon: LayoutDashboard, title: "Control the room.", desc: "Manage participants, permissions, and chat seamlessly during the meeting." },
    { id: "TRACK", icon: BarChart3, title: "Understand activity.", desc: "Use the dashboard to track meeting history, participant engagement, and team stats." },
  ];

  return (
    <section ref={containerRef} className="py-24 md:py-32 bg-slate-50 relative">
      <div className="max-w-4xl mx-auto px-6 relative">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">
            The complete meeting lifecycle.
          </h2>
        </div>

        {/* The Vertical Line Container */}
        <div className="relative ml-6 md:ml-0 md:mx-auto md:w-full max-w-2xl">
          
          {/* Background Line (Light Blue) */}
          <div className="absolute top-0 bottom-0 left-[15px] md:left-1/2 md:-ml-px w-[2px] bg-brand-100" />
          
          {/* Foreground Line (Brand Blue) filling on scroll */}
          <motion.div 
            className="absolute top-0 bottom-0 left-[15px] md:left-1/2 md:-ml-px w-[2px] bg-brand-primary origin-top"
            style={{ scaleY }}
          />

          {/* Steps */}
          <div className="space-y-16">
            {steps.map((step, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div key={step.id} className={`relative flex items-center md:justify-between ${isEven ? 'md:flex-row-reverse' : ''}`}>
                  
                  {/* Content Box */}
                  <motion.div 
                    initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={`pl-12 md:pl-0 md:w-5/12 ${isEven ? 'md:text-left' : 'md:text-right'}`}
                  >
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-brand-100 transition-all">
                      <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary mb-2 block">{step.id}</span>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                    </div>
                  </motion.div>

                  {/* Icon Node */}
                  <div className="absolute left-0 md:left-1/2 -ml-3 md:-ml-6 w-12 h-12 rounded-full bg-white border-2 border-brand-100 shadow-sm flex items-center justify-center z-10 transition-colors duration-300">
                    <step.icon className="w-5 h-5 text-brand-primary" />
                  </div>

                  {/* Empty space for alternating layout on desktop */}
                  <div className="hidden md:block w-5/12" />

                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Storytelling;
