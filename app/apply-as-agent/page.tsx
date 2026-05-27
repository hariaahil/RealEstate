import Link from 'next/link';

export default function ApplyAsAgentPage() {
  return <div className='mx-auto max-w-3xl px-6 py-14'>
    <h1 className='text-4xl font-semibold'>Apply as Agent</h1>
    <p className='mt-3 text-zinc-600'>Agent signup is reviewed by admin. Submit profile and wait for approval.</p>
    <Link className='mt-6 inline-flex rounded-full bg-brand-600 px-6 py-3 text-white' href='/login'>Sign in to apply</Link>
  </div>;
}
