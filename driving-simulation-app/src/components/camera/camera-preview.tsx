"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, CameraOff, AlertCircle, ShieldAlert, Loader2 } from "lucide-react";
import type { CameraStatus } from "@/hooks/use-camera";

interface CameraPreviewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>; // Added videoRef prop
  stream: MediaStream | null;
  status: CameraStatus;
  error: string | null;
  onStart: () => void;
  onStop: () => void;
}

export function CameraPreview({ videoRef, stream, status, error, onStart, onStop }: CameraPreviewProps) {
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    } else if (videoRef.current && !stream) {
      videoRef.current.srcObject = null;
    }
  }, [stream, videoRef]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Camera className="h-4 w-4" />
          Driver Camera
          <StatusBadge status={status} />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="relative aspect-video bg-black rounded-md overflow-hidden">
          {status === "active" && stream ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              {status === "requesting" ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p className="text-sm">Requesting camera access...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <CameraOff className="h-8 w-8" />
                  <p className="text-sm">Camera inactive</p>
                </div>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
              <div className="text-sm text-destructive">
                <p className="font-medium">Camera Error</p>
                <p className="text-xs mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {status === "secure-context-required" && (
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
            <div className="flex items-start gap-2">
              <ShieldAlert className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-700 dark:text-yellow-400">
                <p className="font-medium">Secure Connection Required</p>
                <p className="text-xs mt-1">Camera access requires HTTPS or localhost.</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {status === "active" ? (
            <Button onClick={onStop} variant="outline" className="w-full">
              <CameraOff className="mr-2 h-4 w-4" /> Stop Camera
            </Button>
          ) : (
            <Button onClick={onStart} disabled={status === "requesting"} className="w-full">
              {status === "requesting" ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Requesting...</>
              ) : (
                <><Camera className="mr-2 h-4 w-4" /> Start Camera</>
              )}
            </Button>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Video is processed locally. No data is uploaded to any server.
        </p>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: CameraStatus }) {
  const config = {
    idle: { label: "Inactive", color: "bg-gray-500" },
    requesting: { label: "Requesting", color: "bg-yellow-500" },
    active: { label: "Active", color: "bg-green-500" },
    error: { label: "Error", color: "bg-red-500" },
    unsupported: { label: "Unsupported", color: "bg-red-500" },
    "permission-denied": { label: "Denied", color: "bg-red-500" },
    "secure-context-required": { label: "HTTPS Required", color: "bg-yellow-500" },
  };
  const { label, color } = config[status];
  return (
    <span className="ml-auto flex items-center gap-1.5 text-xs font-normal">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      {label}
    </span>
  );
}