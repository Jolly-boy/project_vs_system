
"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Gauge, Play, Square, Zap } from "lucide-react";
import type { PhaserGameHandle } from "@/app/simulator/phaser-game";
import { useCamera } from "@/hooks/use-camera";
import { CameraPreview } from "@/components/camera/camera-preview";
import { useFaceMonitoring } from "@/hooks/use-face-monitoring";
import { DriverMonitoringPanel } from "@/components/monitoring/driver-monitoring-panel";

const PhaserGame = dynamic(
  () => import("@/app/simulator/phaser-game"),
  { 
    ssr: false, 
    loading: () => (
      <div className="w-full max-w-[800px] aspect-[4/3] bg-muted animate-pulse rounded-md flex items-center justify-center text-muted-foreground">
        Loading Simulator Engine...
      </div>
    ) 
  }
);

export default function SimulatorPage() {
  const gameRef = useRef<PhaserGameHandle>(null);
  const videoRef = useRef<HTMLVideoElement>(null); // Shared video ref
  
  const [speed, setSpeed] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  
  const { stream, status, error, startCamera, stopCamera } = useCamera();
  const monitoring = useFaceMonitoring(videoRef);

  const SPEED_LIMIT = 20;

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${time}] ${msg}`, ...prev].slice(0, 8));
  };

  const handleAccelerate = () => {
    const newSpeed = speed + 5;
    setSpeed(newSpeed);
    gameRef.current?.setSpeed(newSpeed);
    if (newSpeed > SPEED_LIMIT) addLog(`⚠️ WARNING: Overspeed (${newSpeed} km/h)`);
    else addLog(`Accelerated to ${newSpeed} km/h`);
  };

  const handleDecelerate = () => {
    const newSpeed = Math.max(0, speed - 5);
    setSpeed(newSpeed);
    gameRef.current?.setSpeed(newSpeed);
    addLog(`Decelerated to ${newSpeed} km/h`);
  };

  const handleTriggerOverspeed = () => {
    const newSpeed = 25;
    setSpeed(newSpeed);
    gameRef.current?.setSpeed(newSpeed);
    addLog(`🚨 TEST EVENT: Triggered overspeed (${newSpeed} km/h)`);
  };

  const handleTriggerCollision = () => {
    gameRef.current?.triggerCollision();
    addLog(`💥 TEST EVENT: Triggered potential collision`);
  };

  const handleStartCamera = async () => {
  addLog(`📹 Requesting camera access...`);
  await startCamera();
  
  // Preload vision model in background while camera is starting
  addLog(`🧠 Preloading vision model...`);
  monitoring.preload();
};

  const handleStopCamera = () => {
    stopCamera();
    if (monitoring.isRunning) monitoring.stop();
    addLog(`📹 Camera stopped`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Driving Simulator</h1>
        <p className="text-muted-foreground">2D Phaser simulation, telemetry, camera, and vision monitoring.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Game Canvas Area */}
        <div className="lg:col-span-2 flex flex-col items-center">
          <PhaserGame ref={gameRef} />
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Simulation Canvas (800x600). Visual speed scales with telemetry.
          </p>
        </div>

        {/* Controls & Telemetry Area */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Speed</CardTitle>
              <Gauge className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${speed > SPEED_LIMIT ? 'text-red-500' : 'text-foreground'}`}>
                {speed} <span className="text-lg font-normal text-muted-foreground">km/h</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Limit: {SPEED_LIMIT} km/h</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">Simulation Controls</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <Button onClick={handleAccelerate} variant="outline" className="w-full">
                <Play className="mr-2 h-4 w-4" /> Accel (+5)
              </Button>
              <Button onClick={handleDecelerate} variant="outline" className="w-full">
                <Square className="mr-2 h-4 w-4" /> Decel (-5)
              </Button>
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" /> Test Event Triggers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button onClick={handleTriggerOverspeed} variant="destructive" className="w-full">
                Trigger Overspeed (25 km/h)
              </Button>
              <Button onClick={handleTriggerCollision} variant="destructive" className="w-full">
                Trigger Collision
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Camera & Vision Monitoring Panels */}
      <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
        <CameraPreview
          videoRef={videoRef}
          stream={stream}
          status={status}
          error={error}
          onStart={handleStartCamera}
          onStop={handleStopCamera}
        />
        <DriverMonitoringPanel
          state={monitoring}
          onStart={monitoring.start}
          onStop={monitoring.stop}
        />
      </div>

      {/* Event Log */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-blue-500" /> System Event Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">No events recorded yet. Use the controls above.</p>
          ) : (
            <ul className="text-xs font-mono space-y-1 max-h-40 overflow-y-auto">
              {logs.map((log, i) => (
                <li key={i} className="text-muted-foreground">{log}</li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}