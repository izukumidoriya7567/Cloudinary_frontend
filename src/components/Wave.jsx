import {OrbitControls,shaderMaterial,Stars,Sparkles,useTexture} from "@react-three/drei";
import {Canvas,extend,useFrame} from "@react-three/fiber";
import {useRef,useEffect,useState} from "react";
import {useAuth0} from "@auth0/auth0-react";
import * as THREE from "three";
import Error from "./Error";
const TestShaderMaterial3=shaderMaterial(
    {
        uTime:0.0,
        uTexture:null,
    },
    `
    uniform float uTime;
    varying vec2 vUv;
    varying vec3 vNormal;
    void main(){
      vec3 pos=position;
      vUv=uv;
      vNormal=normal;
      pos.z+=sin(uv.x*100.0+uTime*100.0)*0.01;
      gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.0);
    }
    `,
    `
    uniform sampler2D uTexture;
    varying vec2 vUv;
    void main(){
        gl_FragColor=texture2D(uTexture,vUv);
    }
    `,
)
extend({TestShaderMaterial3});
const Pattern3=({email})=>{
    const [texturePath3,setTexture3]=useState([]);
    useEffect(()=>{
        async function fetchImages(){
            const res=await fetch(`http://localhost:8000/image/${email}/waves`,{
                method:"GET",
            })
            const arr=await res.json();
            const texture3=[];
            arr.map((image)=>{
                texture3.push(image.url);
            })
            console.log(texture3);
            setTexture3(texture3);
        }
        fetchImages();
    },[])
    const textures = texturePath3 ? useTexture(texturePath3) : [];
    const meshRef1=useRef(null);
    const meshRef2=useRef(null);
    const meshRef3=useRef(null);
    useFrame(()=>{
        if(meshRef1.current){
            meshRef1.current.material.uniforms.uTime.value+=0.001;
        }
        if(meshRef2.current){
            meshRef2.current.material.uniforms.uTime.value+=0.001;
        }
        if(meshRef3.current){
            meshRef3.current.material.uniforms.uTime.value+=0.001;
        }
    })
    return(<>
        <mesh position={[0,0,0]} ref={meshRef1}>
        <planeGeometry args={[2,2,128,128]}/>
        <testShaderMaterial3 uTexture={textures[0]} side={THREE.DoubleSide}/>
        </mesh>
        <mesh position={[0,-5,0]} ref={meshRef2}>
        <planeGeometry args={[2,2,16,16]}/>
        <testShaderMaterial3 uTexture={textures[1]} side={THREE.DoubleSide}/>
        </mesh>
        <mesh position={[0,-10,0]} ref={meshRef3}>
        <planeGeometry args={[2,2,16,16]}/>
        <testShaderMaterial3 uTexture={textures[2]} side={THREE.DoubleSide}/>
        </mesh>
        </>)
}
const Wave=()=>{
    const {user}=useAuth0();
    if(user){
        return(<>
            <Canvas style={{height:"100vh",width:"100vw",backgroundColor:"black"}}>
            <Pattern3 email={user.email}/>
            <Sparkles/>
            <Stars/>
            <OrbitControls enableZoom={true} enablePan={false} />
            </Canvas>
          </>)
    }
    else{
       return(<>
       <Error/>
       </>)
    }
}
export default Wave;