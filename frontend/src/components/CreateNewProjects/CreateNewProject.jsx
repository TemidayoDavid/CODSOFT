import { useState } from "react";
import styles from "./styles.module.css"
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';

export default function CreateNewProject(props) {
  const current = new Date().toLocaleDateString('fr-CA');
  const [entry, setEntry] = useState({
    title: "",
    note: "",
    assigne: "",
    due_date: "",
    date_created: current,
    user_id: props.onId || ""
  });

  //tracking or handling what the user types
  function handleInput(event) {
    const { name, value } = event.target;

    setEntry((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  }

  function addData(event) {
//to send the gotten values to the server
    fetch("/api/add",{
      method: "post",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify(entry)
    }).then(response => response.json())
//break break break
    props.onAdd(entry);
    setEntry({
      title: "",
      note: "",
      assigne: "",
      due_date: "",
      date_created: "",
    });
    event.preventDefault();
  }

  return (
    <div className={styles.container}>
      
      <div className={styles.formContainer}>
      <form className={styles.formCard}>
      <h1>Create new prooject</h1>
        <input
          className={styles.createProjInput}
          onChange={handleInput}
          placeholder="project title"
          name="title"
        />
        <textarea
          className={styles.createProjInput}
          onChange={handleInput}
          placeholder="project note"
          name="note"
        />
        <input
          className={styles.createProjInput}
          type="email"
          onChange={handleInput}
          placeholder="assign who to this project?"
          name="assigne"
        />
        <label className={styles.createProjLabel} htmlFor="date">when is this due?</label>
        <input className={styles.createProjDate} onChange={handleInput} type="date" name="due_date" />
        <button className={styles.createBtn} onClick={addData}><AddToPhotosIcon /></button>
        {/*type="datetime-local" in case i want to use date with TIME*/}
      </form>
      
      </div>
    </div>
  );
}
