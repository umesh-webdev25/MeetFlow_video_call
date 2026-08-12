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
        <div className="relative [perspective:2000px]">
  <motion.div
    ref={containerRef}
    initial={{
      opacity: 0,
      rotateX: 15,
      y: 80,
      scale: 0.95,
    }}
    whileInView={{
      opacity: 1,
      rotateX: 0,
      y: 0,
      scale: 1,
    }}
    viewport={{
      once: true,
      margin: "-50px",
    }}
    transition={{
      duration: 1,
      type: "spring",
      bounce: 0.4,
    }}
    whileHover={{
      scale: 1.02,
      y: -10,
    }}
    className="
      relative mx-auto
      max-w-6xl
      overflow-hidden
      rounded-xl
      bg-slate-50
      shadow-2xl
      border-4 border-white/40
      ring-1 ring-slate-900/5
      cursor-pointer
    "
  >
    <div className="overflow-hidden w-full h-full">
      <img
        src="/dashbord.png"
        alt="Dashboard Mockup"
        className="
          block
          w-full
          h-auto
          object-cover
          scale-[1.008]
        "
      />
    </div>
  </motion.div>
</div>

      </div>
    </section>
  );
};

// LayoutDashboard icon missing in import above, adding a quick local fallback if needed, but lucide-react should have it.
import { LayoutDashboard } from "lucide-react";

export default DashboardShowcase;
