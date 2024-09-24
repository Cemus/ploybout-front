import * as THREE from "three";

export default function createOutline(
  originalMesh: THREE.SkinnedMesh | THREE.Mesh,
  scene: THREE.Scene
) {
  const THICKNESS = 0.009;
  const outlineMesh = originalMesh.clone();
  console.log("mesh", originalMesh);
  outlineMesh.material = new THREE.ShaderMaterial({
    vertexShader: /* glsl */ `
        void main() {
          vec3 newPosition = position + normal * ${THICKNESS};
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
    fragmentShader: /* glsl */ `
        void main() {
          gl_FragColor = vec4(0, 0, 0, 1); // Black color for outline
        }
      `,
    side: THREE.BackSide,
  });

  if (originalMesh instanceof THREE.SkinnedMesh) {
    if (originalMesh.skeleton) {
      (outlineMesh as THREE.SkinnedMesh).skeleton = originalMesh.skeleton;
      (outlineMesh as THREE.SkinnedMesh).bind(originalMesh.skeleton);
    }
  }
  scene.add(outlineMesh);
}
