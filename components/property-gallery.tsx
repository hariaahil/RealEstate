'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import type { PropertyImage } from '@/types';

export function PropertyGallery({ images }: { images: PropertyImage[] }) {
  if (!images.length) {
    return (
      <div className="rounded-[2rem] border border-zinc-200 bg-zinc-50 p-8 text-center text-sm text-zinc-500">
        Property images are not available right now.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {images.slice(0, 4).map((image) => (
        <motion.div key={image.id} whileHover={{ scale: 1.02 }} className="relative h-56 sm:h-56 sm:h-64 overflow-hidden rounded-[2rem] bg-zinc-100">
          <Image src={image.image_url} alt="Property photo" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
        </motion.div>
      ))}
    </div>
  );
}
