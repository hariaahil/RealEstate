import { useEffect, useState } from 'react';

export function useContactUnlock(propertyId: string) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUnlockStatus = async () => {
      try {
        // Check if user has unlocked this property
        const response = await fetch(`/api/contact-unlocks?property_id=${propertyId}`);
        if (response.ok) {
          const data = await response.json();
          setIsUnlocked(data.unlocked || false);
        }
      } catch (error) {
        console.error('Error checking unlock status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUnlockStatus();
  }, [propertyId]);

  return { isUnlocked, loading };
}
