import React, { useEffect, useContext, useState } from "react";
import "./login.css";

import { UserContext } from "./providers/UserProvider";
import { useHistory } from "react-router-dom";
export default function Login() {
  let history = useHistory();
  const user = useContext(UserContext);

  useEffect(() => {
    if (localStorage.getItem("userId")) {
      localStorage.removeItem("userId");
    }
    if (user) {
      history.push("/dashboard");
    } else {
      history.push("/");
    }
  }, [user]);

  return (
    <div className="login-buttons">
      <h1>Welcome to Drone Drop Delivery Portal</h1>
      <p>Please Sign In in order to opt the door step delivery</p>
    </div>
  );
}
