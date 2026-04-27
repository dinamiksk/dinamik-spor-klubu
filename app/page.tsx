'use client';

import { useState } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import HomeContent from '@/components/HomeContent';

export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && (
        <LoadingScreen onComplete={() => setLoading(false)} />
      )}
      {!loading && <HomeContent />}
    </>
  );
}
