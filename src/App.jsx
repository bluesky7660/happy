import React from "react";
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css'
import Navbar from "./component/Navbar";
import Router from "./shared/Router";
import Header from "./component/Haeder";

function App() {
  const excludedRoutes = ['/signup', '/'];
  const location = useLocation();
  return (
    <div className="App">
      <div className="app_warpper">
        {!excludedRoutes.includes(location.pathname) && <Header />}
        <Router/>
        {!excludedRoutes.includes(location.pathname) && <Navbar />}
      </div>
    </div>
      
  );
}

export default App;