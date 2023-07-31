import * as THREE from "three";
import React, { useMemo, forwardRef } from "react";
import { useGLTF, Line } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";

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
  { speed = 10, ...props }: JSX.IntrinsicElements["group"] & PlayerProps,
  ref: any
) => {
  const leftTranslation = useMemo(() => new THREE.Vector3(), []);
  const rightTranslation = useMemo(() => new THREE.Vector3(), []);
  const getKeys = useKeyboardControls()[1];
  const { nodes, materials } = useGLTF(
    "/models/Johnny-transformed.glb"
  ) as GLTFResult;

  useFrame((state, delta) => {
    const { left, right } = getKeys();
    const current = ref.current;

    if (current) {
      const translationX = current.translation().x;
      const amount = leftTranslation.setX(translationX + delta * speed);
      const negativeAmount = rightTranslation.setX(
        translationX + delta * speed * -1
      );

      if (left) {
        current.setNextKinematicTranslation(amount);
      }
      if (right) {
        current.setNextKinematicTranslation(negativeAmount);
      }
    }
  });

  return (
    <RigidBody gravityScale={0} ref={ref} type="kinematicPosition">
      <group {...props} dispose={null}>
        <Line
          points={[
            [0, 0, 0],
            [0, 20, 0],
          ]}
          color="limeGreen"
        />
        <mesh
          geometry={nodes.Johnny.geometry}
          material={materials.PaletteMaterial001}
          scale={[1, 1, 2.5]}
        />
      </group>
    </RigidBody>
  );
};

export default forwardRef(Player);

useGLTF.preload("/Johnny-transformed.glb");
