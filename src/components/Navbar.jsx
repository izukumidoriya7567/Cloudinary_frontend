import {motion} from "motion/react";
import {Canvas} from "@react-three/fiber";
import {useAuth0} from "@auth0/auth0-react";
import {Suspense,useState} from "react";
import {TbMenuOrder} from "react-icons/tb";
import {RxCross1} from "react-icons/rx";
import "../index.css";
import {BrowserRouter as Router,Routes,Route,Link} from "react-router-dom";
const variants={
    whileHover:{
      scale:1.1,
    },
    whileTap:{
      scale:1.3,
      transition:{
        duration:3.0,
        type:"spring",
      }
    }
}
const LoginButton=()=>{
  const {loginWithRedirect}=useAuth0();
  return(<>
  <motion.button variants={variants} whileTap="whileTap" whileHover="whileHover" className="md:text-[20px] font-bold" onClick={()=>loginWithRedirect()}>
      LOGIN
  </motion.button>
  </>)
}
const LogoutButton=()=>{
  const {logout}=useAuth0();
  return(<>
  <motion.button variants={variants} whileTap="whileTap" whileHover="whileHover" className="md:text-[20px] font-bold" onClick={()=>{logout()}}>
  LOGOUT
  </motion.button>
  </>)
}
const Navbar=()=>{
  const [isOpen,setIsOpen]=useState();
  const {user,isAuthenticated}=useAuth0();
  // useEffect(()=>{
     
  // },[])
  return(<>
        <nav className="bg-black text-white flex flex-row justify-between gap-[10px]">
          {
          isAuthenticated ? (
          <div className="gap-[15px] flex flex-row text-[17.5px]">
            <img className="h-[51px] w-[51px]" src={user.picture} alt={user.name}></img>
            <div className="flex flex-col">
            <p>Welcome</p>
            <p>{user.name}</p>
            </div>
          </div>
          ):(<p className="mt-[10px] ml-[5px]">Login First</p>)
        }
          <div className="hidden sm:flex flex-row gap-[10px] text-[17.5px] md:gap-[25px] md:text-[32.5px]">
          <Link to={"/circle"}><motion.div variants={variants} whileHover="whileHover" whileTap="whileTap" className="hover:text-sky-500/50">Circle</motion.div></Link>
          <Link to={"/cube"}><motion.div variants={variants} whileHover="whileHover" whileTap="whileTap" className="hover:text-sky-500/50">Cube</motion.div></Link>
          <Link to={"/wave"}><motion.div variants={variants} whileHover="whileHover" whileTap="whileTap" className="hover:text-sky-500/50">Wave</motion.div></Link>
          <Link to={"/images"}><motion.div variants={variants} whileHover="whileHover" whileTap="whileTap" className="hover:text-sky-500/50">Images</motion.div></Link>
          <Link to={"/check"}><motion.div variants={variants} whileHover="whileHover" whileTap="whileTap" className="hover:text-sky-500/50">Check</motion.div></Link>
          </div>
          <div className="mr-[15px] mt-[10px] bg-black mx-auto sm:hidden flex flex-col gap-[20px] text-[17.5px]">
              {
                isOpen ? (
                <div className="flex flex-col gap-[15px]">
                    <RxCross1 className="mr-[10px] h-[30px] w-[30px]" onClick={()=>{setIsOpen(!isOpen)}}/>
                    <div className="bg-black h-auto w-auto flex flex-col gap-[10px] p-[10px] rounded-xl">
                      <Link to={"/circle"}><motion.div>Circle</motion.div></Link>
                      <Link to={"/cube"}><motion.div>Cube</motion.div></Link>
                      <Link to={"/wave"}><motion.div>Wave</motion.div></Link>
                      <Link to={"/images"}><motion.div>Images</motion.div></Link>
                      <Link to={"/check"}><motion.div>Check</motion.div></Link> 
                    </div>
                </div>):
                (<TbMenuOrder className="flex gap-[15px] h-[35px] w-[35px]" onClick={()=>{setIsOpen(!isOpen)}}/>)  
              }
          </div>
          <div className="flex gap-[15px] text-white ">
            <LoginButton/>
            <LogoutButton/>
          </div>
        </nav>
       
  </>)
}
export default Navbar;