import React from "react";
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
           className="relative mx-auto max-w-5xl rounded-[2rem] overflow-hidden shadow-2xl border border-slate-200 bg-slate-50"
        >
           {/* Top Bar */}
           <div className="absolute top-0 w-full p-4 md:p-6 flex justify-between items-center z-20 bg-gradient-to-b from-white/90 to-transparent">
              <div className="flex items-center gap-3">
                 <button className="p-2.5 bg-white/80 backdrop-blur hover:bg-white rounded-full transition-colors border border-slate-200 shadow-sm text-slate-600">
                    <ArrowLeft className="w-5 h-5" />
                 </button>
                 
                 <div className="bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-full border border-slate-200 shadow-sm flex items-center gap-4">
                    {/* Live indicator using brand blue */}
                    <div className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-primary"></span>
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-slate-500">Live</span>
                    <div className="h-4 w-px bg-slate-200" />
                    <span className="text-sm font-bold tracking-tight text-slate-800">12:45</span>
                    <div className="h-4 w-px bg-slate-200" />
                    <span className="text-sm font-bold tracking-tight text-slate-800 hidden sm:block">4 Participants</span>
                 </div>
              </div>
              <div className="flex items-center gap-2">
                 <button className="p-2.5 bg-white/80 backdrop-blur hover:bg-white rounded-full transition-colors border border-slate-200 shadow-sm text-slate-600">
                    <Copy className="w-5 h-5" />
                 </button>
                 <button className="p-2.5 bg-white/80 backdrop-blur hover:bg-white rounded-full transition-colors border border-slate-200 shadow-sm text-slate-600">
                    <Maximize2 className="w-5 h-5" />
                 </button>
              </div>
           </div>

           {/* Video Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 pt-24 pb-28 h-[600px] md:h-[700px]">
              
              {/* Active Speaker */}
              <div className="relative rounded-[2.5rem] overflow-hidden bg-white border-2 border-brand-primary shadow-lg ring-4 ring-brand-100">
                 <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800" alt="Speaker" className="w-full h-full object-cover" />
                 <div className="absolute bottom-4 left-4 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl text-sm font-bold flex items-center gap-2 border border-slate-200 shadow-sm text-slate-900">
                    Sarah Jenkins
                 </div>
              </div>
              
              {/* Secondary Grid */}
              <div className="grid grid-rows-2 gap-4">
                <div className="relative rounded-[2rem] overflow-hidden bg-white border border-slate-200 shadow-sm">
                   <img src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=400" alt="Participant" className="w-full h-full object-cover" />
                   <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl text-sm font-bold flex items-center gap-2 border border-slate-200 shadow-sm text-slate-900">
                      David L.
                   </div>
                   <div className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-md rounded-xl border border-slate-200 shadow-sm">
                      <Hand className="w-5 h-5 text-amber-500" />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative rounded-[1.5rem] overflow-hidden bg-white border border-slate-200 shadow-sm">
                     <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400" alt="Participant" className="w-full h-full object-cover" />
                     <div className="absolute bottom-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-md rounded-lg text-xs font-bold flex items-center gap-1 border border-slate-200 shadow-sm text-slate-900">
                        Emily R. <MicOff className="w-3 h-3 text-rose-500" />
                     </div>
                  </div>

                  <div className="relative rounded-[1.5rem] overflow-hidden bg-brand-50 border border-brand-100 shadow-sm flex flex-col items-center justify-center">
                     <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto mb-3 border-4 border-brand-50 shadow-sm">
                        <span className="text-xl font-bold text-brand-primary">MC</span>
                     </div>
                     <p className="font-bold text-slate-900 text-sm">Michael C.</p>
                     <div className="absolute bottom-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-md rounded-lg text-xs font-bold flex items-center gap-1 border border-slate-200 shadow-sm text-slate-900">
                        <MicOff className="w-3 h-3 text-rose-500" />
                     </div>
                  </div>
                </div>
              </div>

           </div>

           {/* Floating Bottom Controls */}
           <div className="absolute bottom-8 inset-x-0 z-40 flex justify-center px-4">
              <div className="flex items-center justify-center gap-2 md:gap-3 px-6 py-4 rounded-full bg-white/90 backdrop-blur-xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                 
                 <button className="p-3.5 bg-white hover:bg-brand-50 shadow-sm border border-slate-200 hover:border-brand-100 rounded-full text-slate-700 hover:text-brand-primary transition-all">
                    <Mic className="w-5 h-5" />
                 </button>
                 <button className="p-3.5 bg-white hover:bg-brand-50 shadow-sm border border-slate-200 hover:border-brand-100 rounded-full text-slate-700 hover:text-brand-primary transition-all">
                    <Video className="w-5 h-5" />
                 </button>
                 <button className="p-3.5 bg-brand-primary hover:bg-brand-hover shadow-sm rounded-full text-white transition-all hover:scale-105">
                    <MonitorUp className="w-5 h-5" />
                 </button>
                 <button className="p-3.5 bg-white hover:bg-brand-50 shadow-sm border border-slate-200 hover:border-brand-100 rounded-full text-slate-700 hover:text-brand-primary transition-all relative">
                    <MessageSquare className="w-5 h-5" />
                    <span className="absolute top-0 right-0 w-3 h-3 bg-brand-primary rounded-full border-2 border-white"></span>
                 </button>
                 <button className="p-3.5 bg-white hover:bg-brand-50 shadow-sm border border-slate-200 hover:border-brand-100 rounded-full text-slate-700 hover:text-brand-primary transition-all">
                    <Hand className="w-5 h-5" />
                 </button>
                 
                 <div className="w-px h-8 bg-slate-200 mx-2"></div>
                 
                 <button className="px-6 py-3.5 bg-rose-500 hover:bg-rose-600 rounded-full transition-all text-white font-bold flex items-center gap-2 shadow-sm hover:shadow-md">
                    <PhoneOff className="w-5 h-5" /> <span className="hidden sm:inline">Leave</span>
                 </button>
              </div>
           </div>

        </motion.div>
      </div>
    </section>
  );
};

export default VideoMeetingExperience;
