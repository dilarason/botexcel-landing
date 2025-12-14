'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const GRID_SIZE = 20;
const CELL_SIZE = 0.5;

export function ClaritySection({ progress }: { progress: number }) {
  const gridRef = useRef<THREE.Group>(null!);

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
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * GRID_SIZE * 0.8,
            Math.sin(progress * Math.PI + i) * 2,
            (Math.random() - 0.5) * GRID_SIZE * 0.8
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
