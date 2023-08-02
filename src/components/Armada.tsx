import * as THREE from "three";
import React, { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import Napoleon from "./Napoleon";
import Dennis from "./Dennis";
import Jimmy from "./Jimmy";
import Bruce from "./Bruce";
import Laser from "./Laser";

interface ArmadaProps {
  playerRef: any;
}

const Armada = ({
  playerRef,
  ...props
}: JSX.IntrinsicElements["group"] & ArmadaProps) => {
  const width = 40;
  const shipCount = 44;
  const startY = 12;
  const xStride = 15;
  const xVelocity = 2;
  const yVelocity = -5;
  const elapsedThreshold = 0.5;

  const [speed, setSpeed] = useState(2);
  const [sinceLastUpdate, setSinceLastUpdate] = useState(0);
  const [yUpdate, setYUpdate] = useState(false);
  const [laserKey, setLaserKey] = useState(0);
  const [laserDimensions, setLaserDimensions] = useState<
    [number, number, number]
  >([0, 0, 0]);
  const [laserPosition, setLaserPosition] = useState<[number, number, number]>([
    0, 0, 0,
  ]);

  const firingPosition = useMemo(() => new THREE.Vector3(), []);
  const groupRef = useRef<THREE.Group>(null!);
  const rayRef = useRef<THREE.Raycaster>(null!);
  const alienRefs = useRef<THREE.Mesh[]>([]);
  const upVector = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const getKeys = useKeyboardControls()[1];
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
  const alienArray = useMemo(
    () =>
      [...Array(shipCount).keys()].map((key) => (
        <group key={key}>
          <mesh
            ref={(ref) => (ref ? alienRefs.current.push(ref) : null)}
            name="alien1"
            position={getPosition(key)}
          >
            <boxGeometry args={[2.75, 2.75, 0.5]} />
            <meshBasicMaterial transparent opacity={0} />
            {getMesh(key)}
          </mesh>
        </group>
      )),
    []
  );

  useFrame((state, delta) => {
    const { space } = getKeys();

    if (groupRef.current?.position) {
      const currPosition = groupRef.current.position;

      if (currPosition.x > xStride) {
        setSpeed(-xVelocity);
        setYUpdate(true);
      }
      if (currPosition.x < -xStride + -width) {
        setSpeed(xVelocity);
        setYUpdate(true);
      }

      if (state.clock.elapsedTime - sinceLastUpdate > elapsedThreshold) {
        if (yUpdate) {
          setYUpdate(false);
          currPosition.y += yVelocity;
        }
        setSinceLastUpdate(state.clock.elapsedTime);
        currPosition.x += speed;
      }
    }

    if (space) {
      const playerPosition = playerRef.current.translation();
      firingPosition.set(playerPosition.x, playerPosition.y, playerPosition.z);

      fire(firingPosition);
    }
  });

  const fire = (playerPos: THREE.Vector3) => {
    rayRef.current?.ray.origin.set(playerPos.x, playerPos.y, playerPos.z);

    const results = rayRef.current?.intersectObjects(alienRefs.current, false);

    if (results?.length) {
      const distance = results[0].distance;

      setLaserDimensions([0.1, distance, 0.1]);
      setLaserPosition([
        playerPos.x,
        laserDimensions[1] / 2 + playerPos.y,
        playerPos.z,
      ]);

      results[0].object.parent?.parent?.remove(results[0].object.parent);
    } else {
      setLaserDimensions([0.1, 100, 0.1]);
      setLaserPosition([
        playerPos.x,
        laserDimensions[1] / 2 + playerPos.y,
        playerPos.z,
      ]);
    }

    setLaserKey(laserKey + 1);
  };

  return (
    <>
      <raycaster
        ref={rayRef}
        ray={new THREE.Ray(new THREE.Vector3(0, -20, 0), upVector)}
      />
      <Laser
        dimensions={laserDimensions}
        key={laserKey}
        position={laserPosition}
      />
      <group
        {...props}
        dispose={null}
        ref={groupRef}
        position={[-width / 2, startY, 0]}
      >
        {alienArray}
      </group>
    </>
  );
};

export default Armada;
