import { Canvas, useThree } from "@react-three/fiber";
import { useRef, useEffect, SetStateAction, useState } from "react";
import * as THREE from "three";
import CharacterLoader from "../character/CharacterLoader";
import { OrbitControls } from "@react-three/drei";
import FloorMarks from "./FloorMarks";
import { AnimationState, FighterInterface } from "../../types/types";

interface ArenaProps {
  playerFighter: FighterInterface;
  opponentFighter: FighterInterface;
  playerPosition: number;
  opponentPosition: number;
  playerAnimationState: AnimationState;
  opponentAnimationState: AnimationState;
  setLoader: React.Dispatch<
    SetStateAction<{ playerIsReady: boolean; opponentIsReady: boolean }>
  >;
}

function CameraSetup() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 2, 9);
  }, [camera]);
  return null;
}

function ArenaContent(props: ArenaProps) {
  const playerRef: React.MutableRefObject<THREE.Group | null> =
    useRef<THREE.Group | null>(null);
  const opponentRef: React.MutableRefObject<THREE.Group | null> =
    useRef<THREE.Group | null>(null);
  const [isFloorLoaded, setIsFloorLoaded] = useState<boolean>(false);
  const [currentTargetPos, setCurrentTargetPos] = useState<THREE.Vector3>(
    new THREE.Vector3(0, 0, 0)
  );
  const playerPlayAnimation = useRef<(arg0: AnimationState) => void>(() => {});
  const opponentPlayAnimation = useRef<(arg0: AnimationState) => void>(
    () => {}
  );

  const playerMovePosition = useRef<(arg0: number) => void>(() => {});
  const opponentMovePosition = useRef<(arg0: number) => void>(() => {});
  useEffect(() => {
    if (props.playerAnimationState) {
      playerPlayAnimation.current(props.playerAnimationState);
    }
  }, [props.playerAnimationState]);

  useEffect(() => {
    if (props.opponentAnimationState) {
      opponentPlayAnimation.current(props.opponentAnimationState);
    }
  }, [props.opponentAnimationState]);

  useEffect(() => {
    playerMovePosition.current(props.playerPosition);
    const newPos = new THREE.Vector3(props.playerPosition);
    setCurrentTargetPos(newPos);
  }, [props.playerPosition]);

  useEffect(() => {
    opponentMovePosition.current(props.opponentPosition);
  }, [props.opponentPosition]);

  return (
    <>
      <OrbitControls target={currentTargetPos} maxPolarAngle={Math.PI / 2} />
      <CameraSetup />
      <FloorMarks setIsFloorLoaded={setIsFloorLoaded} />
      {isFloorLoaded && (
        <>
          <CharacterLoader
            fighterId={props.playerFighter.id}
            characterRef={playerRef}
            position={[props.playerPosition, 0, 0]}
            visuals={props.playerFighter.visuals}
            equipment={props.playerFighter.equipments}
            setPlayAnimation={(fn) => (playerPlayAnimation.current = fn)}
            setLoader={props.setLoader}
            isPlayer={true}
            setMovePosition={(fn) => (playerMovePosition.current = fn)}
          />
          <CharacterLoader
            fighterId={props.opponentFighter.id}
            characterRef={opponentRef}
            position={[props.opponentPosition, 0, 0]}
            visuals={props.opponentFighter.visuals}
            equipment={props.opponentFighter.equipments}
            setPlayAnimation={(fn) => (opponentPlayAnimation.current = fn)}
            setLoader={props.setLoader}
            isPlayer={false}
            setMovePosition={(fn) => (opponentMovePosition.current = fn)}
          />
        </>
      )}
    </>
  );
}

export function Arena(props: ArenaProps) {
  return (
    <div className="flex-1">
      <Canvas>
        <ambientLight intensity={0.9} />
        <spotLight
          position={[0, 9, 0]}
          intensity={80}
          angle={0.9}
          penumbra={0.1}
          castShadow={true}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={10}
          shadow-bias={-0.0001}
          shadow-camera-fov={50}
        />
        <ArenaContent
          playerFighter={props.playerFighter}
          opponentFighter={props.opponentFighter}
          playerPosition={props.playerPosition}
          opponentPosition={props.opponentPosition}
          playerAnimationState={props.playerAnimationState}
          opponentAnimationState={props.opponentAnimationState}
          setLoader={props.setLoader}
        />
      </Canvas>
    </div>
  );
}
