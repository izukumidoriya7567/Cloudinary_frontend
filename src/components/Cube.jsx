import {useRef,useEffect,useState, Suspense} from "react";
import {useFrame,extend,Canvas} from "@react-three/fiber";
import {useAuth0} from "@auth0/auth0-react";
import {shaderMaterial,useTexture,Sparkles,OrbitControls,Sky} from "@react-three/drei";
import Error from "./Error";
const TestShaderMaterial1=shaderMaterial(
    {
        uTime:0.0,
        uTexture:null,
    },
    `
    varying vec2 vUv;
    varying vec3 vNormal;
    uniform float uTime;
    void main(){
       vNormal=normal;
       vUv=uv;
       gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);
    }
    `,
    `
    varying vec2 vUv;
    varying vec3 vNormal;
    uniform float uTime;
    uniform sampler2D uTexture[10];
    void main(){
       if(vNormal.x==1.0){
          vec2 grid=(vUv+uTime)*2.0;
          float x=grid.x;
          float y=grid.y;
          float val=mod(floor(x)+floor(y),2.0);
          vec2 new_grid=vec2(fract(grid.x),fract(grid.y));
          if(val==0.0){
             gl_FragColor=texture2D(uTexture[0],new_grid);
          }
          else{
             gl_FragColor=texture2D(uTexture[1],new_grid);
          }
       }
       else if(vNormal.x==-1.0){
          vec2 grid=(vUv+uTime*0.5)*3.0;
          float x=grid.x;
          float y=grid.y;
          float val=mod(floor(x)+floor(y),3.0);
          vec2 new_grid=vec2(fract(grid.x),fract(grid.y));
            if(val==0.0){
                gl_FragColor=texture2D(uTexture[5],new_grid);
            }
            else if(val==1.0){
                gl_FragColor=texture2D(uTexture[6],new_grid);
            }
            else{
                gl_FragColor=texture2D(uTexture[7],new_grid);
            }
       }
        else if(vNormal.y==1.0){
          float x=(vUv.x-0.5)*2.5;
          float y=(vUv.y-0.45)*2.5;
          if(pow(pow(x,2.0)+pow(y,2.0)-1.0,3.0)<=pow(x,2.0)*pow(y,3.0)){
             gl_FragColor=texture2D(uTexture[8],vUv);
          }
          else{
            gl_FragColor=vec4(abs(sin((vUv.x+vUv.y)*3.14+uTime)),abs(cos((vUv.x+vUv.y)*3.14+uTime)),abs(sin((vUv.x*vUv.y)*3.14+uTime)),1.0);
          }
        }
        else if(vNormal.y==-1.0){
          float x=(vUv.x-0.5)*2.5;
          float y=(vUv.y-0.4)*2.5;
          if(pow(pow(x,2.0)+pow(y,2.0)-1.0,3.0)<=pow(x,2.0)*pow(y,3.0)){
             gl_FragColor=texture2D(uTexture[9],vUv);
          }
          else{
            gl_FragColor=vec4(abs(sin((vUv.x+vUv.y)*uTime)),abs(cos((vUv.x+vUv.y)*uTime)),abs(sin((vUv.x/vUv.y)*uTime)),1.0);
          }
        }
        else if(vNormal.z==1.0){
          vec2 grid=(vUv+uTime)*2.0;
          float x=grid.x;
          float y=grid.y;
          float val=mod(floor(x)+floor(y),2.0);
          if(val==0.0){
            gl_FragColor=texture2D(uTexture[2],vUv);
          }
          else{
            gl_FragColor=texture2D(uTexture[3],vUv);
          }
        }
        else if(vNormal.z==-1.0){
          vec2 grid=(vUv+uTime)*2.0;
          float x=grid.x;
          float y=grid.y;
          float val=mod(floor(x)+floor(y),2.0);
          vec2 new_grid=vec2(fract(grid.x),fract(grid.y));
          if(val==0.0){
            gl_FragColor=texture2D(uTexture[5],vUv);
          }
          else{
            gl_FragColor=texture2D(uTexture[6],vUv);
          }
        }
    }
    `,
)
extend({TestShaderMaterial1});
const Pattern1=({email})=>{
  const [texturePath1,setTexture1]=useState([]);
  useEffect(()=>{
      async function fetchImages(){
          const endPoint=`http://localhost:8000/image/${email}/cube`;
          const res=await fetch(endPoint,{
            method:"GET",
          })
          console.log(res);
          const arr=await res.json();
          console.log(arr);
          const texture1=[];
          arr.map((image)=>{
              texture1.push(image.url);
          })
          setTexture1(texture1);
      }
      fetchImages();
  },[])
  const meshRef=useRef(null);
  const texture1=useTexture(texturePath1);
  useFrame(()=>{
      if(meshRef.current){
          meshRef.current.material.uniforms.uTime.value+=0.0055;
      }
  });
  return(<>
        <mesh ref={meshRef}>
          <boxGeometry args={[3,3,3]}/>
          <testShaderMaterial1 uTexture={texture1}/>
        </mesh>
  </>)
}

const Cube=()=>{
     const {user}=useAuth0();
      if(user){
      console.log(user.email);
        return(
        <>
        <Suspense fallback={<h1>Hello</h1>}>
           <Canvas style={{height:"100vh",width:"100vw"}}>
           <Pattern1 email={user.email}/>
           <Sky/>
           <Sparkles count={100} scale={[10,10,10]} size={1} color="white" position={[0,0,0]}/>
           <OrbitControls/>
           </Canvas>
        </Suspense>  
        </>)
     }
     else{
         return(<>
         <Error/>
         </>)
     }
    }
export default Cube;