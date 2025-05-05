import {BrowserRouter as Router,Route,Routes} from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Circle from "./components/Circle";
import Cube from "./components/Cube";
import Wave from "./components/Wave";
import Images from "./components/Images";
import Check from "./components/Check";
const App=()=>{
      return(<>
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout/>}>
              <Route path="/cube" element={<Cube/>}/>
              <Route path="/wave" element={<Wave/>}/>
              <Route path="/circle" element={<Circle/>}/>
              <Route path="/images" element={<Images/>}/>
              <Route path="/check" element={<Check/>}/>
            </Route>
          </Routes>
        </Router>
    </>)
}
export default App;