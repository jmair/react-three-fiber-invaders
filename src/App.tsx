import { Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import "./App.css";

export default function App(props: any) {
  return (
    <Canvas>
      <Environment files="/images/nebula.hdr" background />
    </Canvas>
  );
}
