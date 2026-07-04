import React from 'react';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ComponentType<any>;
  iconPosition?: 'left' | 'right';
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  
  // Base structural classes
  const baseClasses = "inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer transform hover:-translate-y-0.5";

  // Variant classes
  const variantClasses = {
    primary: "bg-[#23395B] text-white hover:bg-[#1a2d48] shadow-sm hover:shadow-md border border-transparent",
    secondary: "bg-white text-slate-700 border border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80 shadow-2xs hover:shadow-xs",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-white hover:-translate-y-0",
    danger: "bg-red-50 text-red-600 border border-red-200/60 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50 hover:bg-red-100/50 dark:hover:bg-red-950/40 shadow-2xs hover:shadow-xs",
    success: "bg-emerald-50 text-emerald-600 border border-emerald-200/60 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50 hover:bg-emerald-100/50 dark:hover:bg-emerald-950/40 shadow-2xs hover:shadow-xs",
    outline: "bg-transparent text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800"
  };

  // Size classes
  const sizeClasses = {
    xs: "px-2.5 py-1.5 text-[10px]",
    sm: "px-3.5 py-2 text-xs",
    md: "px-4.5 py-2.5 text-xs",
    lg: "px-6 py-3 text-sm"
  };

  return (
    <motion.button
      whileTap={disabled || isLoading ? undefined : { scale: 0.98 }}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin mr-2 shrink-0" />
      ) : Icon && iconPosition === 'left' ? (
        <Icon className={`w-3.5 h-3.5 mr-2 shrink-0 ${size === 'xs' ? 'w-3 h-3 mr-1' : ''}`} />
      ) : null}

      <span>{children}</span>

      {!isLoading && Icon && iconPosition === 'right' ? (
        <Icon className={`w-3.5 h-3.5 ml-2 shrink-0 ${size === 'xs' ? 'w-3 h-3 ml-1' : ''}`} />
      ) : null}
    </motion.button>
  );
}
