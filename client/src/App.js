import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Header from './components/Header'
import Signup from './components/Signup'
import Dashboard from './components/Dashboard'
import Login from "./components/Login";
import { useEffect } from "react";
import cookie from "js-cookie";
import {useHistory} from 'react-router-dom'
import LandingPage from "./components/LandingPage";

const Routing = () => {
  const history = useHistory()
  
  useEffect(()=>{
    if(!cookie.get("access")){
      history.push('/')
    }
    if(cookie.get("access")){
      history.push('/home')
    }
  })
  return (
    <Switch>
      <Route exact path="https://mail-reminder-app.herokuapp.com//signup" component={Signup}></Route>
      <Route exact path=" https://mail-reminder-app.herokuapp.com/" component={LandingPage}></Route>
      <Route exact path="https://mail-reminder-app.herokuapp.com//login" component={Login}></Route>
      <Route exact path="https://mail-reminder-app.herokuapp.com//home" component={Dashboard}></Route>
    </Switch>
  );
};

function App() {
  return (
    <BrowserRouter>
    <Header></Header>
      <Routing></Routing>
    </BrowserRouter>
  );
}

export default App;
