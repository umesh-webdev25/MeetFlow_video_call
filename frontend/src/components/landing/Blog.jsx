import React from "react";
import { motion } from "framer-motion";
import { BLOGS } from "../../data/landingData";
import ScrollReveal from "./ScrollReveal";
import MagneticButton from "./MagneticButton";

const Blog = () => {
  return (
    <section id="resources" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
                Latest insights
              </h2>
              <p className="text-lg text-slate-600 max-w-xl">
                Stay updated with the latest trends, guides, and stories in the world of remote work and video collaboration.
              </p>
            </div>
            <MagneticButton className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-full font-medium transition-colors whitespace-nowrap">
              View all articles
            </MagneticButton>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8">
          {BLOGS.map((blog, idx) => (
            <ScrollReveal key={blog.id} delay={idx * 0.1}>
              <div className="group cursor-pointer">
                <div className="relative rounded-3xl overflow-hidden mb-6 aspect-[4/3]">
                  <motion.img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-slate-900 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                      {blog.category}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-slate-600 mb-4 line-clamp-2">
                    {blog.description}
                  </p>
                  <span className="text-primary font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                    Read article <span className="text-lg">→</span>
                  </span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
