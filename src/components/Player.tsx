import * as THREE from "three";
import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useKeyboardControls } from "@react-three/drei";
import { MeshProps, useFrame } from "@react-three/fiber";

type GLTFResult = GLTF & {
  nodes: {
    Johnny: THREE.Mesh;
  };
  materials: {
    PaletteMaterial001: THREE.MeshStandardMaterial;
  };
};

interface PlayerProps {
  speed?: number;
}

export default function Player({
  speed = 25,
  ...props
}: JSX.IntrinsicElements["group"] & PlayerProps) {
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const { nodes, materials } = useGLTF(
    "/models/Johnny-transformed.glb"
  ) as GLTFResult;

  const playerRef = useRef<THREE.Group | null>(null);

  useFrame((state, delta) => {
    const { left, right } = getKeys();
    const current = playerRef.current;
    const amount = delta * speed;

    if (current) {
      if (left) {
        current.position.x += amount;
      }
      if (right) {
        current.position.x -= amount;
      }
    }
  });

  return (
    <group {...props} dispose={null} ref={playerRef}>
      <mesh
        geometry={nodes.Johnny.geometry}
        material={materials.PaletteMaterial001}
        scale={[1, 1, 2.5]}
      />
    </group>
  );
}

useGLTF.preload("/Johnny-transformed.glb");
