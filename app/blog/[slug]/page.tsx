import { notFound } from 'next/navigation';
const content:Record<string,string>={
 'gachibowli-rent-guide':'Area guide for rentals, commute, and expected rents.',
 'kondapur-investment-outlook':'Market trends and inventory outlook for buyers.',
 'hyderabad-rental-tips':'Checklist for tenants before finalizing a rental.'
};
export default async function BlogDetail({params}:{params:Promise<{slug:string}>}){const {slug}=await params; if(!content[slug]) return notFound(); return <div className='mx-auto max-w-4xl px-6 py-12'><h1 className='text-4xl font-semibold capitalize'>{slug.replaceAll('-',' ')}</h1><p className='mt-4 text-zinc-600'>{content[slug]}</p></div>}
