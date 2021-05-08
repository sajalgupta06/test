import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../style/login.css";
import cookie from 'js-cookie'

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading,setLoading] = useState(false)
  const [message,setMessage] = useState("")
  const [role,setRole] = useState("")

  const handleSignup = (e) => {
    e.preventDefault();
    setLoading(true)
    setMessage("Loading....")
    setRole("primary")
    // console.table({email,password})
    fetch('https://mail-reminder-app.herokuapp.com/auth/register',{
      method:"post",
      headers:{
        "Content-Type": "application/json",
        
      },  
      body: JSON.stringify({
        email,
        password
      }), 
    }).then(res=>res.json()).then(data=>{ 
      if(data.error){
        
        setMessage(data.error.message)
        setRole("danger")
        setLoading(true)
        setEmail("")
        setPassword("")
      }
      else{
        
        setMessage(data.message)
        setRole("success")
        setLoading(true)
        setEmail("")
        setPassword("")
        
        
      }
    })
  };
  return (
    <React.Fragment>
      <div className="container-fluid px-1 px-md-5 px-lg-1 px-xl-5 py-5 mx-auto">
        <div className="card card0 border-0">
        <h1 className="mt-2"style={{textAlign:"center"}}>Signup Form</h1>
          <div className="row d-flex">
            <div className="col-lg-6">
              <div className="card1 pb-5">
                <div className="row">
                  {" "}
                  
                </div>
                <div className="row px-3 justify-content-center mt-4 mb-5 border-line">
                  {" "}
                  <img
                    src="https://i.imgur.com/uNGdWHi.png"
                    className="image"
                  />{" "}
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card2 card border-0 px-4 py-5">
                <div className="row px-3">
                  {" "}
                  <label className="mb-1">
                    <h6 className="mb-0 text-sm">Email Address</h6>
                  </label>{" "}
                  <input
                    className="mb-4"
                    type="text"
                    name="email"
                    placeholder="Enter a valid email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />{" "}
                </div>
                <div className="row px-3">
                  {" "}
                  <label className="mb-1">
                    <h6 className="mb-0 text-sm">Password</h6>
                  </label>{" "}
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />{" "}
                </div>
                <div className="row px-3 mb-4"></div>
                {loading && <div className={`alert alert-${role}`} role="alert">
                  {message}
                </div>}
                <div className="row mb-3 px-3">
                  {" "}
                  <button
                    onClick={handleSignup}
                    type="submit"
                    className="btn btn-blue text-center"
                  >
                    Signup
                  </button>{" "}
                </div>
                <div className="row mb-4 px-3">
                  {" "}
                  <small className="font-weight-bold">
                    Already have an account?{" "}
                    <Link className="text-danger " to="/login">
                      Login
                    </Link>
                  </small>{" "}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-blue py-4">
            <div className="row px-3">
              {" "}
              <small className="ml-4 ml-sm-5 mb-2">
                Copyright &copy; {new Date().getFullYear()}. All rights
                reserved.
              </small>
              <div className="social-contact ml-4 ml-sm-auto">
                {" "}
                <span className="fa fa-facebook mr-4 text-sm"></span>{" "}
                <span className="fa fa-google-plus mr-4 text-sm"></span>{" "}
                <span className="fa fa-linkedin mr-4 text-sm"></span>{" "}
                <span className="fa fa-twitter mr-4 mr-sm-5 text-sm"></span>{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
