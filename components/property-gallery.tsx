'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import type { PropertyImage } from '@/types';

export function PropertyGallery({ images }: { images: PropertyImage[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {images.slice(0, 4).map((image) => (
        <motion.div key={image.id} whileHover={{ scale: 1.02 }} className="relative h-64 overflow-hidden rounded-[2rem] bg-zinc-100">
          <Image src={image.image_url} alt="Property photo" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
        </motion.div>
      ))}
    </div>
  );
}
