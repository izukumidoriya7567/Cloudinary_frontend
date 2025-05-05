import React from "react";
import {Outlet} from "react-router-dom";
import Navbar from "./Navbar";
const MainLayout=()=>{
    return(<>
        <div>
        <Navbar/>
        <div style={{ padding: '1rem' }}>
          <Outlet/>
        </div>
        </div>
        </>)
}
export default MainLayout;