'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const GRID_SIZE = 20;
const CELL_SIZE = 0.5;

const pseudoRand = (index: number, seed: number) => {
  const x = Math.sin(index * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

export function ClaritySection({ progress }: { progress: number }) {
  const gridRef = useRef<THREE.Group>(null!);
  const positions = useMemo(
    () =>
      Array.from({ length: 5 }).map((_, i) => {
        const px = (pseudoRand(i, 1) - 0.5) * GRID_SIZE * 0.8;
        const pz = (pseudoRand(i, 2) - 0.5) * GRID_SIZE * 0.8;
        return { px, pz };
      }),
    [],
  );

  useFrame(() => {
    if (!gridRef.current) return;
    gridRef.current.rotation.x = Math.PI * 0.5 - progress * 0.3;
    gridRef.current.position.y = -5 + progress * 3;
  });

  return (
    <group ref={gridRef}>
      <gridHelper
        args={[GRID_SIZE, GRID_SIZE / CELL_SIZE, 0x10b981, 0x1e3a8a]}
        rotation={[0, 0, 0]}
      />
      {positions.map(({ px, pz }, i) => (
        <mesh
          key={i}
          position={[
            px,
            Math.sin(progress * Math.PI + i) * 2,
            pz
          ]}
        >
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#10b981"
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}
