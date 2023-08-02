import * as THREE from "three";
import React, { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import Napoleon from "./Napoleon";
import Dennis from "./Dennis";
import Jimmy from "./Jimmy";
import Bruce from "./Bruce";

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
  const alienRefs = useRef<THREE.Mesh[]>([]);
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
    const results = rayRef.current?.intersectObjects(alienRefs.current, false);
    if (results?.length) {
      console.log(results);
      results[0].object.parent?.traverseVisible(
        (visable) => (visable.visible = false)
      );
      // results.forEach((result) => {
      //   result.object.parent?.traverseVisible(
      //     (visable) => (visable.visible = false)
      //   );
      // });
    }
  };

  const getMesh = (index: number) => {
    if (index < 11) {
      return <Dennis />;
    } else if (index < 22) {
      return <Napoleon />;
    } else if (index < 33) {
      return <Jimmy />;
    } else {
      return <Bruce />;
    }
  };

  const getPosition = (index: number): [number, number, number] => {
    const xPos = (index % 11) * 4;
    if (index < 11) {
      return [xPos, 0, 0];
    } else if (index < 22) {
      return [xPos, 5, 0];
    } else if (index < 33) {
      return [xPos, 10, 0];
    } else {
      return [xPos, 15, 0];
    }
  };

  const getAliens = () => {
    return [...Array(44).keys()].map((key) => (
      <group>
        <mesh
          ref={(ref) => (ref ? alienRefs.current.push(ref) : null)}
          name="alien1"
          position={getPosition(key)}
        >
          <boxGeometry args={[2, 2, 0.5]} />
          <meshBasicMaterial transparent opacity={0} />
          {getMesh(key)}
        </mesh>
      </group>
    ));
  };

  return (
    <>
      <raycaster
        ref={rayRef}
        ray={new THREE.Ray(new THREE.Vector3(0, 0, 0), upVector)}
      />
      <group {...props} dispose={null} ref={groupRef} position={[0, 12, 0]}>
        {getAliens()}
      </group>
    </>
  );
};

export default Armada;
