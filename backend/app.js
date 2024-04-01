const express = require("express");
const bodyParser = require("body-parser");
const { Client } = require("pg");
const cors = require("cors");
const bcrypt = require("bcrypt");
require('dotenv').config()

const app = express();
const PORT = process.env.PORT || 8080;
const saltRounds = 10;

app.use(bodyParser.json());
// app.use(express.static("build"));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const db = new Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

db.connect();

//Check user and log them in our keep them out
app.post("/api/auth/login", async (req, res) => {
  try {
    const { password, email } = req.body;
    const searchCredentials = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    let verifyEmail = searchCredentials.rows[0].email;
    let verifyHashedPassword = searchCredentials.rows[0].password;
    let user_id = searchCredentials.rows[0].id;

    if (verifyEmail == email) {
      //checking hashed password
      bcrypt.compare(password, verifyHashedPassword, async (err, result) => {
        if (err) {
          console.log("Error comparing passwords:", err);
        } else {
          if (result) {
            const result = await db.query(
              "SELECT * FROM users JOIN project_details ON users.id = user_id WHERE user_id = $1",
              [user_id]
            );
            const details = [];
            result.rows.forEach((row) => {
              details.push(row);
              //console.log(details);
            });
            res.status(200).send({
              data: JSON.stringify(details),
              user_id,
              message: "Eyah, welcome",
            });
          } else {
            res
              .status(401)
              .send({ message: "you don type password wey wrong, try again." });
          }
        }
      });
    } else {
      res.status(401).send({
        message: "i neva see this email before, abeg try again or register.",
      });
    }
  } catch (error) {
    console.error("User doesn't exist");
    res.status(401).send({
      message: "i neva see this email before, abeg try again or register.",
    });
  }
});

// register new users
app.post("/api/auth/register", async (req, res) => {
  const { name, password, email } = req.body;
  const result = await db.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  try {
    if (result.rows.length > 0) {
      res
        .status(401)
        .send({ message: "this email is already registered!, please log in." });
    } else {
      //hashing the password
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.log("Error trying to hash password:", err);
        } else {
          const result = await db.query(
            "INSERT INTO users (name, password, email) VALUES ($1, $2, $3) RETURNING *",
            [name, hash, email]
          );

          const user_idd = result.rows[0].id;

          await db.query(
            "INSERT INTO project_details (title, note, assigne, due_date, date_created, user_id) VALUES ($1, $2, $3, $4, $5, $6)",
            [
              "Sample title",
              "Sample note",
              "Sample assigne",
              "2025-12-12",
              "2024-10-10",
              user_idd,
            ]
          );

          res.status(200).send({
            data: user_idd,
            message: "User has been registered successfully, please login",
          });
        }
      });

      //console.log(result.rows[0].id);
    }
  } catch (error) {
    console.error("User exists, please login");
    res.status(401).send({
      message: "i don see your email before, abeg login.",
    });
  }
});

//Add new prooject to the database
app.post("/api/add", async (req, res) => {
  //console.log(req.body);
  const { title, note, assigne, due_date, date_created, user_id } = req.body;
  const result = await db.query(
    "INSERT INTO project_details (title, note, assigne, due_date, date_created, user_id) VALUES ($1, $2, $3, $4, $5, $6)",
    [title, note, assigne, due_date, date_created, user_id]
  );
  res.json({ message: "Form submitted" });
});

//Delete prooject from the database
app.post("/api/delete", async (req, res) => {
  //console.log("this should be deleted:" + req.body);
  const id = req.body[0];
  const result = await db.query("DELETE FROM project_details WHERE id = $1", [
    id,
  ]);
  //console.log(id);
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
