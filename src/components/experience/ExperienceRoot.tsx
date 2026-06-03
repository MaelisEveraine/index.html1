"use client";

import { SceneCanvas } from "@/components/scene/SceneCanvas";
import { InstructionOverlay } from "@/components/ui/InstructionOverlay";
import { useWebcamHandTracking } from "@/hooks/useWebcamHandTracking";

export function ExperienceRoot() {
  const { frame } = useWebcamHandTracking();

  return (
    <main className="relative h-dvh w-screen overflow-hidden bg-black">
      <div className="pointer-events-none absolute inset-0 bg-hero-radial" />
      <SceneCanvas />
      <InstructionOverlay />

      <div className="pointer-events-none absolute left-0 top-0 z-30 p-3 text-xs text-white/60">
        camera: {frame.permission} {frame.error ? `— ${frame.error}` : ""}
      </div>
    </main>
  );
}