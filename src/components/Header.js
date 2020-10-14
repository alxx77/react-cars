import store from "./Store";
import React, { useState } from "react";
import "./Header.css";
import { signOutUser } from "./actions";
import { useHistory } from "react-router-dom";

function Header() {
  const [user, setUser] = useState(store.getState().user);

  const history = useHistory();

  function handleSignOut() {
    store.dispatch(signOutUser());
    setUser(store.getState().user);
    history.push("/");
  }

  let user_navbar_element = null;

  if (user.username != null) {
    user_navbar_element = (
      <div className="topnav_right">

          
          <button onClick={handleSignOut} className="button_link">
          <i className="fas fa-sign-out-alt"></i> {user.username}
          </button>

      </div>
    );
  } else {
    user_navbar_element = (
      <div className="topnav_right">
        <a href="/signin">Sign In</a>
      </div>
    );
  }

  return (
    <div>
      <nav className="topnav">
        <a href="/">Home</a>
        <a href="/settings">Settings</a>
        {user_navbar_element}
      </nav>
    </div>
  );
}

export default Header;
