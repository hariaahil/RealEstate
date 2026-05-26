'use client';

import Script from 'next/script';

type AdScriptLoaderProps = {
  id: string;
  src: string;
  dataZone?: string;
};

export function AdScriptLoader({ id, src, dataZone }: AdScriptLoaderProps) {
  return (
    <Script
      id={id}
      src={src}
      strategy="afterInteractive"
      data-cfasync="false"
      {...(dataZone ? { 'data-zone': dataZone } : {})}
    />
  );
}
