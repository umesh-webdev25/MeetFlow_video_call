import React from "react";
import { motion } from "framer-motion";
import { Plug, Zap, MessageSquare, Calendar, Database, Cloud, Shield, Settings } from "lucide-react";

const tools = [
  { name: 'Slack', icon: MessageSquare, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { name: 'Google Calendar', icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { name: 'Salesforce', icon: Cloud, color: 'text-sky-500', bg: 'bg-sky-500/10' },
  { name: 'Zoom', icon: Plug, color: 'text-blue-600', bg: 'bg-blue-600/10' },
  { name: 'Notion', icon: Database, color: 'text-slate-800', bg: 'bg-slate-800/10' },
  { name: 'Zapier', icon: Zap, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { name: 'Trello', icon: Shield, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { name: 'GitHub', icon: Settings, color: 'text-slate-900', bg: 'bg-slate-900/10' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 10 }
  }
};

const Integrations = () => {
  return (
    <section className="py-24 md:py-32 bg-slate-50 relative overflow-hidden" id="integrations">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full mb-6 text-brand-primary shadow-sm">
              <Plug className="w-4 h-4" />
              <span className="text-xs font-bold tracking-widest uppercase">Seamless Integrations</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">
              Works with your favorite tools
            </h2>
            <p className="text-xl text-slate-600">
              Connect MeetFlow with your existing workflow seamlessly. From calendars to CRMs, we've got you covered.
            </p>
          </motion.div>
        </div>

        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group relative p-8 border border-slate-200 rounded-2xl bg-white shadow-sm hover:shadow-xl hover:border-brand-100 transition-all cursor-pointer flex flex-col items-center justify-center text-center overflow-hidden"
              >
                {/* Hover Glow */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${tool.bg}`}></div>
                
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${tool.bg} ${tool.color}`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-900 group-hover:text-brand-primary transition-colors">
                  {tool.name}
                </h3>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Integrations;
