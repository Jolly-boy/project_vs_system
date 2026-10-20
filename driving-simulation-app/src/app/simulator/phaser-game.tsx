"use client";

import { forwardRef, useImperativeHandle, useEffect, useRef } from "react";
import Phaser from "phaser";
import { DrivingScene } from "./driving-scene";

export interface PhaserGameHandle {
  setSpeed: (speed: number) => void;
  triggerCollision: () => void;
}

const PhaserGame = forwardRef<PhaserGameHandle>((props, ref) => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Expose methods to the parent component
  useImperativeHandle(ref, () => ({
    setSpeed: (speed: number) => {
      const scene = gameRef.current?.scene.getScene("DrivingScene") as DrivingScene;
      scene?.setSpeed(speed);
    },
    triggerCollision: () => {
      const scene = gameRef.current?.scene.getScene("DrivingScene") as DrivingScene;
      scene?.triggerCollision();
    },
  }));

  useEffect(() => {
    // Prevent initialization if already running or container is missing
    if (!containerRef.current || gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: containerRef.current,
      scene: [DrivingScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      banner: false, // Hide Phaser console banner
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    // CRITICAL: Cleanup function to prevent memory leaks on hot-reload
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="border rounded-md overflow-hidden bg-black shadow-lg" 
    />
  );
});

PhaserGame.displayName = "PhaserGame";
export default PhaserGame;