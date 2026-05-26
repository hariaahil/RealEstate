import { AdScriptLoader } from '@/components/ads/AdScriptLoader';

type InPagePushAdProps = {
  placement: string;
  className?: string;
};

export function InPagePushAd({ placement, className }: InPagePushAdProps) {
  return (
    <section
      aria-label={`Sponsored placement ${placement}`}
      className={className ?? 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8'}
    >
      <div className="overflow-hidden rounded-[1.5rem] border border-zinc-200 bg-white p-3 shadow-soft sm:p-4">
        <div className="min-h-[56px] w-full" />
      </div>
      <AdScriptLoader id="propeller-inpage-push" src="https://nap5k.com/tag.min.js" dataZone="11058486" />
    </section>
  );
}
