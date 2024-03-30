import { useState } from "react";
import styles from "./styles.module.css";

export default function Login(props) {
  const [toggle, setToggle] = useState(true);
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
  });

  //handle's the user input as they type
  function handleCredentials(event) {
    const { name, value } = event.target;
    setCredentials((prevValue) => {
      return { ...prevValue, [name]: value };
    });
    console.log("handling credentials");
  }
  //submits and sends the user credentials for Login to the server side
  async function submitCredentials(event) {
    props.onLogin(credentials);
    event.preventDefault();
  }
  //submits and sends the user credentials for Register to the server side
  async function submitRegistration(event) {
    props.onRegister(credentials);
    event.preventDefault();
  }

  function hideLogin() {
    //hide input element for name
    document.getElementById("show_register").hidden = !toggle;
    //const isRequired = false
    setToggle(false);
  }

  function hideRegister() {
    //hide input element for name
    document.getElementById("show_register").hidden = !toggle;
    //const isRequired = false
    setToggle(true);
  }

  return (
    <div className={styles.container}>
      <div className={styles.LoginContainer}>
        <div className={styles.formCard}>
          <h1>Welcome to prOOject</h1>
          <p>a codsoft intership project</p>

          <form
            className={styles.formContainer}
            onSubmit={toggle ? submitCredentials : submitRegistration}
          >
            <h2>Login Here</h2>
            <input
              className={styles.loginInput}
              hidden={toggle}
              id="show_register"
              onChange={handleCredentials}
              value={credentials.name}
              type="text"
              required={!toggle}
              name="name"
              placeholder="What's your name?"
            />
            <input
              className={styles.loginInput}
              onChange={handleCredentials}
              value={credentials.email}
              type="text"
              required
              name="email"
              placeholder="type your username (email)"
            />
            <input
              className={styles.loginInput}
              onChange={handleCredentials}
              value={credentials.password}
              type="password"
              required
              name="password"
              placeholder="password"
            />
            {props.theError && (
              <div className={styles.error_msg}>{props.theError}</div>
            )}
            <a hidden={!toggle} onClick={hideLogin}>
              Register Instead
            </a>
            <a hidden={toggle} onClick={hideRegister}>
              Login Instead
            </a>
            <button className={styles.green_btn} type="submit">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
