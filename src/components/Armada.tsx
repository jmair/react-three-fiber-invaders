import * as THREE from "three";
import React, { ForwardedRef, forwardRef, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import Dennis from "./Dennis";

const Armada = (
  props: JSX.IntrinsicElements["group"],
  ref: ForwardedRef<THREE.Mesh>
) => {
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
    <group {...props} dispose={null} ref={groupRef} position={[0, 12, 0]}>
      <mesh ref={ref}>
        <boxGeometry args={[3, 3, 0.5]} />
        <meshBasicMaterial transparent opacity={0} />
        <Dennis />
      </mesh>
    </group>
  );
};

export default forwardRef(Armada);
