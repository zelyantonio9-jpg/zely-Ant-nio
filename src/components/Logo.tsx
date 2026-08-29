import React, { useRef } from 'react';
import officialLogoImg from '../assets/images/ao_market_official_logo_1788025428740.jpg';

export { officialLogoImg };

interface LogoProps {
  variant?: 'header' | 'badge' | 'full' | 'compact' | 'footer';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSlogan?: boolean;
  onClick?: () => void;
  onSecretAdminTrigger?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'header',
  size = 'md',
  className = '',
  showSlogan = false,
  onClick,
  onSecretAdminTrigger
}) => {
  const clickCountRef = useRef<number>(0);
  const clickTimerRef = useRef<any>(null);

  const imgHeights = {
    sm: 'h-9 sm:h-11',
    md: 'h-13 sm:h-16 md:h-18',
    lg: 'h-18 sm:h-22 md:h-24',
    xl: 'h-24 sm:h-30 md:h-36'
  };

  const badgeSizes = {
    sm: 'w-10 h-10 p-1.5',
    md: 'w-14 h-14 p-2',
    lg: 'w-20 h-20 p-2.5',
    xl: 'w-28 h-28 p-3'
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    // Increment click count for 5-clicks secret administrator gateway
    clickCountRef.current += 1;

    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    if (clickCountRef.current >= 5) {
      clickCountRef.current = 0;
      if (onSecretAdminTrigger) {
        onSecretAdminTrigger();
        return;
      }
    }

    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 2000);

    if (onClick) {
      onClick();
    }
  };

  // 1. Badge variant (e.g. for modals and cards)
  if (variant === 'badge') {
    return (
      <div 
        onClick={handleLogoClick}
        className={`relative inline-flex items-center justify-center shrink-0 rounded-2xl bg-white ${badgeSizes[size]} shadow-xs border border-slate-100 ${className} ${(onClick || onSecretAdminTrigger) ? 'cursor-pointer hover:shadow-md transition' : ''}`}
        title="AO MARKET"
      >
        <img 
          src={officialLogoImg} 
          alt="AO MARKET" 
          className="w-full h-full object-contain"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  // 2. Full variant with optional slogan
  if (variant === 'full') {
    return (
      <div 
        onClick={handleLogoClick}
        className={`flex flex-col items-start select-none ${className} ${(onClick || onSecretAdminTrigger) ? 'cursor-pointer group' : ''}`}
        title="AO MARKET - O Teu Mercado Online em Angola"
      >
        <div className="flex items-center">
          <img 
            src={officialLogoImg} 
            alt="AO MARKET" 
            className={`${imgHeights[size]} w-auto object-contain transition-transform duration-200 group-hover:scale-102`}
            referrerPolicy="no-referrer"
          />
        </div>
        {showSlogan && (
          <span className="text-[11px] sm:text-xs font-bold text-slate-500 tracking-tight mt-1">
            O Teu Mercado Online em Angola!
          </span>
        )}
      </div>
    );
  }

  // 3. Footer variant - High contrast container for dark backgrounds
  if (variant === 'footer') {
    return (
      <div 
        onClick={handleLogoClick}
        className={`flex items-center space-x-3.5 select-none ${className} ${(onClick || onSecretAdminTrigger) ? 'cursor-pointer group' : ''}`}
        title="AO MARKET - O Teu Mercado Online em Angola"
      >
        <div className="bg-white rounded-2xl p-2.5 shadow-md border border-slate-700/60 transition-transform duration-200 group-hover:scale-105 shrink-0">
          <img 
            src={officialLogoImg} 
            alt="AO MARKET" 
            className="h-12 sm:h-14 md:h-16 w-auto object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center leading-none">
            <span className="font-display font-black text-xl tracking-tight text-white">
              AO
            </span>
            <span className="font-display font-black text-xl tracking-tight text-[#FF6B00] ml-1.5">
              MARKET
            </span>
          </div>
          <span className="text-[11px] font-semibold text-slate-400 tracking-wide mt-1">
            O Teu Mercado Online em Angola
          </span>
        </div>
      </div>
    );
  }

  // 4. Compact variant
  if (variant === 'compact') {
    return (
      <div 
        onClick={handleLogoClick}
        className={`inline-flex items-center select-none shrink-0 ${className} ${(onClick || onSecretAdminTrigger) ? 'cursor-pointer group' : ''}`}
        title="AO MARKET"
      >
        <img 
          src={officialLogoImg} 
          alt="AO MARKET" 
          className={`${imgHeights[size]} w-auto object-contain transition-transform duration-200 group-hover:scale-105`}
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  // 5. Header / Default variant
  return (
    <div 
      onClick={handleLogoClick}
      className={`flex items-center select-none shrink-0 ${className} ${(onClick || onSecretAdminTrigger) ? 'cursor-pointer group' : ''}`}
      title="AO MARKET - O Teu Mercado Online em Angola"
    >
      <img 
        src={officialLogoImg} 
        alt="AO MARKET" 
        className={`${imgHeights[size]} w-auto object-contain transition-transform duration-200 group-hover:scale-102`}
        referrerPolicy="no-referrer"
      />
    </div>
  );
};
