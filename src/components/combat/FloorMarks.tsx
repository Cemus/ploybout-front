import { SetStateAction, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

interface FloorMarksProps {
  setIsFloorLoaded: React.Dispatch<SetStateAction<boolean>>;
}

export default function FloorMarks({ setIsFloorLoaded }: FloorMarksProps) {
  const { scene } = useThree();

  useEffect(() => {
    setIsFloorLoaded(false);

    const loadMark = async () => {
      const loader = new GLTFLoader();
      const floorMarkGlb = await loader.loadAsync(
        `/models/utils/floorMarks.glb`
      );
      return floorMarkGlb.scene.children[0];
    };

    loadMark()
      .then((floorMark) => {
        const floorMarkGroup = new THREE.Group();
        if (floorMark) {
          for (let i = 0; i < 7; i++) {
            const mark = floorMark.clone();
            mark.position.x = -9 + i * 3;
            mark.userData.name = `floorMark${i}`;
            floorMarkGroup.add(mark);
          }
          scene.add(floorMarkGroup);
        } else {
          console.error("Aucun marqueur de sol trouvé.");
        }
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des marqueurs de sol:", error);
      })
      .finally(() => {
        setIsFloorLoaded(true);
      });
  }, [scene, setIsFloorLoaded]);

  return null;
}
