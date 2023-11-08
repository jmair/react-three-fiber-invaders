import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useContext, useEffect, useRef } from "react";
import { PlayerContext } from "./Game";

interface LaserProps {
  laserRefs: any;
}

const Laser = ({
  laserRefs,
  ...props
}: JSX.IntrinsicElements["mesh"] & LaserProps) => {
  const speed = 16;
  const maxYPosition = 40;
  const ref = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const { hero } = useContext(PlayerContext);
  useEffect(() => {
    laserRefs.current.push(ref.current);
  }, [laserRefs]);

  useFrame((state, delta) => {
    if (!hero.destroyed && ref.current) {
      if (ref.current.position.y > maxYPosition) {
        ref.current.position.y = -15;
        ref.current.visible = false;
      }
      if (ref.current.visible) {
        ref.current.position.y += delta * speed;
      }
    }
  });

  return (
    <mesh {...props} ref={ref}>
      <boxGeometry args={[0.15, 1.5, 0.15]} />
      <meshStandardMaterial
        ref={materialRef}
        color="cyan"
        emissive="cyan"
        transparent
        opacity={1}
      />
    </mesh>
  );
};

export default Laser;
