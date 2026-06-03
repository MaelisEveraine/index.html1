"use client";

export function ExperienceRoot() {
  return (
    <main style={{ width: "100vw", height: "100vh", background: "black", color: "white" }}>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "0.08em" }}>
            Gesture Particle Website
          </h1>
          <p style={{ marginTop: 12, opacity: 0.85 }}>
            Next: we’ll add the camera + particles.
          </p>
        </div>
      </div>
    </main>
  );
}