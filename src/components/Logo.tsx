import React, { useRef } from 'react';
import officialLogoImg from '../assets/images/ao_market_official_logo_1787066355050.jpg';

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

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
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

  // Vector Logo Icon matching the exact style in the image
  const LogoIcon = () => (
    <div className={`relative flex items-center justify-center shrink-0 ${iconSizes[size]} transition-transform duration-200 group-hover:scale-105`}>
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Shopping Basket / Gateway Roof Arch in Navy Blue */}
        <path d="M8 18L24 6L40 18" stroke="#0A2540" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Basket base in Orange */}
        <path d="M12 20L15 38C15.5 41 18 43 21 43H27C30 43 32.5 41 33 38L36 20" stroke="#FF6B00" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Central 'A' & 'O' stylized bars */}
        <path d="M20 34L24 23L28 34" stroke="#0A2540" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M19 30H29" stroke="#FF6B00" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Bottom anchor line */}
        <circle cx="24" cy="14" r="2.5" fill="#FF6B00" />
      </svg>
    </div>
  );

  // 1. Badge variant
  if (variant === 'badge') {
    return (
      <div 
        onClick={handleLogoClick}
        className={`relative inline-flex items-center justify-center shrink-0 rounded-2xl bg-white p-2 shadow-sm border border-slate-100 ${className} ${(onClick || onSecretAdminTrigger) ? 'cursor-pointer hover:shadow-md transition' : ''}`}
      >
        <LogoIcon />
      </div>
    );
  }

  // 2. Full variant
  if (variant === 'full') {
    return (
      <div 
        onClick={handleLogoClick}
        className={`flex items-center space-x-2.5 select-none ${className} ${(onClick || onSecretAdminTrigger) ? 'cursor-pointer group' : ''}`}
      >
        <LogoIcon />
        <div className="flex flex-col">
          <div className="flex items-center leading-none">
            <span className={`font-display font-black tracking-tight text-[#0A2540] ${textSizes[size]}`}>
              AO
            </span>
            <span className={`font-display font-black tracking-tight text-[#FF6B00] ml-1.5 ${textSizes[size]}`}>
              MARKET
            </span>
          </div>
          {showSlogan && (
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 tracking-tight mt-1">
              O Teu Mercado Online em Angola!
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
        onClick={handleLogoClick}
        className={`flex items-center space-x-3 select-none ${className} ${(onClick || onSecretAdminTrigger) ? 'cursor-pointer group' : ''}`}
      >
        <div className="bg-white/10 p-1.5 rounded-xl">
          <LogoIcon />
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
          <span className="text-[10px] font-medium text-slate-300 tracking-wide mt-1">
            O Teu Mercado Online em Angola
          </span>
        </div>
      </div>
    );
  }

  // 4. Header / Default variant
  return (
    <div 
      onClick={handleLogoClick}
      className={`flex items-center space-x-2 select-none shrink-0 ${className} ${(onClick || onSecretAdminTrigger) ? 'cursor-pointer group' : ''}`}
      title="AO MARKET - O Teu Mercado Online em Angola"
    >
      <LogoIcon />

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-center leading-none">
          <span className={`font-display font-black tracking-tight text-[#0A2540] group-hover:text-slate-900 transition ${textSizes[size]}`}>
            AO
          </span>
          <span className={`font-display font-black tracking-tight text-[#FF6B00] ml-1 ${textSizes[size]}`}>
            MARKET
          </span>
        </div>
      </div>
    </div>
  );
};
