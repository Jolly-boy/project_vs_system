'use client';

import { useEffect, useRef } from 'react';
import Phaser from 'phaser';

export default function PhaserGameWrapper() {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    // Basic Phaser game configuration
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: 'phaser-game-container',
      backgroundColor: '#020617', // Matches slate-950
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene: {
        preload: function () {
          // Load assets here in the future
        },
        create: function () {
          // Test text to verify Phaser is running
          this.add.text(400, 300, 'Driving Simulation Active', {
            fontSize: '24px',
            color: '#38bdf8',
          }).setOrigin(0.5);
        },
        update: function () {
          // Game loop update logic
        },
      },
    };

    // Initialize the game only once on mount
    if (!gameRef.current) {
      gameRef.current = new Phaser.Game(config);
    }

    // Cleanup game instance when unmounting
    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return (
    <div 
      id="phaser-game-container" 
      className="flex h-[600px] w-[800px] items-center justify-center overflow-hidden rounded-xl border border-slate-800 shadow-2xl" 
    />
  );
}