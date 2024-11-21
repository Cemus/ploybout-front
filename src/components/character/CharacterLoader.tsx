import { memo, useCallback, useEffect, useState, SetStateAction } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useFn } from "../../hooks/useFn";
import {
  AnimationState,
  EquipmentInterface,
  VisualsInterface,
} from "../../types/types";

const findEquipment = (
  equipment: EquipmentInterface[],
  type: string,
  fighterId: number
) => {
  let itemFound: string | null = null;
  equipment.forEach((equipment) => {
    if (equipment.equipped === fighterId && equipment.slot === type) {
      itemFound = equipment.itemName.replace(/\s+/g, "").toLowerCase();
    }
  });
  return itemFound;
};

const equipBody = async (
  loader: THREE.Loader,
  character: THREE.Object3D<THREE.Object3DEventMap>,
  itemName: string
) => {
  const armorglb = (await loader.loadAsync(
    `/models/equipment/${itemName}.glb`
  )) as GLTF;
  const body = armorglb.scene.children[0].children[0] as THREE.SkinnedMesh;
  const characterBody = character.getObjectByName("body") as THREE.Object3D;
  const characterBodyChildren = characterBody.children;
  let bodySkeleton = null;

  for (const child of characterBodyChildren) {
    if (child instanceof THREE.SkinnedMesh) {
      bodySkeleton = child.skeleton;
      break;
    }
  }

  characterBody.parent?.remove(characterBody);

  if (body) {
    body.children.forEach((child) => {
      if (child instanceof THREE.SkinnedMesh && bodySkeleton) {
        child.skeleton = bodySkeleton;
        child.position.copy(characterBody.position);
        child.rotation.copy(characterBody.rotation);
        child.scale.copy(characterBody.scale);
      }
    });
    characterBody.children.forEach((child) => {
      if (child instanceof THREE.SkinnedMesh) {
        child?.geometry.dispose();
      }
    });
    character.add(body);
  }
};

const equipHandsOrFeet = async (
  loader: THREE.Loader,
  character: THREE.Object3D<THREE.Object3DEventMap>,
  itemName: string,
  type: string
) => {
  const itemGlb = (await loader.loadAsync(
    `/models/equipment/${itemName}.glb`
  )) as GLTF;
  const item = itemGlb.scene.children[0].children[0] as THREE.SkinnedMesh;
  const mesh =
    type === "hands"
      ? (character.getObjectByName("hands") as THREE.SkinnedMesh)
      : (character.getObjectByName("feet") as THREE.SkinnedMesh);
  if (mesh) {
    mesh?.parent?.remove(mesh);
    mesh.geometry.dispose();
  }
  if (item) {
    item.skeleton = mesh.skeleton;
    character.add(item);
  }
};

const equipWeapon = async (
  loader: THREE.Loader,
  character: THREE.Object3D<THREE.Object3DEventMap>,
  itemName: string
) => {
  const weaponGlb = (await loader.loadAsync(
    `/models/weapons/${itemName}.glb`
  )) as GLTF;
  const weapon = weaponGlb.scene.children[0] as THREE.Mesh;
  const emptyHand = character.getObjectByName("mixamorigRightHand");
  if (emptyHand) {
    emptyHand.attach(weapon);
  }
};

