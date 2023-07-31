import * as THREE from "three";
import React, { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import Dennis from "./Dennis";
import { useKeyboardControls } from "@react-three/drei";
import { Napoleon } from "./Napoleon";

interface ArmadaProps {
  playerRef: any;
}

const Armada = ({
  playerRef,
  ...props
}: JSX.IntrinsicElements["group"] & ArmadaProps) => {
  const [speed, setSpeed] = useState(2);

  const xVelocity = 2;
  const firingPosition = useMemo(() => new THREE.Vector3(), []);
  const groupRef = useRef<THREE.Group>(null!);
  const rayRef = useRef<THREE.Raycaster>(null!);
  const alien1Ref = useRef<THREE.Mesh>(null!);
  const alien2Ref = useRef<THREE.Mesh>(null!);
  const upVector = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const getKeys = useKeyboardControls()[1];

  const xStride = 25;
  const yStride = -0.25;

  useFrame((state, delta) => {
    const { space } = getKeys();

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

    if (space) {
      const position = playerRef.current.translation();
      fire(firingPosition.set(position.x, position.y, position.z));
    }
  });

  const fire = (position: THREE.Vector3) => {
    rayRef.current?.ray.origin.set(position?.x, position?.y, position?.z);
    const results = rayRef.current?.intersectObjects(
      [alien1Ref.current, alien2Ref.current],
      false
    );
    if (results?.length) {
      results.forEach((result) => {
        result.object.parent?.traverseVisible(
          (visable) => (visable.visible = false)
        );
      });
    }
  };

  return (
    <>
      <raycaster
        ref={rayRef}
        ray={new THREE.Ray(new THREE.Vector3(0, 0, 0), upVector)}
      />

      <group {...props} dispose={null} ref={groupRef} position={[0, 12, 0]}>
        <group>
          <mesh ref={alien1Ref} name="alien1">
            <boxGeometry args={[3, 3, 0.5]} />
            <meshBasicMaterial transparent opacity={0} />
            <Dennis />
          </mesh>
        </group>
        <group>
          <mesh ref={alien1Ref} position={[10, 0, 0]} name="alien2">
            <boxGeometry args={[3, 3, 0.5]} />
            <meshBasicMaterial transparent opacity={0} />
            <Dennis />
          </mesh>
        </group>
        <group>
          <mesh ref={alien2Ref} position={[5, -5, 0]} name="alien3">
            <boxGeometry args={[3, 3, 0.5]} />
            <meshBasicMaterial transparent opacity={0} />
            <Napoleon />
          </mesh>
        </group>
      </group>
    </>
  );
};

export default Armada;
