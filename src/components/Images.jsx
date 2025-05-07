import {motion,AnimatePresence} from "motion/react";
import {useDropzone} from "react-dropzone";
import {useEffect,useRef,useState,useCallback} from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import {HiMiniArrowDownTray} from "react-icons/hi2";
import {RxCross2} from "react-icons/rx";
import {useAuth0} from "@auth0/auth0-react";
import Error from "./Error";
import "../index.css";
const variants={
     whileHover:{
       scale:1.2,
     }
}
const Images=()=>{
  const optionRef1=useRef(null);
  const optionRef=useRef(null);
  const {user}=useAuth0();
  const [images,setImages]=useState([]);
  const [acceptedFiles,setAcceptedFiles]=useState([]);
  const [rejectedFiles,setRejectedFiles]=useState([]);
  const onDrop=useCallback((acceptedFiles,rejectedFiles)=>{
    if(acceptedFiles?.length){
        setAcceptedFiles((prev)=>{
          return [...prev,...acceptedFiles.map((file)=>
            Object.assign(file,{preview: URL.createObjectURL(file)})
          )]
        })
    }
    if(rejectedFiles?.length){
        setRejectedFiles((prev)=>{
            return [...prev,...rejectedFiles];
        })
    }
})
const {getInputProps,getRootProps,isDragActive}=useDropzone({
  onDrop:onDrop,
  maxFiles:10,
})
  if(!user){
    return(<>
      <Error/>
    </>)
  }
  else{
    const email=user.email;
    const retrieveImages=async()=>{
         const endPoint=`https://cloudinary-backend-sooty.vercel.app/image/arpitghr12@gmail.com/cube`
         const image_data=await fetch(endPoint,{
            method:"GET",
         });
         const arr=await image_data.json();
         console.log(arr);
         setImages(arr);
    }
    const removeRejectedFiles=(file)=>{
      setRejectedFiles((prev)=>{
          return [...prev].filter((x)=>x!==file);
      });       
    }
    const removeImage=(file)=>{
      setImages((prev)=>{
       return [...prev].filter((x)=>x!==file) 
      })
    } 
    const removeFile=(file)=>{
        setAcceptedFiles((prev)=>{
            return [...prev].filter((x)=>x!==file);
         })
    }
    const deleteFile=async(public_id)=>{
        try{
          const endPoint=`https://cloudinary-backend-sooty.vercel.app/images/${public_id}`;
          const res=await fetch(endPoint,{
            method:"DELETE",
          })
          const ans=await res.json();
          alert(ans.message);
        }
        catch(e){
          alert(`Error: ${e}`);
        }
    }
    const removeAllFiles=()=>{
        setAcceptedFiles([]);
        setRejectedFiles([]);
    }
    const uploadToCloudinary=async()=>{
       [...acceptedFiles].map(async (file)=>{
            const data=new FormData();
            data.append("file",file);
            data.append("upload_preset","Optimus_Prime");
            data.append("cloud_name","dfwyxz77d");
            data.append("folder",`${email}/${optionRef.current.value}`);
            const result=await fetch("https://api.cloudinary.com/v1_1/dfwyxz77d/image/upload",{
               method:"POST",
               body:data,
            })
            if(result.status===200){
              alert("All the Images have been uploaded successfully");
            }
            else{
              alert("Image cannot be uploaded");
            }
       })
       setAcceptedFiles([]);
    }
    return(<>
      {/*Dropzone*/}
      <div {...getRootProps()} className="w-full h-[250px] md:h-[350px] rounded-3xl outline-2 outline-offset-2 outline-sky-500 flex justify-center items-center bg-cyan-200/25">
        <HiMiniArrowDownTray className="size-[60px]"/>
        {
        isDragActive ?
         <p>Drop Your Files Here</p>
        :<p>Drag Your file and drop them here</p>
        }
        <input {...getInputProps()}/>
      </div>
      {/*Options Quick*/}
      <div className="my-[15px]">
        <h1 className="m-[10px] font-bold text-[25px] md:text-[35px]">Where to upload</h1>
          <select className="outline-2 outline-sky-500 h-[35px] w-[55px] md:h-[50px] md:w-[80px] text-[15px] md:text-[25px] rounded-xl" ref={optionRef} name="fruits">
            <option className="flex justify-center items-center" value="cube">Cube</option>
            <option className="flex justify-center items-center" value="circle">Circle</option>
            <option className="flex justify-center items-center" value="waves">Waves</option>
            <option className="flex justify-center items-center" value="book">Book</option>
          </select>
      </div>
      <div className="my-[27.5px] flex flex-row justify-between">
        <motion.button whileHover={{scale:1.1}} whileTap={
          {
            scale:[0.85,1.10],
            transition:{
              delay:1.0,
              type:"keyframes",
              duration:6.0,
            }
          }
        }
        className="bg-cyan-400 text-[15px] md:text-[20px] hover:bg-sky-400 font-bold rounded-xl p-[10px]" onClick={()=>{removeAllFiles()}}>
        Remove All Files
      </motion.button>
      <motion.button whileHover={
        {
          scale:1.1,
        }} 
        whileTap={
          {
            scale:[0.85,1.10],
            transition:{
              type:"keyframes",
              delay:1.0,
              duration:6.0,
            }
          }
          } className="bg-cyan-400 text-[15px] md:text-[20px] hover:bg-sky-400 font-bold rounded-xl p-[10px]" onClick={()=>{uploadToCloudinary()}}>
        Upload To Cloudinary
      </motion.button>
      </div>

      {/*Uploaded Images*/}
      <div className="flex my-[15px] justify-center items-center">
          <motion.h1 variants={variants} whileHover="whileHover" className="mx-auto text-[30px] md:text-[40px] text-[blue] font-bold">Uploaded Images</motion.h1>
      </div>
      <ScrollToBottom className="rounded-xl bg-cyan-200/25 outline-2 outline-blue-500/25 w-full h-[175px] md:h-[300px]">
          <ul className="flex flex-row flex-wrap ml-[5px] mt-[10px] ml-[10px] gap-[20px]">
            <AnimatePresence>
             {[...images].map((image,index)=>{
                return(
                  <motion.li key={index} initial={{opacity:0.0}} animate={{opacity:1.0,
                    transition:{
                       delay:1.0,
                       type:"spring",
                       duration:2.0,
                    }
                  }} exit={{opacity:0}} className="flex flex-col justify-center items-center ">
                    <img src={image.url} className="size-[100px] md:size-[150px] rounded-xl"/>
                    <motion.button className="size-[27.5px] md:size-[50px] bg-red-500 rounded-xl" 
                    whileTap={{
                      scale:1.15,
                      transition:{
                        type:"spring",
                        duration:2.0,
                      }
                    }} 
                    onClick={()=>{
                      deleteFile(image.public_id);
                      removeImage(image);
                    }}>
                      <RxCross2 className="mx-auto size-[27.5px] md:size-[50px]"/>
                    </motion.button>
                  </motion.li>
                )
             })}
             </AnimatePresence>
          </ul>
      </ScrollToBottom>
      <div className="my-[15px]">
        <select className="outline-2 outline-sky-500 h-[35px] w-[55px] md:h-[50px] md:w-[80px] text-[15px] md:text-[25px] rounded-xl" ref={optionRef1} name="fruits">
            <option value="cube">Cube</option>
            <option value="circle">Circle</option>
            <option value="waves">Waves</option>
            <option value="book">Book</option>
        </select>
      </div>
      <motion.button whileHover={{scale:1.1}} whileTap={
         {
           scale:[0.85,1.1],
           transition:{
            delay:1.0,
            duration:4.0,
            type:"keyframes",
           }
         }
       }
        className="bg-cyan-400 text-[15px] mt-[30px] md:text-[20px] hover:bg-sky-400 font-bold rounded-xl p-[10px]" onClick={()=>{retrieveImages()}}>
        Retrieve Images
      </motion.button>
      {/*Accepted Files*/}
      <div className="flex my-[15px] justify-center items-center">
        <span><motion.h1 className="text-[30px] md:text-[40px] font-bold text-[blue]" variants={variants} whileHover="whileHover">Accepted Files</motion.h1><motion.p></motion.p></span>
      </div>
        <ScrollToBottom className="outline-2 outline-blue-500 rounded-xl bg-cyan-200/25 outline-solid w-full h-[175px] md:h-[300px]">
          <ul className="flex flex-row flex-wrap gap-[20px] mt-[10px] ml-[10px]">
            <AnimatePresence>  
          {
            [...acceptedFiles].map((file,index)=>{
              return(
                <motion.li key={index} 
                  exit={{ 
                    opacity: 0, 
                    transition:{ 
                      type:"spring",
                      duration:1.5,
                    }
                  }}
                className="flex flex-col items-center justify-center" layout>
                <img src={file.preview} className="size-[100px] md:size-[150px] rounded-3xl" alt={`Accepted Files:${index}`}/>
                <motion.button className="bg-red-500 mx-auto rounded-xl" whileTap={{
                  scale:1.2,
                  transition:{
                    type:"spring",
                    duration:1.5,
                  }
                }} onClick={()=>removeFile(file)}>
                  <RxCross2 className="size-[27.5px] md:size-[50px]"/>
                </motion.button>
                </motion.li>
              )
          }) 
       }
            </AnimatePresence>
          </ul>
        </ScrollToBottom>
        {/*Rejected Files*/}
        <div className="mt-[20px]">
          <motion.h1 className="flex justify-center items-center text-[blue] font-bold text-[30px] md:text-[45px]" variants={variants} whileHover="whileHover">Rejected Files</motion.h1>
        </div>
        <ScrollToBottom className="mt-[30px] rounded-xl outline-2 outline-blue-500/25 bg-cyan-200/25 w-full h-[175px] md:h-[400px]">
          <ul>
            <AnimatePresence>
             {
              [...rejectedFiles].map((file,index)=>{
                return(
                  <motion.li key={index} 
                  exit={{
                     opacity:0.0,
                     duration:{
                      type:"spring",
                      duration:1.5,
                     }
                  }}
                  className="flex flex-col gap-[10px] w-full">
                    <div>
                    <p className="font-bold text-[25px]">{file.errors[0].message}</p>
                    <p className="font-bold">{file.file.name}</p>
                    </div>
                    <motion.button className="size-[27.5px] md:size-[40px] bg-red-500/75 rounded-xl" onClick={()=>removeRejectedFiles(file)}>
                       <RxCross2 className="size-[27.5px] md:size-[40px]"/>
                    </motion.button>
                  </motion.li>
                )
              })
             }
             </AnimatePresence>
           </ul>
        </ScrollToBottom>
      </>)
  }
}
export default Images;