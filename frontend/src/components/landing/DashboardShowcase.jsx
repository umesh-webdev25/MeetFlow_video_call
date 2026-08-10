import React, { useEffect, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { Users, Activity, Folder, Plus, Search, Calendar, Video, Filter, ChevronRight, BarChart } from "lucide-react";

// CountUp component (React Bits re-skinned)
const CountUp = ({ end, duration = 2, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      let startTime;
      let animationFrame;
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };
      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [inView, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const DashboardShowcase = () => {
  const containerRef = React.useRef(null);
  const inView = useInView(containerRef, { once: true, margin: "-100px" });

  const meetings = [
    { time: "09:30 AM", title: "Product Design Review", participants: 4, type: "Video" },
    { time: "11:00 AM", title: "Engineering Standup", participants: 12, type: "Video" },
    { time: "02:00 PM", title: "Client Discussion", participants: 3, type: "Call" },
    { time: "04:30 PM", title: "Team Sync", participants: 8, type: "Video" },
  ];

  return (
    <section className="py-24 md:py-32 bg-slate-50 relative overflow-hidden" id="dashboard">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full mb-6 text-brand-primary shadow-sm">
              <BarChart className="w-4 h-4" />
              <span className="text-xs font-bold tracking-widest uppercase">Admin Dashboard</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">
              Total visibility. Complete control.
            </h2>
            <p className="text-xl text-slate-600">
              Manage your teams, monitor active meetings, and analyze organization-wide usage from a centralized, intuitive interface.
            </p>
          </motion.div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

        {/* Dashboard Mockup */}
        <motion.div
           ref={containerRef}
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.7 }}
           className="relative mx-auto rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-50 font-sans flex max-w-6xl h-[700px]"
        >
           {/* Sidebar */}
           <div className="w-64 bg-white border-r border-slate-200 flex flex-col p-6 hidden lg:flex relative z-10">
              <div className="flex items-center gap-2 mb-10">
                 <div className="w-8 h-8 rounded bg-brand-primary flex items-center justify-center">
                    <Video className="w-5 h-5 text-white" />
                 </div>
                 <span className="font-bold text-xl text-slate-900">MeetFlow</span>
              </div>
              <div className="space-y-2 flex-1">
                 <div className="h-11 w-full bg-brand-50 rounded-xl flex items-center px-4 border border-brand-100 cursor-pointer">
                    <LayoutDashboard className="w-5 h-5 text-brand-primary mr-3" />
                    <span className="text-sm font-bold text-brand-primary">Dashboard</span>
                 </div>
                 {["Meetings", "Calendar", "Participants", "Messages", "Settings"].map((item, i) => (
                    <div key={i} className="h-11 w-full rounded-xl flex items-center px-4 hover:bg-slate-50 cursor-pointer transition-colors text-slate-600 hover:text-slate-900">
                       <Folder className="w-5 h-5 mr-3" />
                       <span className="text-sm font-bold">{item}</span>
                    </div>
                 ))}
              </div>
              <div className="mt-auto">
                 <button className="w-full h-11 bg-brand-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-hover transition-colors shadow-sm shadow-brand-primary/20">
                    <Plus className="w-4 h-4" /> New Meeting
                 </button>
              </div>
           </div>

           {/* Main Content */}
           <div className="flex-1 overflow-hidden flex flex-col bg-slate-50 relative z-10">
              {/* Header */}
              <div className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8">
                 <div className="flex items-center gap-3 w-96">
                    <div className="h-10 w-full bg-slate-50 border border-slate-200 rounded-xl flex items-center px-3">
                       <Search className="w-4 h-4 text-slate-400 mr-2" />
                       <span className="text-sm text-slate-400">Search meetings or people...</span>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                       <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Admin&backgroundColor=e2e8f0" alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                 </div>
              </div>

              {/* Dashboard Content */}
              <div className="flex-1 p-8 overflow-y-auto">
                 <div className="flex justify-between items-end mb-8">
                    <div>
                       <h1 className="text-3xl font-bold text-slate-900">Overview</h1>
                       <p className="text-slate-500 mt-1">Here is what's happening across your organization.</p>
                    </div>
                    <div className="flex gap-2">
                       <button className="h-10 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 shadow-sm flex items-center gap-2 hover:bg-slate-50">
                          <Filter className="w-4 h-4" /> This Week
                       </button>
                    </div>
                 </div>

                 {/* Stat Cards with CountUp */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-brand-100 transition-colors">
                       <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
                          <Video className="w-6 h-6 text-brand-primary" />
                       </div>
                       <p className="text-sm font-bold text-slate-500 mb-1">Total Meetings</p>
                       <p className="text-4xl font-bold text-slate-900">
                          {inView && <CountUp end={1248} />}
                       </p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-100 transition-colors">
                       <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
                          <Users className="w-6 h-6 text-emerald-600" />
                       </div>
                       <p className="text-sm font-bold text-slate-500 mb-1">Active Participants</p>
                       <p className="text-4xl font-bold text-slate-900">
                          {inView && <CountUp end={8560} />}
                       </p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-amber-100 transition-colors">
                       <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
                          <Activity className="w-6 h-6 text-amber-600" />
                       </div>
                       <p className="text-sm font-bold text-slate-500 mb-1">Total Minutes</p>
                       <p className="text-4xl font-bold text-slate-900">
                          {inView && <CountUp end={45} suffix="k" />}
                       </p>
                    </div>
                 </div>

                 {/* Today's Meetings (Staggered List Animation) */}
                 <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Today's Schedule</h3>
                    <div className="space-y-3">
                       {meetings.map((meeting, idx) => (
                          <motion.div
                             key={idx}
                             initial={{ opacity: 0, x: -20 }}
                             animate={inView ? { opacity: 1, x: 0 } : {}}
                             transition={{ duration: 0.5, delay: idx * 0.1 + 0.3 }}
                             className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md hover:border-brand-100 transition-all cursor-pointer group"
                          >
                             <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center group-hover:bg-brand-50 group-hover:border-brand-100 transition-colors">
                                   <span className="text-xs font-bold text-brand-primary">{meeting.time.split(' ')[0]}</span>
                                   <span className="text-[10px] font-bold text-slate-400">{meeting.time.split(' ')[1]}</span>
                                </div>
                                <div>
                                   <h4 className="font-bold text-slate-900">{meeting.title}</h4>
                                   <div className="flex items-center gap-3 mt-1">
                                      <span className="text-xs font-semibold text-slate-500 flex items-center gap-1"><Users className="w-3 h-3"/> {meeting.participants} joined</span>
                                      <span className="text-xs font-semibold text-brand-primary px-2 py-0.5 rounded-md bg-brand-50">{meeting.type}</span>
                                   </div>
                                </div>
                             </div>
                             <div className="flex items-center gap-4">
                                {idx === 1 ? (
                                  <button className="px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-bold shadow-sm hover:bg-brand-hover transition-colors flex items-center gap-2">
                                    <span className="relative flex h-2 w-2">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                    </span>
                                    Join Now
                                  </button>
                                ) : (
                                  <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-slate-50 transition-colors">
                                    <ChevronRight className="w-5 h-5" />
                                  </button>
                                )}
                             </div>
                          </motion.div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </motion.div>

      </div>
    </section>
  );
};

// LayoutDashboard icon missing in import above, adding a quick local fallback if needed, but lucide-react should have it.
import { LayoutDashboard } from "lucide-react";

export default DashboardShowcase;
