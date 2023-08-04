import * as THREE from "three";
import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import Player from "./Player";
import Armada from "./Armada";
import Laser from "./Laser";
import { useKeyboardControls } from "@react-three/drei";
import Bomb from "./Bomb";

const Game = () => {
  const [laserIndex, setLaserIndex] = useState<number>(0);
  const [bombIndex, setBombIndex] = useState<number>(0);
  const [lastFire, setLastFire] = useState(0);
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

  useFrame((state, delta) => {
    const { space } = getKeys();
    if (space) {
      if (state.clock.elapsedTime - lastFire > fireInterval) {
        setLastFire(state.clock.elapsedTime);
        const activeLaser = laserRefs.current[laserIndex];
        const player = playerRef.current;
        activeLaser.position.set(
          player.position.x,
          player.position.y,
          player.position.z
        );
        activeLaser.visible = true;
        setLaserIndex(laserIndex < laserCount - 1 ? laserIndex + 1 : 0);
      }
    }
  });

  const dropBomb = (position: THREE.Vector3) => {
    const currentBomb = bombRefs.current[bombIndex];
    currentBomb.position.set(position.x, position.y - 2, position.z);
    currentBomb.visible = true;
    setBombIndex(bombIndex < bombCount - 1 ? bombIndex + 1 : 0);
  };

  return (
    <>
      <Armada playerRef={playerRef} laserRefs={laserRefs} dropBomb={dropBomb} />
      <Player ref={playerRef} />
      {bombArray}
      {laserArray}
    </>
  );
};

export default Game;
