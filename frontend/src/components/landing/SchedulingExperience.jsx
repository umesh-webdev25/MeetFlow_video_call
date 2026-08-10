import React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Users, ChevronDown, CheckCircle2 } from "lucide-react";

const SchedulingExperience = () => {
  return (
    <section className="py-24 md:py-32 bg-slate-50 relative overflow-hidden" id="scheduling">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Left: Copy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full mb-6 text-brand-primary shadow-sm">
            <Calendar className="w-4 h-4" />
            <span className="text-xs font-bold tracking-widest uppercase">Smart Scheduling</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">
            Scheduling a meeting should take seconds.
          </h2>
          <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed">
            Stop the endless back-and-forth emails. MeetFlow’s scheduling engine finds the perfect time for everyone instantly and integrates directly with your calendar.
          </p>
          
          <ul className="space-y-4">
            {[
              "Automated timezone conversions",
              "One-click Google Calendar sync",
              "Custom meeting durations",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                <div className="w-6 h-6 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-brand-primary" />
                </div>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Right: UI Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="relative"
        >
          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-primary/20 rounded-full blur-[100px] pointer-events-none -z-10"></div>

          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden relative z-10">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900">Schedule New Meeting</h3>
            </div>
            
            <div className="p-6 md:p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Meeting Title</label>
                <div className="h-12 w-full rounded-xl bg-slate-50 border border-slate-200 px-4 flex items-center hover:border-brand-100 transition-colors cursor-text">
                  <span className="font-medium text-slate-900">Q3 Product Strategy Sync</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date</label>
                  <div className="h-12 w-full rounded-xl bg-slate-50 border border-slate-200 px-4 flex items-center justify-between hover:border-brand-100 transition-colors cursor-pointer group">
                    <span className="font-medium text-slate-900 text-sm">Oct 24, 2026</span>
                    <Calendar className="w-4 h-4 text-slate-400 group-hover:text-brand-primary transition-colors" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Time</label>
                  <div className="h-12 w-full rounded-xl bg-slate-50 border border-slate-200 px-4 flex items-center justify-between hover:border-brand-100 transition-colors cursor-pointer group">
                    <span className="font-medium text-slate-900 text-sm">10:30 AM</span>
                    <Clock className="w-4 h-4 text-slate-400 group-hover:text-brand-primary transition-colors" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Participants</label>
                <div className="h-12 w-full rounded-xl bg-slate-50 border border-slate-200 px-4 flex items-center justify-between hover:border-brand-100 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400 group-hover:text-brand-primary transition-colors" />
                    <span className="font-medium text-slate-900 text-sm">Select Team or Members</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button className="flex-1 h-12 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button className="flex-1 h-12 rounded-xl bg-brand-primary text-white font-bold shadow-sm hover:bg-brand-hover hover:shadow-md transition-all flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4" /> Schedule
                </button>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default SchedulingExperience;
