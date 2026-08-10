import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Video, Calendar, Users, MoreHorizontal, CheckCircle2, Plus } from "lucide-react";

const HeroProductVisual = () => {
  const containerRef = useRef(null);
  
  // Subtle parallax for floating elements based on scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -20]);

  return (
    <section ref={containerRef} className="relative pb-24 md:pb-32 bg-white px-6">
      <div className="max-w-6xl mx-auto relative z-20">
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          {/* Browser / Product Frame */}
          <div className="rounded-2xl md:rounded-[2rem] overflow-hidden border border-slate-200 bg-slate-50 shadow-2xl relative z-10">
            {/* Browser Header */}
            <div className="h-12 bg-white border-b border-slate-200 flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-slate-200" />
                <div className="w-3 h-3 rounded-full bg-slate-200" />
                <div className="w-3 h-3 rounded-full bg-slate-200" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="h-7 w-64 bg-slate-100 rounded-md border border-slate-200 flex items-center justify-center">
                  <span className="text-[10px] font-medium text-slate-400 tracking-wide">meetflow.app/dashboard</span>
                </div>
              </div>
            </div>

            {/* Product UI Mockup */}
            <div className="flex h-[400px] md:h-[600px] bg-white">
              {/* Sidebar */}
              <div className="w-16 md:w-64 border-r border-slate-100 p-4 hidden sm:flex flex-col gap-6">
                <div className="w-8 h-8 rounded bg-brand-primary flex items-center justify-center shrink-0">
                  <Video className="w-4 h-4 text-white" />
                </div>
                <div className="space-y-1">
                  <div className="h-10 w-full bg-brand-50 rounded-xl flex items-center px-3 border border-brand-100">
                    <span className="text-sm font-bold text-brand-primary hidden md:block">Dashboard</span>
                  </div>
                  <div className="h-10 w-full rounded-xl flex items-center px-3 hover:bg-slate-50">
                    <span className="text-sm font-bold text-slate-500 hidden md:block">Meetings</span>
                  </div>
                  <div className="h-10 w-full rounded-xl flex items-center px-3 hover:bg-slate-50">
                    <span className="text-sm font-bold text-slate-500 hidden md:block">Calendar</span>
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 p-6 md:p-8 overflow-hidden bg-slate-50/50">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Good morning, Alex</h2>
                    <p className="text-sm text-slate-500 mt-1">Here is what's happening today.</p>
                  </div>
                  <div className="hidden sm:flex gap-3">
                    <button className="h-10 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 shadow-sm">
                      Join Meeting
                    </button>
                    <button className="h-10 px-4 bg-brand-primary rounded-xl text-sm font-bold text-white shadow-sm flex items-center gap-2">
                      <Plus className="w-4 h-4" /> Schedule
                    </button>
                  </div>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mb-3">
                      <Calendar className="w-5 h-5 text-brand-primary" />
                    </div>
                    <p className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Today's Meetings</p>
                    <p className="text-3xl font-bold text-slate-900">4</p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
                      <Users className="w-5 h-5 text-emerald-600" />
                    </div>
                    <p className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Total Participants</p>
                    <p className="text-3xl font-bold text-slate-900">28</p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hidden md:block">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-3">
                      <Video className="w-5 h-5 text-amber-600" />
                    </div>
                    <p className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Hours Recorded</p>
                    <p className="text-3xl font-bold text-slate-900">12.5</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating UI Elements (Parallax) */}
          
          {/* Floating Element 1: Active Meeting */}
          <motion.div 
            style={{ y: y1 }}
            className="absolute -left-4 md:-left-12 top-20 z-30 bg-white p-4 rounded-2xl shadow-xl border border-brand-100 flex items-center gap-4 w-64"
          >
            <div className="relative">
              <span className="flex h-3 w-3 absolute -top-1 -right-1 z-10">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-primary"></span>
              </span>
              <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center border border-brand-100">
                <Video className="w-6 h-6 text-brand-primary" />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Design Sync</h4>
              <p className="text-xs font-medium text-brand-primary">Live now • 4 in room</p>
            </div>
          </motion.div>

          {/* Floating Element 2: Participant Stack */}
          <motion.div 
            style={{ y: y2 }}
            className="absolute -right-4 md:-right-8 top-1/2 z-30 bg-white p-3 rounded-2xl shadow-xl border border-brand-100 flex items-center gap-3"
          >
            <div className="flex -space-x-3">
              {[1,2,3].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${i}&backgroundColor=e2e8f0`} alt="Avatar" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="pr-2">
              <span className="text-sm font-bold text-slate-900">+12 Joined</span>
            </div>
          </motion.div>

          {/* Floating Element 3: Meeting Reminder */}
          <motion.div 
            style={{ y: y3 }}
            className="absolute left-1/4 -bottom-6 z-30 bg-white px-5 py-3 rounded-xl shadow-xl border border-brand-100 flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span className="text-sm font-bold text-slate-700">Meeting successfully scheduled</span>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

export default HeroProductVisual;
