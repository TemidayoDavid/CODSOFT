import { useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Projects from "../Projects/Projects";

import CreateNewProject from "../CreateNewProjects/CreateNewProject";
import axios from "axios";
import Login from "../Login/Login";

import styles from "./styles.module.css";

export default function Main() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [userIdentity, setUserIdentity] = useState("");
  const [user] = userIdentity;

  //calling data from login API
  async function approveCredentials(credentials) {
    try {
      const url = "http://localhost:8080/api/auth/login";
      const { data: res } = await axios.post(url, credentials);
      localStorage.setItem("details", res.data);
      setData(JSON.parse(res.data));
      setUserIdentity(JSON.parse(res.data));
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  }

  //calling data from REGISTER API
  async function approveRegistration(credentials) {
    try {
      const url = "http://localhost:8080/api/auth/register";
      const { data: res } = await axios.post(url, credentials);

      res.data ? (window.location = "/") : (location = "/");
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  }

  // adding user inputs to state and databasae
  function addData(entry) {
    setData((prevValue) => {
      return [...prevValue, entry];
    });
  }

  // delete data in state not in database
  function deleteData(id) {
    setData((prevValue) => {
      return prevValue.filter((datta, index) => {
        return index !== id;
      });
    });
  }

  const approve = localStorage.getItem("details");

  function removeToken() {
    localStorage.removeItem("details");

    window.location = "/";
  }

  return (
    <div>
      {!approve && (
        <Login
          onLogin={approveCredentials}
          onRegister={approveRegistration}
          theError={error}
        />
      )}

      {approve && <Header />}

      <div className={styles.logout}>
        {approve && <button onClick={removeToken}>Log Out</button>}
      </div>
      {approve && <CreateNewProject onAdd={addData} onId={user.user_id} />}
      <div className={styles.alignMain}>
        {approve &&
          data.map((datta, index) => {
            return (
              <Projects
                key={index}
                id={index} //i plan to pass datta.id here
                idd={datta.id} //this is the id of the data in state
                title={datta.title}
                note={datta.note}
                assigne={datta.assigne}
                due_data={datta.due_date}
                date_created={datta.date_created}
                onDelete={deleteData}
              />
            );
          })}
      </div>
      <div className={styles.button_footer}>{approve && <Footer />}</div>
    </div>
  );
}
