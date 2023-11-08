import { useContext, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import PlayerMini from "./PlayerMini";
import { PlayerContext } from "./Game";

const PlayersLives = () => {
  const {
    hero: { maxLives, lives },
  } = useContext(PlayerContext);
  const [displayedLives, setDisplayedLives] = useState(0);
  const playerWidth = 4;
  const livesRefs = useRef<THREE.Group[]>([]);

  const meshes = useMemo(
    () =>
      [...Array(maxLives).keys()].map((key, i) => (
        <PlayerMini
          key={i}
          position={[i * playerWidth, 0, 0]}
          livesRefs={livesRefs}
        />
      )),
    [maxLives]
  );

  useFrame(() => {
    if (
      livesRefs.current.length &&
      lives != null &&
      maxLives &&
      displayedLives !== lives
    ) {
      for (let i = maxLives - 1; i > lives - 1; i--) {
        livesRefs.current[i].visible = false;
        setDisplayedLives(lives);
      }
    }
  });

  return (
    <group position={[-40, 25.25, 0]} scale={[0.75, 0.75, 0.75]}>
      {meshes}
    </group>
  );
};

export default PlayersLives;
