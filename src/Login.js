import React, { useState } from "react";
import "./Login.css";
import {useHistory } from "react-router-dom";
import axios from "axios";
import store from "./components/Store";
import { signInUser } from "./components/actions";

function Login() {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials=true;
    let res = await axios.post(
      `http://localhost:3003/api/register/?email=${email}&password=${password}`);
    
     if(res.data.success===false){
       alert(res.data.error)
     } else{
       alert("User Registered...!")
     }
     
  };

  const signIn = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials=true;
    let user = await axios.post(
      `http://localhost:3003/api/signin/?email=${email}&password=${password}`);

    store.dispatch(signInUser(user.data));
    history.push("/");
  };

  return (
    <div className="login">
      <img alt="" className="login__logo" src="" />

      <div className="login__container">
        <h1>Sign-in</h1>

        <form>
          <h5>E-mail</h5>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <h5>Password</h5>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            onClick={signIn}
            className="login__signInButton"
          >
            Sign In
          </button>
        </form>

        <button onClick={register} className="login__registerButton">
          Create your Account
        </button>
      </div>
    </div>
  );
}

export default Login;
