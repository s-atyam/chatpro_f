import React from "react";
import img_dp from '../images/chat.gif'
import logo_dp from '../images/logo.png'
import { Link } from "react-router-dom";

const Homepage = () => {
  
  return (
    <div className="w-screen h-screen bg-slate-900 flex flex-col justify-between">
     
      {/* navbar */}
      <div className="h-fit w-full flex  justify-around items-center mt-5 overflow-hidden">
        <div className="w-1/3 flex md:w-[12%]  md:mr-12">
          <img src={logo_dp} alt="" />
        </div>
        <div className="w-fit flex py-2">
          <Link to='/signup' className="border-2 font-medium text-lg border-blue-500 text-blue-500 mx-2 px-4 py-1 rounded-sm hover:text-blue-900 hover:border-blue-900">
            Signup
          </Link>
          <Link to='/login' className="border-2 font-medium text-lg border-green-500 text-green-500 mx-2 px-4 py-1 rounded-sm hover:text-green-900 hover:border-green-900">
            Login
          </Link>
        </div>
      </div>

      {/* info */}
      <div className="text-slate-400 w-full h-3/4 md:h-5/6 flex justify-center items-center flex-wrap">
        <div className="h-1/3 flex md:h-1/2 md:mr-12">
          <img src={img_dp} alt="" className="mx-auto" />
        </div>
        <div className="w-5/6  md:w-2/5 h-fit flex flex-col ">
          <h1 className="font-light text-7xl mb-1 overflow-hidden">
            Chat<span className="text-blue-600">Pro</span>
          </h1>
          <h2 className="font-normal text-2xl ml-1 mb-5 overflow-hidden">
            Elevating Your Digital Discourse
          </h2>
          <p className="font-semibold text-md mb-10">
            Welcome to Chat<span className="text-blue-600">Pro</span>, the
            ultimate platform designed to amplify your daily digital
            interactions. Chat<span className="text-blue-600">Pro</span>{" "}
            empowers you with a suite of cutting-edge features to optimize your
            online communication and redefine your digital landscape
          </p>
          <Link to='/signup' className="border-2 border-slate-400 font-semibold w-fit text-xs px-8 py-2 rounded-md hover:text-blue-500 hover:border-blue-500">
            Get Started
          </Link>
        </div>
      </div>

      {/* footer */}
      <div className="text-slate-400 md:text-lg mb-4 font-semibold w-full flex items-center justify-center flex-wrap">
        <span className="mx-1 text-sm">Contact</span>
        {/* <span className="mr-3 ">.</span> */}
        <span className="mx-1 text-sm">Feedback</span>
        {/* <span className="mr-3 ">.</span> */}
        <span className="mx-1 text-sm text-blue-700">
          Terms of Service <span className="text-slate-400">and</span> Privacy
          Policy
        </span>
        {/* <span className="mr-3 ">.</span> */}
        <span className="mx-1 text-sm">About us</span>
      </div>
    </div>
  );
};

export default Homepage;
