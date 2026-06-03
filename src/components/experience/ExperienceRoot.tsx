"use client";

import { SceneCanvas } from "@/components/scene/SceneCanvas";
import { InstructionOverlay } from "@/components/ui/InstructionOverlay";

export function ExperienceRoot() {
  return (
    <main className="relative h-dvh w-screen overflow-hidden bg-black">
      <div className="pointer-events-none absolute inset-0 bg-hero-radial" />
      <SceneCanvas />
      <InstructionOverlay />
    </main>
  );
}