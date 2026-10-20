interface Landmark {
  x: number;
  y: number;
  z?: number;
}

function distance(p1: Landmark, p2: Landmark): number {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y, (p1.z || 0) - (p2.z || 0));
}

/**
 * Estimates head yaw and pitch using 2D facial landmarks.
 * This is a simplified geometric approach suitable for a prototype.
 */
export function estimateHeadPose(landmarks: Landmark[]): { yaw: number; pitch: number } {
  const noseTip = landmarks[1];
  const leftEyeCorner = landmarks[33];
  const rightEyeCorner = landmarks[263];
  const chin = landmarks[152];

  if (!noseTip || !leftEyeCorner || !rightEyeCorner || !chin) {
    return { yaw: 0, pitch: 0 };
  }

  // Yaw (Left/Right turn): Compare distance from nose to left vs right eye corners
  const distLeft = distance(noseTip, leftEyeCorner);
  const distRight = distance(noseTip, rightEyeCorner);
  const yawRatio = (distLeft - distRight) / (distLeft + distRight);
  const yaw = yawRatio * 45; // Map ratio to approximate degrees

  // Pitch (Up/Down tilt): Compare nose position relative to eyes and chin
  const eyeCenterY = (leftEyeCorner.y + rightEyeCorner.y) / 2;
  const distNoseToEyes = noseTip.y - eyeCenterY;
  const distEyesToChin = chin.y - eyeCenterY;
  
  if (distEyesToChin === 0) return { yaw, pitch: 0 };

  const pitchRatio = distNoseToEyes / distEyesToChin;
  const pitch = (pitchRatio - 0.5) * 60; // Map ratio to approximate degrees

  return { yaw, pitch };
}