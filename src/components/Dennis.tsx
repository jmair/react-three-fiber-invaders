/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.5 public/models/Dennis.glb -Tt
*/

import * as THREE from "three";
import React from "react";
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

export default function Dennis(props: JSX.IntrinsicElements["group"]) {
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
}

useGLTF.preload("/models/Dennis-transformed.glb");
