"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { ChaosField } from "@/components/scrolly/ChaosField";
import { ClaritySection } from "@/components/scrolly/ClaritySection";
import WhiteoutTransition from "@/components/scrolly/WhiteoutTransition";

interface ChaosFieldSceneProps {
    progress: number;
}

export function ChaosFieldScene({ progress }: ChaosFieldSceneProps) {
    const showChaos = progress < 0.3;
    const showClarity = progress >= 0.3;
    const transitionActive = progress > 0.25 && progress < 0.35;

    return (
        <>
            <Canvas
                camera={{ position: [0, 0, 10], fov: 75 }}
                className="w-full h-full"
            >
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />

                {showChaos && <ChaosField />}
                {showClarity && <ClaritySection progress={(progress - 0.3) / 0.7} />}

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate={false}
                />
            </Canvas>

            <WhiteoutTransition active={transitionActive} />
        </>
    );
}
