// MediaPipe FaceMesh landmark indices for eyes
export const LEFT_EYE = {
  p1: 33,   // outer corner
  p2: 160,  // top outer
  p3: 158,  // top inner
  p4: 133,  // inner corner
  p5: 153,  // bottom inner
  p6: 144,  // bottom outer
};

export const RIGHT_EYE = {
  p1: 362,  // inner corner
  p2: 385,  // top inner
  p3: 387,  // top outer
  p4: 263,  // outer corner
  p5: 373,  // bottom outer
  p6: 380,  // bottom inner
};

interface Landmark {
  x: number;
  y: number;
  z?: number;
}

function distance(p1: Landmark, p2: Landmark): number {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y, (p1.z || 0) - (p2.z || 0));
}

/**
 * Calculates the Eye Aspect Ratio (EAR) for a given eye.
 * EAR = (||p2-p6|| + ||p3-p5||) / (2 * ||p1-p4||)
 * A lower EAR indicates the eye is closed. Typical threshold is ~0.2.
 */
export function calculateEAR(landmarks: Landmark[], indices: typeof LEFT_EYE): number {
  const p1 = landmarks[indices.p1];
  const p2 = landmarks[indices.p2];
  const p3 = landmarks[indices.p3];
  const p4 = landmarks[indices.p4];
  const p5 = landmarks[indices.p5];
  const p6 = landmarks[indices.p6];

  if (!p1 || !p2 || !p3 || !p4 || !p5 || !p6) return 0;

  const vertical1 = distance(p2, p6);
  const vertical2 = distance(p3, p5);
  const horizontal = distance(p1, p4);

  if (horizontal === 0) return 0;
  
  return (vertical1 + vertical2) / (2.0 * horizontal);
}