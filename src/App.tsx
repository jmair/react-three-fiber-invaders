import { Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import "./App.css";
import Game from "./components/Game";
import CameraRig from "./components/CameraRig";
import { KeyboardControls } from "@react-three/drei";

export default function App(props: any) {
  return (
    <>
      <KeyboardControls
        map={[
          { name: "left", keys: ["ArrowLeft", "KeyA"] },
          { name: "right", keys: ["ArrowRight", "KeyD"] },
        ]}
      >
        <Canvas>
          <Environment files="/images/nebula.hdr" background />
          <CameraRig />
          <Game />
        </Canvas>
      </KeyboardControls>
    </>
  );
}
