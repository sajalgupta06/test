import cookie from "js-cookie";
import React from "react";
import { Link, useHistory } from "react-router-dom";
import { isAuth } from "./helper";

export default function Header() {
  const history = useHistory()

  const logout=()=>{
    history.replace('/')
    history.go(0)
    localStorage.clear()
    cookie.remove('access')
    cookie.remove('userId')
  }
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            Reminder App
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
           
              {isAuth() && (<Link className="nav-link active" aria-current="page" to="/home">
                  Home
                </Link>
              )}{" "}
              {!isAuth() && (<Link className="nav-link" to="/login">
                  Login
                </Link>
              )}
              {!isAuth() && ( <Link className="nav-link" to="/signup">
                  Signup
                </Link>
              )}
              {isAuth() && ( <div>
                <button onClick={()=>{logout()}}
                className=" btn btn-primary"
                name="button"
              > Logout
              </button>
              </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
