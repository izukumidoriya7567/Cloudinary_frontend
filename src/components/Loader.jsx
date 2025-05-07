import React from "react";
import { Html, useProgress} from '@react-three/drei'

function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div style={{ color: 'blue', fontSize: '30px' }}>
        Loading... {Math.floor(progress)}%
      </div>
    </Html>
  )
}
export default Loader;