import React from 'react';

interface LogoBrandingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'compact' | 'horizontal' | 'light' | 'white' | 'stacked';
  showSubtitle?: boolean;
  className?: string;
}

export const LogoBranding: React.FC<LogoBrandingProps> = ({
  size = 'md',
  variant = 'horizontal',
  showSubtitle = true,
  className = '',
}) => {
  const sizeMap = {
    sm: { 
      main: 'text-xs sm:text-sm', 
      sub: 'text-[11px]', 
      badge: 'text-[10px] px-2 py-0.5',
      divider: 'mx-1.5 text-xs' 
    },
    md: { 
      main: 'text-sm sm:text-base', 
      sub: 'text-xs sm:text-sm', 
      badge: 'text-[11px] px-2.5 py-0.5',
      divider: 'mx-2 text-sm' 
    },
    lg: { 
      main: 'text-base sm:text-lg', 
      sub: 'text-sm sm:text-base', 
      badge: 'text-xs px-3 py-1',
      divider: 'mx-2.5 text-base' 
    },
    xl: { 
      main: 'text-lg sm:text-xl', 
      sub: 'text-base sm:text-lg', 
      badge: 'text-sm px-3.5 py-1',
      divider: 'mx-3 text-lg' 
    },
  };

  const isLight = variant === 'light' || variant === 'white';
  const isStacked = variant === 'stacked';

  return (
    <div className={`select-none ${className}`} id="applied-college-branding">
      {isStacked ? (
        <div className="flex flex-col text-right leading-tight">
          <div className="flex items-center gap-2">
            <span
              className={`font-extrabold font-kufi tracking-tight ${sizeMap[size].main} ${
                isLight ? 'text-white' : 'text-[#1b4329]'
              }`}
            >
              الكلية التطبيقية
            </span>
          </div>
          {showSubtitle && (
            <span
              className={`font-medium font-cairo mt-0.5 ${sizeMap[size].sub} ${
                isLight ? 'text-[#e5d4a6]' : 'text-[#8f743c]'
              }`}
            >
              وحدة الإرشاد المهني والتوظيف
            </span>
          )}
        </div>
      ) : (
        <div className="flex items-center flex-wrap text-right leading-none gap-y-1">
          <span
            className={`font-extrabold font-kufi tracking-tight ${sizeMap[size].main} ${
              isLight ? 'text-white' : 'text-[#1b4329]'
            }`}
          >
            الكلية التطبيقية
          </span>
          <span
            className={`font-bold font-kufi ${sizeMap[size].divider} ${
              isLight ? 'text-[#e5d4a6]' : 'text-[#a4874b]'
            }`}
          >
            -
          </span>
          <span
            className={`font-semibold font-kufi ${sizeMap[size].sub} ${
              isLight ? 'text-emerald-100' : 'text-[#245836]'
            }`}
          >
            وحدة الإرشاد المهني والتوظيف
          </span>
        </div>
      )}
    </div>
  );
};

