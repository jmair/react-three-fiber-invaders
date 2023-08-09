import * as THREE from "three";
import {
  useMemo,
  useRef,
  useState,
  createContext,
  Dispatch,
  SetStateAction,
} from "react";
import { useFrame } from "@react-three/fiber";
import Player from "./Player";
import Armada from "./Armada";
import Laser from "./Laser";
import { useKeyboardControls, Text3D } from "@react-three/drei";
import Bomb from "./Bomb";

interface PlayerState {
  isDead?: boolean;
  score?: number;
}

interface PlayerContextInterface {
  hero: PlayerState;
  setHero: Dispatch<SetStateAction<PlayerState>>;
}

export const PlayerContext = createContext<PlayerContextInterface>({
  hero: { isDead: false, score: 0 },
  setHero: () => {},
});

const Game = () => {
  const [laserIndex, setLaserIndex] = useState<number>(0);
  const [bombIndex, setBombIndex] = useState<number>(0);
  const [lastFire, setLastFire] = useState(0);
  const [hero, setHero] = useState<PlayerState>({
    isDead: false,
    score: 0,
  });
  const playerRadius = 1.95;
  const fireInterval = 0.5;
  const getKeys = useKeyboardControls()[1];
  const playerRef = useRef<THREE.Mesh>(null!);
  const laserCount = 10;
  const bombCount = 10;
  const bombRefs = useRef<THREE.Mesh[]>([]);
  const bombArray = useMemo(
    () =>
      [...Array(bombCount).keys()].map((key) => (
        <Bomb
          position={[0, 0, 0]}
          visible={true}
          key={key}
          bombRefs={bombRefs}
        />
      )),
    []
  );
  const laserRefs = useRef<THREE.Mesh[]>([]);
  const laserArray = useMemo(() => {
    return [...Array(laserCount).keys()].map((key) => {
      return (
        <Laser
          position={[0, 0, 0]}
          visible={false}
          key={key}
          laserRefs={laserRefs}
        />
      );
    });
  }, [laserCount]);

  const checkIfPlayerHasDied = () => {
    const player = playerRef.current;
    bombRefs.current.forEach((bomb) => {
      if (
        bomb.visible &&
        bomb.position.distanceTo(player.position) < playerRadius
      ) {
        bomb.visible = false;
        if (!hero.isDead) {
          setHero({ ...hero, isDead: true });
        }
      }
    });
  };

  useFrame((state, delta) => {
    checkIfPlayerHasDied();

    const { space } = getKeys();
    if (hero.isDead && space) {
      setHero({ ...hero, isDead: false });
    }

    if (!hero.isDead && space) {
      if (state.clock.elapsedTime - lastFire > fireInterval) {
        setLastFire(state.clock.elapsedTime);
        if (laserRefs.current.length > 0) {
          const activeLaser = laserRefs.current[laserIndex];
          const player = playerRef.current;
          activeLaser.position.set(
            player.position.x,
            player.position.y + 1,
            player.position.z
          );
          activeLaser.visible = true;
          setLaserIndex(laserIndex < laserCount - 1 ? laserIndex + 1 : 0);
        }
      }
    }
  });

  const dropBomb = (position: THREE.Vector3) => {
    if (bombRefs.current.length > 0) {
      const currentBomb = bombRefs.current[bombIndex];
      currentBomb.position.set(position.x, position.y - 2, position.z);
      currentBomb.visible = true;
      setBombIndex(bombIndex < bombCount - 1 ? bombIndex + 1 : 0);
    }
  };

  return (
    <PlayerContext.Provider value={{ hero, setHero }}>
      <Text3D font="/fonts/Chakra Petch_Regular.json" position={[-50, 25, 0]}>
        SCORE: {hero.score}
      </Text3D>
      <Armada playerRef={playerRef} laserRefs={laserRefs} dropBomb={dropBomb} />
      <Player ref={playerRef} />
      {bombArray}
      {laserArray}
    </PlayerContext.Provider>
  );
};

export default Game;
