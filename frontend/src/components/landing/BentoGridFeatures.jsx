import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Video, LayoutDashboard, Shield, Users, Bell } from "lucide-react";

// React Bits pattern: Spotlight Card (re-skinned to White/Blue)
const SpotlightCard = ({ children, className = "" }) => {
  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current || isFocused) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-sm transition-all duration-300 hover:border-brand-200 hover:shadow-md ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-0"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(37, 99, 235, 0.05), transparent 40%)`,
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};

const BentoGridFeatures = () => {
  return (
    <section className="py-24 md:py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">
              Everything you need. <br/> Nothing you don't.
            </h2>
            <p className="text-xl text-slate-600">
              Powerful features packaged in an interface that gets out of your way.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[240px]">
          
          {/* Large Card: Dashboard */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-2 lg:col-span-2 row-span-2"
          >
            <SpotlightCard className="h-full p-8 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-6">
                  <LayoutDashboard className="w-6 h-6 text-brand-primary" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Centralized Dashboard</h3>
                <p className="text-slate-600">Everything about your meetings in one place. Monitor activity, track history, and manage your team from a single view.</p>
              </div>
              
              {/* Abstract Dashboard Visual */}
              <div className="mt-8 relative h-40 bg-slate-50 rounded-xl border border-slate-200 overflow-hidden group-hover:border-brand-200 transition-colors p-4">
                <div className="flex gap-4">
                  <div className="w-1/3 h-24 bg-white rounded-lg shadow-sm border border-slate-100 p-3">
                    <div className="h-2 w-12 bg-slate-200 rounded-full mb-3"></div>
                    <div className="h-8 w-16 bg-brand-50 rounded-lg"></div>
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="w-full h-8 bg-white rounded-lg shadow-sm border border-slate-100"></div>
                    <div className="w-full h-8 bg-white rounded-lg shadow-sm border border-slate-100"></div>
                    <div className="w-3/4 h-8 bg-white rounded-lg shadow-sm border border-slate-100"></div>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>

          {/* Medium Card: Video Calling */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-1 lg:col-span-2 row-span-1"
          >
            <SpotlightCard className="h-full p-8 flex items-center justify-between group">
              <div className="w-1/2 pr-4">
                <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-4">
                  <Video className="w-5 h-5 text-brand-primary" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Join instantly</h3>
                <p className="text-sm text-slate-600">High-quality, low-latency video meetings directly in your browser.</p>
              </div>
              <div className="w-1/2 h-full flex justify-end items-center">
                 <div className="w-32 h-32 rounded-full bg-slate-50 border-4 border-white shadow-lg overflow-hidden relative group-hover:scale-105 transition-transform duration-500">
                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400" alt="Video Call" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 border-2 border-brand-primary/20 rounded-full"></div>
                 </div>
              </div>
            </SpotlightCard>
          </motion.div>

          {/* Medium Card: Scheduling */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-1 lg:col-span-2 row-span-1"
          >
            <SpotlightCard className="h-full p-8 flex items-center justify-between group">
              <div className="w-1/2 h-full flex justify-start items-center">
                 <div className="w-full max-w-[160px] bg-white rounded-xl shadow-sm border border-slate-200 p-3 group-hover:-translate-y-2 transition-transform duration-500">
                    <div className="flex justify-between items-center mb-3">
                       <span className="text-xs font-bold text-slate-700">Oct 24</span>
                       <Calendar className="w-3 h-3 text-brand-primary" />
                    </div>
                    <div className="space-y-2">
                       <div className="h-6 w-full bg-brand-50 rounded border border-brand-100"></div>
                       <div className="h-6 w-3/4 bg-slate-50 rounded border border-slate-100"></div>
                    </div>
                 </div>
              </div>
              <div className="w-1/2 pl-4 text-right">
                <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-4 ml-auto">
                  <Calendar className="w-5 h-5 text-brand-primary" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Schedule in seconds</h3>
                <p className="text-sm text-slate-600">Align calendars and send invites without the back-and-forth.</p>
              </div>
            </SpotlightCard>
          </motion.div>

          {/* Small Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="md:col-span-1 lg:col-span-1 row-span-1"
          >
            <SpotlightCard className="h-full p-6 flex flex-col justify-center text-center items-center">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
                <Shield className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Secure</h3>
              <p className="text-xs text-slate-500 mt-1">End-to-end encryption for all calls.</p>
            </SpotlightCard>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="md:col-span-1 lg:col-span-1 row-span-1"
          >
            <SpotlightCard className="h-full p-6 flex flex-col justify-center text-center items-center">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Participant Mgmt</h3>
              <p className="text-xs text-slate-500 mt-1">Granular control over who joins.</p>
            </SpotlightCard>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="md:col-span-1 lg:col-span-2 row-span-1"
          >
            <SpotlightCard className="h-full p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0">
                <Bell className="w-6 h-6 text-brand-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Smart Reminders</h3>
                <p className="text-sm text-slate-500 mt-1">Automated notifications ensure no one misses a meeting.</p>
              </div>
            </SpotlightCard>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default BentoGridFeatures;
