import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
export const ResizeHandler = () => {
  const { gl, camera, size } = useThree();

  useEffect(() => {
    const handleResize = () => {
      const { width, height } = size;

      gl.setSize(width, height, false);

      if (camera instanceof THREE.PerspectiveCamera) {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      } else if (camera instanceof THREE.OrthographicCamera) {
        const aspect = width / height;
        camera.left = -aspect * camera.zoom;
        camera.right = aspect * camera.zoom;
        camera.top = camera.zoom;
        camera.bottom = -camera.zoom;
        camera.updateProjectionMatrix();
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [gl, camera, size]);

  return null;
};
