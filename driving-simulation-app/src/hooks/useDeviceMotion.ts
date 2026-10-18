import { useEffect, useState } from 'react';

export function useDeviceMotion() {
  const [motion, setMotion] = useState<{ alpha: number | null; beta: number | null; gamma: number | null }>({
    alpha: null,
    beta: null,
    gamma: null,
  });

  useEffect(() => {
    function handleOrientation(event: DeviceOrientationEvent) {
      setMotion({
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma,
      });
    }

    window.addEventListener('deviceorientation', handleOrientation);
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  return motion;
}