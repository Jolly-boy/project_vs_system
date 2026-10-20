"use client";

import { useState, useCallback, useRef, useEffect } from "react";

export type CameraStatus = 
  | "idle" 
  | "requesting" 
  | "active" 
  | "error" 
  | "unsupported"
  | "permission-denied"
  | "secure-context-required";

export interface UseCameraReturn {
  stream: MediaStream | null;
  status: CameraStatus;
  error: string | null;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
}

export function useCamera(): UseCameraReturn {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [status, setStatus] = useState<CameraStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setStream(null);
    setStatus("idle");
    setError(null);
  }, []);

  const startCamera = useCallback(async () => {
    // Check if running in a secure context (HTTPS or localhost)
    if (typeof window !== "undefined" && !window.isSecureContext) {
      setStatus("secure-context-required");
      setError("Camera requires HTTPS or localhost. Please access the app via a secure connection.");
      return;
    }

    // Check if getUserMedia is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setStatus("unsupported");
      setError("Camera API is not supported in this browser.");
      return;
    }

    setStatus("requesting");
    setError(null);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
        audio: false,
      });

      streamRef.current = mediaStream;
      setStream(mediaStream);
      setStatus("active");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      
      if (err instanceof DOMException) {
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          setStatus("permission-denied");
          setError("Camera permission was denied. Please enable camera access in your browser settings and try again.");
        } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
          setStatus("error");
          setError("No camera device found. Please connect a camera and try again.");
        } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
          setStatus("error");
          setError("Camera is already in use by another application. Please close other apps using the camera.");
        } else if (err.name === "OverconstrainedError" || err.name === "ConstraintNotSatisfiedError") {
          setStatus("error");
          setError("Camera does not support the requested configuration. Please try a different camera.");
        } else {
          setStatus("error");
          setError(`Camera error: ${errorMessage}`);
        }
      } else {
        setStatus("error");
        setError(`Failed to access camera: ${errorMessage}`);
      }
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return {
    stream,
    status,
    error,
    startCamera,
    stopCamera,
  };
}