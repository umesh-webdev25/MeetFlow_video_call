import React, { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";
import { STATISTICS } from "../../data/landingData";
import ScrollReveal from "./ScrollReveal";

const Counter = ({ value, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      let startTime = null;

      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        setCount(Math.floor(progress * (end - start) + start));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, value]);

  return (
    <span ref={ref} className="text-5xl font-extrabold text-slate-900 tracking-tight">
      {count}
      {suffix}
    </span>
  );
};

const Statistics = () => {
  return (
    <section className="py-20 bg-slate-100 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {STATISTICS.map((stat, idx) => (
            <ScrollReveal key={stat.label} delay={idx * 0.1}>
              <div className="flex flex-col items-center justify-center space-y-2">
                <Counter value={stat.value} suffix={stat.suffix} />
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                  {stat.label}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
