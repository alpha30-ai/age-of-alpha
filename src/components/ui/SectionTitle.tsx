interface SectionTitleProps {
  title: string;
  subtitle?: string;
  accent?: 'magma' | 'blue';
}

export default function SectionTitle({ title, subtitle, accent = 'magma' }: SectionTitleProps) {
  const isPrimary = accent === 'magma';
  const accentColorClass = isPrimary ? 'text-[var(--theme-primary)]' : 'text-[var(--theme-secondary)]';
  const lineColorClass = isPrimary ? 'bg-[var(--theme-primary)]' : 'bg-[var(--theme-secondary)]';
  const glowStyle = isPrimary 
    ? { textShadow: '0 0 20px color-mix(in srgb, var(--theme-primary) 60%, transparent), 0 0 40px color-mix(in srgb, var(--theme-primary) 30%, transparent)' }
    : { textShadow: '0 0 20px color-mix(in srgb, var(--theme-secondary) 60%, transparent), 0 0 40px color-mix(in srgb, var(--theme-secondary) 30%, transparent)' };

  return (
    <div className="text-center mb-12">
      <h2 className={`font-cairo font-bold text-3xl md:text-4xl text-[var(--color-theme-heading)] mb-4`} style={glowStyle}>
        {title}
      </h2>
      {subtitle && (
        <p className="text-silver-ash/70 max-w-2xl mx-auto text-lg">
          {subtitle}
        </p>
      )}
      <div className={`mt-6 mx-auto w-24 h-0.5 ${lineColorClass} rounded-full opacity-60 shadow-[0_0_10px_currentColor]`} />
    </div>
  );
}
