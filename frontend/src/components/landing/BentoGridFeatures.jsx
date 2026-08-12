import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Video,
  LayoutDashboard,
  Shield,
  Users,
  Bell,
} from "lucide-react";

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
  const today = new Date();
  const currentMonth = today.toLocaleString("default", { month: "long" });
  const currentYear = today.getFullYear();
  const firstDayOfMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1,
  ).getDay();
  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0,
  ).getDate();
  const currentDate = today.getDate();

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
              Everything you need. <br /> Nothing you don't.
            </h2>
            <p className="text-xl text-slate-600">
              Powerful features packaged in an interface that gets out of your
              way.
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
                <div className="w-20 h-20 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-6">
                  <LayoutDashboard className="w-10 h-10 text-brand-primary" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Centralized Dashboard
                </h3>
                <p className="text-slate-600">
                  Everything about your meetings in one place. Monitor activity,
                  track history, and manage your team from a single view.
                </p>
              </div>

              {/* Detailed SaaS Dashboard Visual */}
              <div className="mt-2 relative h-60 bg-slate-50 rounded-xl border border-slate-200 overflow-hidden group-hover:border-brand-300 transition-colors shadow-inner flex font-sans text-slate-800">
                {/* Decorative background grid */}
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:16px_16px]"></div>

                {/* Left Sidebar */}
                <div className="w-1/3 max-w-[170px] bg-white border-r border-slate-200 p-4 flex flex-col gap-4 relative z-10 shrink-0">
                  {/* User Profile */}
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-200 overflow-hidden border border-slate-300 shrink-0 flex items-center justify-center">
                       <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                    </div>
                    <span className="text-[11px] font-bold text-slate-700 truncate">Admin User</span>
                  </div>
                  {/* Search Bar */}
                  <div className="w-full h-8 bg-slate-50 border border-slate-200 rounded-md flex items-center px-2 gap-2 text-slate-400">
                     <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                     <span className="text-[10px]">Search...</span>
                  </div>
                  {/* Navigation Menu */}
                  <div className="flex flex-col  flex-1 mt-1">
                    <div className="text-[10px] font-semibold text-brand-700 bg-brand-50 border border-brand-100 px-2 py-1.5 rounded flex items-center">Sales Overview</div>
                    <div className="text-[10px] font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 px-2 py-1.5 rounded flex items-center transition-colors">Marketing Analytics</div>
                    <div className="text-[10px] font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 px-2 py-1.5 rounded flex items-center transition-colors">Inventory Logs</div>
                    <div className="text-[10px] font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 px-2 py-1.5 rounded flex items-center transition-colors">User Reports</div>
                    <div className="text-[10px] font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 px-2 py-1.5 rounded flex items-center transition-colors">System Settings</div>
                    <div className="text-[10px] font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 px-2 py-1.5 rounded flex items-center transition-colors">Team Management</div>
                  </div>
                </div>

                {/* Main Dashboard Area */}
                <div className="flex-1 flex flex-col relative z-10 bg-slate-50/50 backdrop-blur-sm">
                  {/* Top Header */}
                  <div className="h-14 border-b border-slate-200 bg-white/90 flex items-center justify-between px-5 shrink-0">
                    <h2 className="text-sm font-bold text-slate-800">Real-Time Revenue</h2>
                    <div className="flex items-center gap-3">
                      <div className="h-7 px-3 bg-white border border-slate-200 rounded-md flex items-center text-[9px] font-medium text-slate-600 shadow-sm">
                        Oct 01 - Oct 31, 2023
                      </div>
                      <div className="w-7 h-7 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center">
                         <span className="text-[9px] font-bold text-slate-500">AU</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Cards Area */}
                  <div className="flex-1 p-4 flex gap-4 h-full">
                    {/* Left Card: Revenue */}
                    <div className="flex-1 bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col overflow-hidden relative group-hover:-translate-y-1 transition-transform duration-500 delay-75">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
                      <div className="p-3 pb-1 pl-4">
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Monthly Revenue (USD)</div>
                        <div className="text-xl font-bold text-slate-800 mt-0.5">2,450,000</div>
                        <div className="text-[9px] font-medium text-emerald-600 mt-0.5">vs. Previous Month (+15%)</div>
                      </div>
                      <div className="flex-1 mt-3 mx-4 mb-3 flex items-end gap-2 relative border-b border-l border-slate-100 pl-1">
                        {/* Grid lines */}
                        <div className="absolute left-1 right-0 top-0 border-t border-slate-100 border-dashed"></div>
                        <div className="absolute left-1 right-0 top-1/2 border-t border-slate-100 border-dashed"></div>
                        <div className="absolute left-1 right-0 top-1/4 border-t border-slate-100 border-dashed"></div>
                        <div className="absolute left-1 right-0 top-3/4 border-t border-slate-100 border-dashed"></div>
                        {/* Bars */}
                        {[40, 60, 45, 80, 65, 95].map((h, i) => (
                           <div key={i} className="flex-1 flex flex-col justify-end group/bar cursor-pointer h-full gap-0.5 relative z-10">
                             <div className="w-full bg-teal-300 rounded-t-sm transition-all" style={{height: `${h * 0.3}%`}}></div>
                             <div className="w-full bg-emerald-500 rounded-b-sm transition-all" style={{height: `${h * 0.7}%`}}></div>
                           </div>
                        ))}
                        {/* Axis labels */}
                        <div className="absolute -left-6 bottom-[-4px] text-[6px] text-slate-400 font-medium bg-white pr-1">0M</div>
                        <div className="absolute -left-7 top-[48%] -translate-y-1/2 text-[6px] text-slate-400 font-medium bg-white pr-1">1.25M</div>
                        <div className="absolute -left-7 top-[-4px] text-[6px] text-slate-400 font-medium bg-white pr-1">2.5M</div>
                      </div>
                    </div>

                    {/* Right Card: Activity */}
                    <div className="flex-1 bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col overflow-hidden relative group-hover:-translate-y-1 transition-transform duration-500 delay-150">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
                      <div className="p-3 pb-1 pl-4">
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">User Activity (Daily Active)</div>
                        <div className="text-xl font-bold text-slate-800 mt-0.5">12,580</div>
                        <div className="text-[9px] font-medium text-rose-500 mt-0.5">vs. Previous Month (-5%)</div>
                      </div>
                      <div className="flex-1 mt-3 mx-4 mb-3 flex items-end gap-1.5 relative border-b border-l border-slate-100 pl-1">
                        {/* Grid lines */}
                        <div className="absolute left-1 right-0 top-0 border-t border-slate-100 border-dashed"></div>
                        <div className="absolute left-1 right-0 top-1/2 border-t border-slate-100 border-dashed"></div>
                        <div className="absolute left-1 right-0 top-1/4 border-t border-slate-100 border-dashed"></div>
                        <div className="absolute left-1 right-0 top-3/4 border-t border-slate-100 border-dashed"></div>
                        {/* Bars */}
                        {[85, 70, 90, 50, 45, 60, 40, 75, 80].map((h, i) => (
                           <div key={i} className="flex-1 flex flex-col justify-end group/bar cursor-pointer h-full gap-0.5 relative z-10">
                             <div className="w-full bg-amber-300 rounded-t-sm transition-all" style={{height: `${h * 0.4}%`}}></div>
                             <div className="w-full bg-orange-500 rounded-b-sm transition-all" style={{height: `${h * 0.6}%`}}></div>
                           </div>
                        ))}
                        {/* Axis labels */}
                        <div className="absolute -left-4 bottom-[-4px] text-[6px] text-slate-400 font-medium bg-white pr-1">0</div>
                        <div className="absolute -left-6 top-[48%] -translate-y-1/2 text-[6px] text-slate-400 font-medium bg-white pr-1">7.5K</div>
                        <div className="absolute -left-6 top-[-4px] text-[6px] text-slate-400 font-medium bg-white pr-1">15K</div>
                      </div>
                    </div>
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
            <SpotlightCard className="h-full p-8 flex items-center group relative overflow-hidden">
              <div className="w-2/3 relative z-10 pr-4">
                <div className="w-20 h-20 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <Video className="w-10 h-10 text-brand-primary drop-shadow-sm" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Join instantly
                </h3>
                <p className="text-sm text-slate-600">
                  High-quality, low-latency video meetings directly in your
                  browser.
                </p>
              </div>
              <div className="absolute -right-6 top-1/2 -translate-y-1/2 flex justify-end z-0">
                <div className="w-40 h-40 rounded-full bg-slate-50 border-4 border-white shadow-xl overflow-hidden relative group-hover:scale-105 transition-transform duration-500 shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400"
                    alt="Video Call"
                    className="w-full h-full object-cover"
                  />
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
            <SpotlightCard className="h-full p-8 group overflow-hidden">
              <div className="flex items-center justify-between w-full h-full">
                <div className="w-1/2 pr-4 z-10">
                  <div className="w-20 h-20 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <Calendar className="w-10 h-10 text-brand-primary drop-shadow-sm" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Schedule in seconds
                  </h3>
                  <p className="text-sm text-slate-600">
                    Align calendars and send invites without the back-and-forth.
                  </p>
                </div>
                <div className="w-1/2 flex justify-end items-center h-full relative z-10">
                  <div className="w-full max-w-[240px] bg-white rounded-xl shadow-lg border border-slate-200 p-3 flex flex-col gap-1.5">
                    {/* Header */}
                    <div className="flex justify-between items-center pb-1 border-b border-slate-100">
                      <span className="text-sm font-bold text-slate-800">
                        {currentMonth} {currentYear}
                      </span>

                      <div className="flex gap-1">
                        <div className="w-5 h-5 bg-slate-50 rounded border border-slate-100 flex items-center justify-center">
                          <span className="text-[10px] text-slate-400">‹</span>
                        </div>

                        <div className="w-5 h-5 bg-slate-50 rounded border border-slate-100 flex items-center justify-center">
                          <span className="text-[10px] text-slate-400">›</span>
                        </div>
                      </div>
                    </div>

                    {/* Calendar */}
                    <div>
                      <div className="grid grid-cols-7 mb-0.5">
                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                          <div
                            key={d}
                            className="text-[9px] font-bold text-slate-400 text-center"
                          >
                            {d}
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-y-0">
                        {[...Array(firstDayOfMonth)].map((_, i) => (
                          <div key={`offset-${i}`} className="h-5" />
                        ))}

                        {[...Array(daysInMonth)].map((_, i) => {
                          const day = i + 1;

                          const isToday = day === currentDate;
                          const hasMeeting =
                            day === currentDate + 2 || day === currentDate + 5;

                          return (
                            <div
                              key={day}
                              className={`
                h-5 mx-0.5 rounded
                flex items-center justify-center
                text-[10px] font-medium
                ${
                  isToday
                    ? "bg-brand-primary text-white shadow-sm"
                    : hasMeeting
                      ? "bg-brand-50 text-brand-700"
                      : "text-slate-600"
                }
              `}
                            >
                              {day}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Meeting */}
                    <div className="h-8 bg-brand-50 rounded-lg flex items-center px-2.5 gap-2 border border-brand-100/50">
                      <Video className="w-4 h-4 text-brand-primary shrink-0" />
                      <span className="text-[10px] font-medium text-brand-700 truncate">
                        Sync with Design Team
                      </span>
                    </div>
                  </div>
                </div>
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
            <SpotlightCard className="h-full p-6 flex flex-col justify-center text-center items-center group">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200/50 flex items-center justify-center mb-5 group-hover:-translate-y-1 transition-transform duration-300 shadow-sm">
                <Shield className="w-10 h-10 text-emerald-600 drop-shadow-sm" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">Secure</h3>
              <p className="text-sm text-slate-500">
                End-to-end encryption for all calls.
              </p>
            </SpotlightCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="md:col-span-1 lg:col-span-1 row-span-1"
          >
            <SpotlightCard className="h-full p-6 flex flex-col justify-center text-center items-center group">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200/50 flex items-center justify-center mb-5 group-hover:-translate-y-1 transition-transform duration-300 shadow-sm">
                <Users className="w-10 h-10 text-amber-600 drop-shadow-sm" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                Participant Mgmt
              </h3>
              <p className="text-sm text-slate-500">
                Granular control over who joins.
              </p>
            </SpotlightCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="md:col-span-1 lg:col-span-2 row-span-1"
          >
            <SpotlightCard className="h-full p-8 group">
              <div className="flex items-center gap-6 w-full h-full ">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100/50 border border-brand-200/50 flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform duration-300 shadow-sm">
                  <Bell className="w-10 h-10 text-brand-primary drop-shadow-sm -translate-y-1" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Smart Reminders
                  </h3>
                  <p className="text-slate-500">
                    Automated notifications ensure no one misses a meeting.
                  </p>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BentoGridFeatures;
