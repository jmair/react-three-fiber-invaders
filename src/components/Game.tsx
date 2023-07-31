import { useRef } from "react";
import Player from "./Player";
import Armada from "./Armada";
import { RapierRigidBody } from "@react-three/rapier";

const Game = () => {
  const playerRef = useRef<RapierRigidBody>(null!);

  return (
    <>
      <Armada playerRef={playerRef} />
      <Player ref={playerRef} />
    </>
  );
};

export default Game;
