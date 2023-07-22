import {
  InstancedRigidBodies,
  InstancedRigidBodyProps,
} from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";

const Instances = () => {
  const laserCount = 3;

  const instances = useMemo(() => {
    const instances: InstancedRigidBodyProps[] = [];

    for (var i = 0; i < laserCount; i++) {
      instances.push({
        key: "instance_" + i,
        position: [i * 2, 0, 0],
        rotation: [0, 0, 0],
      });
    }

    return instances;
  }, []);

  useFrame((state, delta) => {});

  return (
    <InstancedRigidBodies
      instances={instances}
      gravityScale={0}
      type="kinematicPosition"
    >
      <instancedMesh args={[undefined, undefined, laserCount]}>
        <boxGeometry args={[0.25, 2, 0.25]} />
        <meshStandardMaterial color="white" emissive="white" />
      </instancedMesh>
    </InstancedRigidBodies>
  );
};

export default Instances;
