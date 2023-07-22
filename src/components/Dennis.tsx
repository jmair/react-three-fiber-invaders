import * as THREE from "three";
import React, { ForwardedRef, forwardRef } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";

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

  return (
    <group {...props} dispose={null}>
      <group scale={[1, 1, 2.5]}>
        <mesh
          geometry={nodes.Plane001.geometry}
          material={materials.PaletteMaterial001}
        />
        <mesh
          geometry={nodes.Plane001_1.geometry}
          material={materials.PaletteMaterial002}
        />
      </group>
    </group>
  );
};

export default forwardRef(Dennis);

useGLTF.preload("/models/Dennis-transformed.glb");
