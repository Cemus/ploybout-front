import { Canvas } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";
import CharacterLoader from "./CharacterLoader";
import { useRef } from "react";
import * as THREE from "three";
import { FighterInterface } from "../../types/types";

interface CharacterCanvasProps {
  fighter: FighterInterface;
  shot: "close" | "full";
}

function CameraSetup({ shot }: { shot: "close" | "full" }) {
  const { camera } = useThree();

  const posY = shot === "close" ? 2.5 : 1.7;
  const posZ = shot === "close" ? 1.6 : 3;
  camera.position.x = -0.05;
  camera.position.y = posY;
  camera.position.z = posZ;

  return null;
}

export default function CharacterCanvas({
  fighter,
  shot,
}: CharacterCanvasProps) {
  const characterRef: React.MutableRefObject<THREE.Group | null> =
    useRef<THREE.Group | null>(null);

  return (
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
      <CharacterLoader
        fighterId={fighter.id}
        position={[0, 0, 0]}
        characterRef={characterRef}
        visuals={fighter.visuals}
        equipment={fighter.equipment}
      />
      <CameraSetup shot={shot} />
    </Canvas>
  );
}
