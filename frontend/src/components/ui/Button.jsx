import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  className = '',
  href,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-bold transition-all relative overflow-hidden";
  
  const variants = {
    primary: "bg-brand-primary text-white shadow-sm shadow-brand-primary/20 hover:bg-brand-hover hover:-translate-y-0.5",
    secondary: "bg-white text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-50 hover:-translate-y-0.5",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100"
  };

  const classes = `${baseStyles} ${variants[variant] || variants.primary} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes} data-discover="true" {...props}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};