const loadCharacterModel = async (
  fighterId: number,
  characterGroup: THREE.Group,
  visuals: VisualsInterface,
  equipment: EquipmentInterface[]
) => {
  const loader = new GLTFLoader();
  const textureLoader = new THREE.TextureLoader();

  try {
    // Character
    const characterGlb = await loader.loadAsync("/models/player/player.glb");
    const character = characterGlb.scene.children[0];
    const skinMaterial = new THREE.MeshToonMaterial({
      color: `${visuals.skinColor}`,
    });

    if (fighterId !== -1) {
      //body
      const equipmentBody = findEquipment(equipment, "body", fighterId);
      if (equipmentBody) {
        await equipBody(loader, character, equipmentBody);
      }
      //gloves
      const equipmentGloves = findEquipment(equipment, "hands", fighterId);
      if (equipmentGloves) {
        await equipHandsOrFeet(loader, character, equipmentGloves, "hands");
      }

      //feet
      const equipmentFeet = findEquipment(equipment, "feet", fighterId);
      if (equipmentFeet) {
        await equipHandsOrFeet(loader, character, equipmentFeet, "feet");
      }

      //weapon

      const equipmentWeapon = findEquipment(equipment, "weapon", fighterId);
      if (equipmentWeapon) {
        await equipWeapon(loader, character, equipmentWeapon);
      }
    }
    // Face
    const facePartsGroup = new THREE.Group();

    // Hairs
    const hairGlb = await loader.loadAsync(
      `/models/player/hairs/${visuals.hairType}.glb`
    );
    const hairs = hairGlb.scene.children[0] as THREE.Mesh;
    const hairsMaterial = new THREE.MeshToonMaterial({
      color: `${visuals.hairColor}`,
    });
    if (hairs.children.length > 0) {
      const firstChildren = hairs.children[0] as THREE.Mesh;
      firstChildren.material = hairsMaterial;
    }
    hairs.material = hairsMaterial;
    facePartsGroup.add(hairs);

    // Eyes
    const eyesGlb = await loader.loadAsync("/models/player/eyes/eyes.glb");
    const eyes = eyesGlb.scene.children[0] as THREE.Mesh;
    const eyesTexture = textureLoader.load(
      `    /models/player/eyes/textures/${visuals.eyesType}/${visuals.eyesColor}.png`
    );
    eyesTexture.flipY = false;
    eyes.material = new THREE.MeshToonMaterial({
      map: eyesTexture,
      alphaTest: 0.9,
    });
    eyes.position.set(0, -0.02, 0);
    facePartsGroup.add(eyes);

    // Mouth
    const mouthGlb = await loader.loadAsync("/models/player/mouth/mouth.glb");
    const mouth = mouthGlb.scene.children[0] as THREE.Mesh;
    const mouthTexture = textureLoader.load(
      `    /models/player/mouth/textures/${visuals.mouthType}.png`
    );
    mouthTexture.flipY = false;
    const mouthMaterial = new THREE.MeshStandardMaterial({
      map: mouthTexture,
      alphaTest: 0.6,
    });
    mouth.material = mouthMaterial;
    facePartsGroup.add(mouth);

    //Skin color
    character.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.material.name === "skin") {
          child.material = skinMaterial;
        }
      }
    });

    //association
    const headBone = character.getObjectByName("mixamorigHead");
    if (headBone && headBone instanceof THREE.Bone) {
      facePartsGroup.position.y = -2.083;
      facePartsGroup.position.z = -0.02;
      headBone.add(facePartsGroup);
    }
    characterGroup.traverse((node) => {
      node.visible = false;
    });
    characterGroup.add(character);
  } catch (error) {
    console.error("Error loading character model:", error);
    return null;
  }
};

const loadAnimations = async (character: THREE.Group) => {
  const loader = new GLTFLoader();
  const mixer = new THREE.AnimationMixer(character);

  const animations = {
    idle: "/models/player/animations/idle.glb",
    run: "/models/player/animations/run.glb",
    attack: "/models/player/animations/attack.glb",
    hurt: "/models/player/animations/hurt.glb",
    cast: "/models/player/animations/cast.glb",
    defeat: "/models/player/animations/defeat.glb",
  };

  const actions: { [key: string]: THREE.AnimationAction } = {};

  for (const [name, path] of Object.entries(animations)) {
    const animationGlb = await loader.loadAsync(path);
    const animationClip = animationGlb.animations[0];
    actions[name] = mixer.clipAction(animationClip);
    actions[name].setLoop(THREE.LoopOnce, 1);
  }

  actions["idle"].setLoop(THREE.LoopRepeat, Infinity);
  actions["idle"].play();

  return { mixer, actions };
};

interface CharacterLoaderProps {
  fighterId: number;
  characterRef: React.MutableRefObject<THREE.Group | null>;
  position: [number, number, number];
  visuals: VisualsInterface;
  equipment: EquipmentInterface[];
  setPlayAnimation?: (
    playAnimation: (animation: AnimationState) => void
  ) => void;
  setLoader?: React.Dispatch<
    SetStateAction<{ playerIsReady: boolean; opponentIsReady: boolean }>
  >;
  isPlayer?: boolean;
  setMovePosition?: (movePosition: (position: number) => void) => void;
}

