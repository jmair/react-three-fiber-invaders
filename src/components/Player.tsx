import * as THREE from "three";
import React, { useRef, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { RapierRigidBody } from "@react-three/rapier";

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
  armadaRef?: any;
  rayRef?: any;
  fire: (position: THREE.Vector3) => void;
}

export default function Player({
  speed = 25,
  armadaRef,
  rayRef,
  fire,
  ...props
}: JSX.IntrinsicElements["group"] & PlayerProps) {
  const leftTranslation = useMemo(() => new THREE.Vector3(), []);
  const rightTranslation = useMemo(() => new THREE.Vector3(), []);
  const firingPosition = useMemo(() => new THREE.Vector3(), []);
  const getKeys = useKeyboardControls()[1];
  const { nodes, materials } = useGLTF(
    "/models/Johnny-transformed.glb"
  ) as GLTFResult;

  const ref = useRef<RapierRigidBody>(null);

  useFrame((state, delta) => {
    const { left, right, space } = getKeys();
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
      if (space) {
        const position = ref.current.translation();
        fire(firingPosition.set(position.x, position.y, position.z));
      }
    }
  });

  return (
    <RigidBody gravityScale={0} ref={ref} type="kinematicPosition">
      <group {...props} dispose={null}>
        <mesh
          geometry={nodes.Johnny.geometry}
          material={materials.PaletteMaterial001}
          scale={[1, 1, 2.5]}
        />
      </group>
    </RigidBody>
  );
}

useGLTF.preload("/Johnny-transformed.glb");
