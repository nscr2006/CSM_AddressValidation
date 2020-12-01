import React, { useContext } from "react";
import { UserContext } from "../../providers/UserProvider";
import { Navbar, Nav } from "react-bootstrap";
import { signInWithGoogle, logOut } from "../../services/firebase";
import { useHistory } from "react-router-dom";
export default function NavigationBar() {
  const user = useContext(UserContext);
  let history = useHistory();

  var redirectTo = (path) => {
    history.push(path);
  };
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand>D3 Portal</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        {user ? (
          <Nav className="mr-auto">
            <Nav.Link onClick={(event) => redirectTo("/newAddress")}>
              New Address
            </Nav.Link>
            {/* <Nav.Link onClick={(event) => redirectTo("/usersSignedin")}>
              UsersSignedIn
            </Nav.Link> */}
          </Nav>
        ) : (
          <Nav className="mr-auto"></Nav>
        )}

        <Nav>
          {!user ? (
            <Nav.Link eventKey={2} onClick={signInWithGoogle}>
              Sign In
            </Nav.Link>
          ) : (
            <Nav.Link eventKey={2} onClick={logOut} href="/">
              Sign Out
            </Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
