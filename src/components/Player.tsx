import * as THREE from "three";
import React, { useMemo, forwardRef, useContext } from "react";
import { useGLTF, Line } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { PlayerContext } from "./Game";
import Johnny from "./Johnny";

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

const Player = (
  { speed = 30, ...props }: JSX.IntrinsicElements["group"] & PlayerProps,
  ref: any
) => {
  const getKeys = useKeyboardControls()[1];
  const { hero } = useContext(PlayerContext);
  const { nodes, materials } = useGLTF(
    "/models/Johnny-transformed.glb"
  ) as GLTFResult;

  useFrame((state, delta) => {
    const { left, right } = getKeys();
    const current = ref.current;

    if (current) {
      if (!hero.destroyed) {
        if (!current.visible) {
          current.visible = true;
        }

        if (left) {
          current.position.x += delta * -speed;
        }
        if (right) {
          current.position.x += delta * speed;
        }
      } else {
        current.visible = false;
      }
    }
  });

  return (
    <group {...props} dispose={null} position={[0, -20, 0]} ref={ref}>
      <Johnny />
    </group>
  );
};

export default forwardRef(Player);

useGLTF.preload("/Johnny-transformed.glb");
