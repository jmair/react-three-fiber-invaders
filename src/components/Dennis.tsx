import * as THREE from "three";
import React, { ForwardedRef, forwardRef, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useFrame } from "@react-three/fiber";

type GLTFResult = GLTF & {
  nodes: {
    Plane001: THREE.Mesh;
    Plane001_1: THREE.Mesh;
  };
  materials: {
    PaletteMaterial001: THREE.MeshStandardMaterial;
    PaletteMaterial002: THREE.MeshStandardMaterial;
  };
};

const Dennis = (
  props: JSX.IntrinsicElements["group"],
  ref: ForwardedRef<THREE.Mesh>
) => {
  const { nodes, materials } = useGLTF(
    "/models/Dennis-transformed.glb"
  ) as GLTFResult;

  const [speed, setSpeed] = useState(2);

  const xVelocity = 2;
  const groupRef = useRef<THREE.Group>(null);
  const xStride = 50;
  const yStride = -0.25;

  useFrame((state, delta) => {
    if (groupRef.current?.position) {
      const currPosition = groupRef.current.position;

      if (currPosition.x > xStride) {
        setSpeed(-xVelocity);
        currPosition.y += yStride;
      }
      if (currPosition.x < -xStride) {
        setSpeed(xVelocity);
        currPosition.y += yStride;
      }
      currPosition.x += delta * speed;
    }
  });

  return (
    <group {...props} dispose={null}>
      <group
        ref={groupRef}
        rotation={[Math.PI, 0, Math.PI]}
        scale={[1, 1, 2.5]}
        position={[0, 12, 0]}
      >
        <mesh ref={ref}>
          <boxGeometry args={[3, 3, 0.5]} />
          <meshBasicMaterial transparent opacity={0} />
          <mesh
            geometry={nodes.Plane001.geometry}
            material={materials.PaletteMaterial001}
          />
          <mesh
            geometry={nodes.Plane001_1.geometry}
            material={materials.PaletteMaterial002}
          />
        </mesh>
      </group>
    </group>
  );
};

export default forwardRef(Dennis);

useGLTF.preload("/models/Dennis-transformed.glb");
