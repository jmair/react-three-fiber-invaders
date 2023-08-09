import * as THREE from "three";
import React, {
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { useFrame, RootState } from "@react-three/fiber";
import Napoleon from "./Napoleon";
import Dennis from "./Dennis";
import Jimmy from "./Jimmy";
import Bruce from "./Bruce";
import { PlayerContext } from "./Game";
interface ArmadaProps {
  playerRef: any;
  laserRefs: any;
  dropBomb: (p: THREE.Vector3) => void;
}

const Armada = ({
  playerRef,
  laserRefs,
  dropBomb,
  ...props
}: JSX.IntrinsicElements["group"] & ArmadaProps) => {
  const width = 40;
  const craftRadius = 1.96;
  const shipCount = 44;
  const rowCount = 4;
  const perRow = shipCount / rowCount;
  const startY = 12;
  const horizontalSpacing = 5;
  const verticalSpacing = 5;
  const initalApproach = useMemo(
    () => new THREE.Vector3(-width / 2, startY, 0),
    []
  );
  const xStride = 15;
  const xVelocity = 2;
  const yVelocity = -5;
  const yTravelLimit = -15;
  const elapsedThreshold = 0.5;
  const dropBombThreshold = 1;

  const { hero, setHero } = useContext(PlayerContext);
  const [speed, setSpeed] = useState(2);
  const [sinceLastUpdate, setSinceLastUpdate] = useState(0);
  const [yUpdate, setYUpdate] = useState(false);
  const [lastBombDropped, setLastBombDropped] = useState(0);
  const shipWorldPositionReset = useMemo(() => new THREE.Vector3(), []);
  const shipWorldPositionDamage = useMemo(() => new THREE.Vector3(), []);
  const shipWorldPositionAttack = useMemo(() => new THREE.Vector3(), []);
  const groupRef = useRef<THREE.Group>(null!);
  const fleetRefs = useRef<THREE.Mesh[]>([]);
  const getMesh = useCallback(
    (index: number) => {
      if (index < perRow * 1) {
        return <Dennis />;
      } else if (index < perRow * 2) {
        return <Napoleon />;
      } else if (index < perRow * 3) {
        return <Jimmy />;
      } else {
        return <Bruce />;
      }
    },
    [perRow]
  );
  const getPosition = useCallback(
    (index: number): [number, number, number] => {
      const xPos = (index % perRow) * horizontalSpacing;
      if (index < perRow) {
        return [xPos, 0, 0];
      } else if (index < perRow * 2) {
        return [xPos, verticalSpacing * 1, 0];
      } else if (index < perRow * 3) {
        return [xPos, verticalSpacing * 2, 0];
      } else {
        return [xPos, verticalSpacing * 3, 0];
      }
    },
    [perRow]
  );
  const fleetArray = useMemo(() => {
    return [...Array(shipCount).keys()].map((key) => (
      <group key={key}>
        <mesh
          ref={(ref) => (ref ? fleetRefs.current.push(ref) : null)}
          position={getPosition(key)}
        >
          <boxGeometry args={[2.75, 2.75, 0.5]} />
          <meshBasicMaterial transparent opacity={0} />
          {getMesh(key)}
        </mesh>
      </group>
    ));
  }, [getMesh, getPosition]);

  const resetGroup = () => {
    groupRef.current.position.max(initalApproach);
  };

  const checkForDestruction = (activeCraft: THREE.Mesh[]) => {
    const activeLasers = laserRefs.current.filter(
      (laser: THREE.Mesh) => laser.visible
    );

    activeCraft.forEach((craft) => {
      craft.getWorldPosition(shipWorldPositionDamage);
      activeLasers.forEach((laser: THREE.Mesh) => {
        if (shipWorldPositionDamage.distanceTo(laser.position) < craftRadius) {
          craft.visible = false;
          laser.visible = false;
          setHero({
            ...hero,
            score: hero.score != null ? hero.score + 100 : 0,
          });
        }
      });
    });
  };

  const advance = (state: RootState) => {
    if (groupRef.current?.position) {
      const currPosition = groupRef.current.position;
      if (currPosition.x > xStride) {
        setSpeed(-xVelocity);
        setYUpdate(true);
      }
      if (currPosition.x < -xStride + -width) {
        setSpeed(xVelocity);
        setYUpdate(true);
      }

      if (state.clock.elapsedTime - sinceLastUpdate > elapsedThreshold) {
        if (yUpdate) {
          setYUpdate(false);
          currPosition.y += yVelocity;
        }
        setSinceLastUpdate(state.clock.elapsedTime);
        currPosition.x += speed;
      }
    }
  };

  const attack = (state: RootState, activeCraft: THREE.Mesh[]) => {
    const activeCraftYSorted = activeCraft.sort(
      (a, b) => a.position.y - b.position.y
    );

    const elapsedTime = state.clock.elapsedTime;

    if (
      activeCraftYSorted.length > 0 &&
      elapsedTime - lastBombDropped > dropBombThreshold
    ) {
      const ship =
        activeCraftYSorted[
          Math.min(
            Math.round(Math.random() * (shipCount / rowCount)),
            activeCraftYSorted.length - 1
          )
        ];

      ship.getWorldPosition(shipWorldPositionAttack);
      dropBomb(shipWorldPositionAttack);
      setLastBombDropped(elapsedTime);
    }
  };

  const checkForPlanetObliteration = () => {
    fleetRefs.current.forEach((craft) => {
      if (craft.visible) {
        craft.getWorldPosition(shipWorldPositionReset);
        if (shipWorldPositionReset.y < yTravelLimit) {
          resetGroup();
        }
      }
    });
  };

  useFrame((state, delta) => {
    if (!hero.isDead) {
      const activeCraft = fleetRefs.current.filter((craft) => craft.visible);

      advance(state);
      checkForDestruction(activeCraft);
      attack(state, activeCraft);
      checkForPlanetObliteration();
    }
  });

  return (
    <group {...props} dispose={null} ref={groupRef} position={initalApproach}>
      {fleetArray}
    </group>
  );
};

export default Armada;
