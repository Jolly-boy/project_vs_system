"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { calculateEAR, LEFT_EYE, RIGHT_EYE } from "@/lib/vision/eye-aspect-ratio";
import { estimateHeadPose } from "@/lib/vision/head-pose";

export interface FaceMonitoringState {
  isModelLoaded: boolean;
  isLoading: boolean;
  loadingProgress: string;
  isRunning: boolean;
  faceDetected: boolean;
  earLeft: number | null;
  earRight: number | null;
  yaw: number | null;
  pitch: number | null;
  error: string | null;
}

const INITIAL_STATE: FaceMonitoringState = {
  isModelLoaded: false,
  isLoading: false,
  loadingProgress: "",
  isRunning: false,
  faceDetected: false,
  earLeft: null,
  earRight: null,
  yaw: null,
  pitch: null,
  error: null,
};

export function useFaceMonitoring(videoRef: React.RefObject<HTMLVideoElement | null>) {
  const [state, setState] = useState<FaceMonitoringState>(INITIAL_STATE);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const lastVideoTimeRef = useRef(-1);
  const lastUpdateTimeRef = useRef(0);
  const isPreloadingRef = useRef(false);

  const initModel = useCallback(async () => {
    if (faceLandmarkerRef.current || isPreloadingRef.current) {
      return true;
    }

    isPreloadingRef.current = true;
    
    try {
      setState(prev => ({ 
        ...prev, 
        error: null, 
        isLoading: true,
        loadingProgress: "Loading vision engine..." 
      }));
      
      setState(prev => ({ ...prev, loadingProgress: "Loading vision engine (1/3)..." }));
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      
      setState(prev => ({ ...prev, loadingProgress: "Downloading face model (2/3)... This may take a few seconds." }));
      
      const landmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          delegate: "GPU" // Falls back to CPU automatically if GPU is unavailable
        },
        runningMode: "VIDEO",
        numFaces: 1,
      });

      setState(prev => ({ ...prev, loadingProgress: "Initializing model (3/3)..." }));

      faceLandmarkerRef.current = landmarker;
      setState(prev => ({ 
        ...prev, 
        isModelLoaded: true, 
        isLoading: false,
        loadingProgress: ""
      }));
      
      console.log("✅ MediaPipe model loaded successfully");
      return true;
    } catch (err) {
      console.error("❌ MediaPipe init error:", err);
      isPreloadingRef.current = false;
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        loadingProgress: "",
        error: "Failed to load vision model. Please check your internet connection and try again." 
      }));
      return false;
    }
  }, []);

  const preload = useCallback(async () => {
    if (!faceLandmarkerRef.current && !isPreloadingRef.current) {
      await initModel();
    }
  }, [initModel]);

  const detect = useCallback(() => {
    const video = videoRef.current;
    const landmarker = faceLandmarkerRef.current;

    // STRICT CHECKS: Ensure video is ready, playing, and has valid dimensions
    if (!video || !landmarker || video.readyState < 2 || video.videoWidth === 0 || video.paused) {
      rafIdRef.current = requestAnimationFrame(detect);
      return;
    }

    // Only process if the video time has advanced (new frame available)
    if (video.currentTime !== lastVideoTimeRef.current) {
      lastVideoTimeRef.current = video.currentTime;
      
      try {
        const startTimeMs = performance.now();
        const results = landmarker.detectForVideo(video, startTimeMs);

        // Throttle UI state updates to ~10fps to prevent React re-render lag
        const now = performance.now();
        if (now - lastUpdateTimeRef.current > 100) {
          lastUpdateTimeRef.current = now;

          if (results.faceLandmarks && results.faceLandmarks.length > 0) {
            const landmarks = results.faceLandmarks[0];
            const earLeft = calculateEAR(landmarks, LEFT_EYE);
            const earRight = calculateEAR(landmarks, RIGHT_EYE);
            const { yaw, pitch } = estimateHeadPose(landmarks);

            setState(prev => ({
              ...prev,
              faceDetected: true,
              earLeft,
              earRight,
              yaw,
              pitch,
            }));
          } else {
            setState(prev => ({
              ...prev,
              faceDetected: false,
              earLeft: null,
              earRight: null,
              yaw: null,
              pitch: null,
            }));
          }
        }
      } catch (err) {
        // Log the actual error to the console for debugging, but don't crash the loop
        console.error("MediaPipe detection error:", err);
      }
    }

    rafIdRef.current = requestAnimationFrame(detect);
  }, [videoRef]);

  const start = useCallback(async () => {
    if (!faceLandmarkerRef.current) {
      const success = await initModel();
      if (!success) return;
    }
    
    setState(prev => ({ ...prev, isRunning: true }));
    lastVideoTimeRef.current = -1;
    rafIdRef.current = requestAnimationFrame(detect);
  }, [initModel, detect]);

  const stop = useCallback(() => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    setState(prev => ({ ...prev, isRunning: false }));
  }, []);

  useEffect(() => {
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (faceLandmarkerRef.current) {
        faceLandmarkerRef.current.close();
        faceLandmarkerRef.current = null;
      }
    };
  }, []);

  return { ...state, start, stop, preload };
}