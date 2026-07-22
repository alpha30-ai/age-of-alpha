interface SectionTitleProps {
  title: string;
  subtitle?: string;
  accent?: 'magma' | 'blue';
}

export default function SectionTitle({ title, subtitle, accent = 'magma' }: SectionTitleProps) {
  const accentColor = accent === 'magma' ? 'text-magma' : 'text-milky-blue';
  const lineColor = accent === 'magma' ? 'bg-magma' : 'bg-milky-blue';

  return (
    <div className="text-center mb-12">
      <h2 className={`font-cairo font-bold text-3xl md:text-4xl ${accentColor} glow-text-${accent === 'magma' ? 'magma' : 'blue'} mb-4`}>
        {title}
      </h2>
      {subtitle && (
        <p className="text-silver-ash/70 max-w-2xl mx-auto text-lg">
          {subtitle}
        </p>
      )}
      <div className={`mt-6 mx-auto w-24 h-0.5 ${lineColor} rounded-full opacity-60`} />
    </div>
  );
}
