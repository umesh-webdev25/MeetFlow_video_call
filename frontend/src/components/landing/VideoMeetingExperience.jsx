import { motion } from "framer-motion";
import { Mic, MicOff, Video, MonitorUp, MessageSquare, Hand, PhoneOff, ArrowLeft, Copy, Maximize2 } from "lucide-react";

const VideoMeetingExperience = () => {
  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden" id="video">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 border border-brand-100 rounded-full mb-6 text-brand-primary shadow-sm">
              <Video className="w-4 h-4" />
              <span className="text-xs font-bold tracking-widest uppercase">Meeting Interface</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">
              Crystal clear connection.
            </h2>
            <p className="text-xl text-slate-600">
              Experience ultra-low latency, 4K capable video, and a minimalist interface designed to keep you focused on the conversation.
            </p>
          </motion.div>
        </div>

        {/* Ambient Glow behind the video UI */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>

        {/* Video Meeting Mockup */}
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 0.7, ease: "easeOut" }}
           className="relative mx-auto max-w-8xl rounded-[2rem] overflow-hidden shadow-2xl border border-slate-200 bg-slate-50"
        >
           <img src="/videometting.png" alt="Video Meeting Interface" className="w-full h-auto object-cover" />

        </motion.div>
      </div>
    </section>
  );
};

export default VideoMeetingExperience;
