import { Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import "./App.css";
import Game from "./components/Game";
// import CameraRig from "./components/CameraRig";
import { KeyboardControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
// import * as THREE from "three";
// import { Perf } from "r3f-perf";
import { Suspense } from "react";
import Fallback from "./components/Fallback";
import {
  Bloom,
  EffectComposer,
  Scanline,
  // Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

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
            position: [0, 0, 40],
          }}
        >
          <Suspense fallback={<Fallback />}>
            <EffectComposer>
              {/* <Vignette eskil={false} offset={0.1} darkness={1.1} /> */}
              <Scanline
                density={1.443}
                opacity={0.4}
                blendFunction={BlendFunction.MULTIPLY}
              />
              <Bloom
                blendFunction={BlendFunction.SCREEN}
                luminanceThreshold={0.8}
                luminanceSmoothing={0.2}
                height={300}
              />
              {/* <Perf /> */}
              <Environment files="/images/nebula.hdr" background />
              <ambientLight args={["white", 1]} />
              {/* <CameraRig /> */}
              <Physics>
                <Game />
              </Physics>
            </EffectComposer>
          </Suspense>
        </Canvas>
      </KeyboardControls>
    </>
  );
}
