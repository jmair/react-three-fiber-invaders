import { useMemo, useRef } from "react";
import Player from "./Player";
import { Vector3, Ray, Mesh } from "three";
import { useFrame } from "@react-three/fiber";
import Dennis from "./Dennis";

const Game = () => {
  const alienRef = useRef<Mesh>(null);
  const rayRef = useRef<THREE.Raycaster>(null);
  const upVector = useMemo(() => new Vector3(0, 1, 0), []);

  const fire = (position: Vector3) => {
    if (alienRef.current) {
      rayRef.current?.ray.origin.set(position?.x, position?.y, position?.z);
      const result = rayRef.current?.intersectObjects(
        [alienRef.current],
        false
      );
      console.log(result);
    }
  };

  return (
    <>
      <raycaster ref={rayRef} ray={new Ray(new Vector3(0, 0, 0), upVector)} />
      <Dennis ref={alienRef} />
      <Player fire={fire} />
    </>
  );
};

export default Game;
