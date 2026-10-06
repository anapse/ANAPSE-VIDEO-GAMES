import React, { useEffect, useRef } from 'react';

type AdBannerProps = {
  slot: 'top' | 'footer';
};

const clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID as string | undefined;

const slotIds = {
  top: import.meta.env.VITE_ADSENSE_SLOT_TOP as string | undefined,
  footer: import.meta.env.VITE_ADSENSE_SLOT_FOOTER as string | undefined,
};

export const AdBanner: React.FC<AdBannerProps> = ({ slot }) => {
  const adRef = useRef<HTMLDivElement>(null);
  const slotId = slotIds[slot];

  useEffect(() => {
    if (!clientId || !slotId || !adRef.current) return;

    const scriptId = 'anapse-adsense-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
      document.head.appendChild(script);
    }

    const ins = adRef.current.querySelector('.adsbygoogle');
    if (ins && !(ins as HTMLElement).dataset.loaded) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        (ins as HTMLElement).dataset.loaded = 'true';
      } catch {
        // AdSense may not be ready on the first render; it can retry on navigation.
      }
    }
  }, [clientId, slotId]);

  const heightClass = slot === 'top'
    ? 'min-h-[50px] sm:min-h-[60px]'
    : 'min-h-[50px] sm:min-h-[60px]';

  return (
    <div
      className={`relative z-10 w-full px-2 sm:px-4 ${slot === 'top' ? 'py-2' : 'py-1.5'}`}
      aria-label="Publicidad"
    >
      <div className={`mx-auto w-full max-w-7xl overflow-hidden rounded-lg border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/40 ${heightClass}`}>
        {clientId && slotId ? (
          <div ref={adRef} className="w-full h-full min-h-[50px] flex items-center justify-center">
            <ins
              className="adsbygoogle block w-full"
              style={{ display: 'block', minHeight: slot === 'top' ? '50px' : '50px' }}
              data-ad-client={clientId}
              data-ad-slot={slotId}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>
        ) : (
          <div className="h-[50px] flex items-center justify-center text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-600">
            Espacio publicitario
          </div>
        )}
      </div>
    </div>
  );
};
