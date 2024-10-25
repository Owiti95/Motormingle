import React from "react";
import { Link } from "react-router-dom";
import "../index.css"; // We'll style the page in this file

const Home = () => {
  return (
    <div className="root-container">
      <div className="background-carousel">
        {/* You can add more image URLs here for the background */}
        <div className="bg-img img-1"></div>
        <div className="bg-img img-2"></div>
        <div className="bg-img img-3"></div>
        <div className="bg-img img-4"></div>
        <div className="bg-img img-5"></div>
        <div className="bg-img img-6"></div>
        <div className="bg-img img-7"></div>
      </div>
      <div className="overlay">
        <div className="content">
          <h1>
            <i>Welcome to MotorMingle!</i>
          </h1>
          <h2>
            <i>A Home for Car Enthusiasts</i>
          </h2>
          <div className="button-container">
            <Link to="/login" className="button login-button">
              Login
            </Link>
            <Link to="/register" className="button signup-button">
              Sign Up
            </Link>
            <Link to="/events" className="button guest-button">
              Continue as Guest
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
