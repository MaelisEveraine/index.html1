export const GESTURES = {
  OPEN_PALM: "open_palm",
  INDEX: "index",
  PEACE: "peace",
  FIST: "fist",
  HEART: "heart",
  CIRCLE: "circle",
  SWIPE: "swipe",
  STILL: "still",
} as const;

export type GestureLabel = (typeof GESTURES)[keyof typeof GESTURES];
