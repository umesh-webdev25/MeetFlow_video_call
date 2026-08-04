import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TABS } from "../../data/landingData";
import ScrollReveal from "./ScrollReveal";

const SolutionsTabs = () => {
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const activeTabData = TABS.find((t) => t.id === activeTab);

  return (
    <section id="solutions" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              The perfect solution for any meeting.
            </h2>
          </div>
        </ScrollReveal>

        {/* Tabs */}
        <ScrollReveal delay={0.1}>
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                  activeTab === tab.id ? "text-primary" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary/10 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Content Area */}
        <ScrollReveal delay={0.2}>
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid md:grid-cols-2 gap-12 items-center"
              >
                <div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4">{activeTabData.title}</h3>
                  <p className="text-lg text-slate-600 mb-8">{activeTabData.description}</p>
                  <button className="text-primary font-semibold flex items-center gap-2 hover:gap-3 transition-all group">
                    Learn more about {activeTabData.label}
                    <motion.span
                      className="inline-block"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      →
                    </motion.span>
                  </button>
                </div>
                <div className="rounded-2xl overflow-hidden aspect-square md:aspect-auto md:h-96 relative group">
                  <motion.img
                    src={activeTabData.image}
                    alt={activeTabData.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default SolutionsTabs;
