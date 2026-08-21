import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Briefcase, Globe, Building2, CheckCircle2 } from "lucide-react";

const tabs = [
  { id: "individuals", label: "For Individuals", icon: Users, image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop", content: {
      title: "Perfect for freelancers and consultants.",
      desc: "Set up a professional booking page in minutes. Let clients schedule time with you without the endless email threads.",
      features: ["Custom booking link", "Automated reminders", "Stripe integration for paid calls"]
  }},
  { id: "teams", label: "For Teams", icon: Briefcase, image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop", content: {
      title: "Built for agile collaboration.",
      desc: "Align your team instantly. MeetFlow checks everyone's calendar and finds the perfect overlap for internal syncs.",
      features: ["Round-robin scheduling", "Team analytics", "Slack & MS Teams integration"]
  }},
  { id: "remote", label: "For Remote Teams", icon: Globe, image: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=1000&auto=format&fit=crop", content: {
      title: "Bridge the distance.",
      desc: "High-quality video meetings designed to make remote collaboration feel like you're in the same room.",
      features: ["Ultra-low latency video", "Interactive whiteboarding", "Automated time-zone conversion"]
  }},
  { id: "enterprise", label: "For Business", icon: Building2, image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000&auto=format&fit=crop", content: {
      title: "Enterprise-grade control.",
      desc: "Advanced security, compliance, and administration controls for organizations that need to scale securely.",
      features: ["SSO & SAML integration", "Role-based access control", "Dedicated success manager"]
  }}
];

const SolutionsTabs = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <section className="py-24 md:py-32 bg-slate-50 relative" id="solutions">
      <div className="max-w-5xl mx-auto px-6">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">
            A solution for every workflow.
          </h2>
        </div>

        {/* Tabs Header */}
        <div 
          role="tablist"
          aria-label="Solutions"
          className="flex flex-wrap justify-center gap-1 mb-12 p-1.5 bg-white border border-slate-200 rounded-full shadow-sm mx-auto max-w-fit"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-full transition-colors z-10 ${
                  isActive ? "text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-brand-primary rounded-full -z-10 shadow-sm"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden min-h-[400px]">
          <AnimatePresence mode="wait">
            {tabs.map((tab) => {
              if (tab.id !== activeTab) return null;
              return (
                <motion.div
                  key={tab.id}
                  role="tabpanel"
                  id={`panel-${tab.id}`}
                  aria-labelledby={`tab-${tab.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="p-8 md:p-12 grid md:grid-cols-2 gap-12 items-center"
                >
                  <div>
                    <h3 className="text-3xl font-bold text-slate-900 mb-4">{tab.content.title}</h3>
                    <p className="text-lg text-slate-600 mb-8 leading-relaxed">{tab.content.desc}</p>
                    <ul className="space-y-4">
                      {tab.content.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-slate-700 font-medium">
                          <div className="w-6 h-6 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
                             <CheckCircle2 className="w-4 h-4 text-brand-primary" />
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-slate-50 rounded-2xl border border-slate-100 h-64 md:h-full min-h-[300px] overflow-hidden">
                     <img src={tab.image} alt={tab.content.title} className="w-full h-full object-cover" />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};

export default SolutionsTabs;
