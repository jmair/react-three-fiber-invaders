import {
  InstancedRigidBodies,
  InstancedRigidBodyProps,
  RapierRigidBody,
} from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";

const Explosion = () => {
  const blockCount = 10;

  const instanceRefs = useRef<RapierRigidBody>(null!);
  const instances = useMemo(() => {
    const instances: InstancedRigidBodyProps[] = [];
    const randomNum = Math.random();

    for (var i = 0; i < blockCount; i++) {
      instances.push({
        key: "instance_" + i,
        position: [i * randomNum, i * randomNum, i * randomNum],
        rotation: [i * randomNum, i * randomNum, i * randomNum],
      });
    }

    return instances;
  }, []);

  useFrame((state, delta) => {});

  return (
    <InstancedRigidBodies instances={instances} gravityScale={0}>
      <instancedMesh args={[undefined, undefined, blockCount]}>
        <boxGeometry args={[0.25, 0.25, 0.25]} />
        <meshStandardMaterial color="white" emissive="white" />
      </instancedMesh>
    </InstancedRigidBodies>
  );
};

export default Explosion;
