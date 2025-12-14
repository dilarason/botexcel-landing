"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ChaosFieldProps {
  /** Parçacık sayısı (default: 1500) */
  count?: number;
}

/**
 * ChaosField
 * - Stabil parçacık alanı
 * - R3F 9.x için bufferAttribute -> args={[positions, 3]} kullanır
 */
export function ChaosField({ count = 1500 }: ChaosFieldProps) {
  const pointsRef = useRef<THREE.Points | null>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      arr[i3 + 0] = (Math.random() - 0.5) * 10;
      arr[i3 + 1] = (Math.random() - 0.5) * 10;
      arr[i3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.05;
      pointsRef.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          // THREE.BufferAttribute(positions, 3)
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        sizeAttenuation
        color="#4ade80"
        opacity={0.9}
        transparent
      />
    </points>
  );
}
