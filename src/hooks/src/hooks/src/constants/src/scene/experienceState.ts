export type ShapeMode = "cloud" | "sphere" | "saturn" | "heart";

export type EffectMode =
  | "idle"
  | "morphing"
  | "exploding"
  | "orbiting"
  | "breathing"
  | "scattering"
  | "pulse";

export interface ExperienceState {
  activeShape: ShapeMode;
  targetShape: ShapeMode;
  activeEffect: EffectMode;
  gestureConfidence: number;
  lockedGesture: string | null;
  transitionProgress: number;
  lastGestureAt: number;
  performanceTier: "high" | "medium" | "low";
}

export const INITIAL_EXPERIENCE_STATE: ExperienceState = {
  activeShape: "cloud",
  targetShape: "cloud",
  activeEffect: "idle",
  gestureConfidence: 0,
  lockedGesture: null,
  transitionProgress: 1,
  lastGestureAt: 0,
  performanceTier: "medium",
};
