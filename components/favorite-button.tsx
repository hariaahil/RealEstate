'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

type FavoriteButtonProps = {
  propertyId: string;
};

function readFavoriteIds(): string[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = window.localStorage.getItem('favorite_property_ids');
    return stored ? (JSON.parse(stored) as string[]) : [];
  } catch {
    return [];
  }
}

function writeFavoriteIds(ids: string[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem('favorite_property_ids', JSON.stringify(ids));
}

function getCurrentUserId() {
  if (typeof window === 'undefined') return 'guest';
  let userId = window.localStorage.getItem('favorite_user_id');
  if (!userId) {
    userId = `guest-${Math.random().toString(36).slice(2, 10)}`;
    window.localStorage.setItem('favorite_user_id', userId);
  }
  return userId;
}

export function FavoriteButton({ propertyId }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const ids = readFavoriteIds();
    setIsFavorite(ids.includes(propertyId));
  }, [propertyId]);

  const toggleFavorite = async () => {
    setIsSaving(true);
    const userId = getCurrentUserId();
    const ids = readFavoriteIds();

    if (isFavorite) {
      await fetch('/api/favorites', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ property_id: propertyId, user_id: userId }),
      });
      const nextIds = ids.filter((id) => id !== propertyId);
      writeFavoriteIds(nextIds);
      setIsFavorite(false);
    } else {
      await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, property_id: propertyId }),
      });
      const nextIds = Array.from(new Set([...ids, propertyId]));
      writeFavoriteIds(nextIds);
      setIsFavorite(true);
    }

    setIsSaving(false);
  };

  return (
    <Button
      variant={isFavorite ? 'secondary' : 'outline'}
      size="sm"
      type="button"
      onClick={toggleFavorite}
      disabled={isSaving}
    >
      {isFavorite ? 'Saved' : 'Save'}
    </Button>
  );
}
