'use client';

import { useEffect, useState } from 'react';
import { AdScriptLoader } from '@/components/ads/AdScriptLoader';

const STORAGE_KEY = 'hyd_push_ads_engaged_v1';
const SESSION_KEY = 'hyd_push_ads_requested_v1';

export function PushNotificationAd() {
  const [canLoad, setCanLoad] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const markEngaged = () => {
      localStorage.setItem(STORAGE_KEY, '1');
      window.removeEventListener('click', markEngaged);
      window.removeEventListener('scroll', markEngaged);
      window.removeEventListener('keydown', markEngaged);
      window.removeEventListener('touchstart', markEngaged);
    };

    window.addEventListener('click', markEngaged, { once: true });
    window.addEventListener('scroll', markEngaged, { once: true });
    window.addEventListener('keydown', markEngaged, { once: true });
    window.addEventListener('touchstart', markEngaged, { once: true });

    return () => {
      window.removeEventListener('click', markEngaged);
      window.removeEventListener('scroll', markEngaged);
      window.removeEventListener('keydown', markEngaged);
      window.removeEventListener('touchstart', markEngaged);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem(STORAGE_KEY)) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const timer = window.setTimeout(() => {
      sessionStorage.setItem(SESSION_KEY, '1');
      setCanLoad(true);
    }, 1200);

    return () => window.clearTimeout(timer);
  }, []);

  if (!canLoad) return null;

  return <AdScriptLoader id="propeller-push-notification" src="https://5gvci.com/act/files/tag.min.js?z=11058491" />;
}
