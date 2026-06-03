"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ParticleExperience } from "@/components/scene/ParticleExperience";

export function SceneCanvas() {
  return (
    <Canvas
      className="absolute inset-0"
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      camera={{ fov: 50, position: [0, 0, 6.1], near: 0.1, far: 100 }}
    >
      <color attach="background" args={["#02040a"]} />
      <Suspense fallback={null}>
        <ParticleExperience />
      </Suspense>
    </Canvas>
  );
}