import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation,
  useHistory,
} from "react-router-dom";
import "./App.css";
import Login from "./Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import UserProvider from "./providers/UserProvider";
import NavigationBar from "./pages/Navbar/Navbar";
import AddressForm from "./pages/AddressPage/AddressForm";

import DisplayNames from "./pages/NamesPage/FetchNames";

const GuardedRoute = ({ component: Component }) => (
  <Route
    render={(props) =>
      localStorage.getItem("userId") ? (
        <Component {...props} />
      ) : (
        <Redirect to="/" />
      )
    }
  />
);

function App() {
  return (
    <UserProvider id="parallex-image">
      <Router>
        <NavigationBar />
        <div className="App">
          <Switch>
            <Route exact path="/">
              <Login />
            </Route>
            <Route path="/dashboard">
              <Dashboard />
            </Route>
            <Route exact path="/newAddress">
              <AddressForm />
            </Route>
            <GuardedRoute path="/usersSignedin" component={DisplayNames} />
          </Switch>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
