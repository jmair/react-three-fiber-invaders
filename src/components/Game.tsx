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
import { useKeyboardControls, Text3D, Center } from "@react-three/drei";
import Bomb from "./Bomb";
import PlayersLives from "./PlayersLives";

interface PlayerState {
  maxLives?: number;
  lives?: number;
  destroyed?: boolean;
  defeated?: boolean;
  score?: number;
}

interface PlayerContextInterface {
  hero: PlayerState;
  setHero: Dispatch<SetStateAction<PlayerState>>;
}

export const PlayerContext = createContext<PlayerContextInterface>({
  hero: {},
  setHero: () => {},
});

const Game = () => {
  const [livesKey, setLivesKey] = useState(1);
  const [laserIndex, setLaserIndex] = useState<number>(0);
  const [bombIndex, setBombIndex] = useState<number>(0);
  const [lastFire, setLastFire] = useState(0);
  const [hero, setHero] = useState<PlayerState>({
    maxLives: 10,
    lives: 3,
    destroyed: false,
    defeated: false,
    score: 0,
  });
  const chakraFontUrl = "/fonts/Chakra Petch_Regular.json";
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

  const isPlayerHit = () => {
    const player = playerRef.current;
    bombRefs.current.forEach((bomb) => {
      if (
        hero.lives &&
        bomb.visible &&
        bomb.position.distanceTo(player.position) < playerRadius
      ) {
        bomb.visible = false;
        if (!hero.destroyed) {
          const livesCount = hero.lives ? hero.lives - 1 : 0;
          setHero({
            ...hero,
            destroyed: true,
            defeated: livesCount < 1,
            lives: livesCount,
          });
        }
      }
    });
  };

  useFrame((state, delta) => {
    isPlayerHit();

    const { space } = getKeys();
    if (hero.destroyed && space) {
      setHero({ ...hero, destroyed: false });
      // set last fire to prevent firing when respawning
      setLastFire(state.clock.elapsedTime);
    }

    // Space Bar
    if (space) {
      if (!hero.destroyed) {
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
      } else if (hero.defeated) {
        setHero({
          ...hero,
          lives: 3,
          destroyed: false,
          score: 0,
          defeated: false,
        });
        setLivesKey(livesKey + 1);
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
      <Text3D font={chakraFontUrl} position={[-50, 25, 0]}>
        SCORE: {hero.score}
      </Text3D>
      {hero.defeated && (
        <>
          <Center>
            <Text3D font={chakraFontUrl} scale={[2, 2, 2]}>
              GAME OVER
            </Text3D>
          </Center>
          <Text3D
            font={chakraFontUrl}
            lineHeight={100}
            position={[-3.5, -3, 0]}
          >
            Press Space
          </Text3D>
        </>
      )}
      <PlayersLives key={livesKey} />
      <Armada playerRef={playerRef} laserRefs={laserRefs} dropBomb={dropBomb} />
      <Player ref={playerRef} />
      {bombArray}
      {laserArray}
    </PlayerContext.Provider>
  );
};

export default Game;
