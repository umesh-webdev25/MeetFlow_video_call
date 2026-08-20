import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Video, Calendar, Shield, PlayCircle, BarChart } from "lucide-react";
import { Link } from "react-router-dom";

const handleSmoothScroll = (e, link) => {
  if (link && link.startsWith('#')) {
    const element = document.querySelector(link);
    if (element) {
      e.preventDefault();
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

const MegaMenu = ({ title, items, isOpen }) => {
  return (
    <div className="relative group">
      <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-700 hover:text-brand-primary transition-colors">
        {title} <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      
      {/* Animated blue underline */}
      <span className="absolute bottom-1 left-4 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-[calc(100%-2rem)]"></span>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-0 mt-2 w-[400px] bg-white rounded-2xl shadow-xl border border-slate-100 p-3 z-50"
          >
            <div className="grid grid-cols-1 gap-1">
              {items.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.link}
                  onClick={(e) => handleSmoothScroll(e, item.link)}
                  className="flex items-start gap-4 p-3 rounded-xl hover:bg-brand-50 transition-colors group/item"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover/item:border-brand-100 group-hover/item:bg-white transition-colors">
                    <item.icon className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-0.5">{item.title}</h4>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const productItems = [
    { icon: Video, title: "Video Meetings", desc: "Crystal clear, ultra-low latency calls", link: "#video" },
    { icon: Calendar, title: "Scheduling", desc: "Instant calendar alignment & invites", link: "#scheduling" },
    { icon: BarChart, title: "Dashboard", desc: "Centralized meeting management", link: "#dashboard" },
  ];

  const solutionsItems = [
    { icon: PlayCircle, title: "For Teams", desc: "Keep remote teams deeply connected", link: "#solutions" },
    { icon: Shield, title: "For Enterprise", desc: "Bank-level security and controls", link: "#solutions" },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md border-b border-brand-100 shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded bg-brand-primary flex items-center justify-center shadow-sm shadow-brand-primary/20 transition-transform group-hover:scale-105">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">MeetFlow</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1" onMouseLeave={() => setActiveMenu(null)}>
          <div onMouseEnter={() => setActiveMenu('product')}>
            <MegaMenu title="Product" items={productItems} isOpen={activeMenu === 'product'} />
          </div>
          <div onMouseEnter={() => setActiveMenu('solutions')}>
            <MegaMenu title="Solutions" items={solutionsItems} isOpen={activeMenu === 'solutions'} />
          </div>
          
          <Link to="#pricing" onClick={(e) => handleSmoothScroll(e, '#pricing')} className="relative group px-4 py-2 text-sm font-semibold text-slate-700 hover:text-brand-primary transition-colors">
            Pricing
            <span className="absolute bottom-1 left-4 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-[calc(100%-2rem)]"></span>
          </Link>
          <Link to="#integrations" onClick={(e) => handleSmoothScroll(e, '#integrations')} className="relative group px-4 py-2 text-sm font-semibold text-slate-700 hover:text-brand-primary transition-colors">
            Integrations
            <span className="absolute bottom-1 left-4 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-[calc(100%-2rem)]"></span>
          </Link>
        </nav>

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
            Sign In
          </Link>
          {/* Re-skinned Shiny Button per prompt */}
          <Link to="/signup" className="relative overflow-hidden px-5 py-2.5 bg-brand-primary text-white rounded-full text-sm font-bold shadow-sm shadow-brand-primary/20 hover:bg-brand-hover hover:-translate-y-0.5 transition-all group">
            Get Started
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-slate-600"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              <Link to="#video" className="text-lg font-semibold text-slate-800" onClick={(e) => { setMobileMenuOpen(false); handleSmoothScroll(e, '#video'); }}>Product</Link>
              <Link to="#solutions" className="text-lg font-semibold text-slate-800" onClick={(e) => { setMobileMenuOpen(false); handleSmoothScroll(e, '#solutions'); }}>Solutions</Link>
              <Link to="#pricing" className="text-lg font-semibold text-slate-800" onClick={(e) => { setMobileMenuOpen(false); handleSmoothScroll(e, '#pricing'); }}>Pricing</Link>
              <hr className="border-slate-100 my-2" />
              <Link to="/login" className="text-lg font-semibold text-slate-600" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
              <Link to="/signup" className="w-full py-4 bg-brand-primary text-white rounded-2xl text-lg font-bold text-center shadow-sm" onClick={() => setMobileMenuOpen(false)}>
                Get Started Free
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
