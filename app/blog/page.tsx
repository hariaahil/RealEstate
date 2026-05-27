import Link from 'next/link';
const posts=[{slug:'gachibowli-rent-guide',title:'Gachibowli Rent Guide 2026'},{slug:'kondapur-investment-outlook',title:'Kondapur Investment Outlook'},{slug:'hyderabad-rental-tips',title:'Hyderabad Rental Tips'}];
export default function BlogPage(){return <div className='mx-auto max-w-5xl px-6 py-12'><h1 className='text-4xl font-semibold'>HydPropertiesHub Blog</h1><div className='mt-8 grid gap-4'>{posts.map(p=><Link key={p.slug} href={`/blog/${p.slug}`} className='rounded-2xl border bg-white p-5 hover:shadow-soft'>{p.title}</Link>)}</div></div>}