export default memo(function CharacterLoader({
  fighterId,
  characterRef,
  position,
  visuals,
  equipment,
  setPlayAnimation,
  setLoader,
  isPlayer,
  setMovePosition,
}: CharacterLoaderProps) {
  const { scene } = useThree();
  const clock = new THREE.Clock();
  const [isCharacterLoaded, setIsCharacterLoaded] = useState<boolean>(false);
  const [mixer, setMixer] = useState<THREE.AnimationMixer | null>(null);
  const [actions, setActions] = useState<{
    [key: string]: THREE.AnimationAction;
  } | null>(null);
  const [targetPosition, setTargetPosition] = useState<number | null>(null);

  const setCharacterReadiness = useCallback(
    (isReady: boolean) => {
      if (setLoader) {
        setLoader((prevLoader) => {
          return isPlayer
            ? { ...prevLoader, playerIsReady: isReady }
            : { ...prevLoader, opponentIsReady: isReady };
        });
      }
    },
    [setLoader, isPlayer]
  );

  const moveCharacter = (newPosition: number) => {
    setTargetPosition(newPosition);
  };

  const setCharacterPosition = useCallback(
    (characterGroup: THREE.Group) => {
      characterGroup.position.set(...position);
      if (position[0] < 0) {
        characterGroup.rotation.y = Math.PI / 2;
      } else if (position[0] > 0) {
        characterGroup.rotation.y = -Math.PI / 2;
      }
    },
    [position]
  );
  const stableSetCharacterPosition = useFn(setCharacterPosition);
  useEffect(() => {
    if (isCharacterLoaded && characterRef.current) {
      characterRef.current.traverse((node) => {
        node.visible = true;
      });
    }
  }, [isCharacterLoaded, characterRef]);

  const playAnimation = (animation: AnimationState): Promise<void> => {
    return new Promise((resolve) => {
      setCharacterReadiness(false);

      if (isPlayer) {
        // eslint-disable-next-line no-console
        console.log("%c PLAYER", "color:cyan");
      } else {
        // eslint-disable-next-line no-console
        console.log(" %c OPPONENT", "color: red");
      }
      // eslint-disable-next-line no-console
      console.log(
        ` %c ${animation.currentAnimation.toUpperCase()}`,
        "color: #bada55"
      );
      //desactivation
      if (
        !(
          animation.prevAnimation === "idle" &&
          animation.currentAnimation === "idle"
        )
      ) {
        if (actions) {
          for (const actionName in actions) {
            if (actionName !== animation.currentAnimation) {
              const action = actions[actionName];
              if (action) {
                action.clampWhenFinished = true;
                action.fadeOut(0.3);
              }
            }
          }
          const action = actions[animation.currentAnimation];
          if (action) {
            action.reset().fadeIn(0.3).play();
            if (
              animation.currentAnimation === "idle" ||
              animation.currentAnimation === "run"
            ) {
              action.setLoop(THREE.LoopRepeat, Infinity);
              setCharacterReadiness(true);
            } else {
              action.setLoop(THREE.LoopOnce, 1);
              action.clampWhenFinished = true;
              action.reset();
            }
            resolve();
          }
        }
      } else {
        resolve();
      }
    });
  };
  const stablePlayAnimation = useFn(playAnimation);

  const cleanUp = () => {
    if (mixer) {
      mixer.stopAllAction();
      setMixer(null);
    }

    if (actions) {
      Object.values(actions).forEach((action) => {
        action.stop();
      });
      setActions(null);
    }

    if (characterRef.current) {
      characterRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.geometry) child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((material) => material.dispose());
          } else if (child.material) {
            child.material.dispose();
          }
        }
      });
      scene.remove(characterRef.current);
      characterRef.current = null;
    }
  };
  const stableCleanUp = useFn(cleanUp);

  useEffect(() => {
    if (setPlayAnimation) {
      setPlayAnimation(stablePlayAnimation);
    }
    if (setMovePosition) {
      setMovePosition(moveCharacter);
    }
  }, [setPlayAnimation, stablePlayAnimation, setMovePosition]);

  useEffect(() => {
    const loadAndAttachCharacter = async () => {
      setIsCharacterLoaded(false);
      const characterGroup = new THREE.Group();
      console.log(visuals, equipment);
      await loadCharacterModel(fighterId, characterGroup, visuals, equipment);
      stableSetCharacterPosition(characterGroup);

      const { mixer, actions } = await loadAnimations(characterGroup);

      setMixer(mixer);
      setActions(actions);

      characterRef.current = characterGroup;
      scene.add(characterGroup);
      setIsCharacterLoaded(true);
      setCharacterReadiness(true);
    };

    loadAndAttachCharacter();

    return () => {
      if (characterRef.current) {
        stableCleanUp();
      }
    };
  }, [
    characterRef,
    visuals,
    equipment,
    scene,
    stableSetCharacterPosition,
    stablePlayAnimation,
    setCharacterReadiness,
    isPlayer,
    stableCleanUp,
  ]);
  const moveModel = () => {
    if (characterRef.current && targetPosition !== null) {
      const positionSign = Math.sign(
        targetPosition - characterRef.current.position.x
      );
      const step = 0.1 * positionSign;

      if (
        Math.abs(targetPosition - characterRef.current.position.x) <=
        Math.abs(step)
      ) {
        characterRef.current.position.x = targetPosition;
        setTargetPosition(null);
      } else {
        characterRef.current.position.x += step;
      }
    }
  };

  useFrame(() => {
    const delta = clock.getDelta();
    if (characterRef.current && mixer) {
      mixer.update(delta);
    }

    moveModel();
  });

  return <group ref={characterRef}></group>;
});
