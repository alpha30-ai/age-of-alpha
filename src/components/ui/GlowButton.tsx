'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface GlowButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'magma' | 'blue' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

export default function GlowButton({
  href,
  onClick,
  children,
  variant = 'magma',
  size = 'md',
  className,
  type = 'button',
  disabled = false,
}: GlowButtonProps) {
  const baseClasses =
    'relative inline-flex items-center justify-center gap-2 font-cairo font-bold rounded-lg transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden';

  const variantClasses = {
    magma:
      'bg-[var(--theme-primary)]/90 hover:bg-[var(--theme-primary)] text-silver-ash border border-[var(--theme-primary)]/30 shadow-[0_0_15px_color-mix(in_srgb,var(--theme-primary)_40%,transparent)] hover:shadow-[0_0_30px_color-mix(in_srgb,var(--theme-primary)_80%,transparent)]',
    blue: 'bg-[var(--theme-secondary)]/20 hover:bg-[var(--theme-secondary)]/30 text-[var(--theme-secondary)] border border-[var(--theme-secondary)]/40 shadow-[0_0_15px_color-mix(in_srgb,var(--theme-secondary)_20%,transparent)] hover:shadow-[0_0_30px_color-mix(in_srgb,var(--theme-secondary)_50%,transparent)]',
    ghost:
      'bg-white/5 hover:bg-white/10 text-silver-ash border border-silver-ash/10 hover:border-white/20 backdrop-blur-md',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size], className);

  const innerContent = (
    <>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {/* Glossy overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-silver-ash/0 via-white/5 to-white/20 opacity-0 hover:opacity-100 transition-opacity duration-500 z-0" />
    </>
  );

  const motionProps = {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
  };

  if (href) {
    return (
      <motion.span {...motionProps} className="inline-block">
        <Link href={href} className={classes}>
          {innerContent}
        </Link>
      </motion.span>
    );
  }

  return (
    <motion.button type={type} onClick={onClick} className={classes} disabled={disabled} {...motionProps}>
      {innerContent}
    </motion.button>
  );
}
