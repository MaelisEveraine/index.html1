"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";

type Point3 = { x: number; y: number; z: number };

export type HandFrame = {
  timestamp: number;
  indexTipNorm: Point3 | null; // normalized 0..1 (x,y), z approx
  indexTipSmoothed: Point3 | null;
  velocity: Point3 | null;
  permission: "pending" | "granted" | "denied";
  error: string | null;
};

const TASKS_BASE =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/wasm";
const MODEL_PATH =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

function expSmooth(a: number, b: number, lambda: number, dt: number) {
  return a + (b - a) * (1 - Math.exp(-lambda * dt));
}

export function useWebcamHandTracking() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const rafRef = useRef<number | null>(null);

  const prevRef = useRef<{ p: Point3; t: number } | null>(null);
  const smoothRef = useRef<Point3 | null>(null);
  const lastVideoTimeRef = useRef(-1);

  const [frame, setFrame] = useState<HandFrame>({
    timestamp: 0,
    indexTipNorm: null,
    indexTipSmoothed: null,
    velocity: null,
    permission: "pending",
    error: null,
  });

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;

    if (streamRef.current) {
      for (const t of streamRef.current.getTracks()) t.stop();
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    if (landmarkerRef.current) {
      landmarkerRef.current.close();
      landmarkerRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    const video = videoRef.current;
    const landmarker = landmarkerRef.current;

    if (!video || !landmarker) {
      rafRef.current = requestAnimationFrame(tick);
      return;
    }

    if (video.readyState < 2 || video.videoWidth === 0) {
      rafRef.current = requestAnimationFrame(tick);
      return;
    }

    const now = performance.now();

    if (video.currentTime === lastVideoTimeRef.current) {
      rafRef.current = requestAnimationFrame(tick);
      return;
    }
    lastVideoTimeRef.current = video.currentTime;

    try {
      const result = landmarker.detectForVideo(video, now);
      const landmarks = result.landmarks?.[0] ?? null;

      let indexTip: Point3 | null = null;
      if (landmarks && landmarks[8]) {
        indexTip = { x: landmarks[8].x, y: landmarks[8].y, z: landmarks[8].z };
      }

      let smoothed: Point3 | null = smoothRef.current;
      let velocity: Point3 | null = null;

      if (indexTip) {
        const prev = prevRef.current;
        const dt = prev ? Math.max((now - prev.t) / 1000, 1 / 240) : 1 / 60;

        if (!smoothed) smoothed = indexTip;
        else {
          smoothed = {
            x: expSmooth(smoothed.x, indexTip.x, 18, dt),
            y: expSmooth(smoothed.y, indexTip.y, 18, dt),
            z: expSmooth(smoothed.z, indexTip.z, 18, dt),
          };
        }

        if (prev) {
          velocity = {
            x: (indexTip.x - prev.p.x) / dt,
            y: (indexTip.y - prev.p.y) / dt,
            z: (indexTip.z - prev.p.z) / dt,
          };
        } else velocity = { x: 0, y: 0, z: 0 };

        prevRef.current = { p: indexTip, t: now };
        smoothRef.current = smoothed;
      } else {
        prevRef.current = null;
        smoothRef.current = smoothed;
      }

      setFrame((f) => ({
        ...f,
        timestamp: now,
        indexTipNorm: indexTip,
        indexTipSmoothed: smoothed,
        velocity,
      }));
    } catch (e) {
      setFrame((f) => ({
        ...f,
        error: e instanceof Error ? e.message : "Hand tracking failed",
      }));
    }

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const start = useCallback(async () => {
    stop();
    setFrame((f) => ({ ...f, permission: "pending", error: null }));

    try {
      const video = document.createElement("video");
      video.playsInline = true;
      video.muted = true;
      video.autoplay = true;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
      });

      streamRef.current = stream;
      video.srcObject = stream;
      await video.play();
      videoRef.current = video;

      setFrame((f) => ({ ...f, permission: "granted" }));

      const vision = await FilesetResolver.forVisionTasks(TASKS_BASE);
      const landmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: { modelAssetPath: MODEL_PATH, delegate: "GPU" },
        runningMode: "VIDEO",
        numHands: 2,
        minHandDetectionConfidence: 0.6,
        minHandPresenceConfidence: 0.58,
        minTrackingConfidence: 0.55,
      });

      landmarkerRef.current = landmarker;

      rafRef.current = requestAnimationFrame(tick);
    } catch (e) {
      const denied =
        e instanceof DOMException &&
        (e.name === "NotAllowedError" || e.name === "SecurityError");

      setFrame((f) => ({
        ...f,
        permission: denied ? "denied" : "pending",
        error: denied
          ? "Camera permission denied."
          : e instanceof Error
            ? e.message
            : "Unable to access camera.",
      }));

      stop();
    }
  }, [stop, tick]);

  useEffect(() => {
    void start();
    return () => stop();
  }, [start, stop]);

  return { frame, start, stop };
}