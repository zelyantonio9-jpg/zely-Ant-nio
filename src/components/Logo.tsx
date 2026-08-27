import React from 'react';
import officialLogoImg from '../assets/images/ao_market_official_logo_1787066355050.jpg';

export { officialLogoImg };

interface LogoProps {
  variant?: 'header' | 'badge' | 'full' | 'compact' | 'footer';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSlogan?: boolean;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'header',
  size = 'md',
  className = '',
  showSlogan = false,
  onClick
}) => {
  // Size mapping for badge/icon
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  // 1. Badge variant - Just the complete official square badge image
  if (variant === 'badge') {
    return (
      <div 
        onClick={onClick}
        className={`relative inline-flex items-center justify-center shrink-0 rounded-2xl overflow-hidden shadow-md border border-amber-500/30 ${className} ${onClick ? 'cursor-pointer hover:opacity-95 transition' : ''}`}
      >
        <img 
          src={officialLogoImg} 
          alt="AO MARKET - Logotipo Oficial" 
          className={`${sizeClasses[size]} object-cover`}
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  // 2. Full variant - Badge + Typography + Slogan
  if (variant === 'full') {
    return (
      <div 
        onClick={onClick}
        className={`flex items-center space-x-3 select-none ${className} ${onClick ? 'cursor-pointer group' : ''}`}
      >
        <div className="relative shrink-0 rounded-2xl overflow-hidden shadow-md border border-amber-500/40 p-0.5 bg-gradient-to-br from-amber-400/40 via-slate-900 to-black">
          <img 
            src={officialLogoImg} 
            alt="AO MARKET Oficial" 
            className={`${sizeClasses[size]} rounded-[14px] object-cover`}
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center space-x-1.5 leading-none">
            <span className={`font-display font-black tracking-tight text-slate-900 ${textSizes[size]}`}>
              AO
            </span>
            <span className={`font-display font-black tracking-tight text-amber-500 ${textSizes[size]}`}>
              MARKET
            </span>
          </div>
          {showSlogan && (
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 tracking-tight mt-1">
              Conectamos Angola • Impulsionamos Negócios
            </span>
          )}
        </div>
      </div>
    );
  }

  // 3. Footer variant - Optimized for dark backgrounds
  if (variant === 'footer') {
    return (
      <div 
        onClick={onClick}
        className={`flex items-center space-x-3 select-none ${className} ${onClick ? 'cursor-pointer group' : ''}`}
      >
        <div className="relative shrink-0 rounded-xl overflow-hidden shadow-lg border border-amber-400/50 p-0.5 bg-gradient-to-br from-amber-400/30 via-slate-800 to-slate-950">
          <img 
            src={officialLogoImg} 
            alt="AO MARKET Oficial" 
            className="w-10 h-10 rounded-[10px] object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center space-x-1.5 leading-none">
            <span className="font-display font-black text-xl tracking-tight text-white">
              AO
            </span>
            <span className="font-display font-black text-xl tracking-tight text-amber-400">
              MARKET
            </span>
          </div>
          <span className="text-[10px] font-medium text-amber-400/80 tracking-wide mt-1 uppercase">
            Conectamos Angola • Impulsionamos Negócios
          </span>
        </div>
      </div>
    );
  }

  // 4. Header / Default variant
  return (
    <div 
      onClick={onClick}
      className={`flex items-center space-x-3 select-none shrink-0 ${className} ${onClick ? 'cursor-pointer group' : ''}`}
      title="AO MARKET - Conectamos Angola. Impulsionamos Negócios."
    >
      {/* Official Emblem Icon with subtle Golden Rim */}
      <div className="relative shrink-0 rounded-xl overflow-hidden shadow-sm border border-amber-500/40 p-0.5 bg-gradient-to-b from-amber-300/40 to-slate-900 transition group-hover:scale-105">
        <img 
          src={officialLogoImg} 
          alt="AO MARKET Logo" 
          className={`${sizeClasses[size]} rounded-[10px] object-cover`}
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-center space-x-1.5 leading-none">
          <span className={`font-display font-black tracking-tight text-slate-900 group-hover:text-amber-600 transition ${textSizes[size]}`}>
            AO
          </span>
          <span className={`font-display font-black tracking-tight text-amber-500 ${textSizes[size]}`}>
            MARKET
          </span>
        </div>
        <span className="text-[9px] font-bold text-slate-500 tracking-wider uppercase leading-none mt-1 hidden sm:block">
          República de Angola
        </span>
      </div>
    </div>
  );
};
