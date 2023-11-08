import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useContext, useEffect, useRef } from "react";
import { PlayerContext } from "./Game";

interface BombProps {
  bombRefs: any;
}

const Bomb = ({
  bombRefs,
  ...props
}: JSX.IntrinsicElements["mesh"] & BombProps) => {
  const { hero } = useContext(PlayerContext);
  const speed = 8;
  const maxYPosition = -20;
  const ref = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useEffect(() => {
    bombRefs.current.push(ref.current);
  }, [bombRefs]);

  useFrame((state, delta) => {
    if (!hero.destroyed && ref.current) {
      if (ref.current.position.y < maxYPosition) {
        ref.current.visible = false;
      }
      if (ref.current.visible) {
        ref.current.position.y -= delta * speed;
      }
    }
  });

  return (
    <mesh {...props} ref={ref}>
      <boxGeometry args={[0.15, 1.5, 0.15]} />
      <meshStandardMaterial
        ref={materialRef}
        color="tomato"
        emissive="tomato"
        transparent
        opacity={1}
      />
    </mesh>
  );
};

export default Bomb;
