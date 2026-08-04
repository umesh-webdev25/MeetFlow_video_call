import React from "react";
import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    Product: ["Video Calls", "Screen Sharing", "Recording", "Security", "Integrations"],
    Solutions: ["Remote Teams", "Sales & Marketing", "Education", "Healthcare", "Enterprise"],
    Resources: ["Blog", "Customer Stories", "Help Center", "Webinars", "API Reference"],
    Company: ["About Us", "Careers", "Press", "Contact", "Partners"],
  };

  return (
    <footer className="bg-slate-900 pt-20 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2">
            <Link to="/landing" className="text-3xl font-bold tracking-tighter text-white mb-6 block">
              MeetFlow<span className="text-primary">.</span>
            </Link>
            <p className="text-slate-400 mb-8 max-w-sm">
              The minimalist platform for high-quality, secure video meetings. Built for the modern remote workforce.
            </p>
            <form className="flex flex-col gap-3">
              <label htmlFor="email" className="text-sm font-semibold text-white">Subscribe to our newsletter</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className="bg-slate-800 border border-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-primary flex-1 min-w-0"
                  required
                />
                <button type="submit" className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Subscribe
                </button>
              </div>
            </form>
          </div>

          {/* Links Grid */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-bold mb-6">{category}</h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Area */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} MeetFlow Inc. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-500 hover:text-white transition-colors">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors">
              <Linkedin size={20} />
            </a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors">
              <Github size={20} />
            </a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors">
              <Instagram size={20} />
            </a>
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
