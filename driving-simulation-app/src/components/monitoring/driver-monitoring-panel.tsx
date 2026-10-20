"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Eye, AlertCircle, Loader2, Download } from "lucide-react";
import type { FaceMonitoringState } from "@/hooks/use-face-monitoring";

interface DriverMonitoringPanelProps {
  state: FaceMonitoringState;
  onStart: () => void;
  onStop: () => void;
}

export function DriverMonitoringPanel({ state, onStart, onStop }: DriverMonitoringPanelProps) {
  const { isModelLoaded, isLoading, loadingProgress, isRunning, faceDetected, earLeft, earRight, yaw, pitch, error } = state;

  // Experimental thresholds
  const EAR_THRESHOLD = 0.2;
  const isBlinking = (earLeft !== null && earLeft < EAR_THRESHOLD) || (earRight !== null && earRight < EAR_THRESHOLD);
  
  const YAW_THRESHOLD = 20; 
  const PITCH_THRESHOLD = 20; 
  const isLookingAway = (yaw !== null && Math.abs(yaw) > YAW_THRESHOLD) || (pitch !== null && Math.abs(pitch) > PITCH_THRESHOLD);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Brain className="h-4 w-4" />
          Driver Monitoring (Vision)
          <span className="ml-auto flex items-center gap-1.5 text-xs font-normal">
            <span className={`h-2 w-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-gray-500'}`} />
            {isRunning ? 'Active' : isLoading ? 'Loading...' : 'Inactive'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Loading State with Progress */}
        {isLoading && (
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-md">
            <div className="flex items-start gap-3">
              <Loader2 className="h-5 w-5 text-blue-600 animate-spin mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Loading Vision Model
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  {loadingProgress}
                </p>
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <Download className="h-3 w-3" />
                  <span>~30MB download (first time only)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-destructive">{error}</p>
              <Button 
                onClick={onStart} 
                variant="outline" 
                size="sm" 
                className="mt-2 w-full"
              >
                Retry Loading
              </Button>
            </div>
          </div>
        )}

        {/* Model Loaded - Show Monitoring UI */}
        {isModelLoaded && !isLoading && (
          <>
            {/* Face Detection Status */}
            <div className="flex items-center justify-between p-2 bg-muted rounded-md">
              <span className="text-sm font-medium">Face Detected</span>
              <span className={`text-sm font-bold ${faceDetected ? 'text-green-600' : 'text-red-500'}`}>
                {faceDetected ? 'Yes' : 'No'}
              </span>
            </div>

            {/* Eye State (EAR) */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Eye className="h-4 w-4" /> Eye State (EAR)
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-muted rounded-md text-center">
                  <p className="text-xs text-muted-foreground">Left Eye</p>
                  <p className={`text-lg font-bold ${isBlinking ? 'text-red-500' : 'text-foreground'}`}>
                    {earLeft !== null ? earLeft.toFixed(3) : '—'}
                  </p>
                </div>
                <div className="p-2 bg-muted rounded-md text-center">
                  <p className="text-xs text-muted-foreground">Right Eye</p>
                  <p className={`text-lg font-bold ${isBlinking ? 'text-red-500' : 'text-foreground'}`}>
                    {earRight !== null ? earRight.toFixed(3) : '—'}
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Status: {faceDetected ? (isBlinking ? 'Eyes Closed / Blinking' : 'Eyes Open') : 'Unknown'}
              </p>
            </div>

            {/* Head Pose */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="text-base">↔️</span> Head Pose (Yaw/Pitch)
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-muted rounded-md text-center">
                  <p className="text-xs text-muted-foreground">Yaw (Left/Right)</p>
                  <p className={`text-lg font-bold ${isLookingAway ? 'text-red-500' : 'text-foreground'}`}>
                    {yaw !== null ? `${yaw.toFixed(1)}°` : '—'}
                  </p>
                </div>
                <div className="p-2 bg-muted rounded-md text-center">
                  <p className="text-xs text-muted-foreground">Pitch (Up/Down)</p>
                  <p className={`text-lg font-bold ${isLookingAway ? 'text-red-500' : 'text-foreground'}`}>
                    {pitch !== null ? `${pitch.toFixed(1)}°` : '—'}
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Status: {faceDetected ? (isLookingAway ? 'Looking Away' : 'Facing Forward') : 'Unknown'}
              </p>
            </div>

            {/* Controls */}
            <div className="flex gap-2 pt-2">
              {isRunning ? (
                <Button onClick={onStop} variant="outline" className="w-full">
                  Stop Monitoring
                </Button>
              ) : (
                <Button onClick={onStart} className="w-full">
                  Start Monitoring
                </Button>
              )}
            </div>
          </>
        )}

        {/* Initial State - Not Loaded, Not Loading */}
        {!isModelLoaded && !isLoading && !error && (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-3">
              Vision model not loaded. Click below to initialize.
            </p>
            <Button onClick={onStart} className="w-full">
              <Brain className="mr-2 h-4 w-4" />
              Initialize Vision Engine
            </Button>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center pt-2 border-t">
          Experimental indicators. Not a medical or certified safety device.
        </p>
      </CardContent>
    </Card>
  );
}