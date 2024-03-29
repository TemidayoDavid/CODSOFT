import styles from "./styles.module.css"
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export default function Projects(props) {
  function deleteData() {
    fetch("/api/delete", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([props.idd]), //square brackets to ensure that the data is passed as a json
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("this is deleted" + data);
      });
    props.onDelete(props.id);
  }

  function calcDate() {
    const dateCreated = new Date(props.date_created);
    const dateDue = new Date(props.due_data);

    const timeDifference = dateDue.getTime() - dateCreated.getTime();

    const timeDiffInDAYS = Math.round(timeDifference / (1000 * 3600 * 24));
    return timeDiffInDAYS;
  }

  return (
    <div className={styles.projects}>
      <h1>{props.title}</h1>
      
      <div className={styles.projects_notes}>
      <p>{props.note}</p>
      </div>

      <div className={styles.assigne}>
      <p >{props.assigne}</p>
      </div>
      
      {/* <p>{props.due_data}</p> */}

      <div className={styles.date_created}>
      <p>Created {props.date_created}</p>
      </div>
      
      {/* <p>{props.id}</p> */}
      {/* <p>{props.idd}</p> */}
      <div className={styles.delete_btn}>
      <button onClick={deleteData}><DeleteForeverIcon/></button>
      </div>
      <div className={styles.progress}>
      <p>expires in {calcDate()} days</p>
      </div>

      
      
    </div>
  );
}
