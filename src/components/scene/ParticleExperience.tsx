"use client";

import { useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { useRef } from "react";
import { Group } from "three";

export function ParticleExperience() {
  const g = useRef<Group>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (g.current) {
      g.current.rotation.y = Math.sin(t * 0.08) * 0.06;
      g.current.rotation.x = Math.cos(t * 0.06) * 0.03;
    }
  });

  return (
    <group ref={g}>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 3.5]} intensity={0.8} color="#89f4ff" />
      <pointLight position={[0, 1.25, 2.75]} intensity={0.35} color="#c7ff8a" />

      <mesh>
        <sphereGeometry args={[1.2, 48, 48]} />
        <meshStandardMaterial
          color="#69E6FF"
          emissive="#69E6FF"
          emissiveIntensity={0.6}
        />
      </mesh>

      <EffectComposer multisampling={0}>
        <Bloom
          intensity={1.1}
          luminanceThreshold={0.08}
          luminanceSmoothing={0.22}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.18} darkness={0.36} />
      </EffectComposer>
    </group>
  );
}