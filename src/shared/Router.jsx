import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Chat from "../pages/Chat";
import User from "../pages/User";

const Router = () => {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="home" element={<Home />} />
        <Route path="user" element={<User />} />
        <Route path="chat" element={<Chat />} />
      </Routes>
  );
};

export default Router;