import {useRef,useState,useEffect, Suspense} from "react";
import {useFrame,extend,Canvas} from "@react-three/fiber";
import {useAuth0} from "@auth0/auth0-react";
import {shaderMaterial,useTexture,Stars,OrbitControls} from "@react-three/drei";
import Error from "./Error";
import Loader from "./Loader";
const TestShaderMaterial2=shaderMaterial(
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
        if(vNormal.z==1.0){
            float val=(vUv.x)*(3.0)+uTime;
            float check=mod(floor(val),2.0);
            if(check==0.0){
              gl_FragColor=texture2D(uTexture[2],vUv);
            }
            else{
              gl_FragColor=texture2D(uTexture[1],vUv);
            }
        }
        else if(vNormal.z==-1.0){
           float val=(vUv.x+uTime)*(3.0);
           float check=mod(floor(val),2.0);
           if(check==0.0){
              gl_FragColor=texture2D(uTexture[6],vUv);
           }
           else{
              gl_FragColor=texture2D(uTexture[3],vUv);
           }
        }
        else if(vNormal.y==1.0){
            float c=clamp(uTime,0.0,3.0);
            vec2 grid=vec2((vUv.x)*c,(vUv.y)*c);
            float check=mod(floor(grid.x)+floor(grid.y),2.0);
            vec2 new_grid=vec2(fract(grid.x),fract(grid.y));
            if(check==0.0){
              gl_FragColor=texture2D(uTexture[4],new_grid);
            }
            else{
              gl_FragColor=texture2D(uTexture[9],new_grid);
            }
        }
        else if(vNormal.y==-1.0){
            vec2 grid=vUv*2.0;
            vec2 new_grid=vec2(fract(grid.x),fract(grid.y));
            float dist=distance(new_grid,vec2(0.5,0.5)); 
            if(dist<=0.3507){
                gl_FragColor=texture2D(uTexture[7],new_grid);
            }
            else{
                gl_FragColor=vec4(abs(sin(new_grid.x*3.14+uTime)),abs(cos(new_grid.y*3.14+uTime)),abs(sin(new_grid.x+uTime)*cos(new_grid.y+uTime)),1.0);
            }
        }
        else if(vNormal.x==1.0){
             float x=(vUv.x-0.5);
             float y=(vUv.y-0.5);
             float radius=pow(x,2.0)+pow(y,2.0);
             if(radius<=0.16){
                gl_FragColor=texture2D(uTexture[0],vUv);
             }
             else{
                vec2 uv=vUv;
                float x=uv.x;
                float y=uv.y;
                float radius=(pow(x,2.0)+pow(y,2.0)+uTime)*16.0;
                float val=mod(floor(radius),4.0);
                if(val==0.0){
                    gl_FragColor=vec4(sqrt(uv.x+uv.y),sin(uv.x*3.14+uTime),cos(uv.y*3.14+uTime),1.0);
                }
                else if(val==1.0){
                    gl_FragColor=vec4(sin(uTime),cos(uTime),sin(uTime)*cos(uTime),1.0);
                }
                else if(val==2.0){
                    gl_FragColor=vec4(cos(uv.x*3.14+uTime)*sin(uv.x*3.14+uTime),sqrt(sin(uv.x+uv.y+uTime)),sin(uv.y*3.14+uTime),1.0);
                }
                else if(val==3.0){
                    gl_FragColor=vec4(vUv.x,vUv.y,sin(uTime+cos(uTime)*50.0),1.0);
                }    
             }
        }
        else if(vNormal.x==-1.0){
            float x=(vUv.x-0.5);
            float y=(vUv.y-0.5);
            float radius=pow(x,2.0)+pow(y,2.0);
            if(radius<=0.16){
                gl_FragColor=texture2D(uTexture[2],vUv);
            }
            else{
                vec2 uv=vUv;
                float x=uv.x;
                float y=uv.y;
                float radius=(pow(x,2.0)+pow(y,2.0)+uTime)*16.0;
                float val=mod(floor(radius),4.0);
                if(val==0.0){
                    gl_FragColor=vec4(sqrt(uv.x+uv.y),sin(uv.x*3.14+uTime),cos(uv.y*3.14+uTime),1.0);
                }
                else if(val==1.0){
                    gl_FragColor=vec4(sin(uv.x*3.14+uTime),cos(uv.y*3.14+uTime),sqrt(uv.x+uv.y),1.0);
                }
                else if(val==2.0){
                    gl_FragColor=vec4(cos(uv.x*3.14+uTime),sqrt(sin(uv.x+uv.y+uTime)),sin(uv.y*3.14+uTime),1.0);
                }
                else if(val==3.0){
                    gl_FragColor=vec4(0.85,0.65,0.35,1.0);
                }    
            }
        }
    }
    `,
)
extend({TestShaderMaterial2});
const Pattern=({email})=>{
    const[texturePath2,setTexture2]=useState([]);
    useEffect(()=>{
        const endPoint=`https://cloudinary-backend-sooty.vercel.app/image/${email}/circle`;
        async function fetchImages(){
            try{
                const res=await fetch(endPoint,{
                    method:"GET",
                })
                const arr=await res.json();
                const texture2=[];
                arr.map((image)=>{
                    texture2.push(image.url);
                })
                texture2.map((path)=>{
                    useTexture.preload(path);
                })
                setTexture2(texture2);
            }
            catch(e){
                 console.log(`Error in fetching images at Circle:${e}`);
            }
        }
        fetchImages();
    },[])
    const textures2=useTexture(texturePath2);
    const meshRef=useRef(null);
    useFrame(()=>{
        if(meshRef.current){
            meshRef.current.material.uniforms.uTime.value+=0.0055;
        }
    })
    return(<>
    <mesh ref={meshRef}>
        <boxGeometry args={[2.5,2.5,2.5]}/>
        <testShaderMaterial2 uTexture={textures2}/>
    </mesh>
    </>)
}
const Circle=()=>{
    const {user}=useAuth0();
    if(user){
        return(
            <>
            
            <Canvas style={{height:'100vh',width:'100vw',backgroundColor:"black"}} camera={{position:[0,0,5],fov:75}}>
            <Suspense fallback={<Loader/>}>
            <Pattern email={user.email}/>
            <OrbitControls enableZoom={false} enablePan={false} enableRotate={true}/>
            <ambientLight intensity={0.5}/>
              <directionalLight position={[0,0,5]} intensity={1}/> 
            <Stars/>
            </Suspense>
            </Canvas>
           
     </>)
    }
    else{
        return(<>
           <Error/>
        </>)
    }   
}
export default Circle;