import { useEffect, useRef } from "react";
import Johnny from "./Johnny";

interface PlayerMiniProps {
  livesRefs: any;
}

const PlayerMini = ({
  livesRefs,
  ...props
}: JSX.IntrinsicElements["group"] & PlayerMiniProps) => {
  const ref = useRef<THREE.Group>(null!);

  useEffect(() => {
    livesRefs.current.push(ref.current);
  }, [livesRefs]);

  return (
    <group ref={ref} {...props}>
      <Johnny />
    </group>
  );
};

export default PlayerMini;
