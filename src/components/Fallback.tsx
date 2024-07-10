import { Text3D, Center } from "@react-three/drei";

const chakraFontUrl = "/fonts/Chakra Petch_Regular.json";

const Fallback = () => {
  return (
    <Center>
      <Text3D font={chakraFontUrl} scale={[2, 2, 2]}>
        LOADING...
      </Text3D>
    </Center>
  );
};

export default Fallback;
