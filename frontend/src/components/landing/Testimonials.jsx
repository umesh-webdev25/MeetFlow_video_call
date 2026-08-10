import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "MeetFlow has completely transformed how our distributed team operates. We spend less time scheduling and more time actually collaborating.",
    name: "Sarah Jenkins",
    role: "VP of Engineering",
    company: "TechNexus",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Sarah&backgroundColor=e2e8f0"
  },
  {
    quote: "The dashboard visibility alone is worth it. Being able to see all organizational meeting stats in one place helps us optimize our time.",
    name: "Marcus Chen",
    role: "Operations Director",
    company: "GlobalCorp",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Marcus&backgroundColor=e2e8f0"
  },
  {
    quote: "Finally, a video calling tool that doesn't feel bloated. It's clean, incredibly fast, and the calendar integration is flawless.",
    name: "Elena Rodriguez",
    role: "Lead Designer",
    company: "Creative Studio",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Elena&backgroundColor=e2e8f0"
  }
];

const Testimonials = () => {
  return (
    <section className="py-24 md:py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">
              Trusted by modern teams.
            </h2>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              // Spotlight/Glare-Hover mapping applied: white card, slate border, blue hover shadow
              className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-brand-primary/10 hover:-translate-y-1 hover:border-brand-100 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="mb-8">
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 text-brand-primary fill-brand-primary" />
                  ))}
                </div>
                <p className="text-lg text-slate-700 leading-relaxed font-medium">"{t.quote}"</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-slate-200 overflow-hidden bg-slate-50">
                  <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{t.name}</h4>
                  <p className="text-sm text-slate-500">{t.role}, {t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
