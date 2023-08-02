import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

interface LaserProps {
  dimensions?: [number, number, number];
}

const Laser = ({
  dimensions = [0, 0, 0],
  ...props
}: JSX.IntrinsicElements["mesh"] & LaserProps) => {
  const ref = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(() => {
    const matCur = materialRef.current;
    if (matCur) {
      if (matCur.opacity > 0) {
        materialRef.current.opacity -= 0.1;
      }
    }
  });

  return (
    <mesh ref={ref} {...props}>
      <boxGeometry args={dimensions} />
      <meshStandardMaterial
        ref={materialRef}
        color="white"
        emissive="white"
        transparent
        opacity={1}
      />
    </mesh>
  );
};

export default Laser;
