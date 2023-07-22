import React, { ForwardedRef, forwardRef, useEffect } from "react";
import { Group } from "three";

const Armada = (props: any, ref: ForwardedRef<Group>) => {
  useEffect(() => {
    console.log("Forward Ref:", ref);
  }, [ref]);

  return <group position={[0, 12, 0]}></group>;
};

export default forwardRef(Armada);
