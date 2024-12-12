import Chat from "../pages/Chat";
import Navbar from "../component/Navbar";
import { useLocation } from 'react-router-dom';

function Home() {
    //const location = useLocation();
    // const [naviSwitch, setNaviSwitch] = useState(true);

    // useEffect(() => {
    //   if (noneHeaderPath.includes(location.pathname)) {
    //     setNaviSwitch(false);
    //   } else {
    //     setNaviSwitch(true);
    //   }
    // }, [location.pathname]);
    return (
      <>
      <div id="home" className="home">
        <div>
            <h1>Home</h1>
        </div>
        <div className="content">
          <p>환영합니다.</p>
        </div>
        {/* <Navbar/> */}
      </div>
        
      </>
    )
  }
  
  export default Home