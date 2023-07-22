import { Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import "./App.css";
import Game from "./components/Game";
import CameraRig from "./components/CameraRig";
import { KeyboardControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import * as THREE from "three";

export default function App(props: any) {
  return (
    <>
      <KeyboardControls
        map={[
          { name: "left", keys: ["ArrowLeft", "KeyA"] },
          { name: "right", keys: ["ArrowRight", "KeyD"] },
          { name: "space", keys: ["Space"] },
        ]}
      >
        <Canvas
          camera={{
            position: [0, 10, -20],
          }}
        >
          {/* <Environment files="/images/nebula.hdr" background /> */}
          <ambientLight args={["white", 1]} />
          {/* <CameraRig /> */}
          <Physics debug>
            <Game />
          </Physics>
        </Canvas>
      </KeyboardControls>
    </>
  );
}
