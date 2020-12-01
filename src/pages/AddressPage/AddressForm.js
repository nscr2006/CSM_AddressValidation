import React, { useEffect, useState } from "react";
import { Form, Button, Col } from "react-bootstrap";
import { useStore } from "../../component/zustand/store";
import { useHistory } from "react-router-dom";
import firebase from "firebase/app";

function AddressForm() {
  useEffect(() => {
    if (localStorage.getItem("userId")) {
      localStorage.removeItem("userId");
    }
  });

  const address1 = useStore((state) => state.address1);
  const address2 = useStore((state) => state.address2);
  const city = useStore((state) => state.city);
  const states = useStore((state) => state.states);
  const zipcode = useStore((state) => state.zipcode);

  const setAddress1 = useStore((state) => state.setAddress1);
  const setAddress2 = useStore((state) => state.setAddress2);
  const setCity = useStore((state) => state.setCity);
  const setStates = useStore((state) => state.setStates);
  const setZipCode = useStore((state) => state.setZipCode);

  const [isSubmit, isSetSubmit] = useState(false);
  const [isValid, isSetValid] = useState(false);

  const [iserror, isSetError] = useState(false);
  const [errMsg, isSetErrMsg] = useState(false);

  const [addressExists, setAddressStatus] = useState(false);

  let history = useHistory();
  const handleVerify = async (e) => {
    e.preventDefault();
    isSetSubmit(true);

    try {
      const apiKey = "43437314387927835";
      const baseUrl = "https://us-street.api.smartystreets.com/";
      let response = await fetch(
        encodeURI(
          `${baseUrl}street-address?street=${address1}&city=${city}&state=${states}&zipcode=${zipcode}&key=${apiKey}&candidates=1`
        )
      );

      let results = await response.json();
      // console.log("result", results[0]);

      if (
        results &&
        results.length > 0 &&
        results[0].metadata?.latitude &&
        results[0].metadata?.longitude &&
        results[0].components?.zipcode === zipcode &&
        results[0].components?.city_name.toLowerCase().split(" ").join("") ===
          city.toLowerCase() &&
        results[0].components?.state_abbreviation === states
      ) {
        isSetValid(true);

        isSetSubmit(false);
        const lat = results[0].metadata?.latitude;
        const long = results[0].metadata?.longitude;
        let isAddrExists = false;

        // retreive user info

        setAddressStatus(false);
        const userId = firebase.auth().currentUser.uid;
        let currentUserAddress = [];

        // read user single user info

        let allExistingUsers = [];
        let currentUser;

        firebase
          .database()
          .ref("users")
          .once("value")
          .then((snapshot) => {
            if (snapshot.val()) {
              allExistingUsers = [...snapshot.val()];

              currentUser = allExistingUsers.find((user) => {
                if (user.userId === userId) {
                  return user;
                }
              });
              if (currentUser) {
                currentUserAddress = [...currentUser.address];
                for (let i = 0; i < currentUserAddress.length; i++) {
                  debugger;
                  if (
                    lat === currentUserAddress[i].lat &&
                    long === currentUserAddress[i].long
                  ) {
                    setAddressStatus(true);
                    isAddrExists = true;

                    break;
                  }
                }
              }
            }

            if (isAddrExists) {
              // show error
              isSetError(true);
              isSetErrMsg(
                "Same  address already exists for this user!Please Enter new address."
              );

              setTimeout(() => {
                isSetError(false);
                isSetErrMsg("");
              }, 3000);
            } else {
              // store
              const address = {
                addr1: address1,
                addr2: address2,
                city: city,
                state: states,
                zipcode: zipcode,
                lat: results[0].metadata.latitude,
                long: results[0].metadata.longitude,
              };
              let userInfoPayload = {
                name: firebase.auth().currentUser.displayName,
                userId: firebase.auth().currentUser.uid,
                address: [],
                isVerified: true,
              };
              userInfoPayload.address.push(address);
              currentUserAddress.push(address);
              userInfoPayload.address = [...currentUserAddress];

              // wirte the user info

              let users = [];
              if (allExistingUsers && allExistingUsers.length > 0) {
                users = [...allExistingUsers];
                let updateCurrentUser = false;
                for (let i = 0; i < users.length; i++) {
                  if (users[i].userId === currentUser?.userId) {
                    users[i].address.push(address);
                    updateCurrentUser = true;
                    break;
                  }
                }
                if (updateCurrentUser) {
                  firebase.database().ref().set({
                    users: users,
                  });
                } else {
                  users.push(userInfoPayload);
                  firebase.database().ref().set({
                    users: users,
                  });
                }
              } else {
                users.push(userInfoPayload);
                firebase.database().ref().set({
                  users: users,
                });
              }
              if (currentUser) {
                localStorage.setItem(
                  "userId",
                  JSON.stringify(currentUser.userId)
                );
              } else {
                localStorage.setItem(
                  "userId",
                  JSON.stringify(userInfoPayload.userId)
                );
              }
              history.push("/usersSignedin");
            }
          });
      } else {
        isSetError(true);
        isSetErrMsg("Please enter a Valid address");

        setTimeout(() => {
          isSetError(false);
          isSetErrMsg("");
        }, 5000);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      {iserror ? (
        <div className="alert alert-danger" role="alert">
          {errMsg}
        </div>
      ) : null}

      <h1>Please Enter the Address to Sign Up for Drone Delivery Services</h1>
      <Form onSubmit={handleVerify}>
        <Form.Group controlId="formGridAddress1">
          <Form.Label>Address1</Form.Label>
          <Form.Control
            placeholder="1234 Main St"
            onChange={(evt) => setAddress1(evt.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formGridAddress2">
          <Form.Label>Address 2</Form.Label>
          <Form.Control
            placeholder="Apartment, studio, or floor"
            onChange={(evt) => setAddress2(evt.target.value)}
          />
        </Form.Group>

        <Form.Row>
          <Form.Group as={Col} controlId="formGridCity">
            <Form.Label>City</Form.Label>
            <Form.Control
              placeholder="ex:Mcdonald "
              onChange={(evt) => setCity(evt.target.value)}
              required
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridState">
            <Form.Label>State</Form.Label>
            <Form.Control
              as="select"
              defaultValue="Choose..."
              onChange={(evt) => setStates(evt.target.value)}
            >
              <option>Choose...</option>
              <option value="AL">Alabama</option>
              <option value="AK">Alaska</option>
              <option value="AZ">Arizona</option>
              <option value="AR">Arkansas</option>
              <option value="CA">California</option>
              <option value="CO">Colorado</option>
              <option value="CT">Connecticut</option>
              <option value="DE">Delaware</option>
              <option value="DC">District Of Columbia</option>
              <option value="FL">Florida</option>
              <option value="GA">Georgia</option>
              <option value="HI">Hawaii</option>
              <option value="ID">Idaho</option>
              <option value="IL">Illinois</option>
              <option value="IN">Indiana</option>
              <option value="IA">Iowa</option>
              <option value="KS">Kansas</option>
              <option value="KY">Kentucky</option>
              <option value="LA">Louisiana</option>
              <option value="ME">Maine</option>
              <option value="MD">Maryland</option>
              <option value="MA">Massachusetts</option>
              <option value="MI">Michigan</option>
              <option value="MN">Minnesota</option>
              <option value="MS">Mississippi</option>
              <option value="MO">Missouri</option>
              <option value="MT">Montana</option>
              <option value="NE">Nebraska</option>
              <option value="NV">Nevada</option>
              <option value="NH">New Hampshire</option>
              <option value="NJ">New Jersey</option>
              <option value="NM">New Mexico</option>
              <option value="NY">New York</option>
              <option value="NC">North Carolina</option>
              <option value="ND">North Dakota</option>
              <option value="OH">Ohio</option>
              <option value="OK">Oklahoma</option>
              <option value="OR">Oregon</option>
              <option value="PA">Pennsylvania</option>
              <option value="RI">Rhode Island</option>
              <option value="SC">South Carolina</option>
              <option value="SD">South Dakota</option>
              <option value="TN">Tennessee</option>
              <option value="TX">Texas</option>
              <option value="UT">Utah</option>
              <option value="VT">Vermont</option>
              <option value="VA">Virginia</option>
              <option value="WA">Washington</option>
              <option value="WV">West Virginia</option>
              <option value="WI">Wisconsin</option>
              <option value="WY">Wyoming</option>
            </Form.Control>
          </Form.Group>

          <Form.Group as={Col} controlId="formGridZip">
            <Form.Label>Zip-Code</Form.Label>
            <Form.Control
              placeholder="ex:12345"
              onChange={(evt) => setZipCode(evt.target.value)}
              required
            />
          </Form.Group>
        </Form.Row>

        <Button variant="primary" type="submit">
          Verify
        </Button>
      </Form>
    </div>
  );
}

export default AddressForm;
