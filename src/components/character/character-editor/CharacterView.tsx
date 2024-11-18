import { Canvas, useThree } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { OrbitControls } from "@react-three/drei";
import CharacterLoader from "../CharacterLoader";
import {
  CharacterCustomizationInterface,
  VisualsInterface,
} from "../../../types/types";
// Camera Setup
function CameraSetup() {
  const { camera } = useThree();
  camera.position.set(0, 2.5, 2);

  return null;
}

interface CharacterViewProps extends CharacterCustomizationInterface {
  onControlsTargetChange: (
    position: THREE.Vector3,
    rotation: THREE.Euler
  ) => void;
  controlsPosition: THREE.Vector3;
}

export default function CharacterView({
  skinColor,
  hairType,
  hairColor,
  eyesType,
  eyesColor,
  mouthType,
  controlsPosition,
  onControlsTargetChange,
}: CharacterViewProps) {
  const characterRef = useRef<THREE.Group | null>(null);

  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const [areControlsReady, setAreControlsReady] = useState(false);

  const visuals = {
    skinColor: skinColor,
    hairType: hairType,
    hairColor: hairColor,
    eyesType: eyesType,
    eyesColor: eyesColor,
    mouthType: mouthType,
  } as VisualsInterface;

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.target.set(
        controlsPosition.x,
        controlsPosition.y,
        controlsPosition.z
      );

      controlsRef.current.update();
    }
  }, [controlsPosition, areControlsReady, onControlsTargetChange]);
  return (
    <div className="flex  w-full h-1/2 justify-center items-center  cursor-move">
      <Canvas shadows>
        <ambientLight intensity={0.9} />
        <spotLight
          position={[1, 3.5, 2]}
          intensity={9}
          angle={0.9}
          penumbra={0.1}
          castShadow={true}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={10}
          shadow-camera-fov={50}
        />
        {areControlsReady && (
          <CharacterLoader
            fighterId={-1}
            equipment={[]}
            position={[0, 0, 0]}
            characterRef={characterRef}
            visuals={visuals}
          />
        )}

        <CameraSetup />
        <OrbitControls
          ref={(ref) => {
            controlsRef.current = ref;
            if (ref) {
              setAreControlsReady(true);
            }
          }}
        />
      </Canvas>
    </div>
  );
}
