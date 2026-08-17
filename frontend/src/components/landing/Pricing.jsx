import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const Pricing = () => {
  const plans = [
    { name: "Starter", price: "Free", features: ["Up to 10 participants", "40-minute limit", "Basic features"] },
    { name: "Pro", price: "$15/mo", features: ["Up to 100 participants", "Unlimited duration", "Cloud recording", "Premium support"] },
    { name: "Enterprise", price: "Custom", features: ["Unlimited participants", "Custom branding", "Dedicated success manager", "SSO integration"] }
  ];

  return (
    <section className="py-24 md:py-32 bg-slate-50 relative overflow-hidden" id="pricing">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-slate-900 mb-6">Simple, transparent pricing</h2>
        <p className="text-xl text-slate-600 mb-16 max-w-2xl mx-auto">
          Choose the plan that fits your team's needs. Upgrade anytime.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              className="p-8 border border-slate-200 rounded-2xl bg-white shadow-sm hover:shadow-xl transition-shadow flex flex-col"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
              <div className="text-4xl font-extrabold text-brand-primary mb-6">{plan.price}</div>
              <ul className="text-left space-y-4 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700">
                    <Check className="w-5 h-5 text-green-500" /> {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors">
                Choose {plan.name}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
