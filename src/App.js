import React from "react";
import Login from "./components/Login/login";
import Homepage from "./components/Home/homepage";
import { Route, Routes } from "react-router-dom";
import Signup from "./components/Signup/signup";
import Body from "./components/Body/body";
import UserState from "./context/userState";

export default function App() {
  return (
    <>
    <UserState>
      <Routes>
        <Route path="/" element={<Homepage/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/user" element={<Body/>} />
      </Routes>
    </UserState>
    </>
  )
}