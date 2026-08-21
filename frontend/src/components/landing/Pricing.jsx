import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: "Starter",
      description: "Perfect for individuals getting started",
      monthlyPrice: 0,
      annualPrice: 0,
      features: [
        { text: "Up to 10 participants per meeting", included: true },
        { text: "40-minute meeting limit", included: true },
        { text: "Basic video & audio", included: true },
        { text: "Screen sharing", included: true },
        { text: "Meeting chat", included: true },
        { text: "Cloud recording", included: false },
        { text: "AI summaries", included: false },
        { text: "Custom branding", included: false },
      ],
      cta: "Get Started Free",
      popular: false,
    },
    {
      name: "Pro",
      description: "For professionals and growing teams",
      monthlyPrice: 15,
      annualPrice: 12,
      features: [
        { text: "Up to 100 participants per meeting", included: true },
        { text: "Unlimited meeting duration", included: true },
        { text: "HD video & spatial audio", included: true },
        { text: "Screen sharing + annotation", included: true },
        { text: "Cloud recording (10GB)", included: true },
        { text: "AI-powered summaries & transcripts", included: true },
        { text: "Priority support", included: true },
        { text: "Custom branding", included: false },
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      description: "For organizations that need scale and security",
      monthlyPrice: 0, // Custom pricing
      annualPrice: 0,
      features: [
        { text: "Unlimited participants", included: true },
        { text: "Unlimited meeting duration", included: true },
        { text: "4K video & spatial audio", included: true },
        { text: "Advanced screen sharing", included: true },
        { text: "Unlimited cloud recording", included: true },
        { text: "AI summaries & transcripts", included: true },
        { text: "SSO & SAML integration", included: true },
        { text: "Custom branding & dedicated support", included: true },
      ],
      cta: "Contact Sales",
      popular: false,
      customPrice: true,
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden" id="pricing">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-brand-primary/5 to-transparent rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full mb-6 text-brand-primary shadow-sm">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold tracking-widest uppercase">Simple Pricing</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Choose the plan that fits your needs. Upgrade, downgrade, or cancel anytime.
            </p>
          </motion.div>

          {/* Toggle: Monthly / Annual */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center justify-center mt-8"
          >
            <span className="mb-3 text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full">Save 20% on Annual</span>
            <div className="flex items-center justify-center gap-4">
              <span className={`text-sm font-bold transition-colors ${!isAnnual ? 'text-slate-900' : 'text-slate-400'}`}>Monthly</span>
              <button
                role="switch"
                aria-checked={isAnnual}
                aria-label="Toggle annual billing"
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative w-14 h-7 rounded-full transition-colors ${isAnnual ? 'bg-brand-primary' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${isAnnual ? 'translate-x-8' : 'translate-x-1'}`} />
              </button>
              <span className={`text-sm font-bold transition-colors ${isAnnual ? 'text-slate-900' : 'text-slate-400'}`}>
                Annual
              </span>
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className={`h-full relative p-8 rounded-2xl border flex flex-col ${
                plan.popular
                  ? 'bg-gradient-to-b from-white to-brand-50/30 border-brand-200 shadow-xl shadow-brand-primary/10 scale-105 z-10'
                  : 'bg-white border-slate-200 shadow-sm hover:shadow-lg'
              } transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-brand-primary to-blue-700 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-1">{plan.name}</h3>
                <p className="text-sm text-slate-500">{plan.description}</p>
              </div>

              <div className="mb-6">
                {plan.customPrice ? (
                  <div className="text-4xl font-extrabold text-slate-900">Custom</div>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-extrabold text-slate-900">
                      ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-slate-400 font-medium">/mo</span>
                  </div>
                )}
                {plan.name === "Starter" && (
                  <span className="text-xs text-slate-400 mt-1 block">Free forever</span>
                )}
                {isAnnual && !plan.customPrice && plan.annualPrice > 0 && (
                  <span className="text-xs text-emerald-600 font-medium mt-1 block">
                    Billed annually (${plan.annualPrice * 12}/yr)
                  </span>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.filter(f => f.included).map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-emerald-600" />
                    </div>
                    <span className="text-slate-700">
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                to={plan.name === "Enterprise" ? "/contact" : "/signup"}
                className={`w-full py-3.5 rounded-xl font-bold text-center transition-all flex items-center justify-center gap-2 group ${
                  plan.popular
                    ? 'bg-gradient-to-r from-brand-primary to-blue-700 text-white shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/30 hover:-translate-y-0.5'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-slate-400 mt-10"
        >
          All plans include end-to-end encryption. Need a custom plan? <a href="#contact" className="text-brand-primary font-bold hover:underline">Contact us</a>
        </motion.p>
      </div>
    </section>
  );
};

export default Pricing;