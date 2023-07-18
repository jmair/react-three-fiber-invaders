import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";

interface RigProps {
  mouseAmount?: number;
}

const Rig = ({ mouseAmount = 20 }: RigProps) => {
  const { camera, mouse } = useThree();
  const vec = new Vector3();

  return useFrame(() => {
    camera.position.lerp(
      vec.set(mouse.x * mouseAmount, mouse.y * mouseAmount, camera.position.z),
      1
    );
    camera.lookAt(0, 0, 0);
  });
};

export default Rig;
