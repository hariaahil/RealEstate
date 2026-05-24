export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-brand-600">Page not found</p>
      <h1 className="text-4xl font-semibold text-zinc-950">We couldn’t find that page</h1>
      <p className="max-w-xl text-zinc-600">The page you are looking for is not available. Please return to the homepage or explore property listings.</p>
      <a href="/" className="inline-flex rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700">Return home</a>
    </div>
  );
}
