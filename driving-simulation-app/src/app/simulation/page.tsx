// Inside src/app/simulation/page.tsx or a wrapper component
'use client';

import dynamic from 'next/dynamic';

const PhaserGame = dynamic(
  () => import('@/components/PhaserGameWrapper'), 
  { ssr: false }
);

export default function SimulationPage() {
  return (
    <main className="flex h-screen w-full flex-col items-center justify-center bg-slate-950">
      <PhaserGame />
    </main>
  );
}