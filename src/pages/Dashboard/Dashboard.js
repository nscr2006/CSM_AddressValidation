import React, { useEffect, useContext } from "react";
import { UserContext } from "../../providers/UserProvider";
import { useHistory } from "react-router-dom";
import "./dashboard.css";
export default function Dashboard() {
  let history = useHistory();
  const user = useContext(UserContext);

  useEffect(() => {
    if (user) {
      history.push("/dashboard");
    } else {
      history.push("/");
    }
  }, [user]);

  return (
    <div className="dashboard">
      <h1 className="dashboard-text">
        Welcome to the Sign up Portal of Drone Drop Delivery
      </h1>
    </div>
  );
}
