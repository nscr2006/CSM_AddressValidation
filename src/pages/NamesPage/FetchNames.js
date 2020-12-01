import React from "react";
import firebase from "firebase";
import "firebase/database";
import { Card, Container, Table } from "react-bootstrap";

class DisplayNames extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      names: [],
    };
  }

  componentDidMount() {
    firebase
      .database()
      .ref(`users`)
      .on("value", (snapshot) => {
        // console.log("n", snapshot);
        let names = [];
        snapshot.forEach((snap) => {
          names.push(snap.val());
        });
        this.setState({ names: names });
      });
  }
  render() {
    return (
      <div>
        <div>
          <Card bg="success" text="black">
            <Card.Body>
              <h2>Congrats!!!You are Signed Up for Door Step Delivery!</h2>
              <h3>Showing Users Signed Up for the Drone Drop Delivery</h3>
            </Card.Body>
          </Card>
        </div>
        <div>
          <Container>
            <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th>Names</th>
                </tr>
              </thead>
              <tbody>
                {this.state.names.map((data) => {
                  return (
                    <tr>
                      <td>{data.name}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Container>
        </div>
      </div>
    );
  }
}

export default DisplayNames;
