import { ReactNode } from 'react';
import { Flame } from 'lucide-react';

interface PageBannerProps {
  title: string;
  subtitle: string;
  icon?: ReactNode;
  backgroundImage?: string;
  themeColor?: 'magma' | 'blue' | 'purple' | 'emerald';
}

export default function PageBanner({ 
  title, 
  subtitle, 
  icon, 
  backgroundImage = 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=2070&auto=format&fit=crop',
  themeColor = 'magma'
}: PageBannerProps) {
  return (
    <div className="relative w-full h-[40vh] min-h-[300px] mb-12 flex items-center justify-center overflow-hidden bg-black">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      
      {/* Dark Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#050505] z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent z-0" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
        <div className={`w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center border border-${themeColor}/30 bg-${themeColor}/10 backdrop-blur-md shadow-[0_0_20px_color-mix(in_srgb,var(--theme-primary)_30%,transparent)]`}>
          {icon || <Flame className={`w-8 h-8 text-[var(--theme-primary)]`} />}
        </div>
        
        <h1 className="font-amiri font-bold text-5xl md:text-6xl text-white mb-4 drop-shadow-lg shadow-black">
          {title}
        </h1>
        
        <p className="font-cairo font-bold text-lg md:text-xl text-gray-300 drop-shadow-md max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>

      {/* Subtle Bottom Glow */}
      <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-[var(--theme-primary)] opacity-50 blur-[2px] rounded-t-full`} />
    </div>
  );
}
