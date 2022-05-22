const express = require('express');
const bcrypt = require('bcryptjs/dist/bcrypt');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const { validateUser } = require('../middleware');
const { findUserByEmail, addUserToDb } = require('../model/userModel');
const { jwtSecret, dbConfig } = require('../config');

const userRoute = express.Router();

userRoute.get('/users', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('connected');
    const sql = 'SELECT * FROM users';
    const [rows] = await connection.execute(sql);
    res.json(rows);
  } catch (error) {
    console.log('home route error ===', error);
    res.status(500).json('something went wrong');
  } finally {
    // atsijungti
    if (connection) connection.end();
  }
});

userRoute.post('/register', validateUser, async (req, res) => {
  // gauti vartotojo email ir password ir irasyti i users
  try {
    const gautasEmail = req.body.email;
    const { password } = req.body;
    const plainTextPassword = password;

    const hashedPassword = bcrypt.hashSync(plainTextPassword, 10);
    console.log('hashedPassword ===', hashedPassword);

    // tikrinam ar yra toks email jau uzregintas
    const foundUser = await findUserByEmail(gautasEmail);
    console.log('foundUser ===', foundUser);

    // jei yra tokio email
    if (foundUser) {
      res.status(400).json(`Vartotojas su ${gautasEmail} el.pastu jau egzistuoja`);
      return;
    }

    const newUser = {
      email: gautasEmail,
      password: hashedPassword,
    };

    // kviesti modelio funkcija kuri sukuria varototoja
    const insertResult = await addUserToDb(newUser.email, newUser.password);
    console.log('insertResult ===', insertResult);

    if (insertResult === false) {
      res.status(500).json('something wrong');
      return;
    }

    res.status(201).json('vartotojas sukurtas');
  } catch (error) {
    console.log(error);
    res.status(500).json('nepavyko sukurti vartotojo');
  }
});

userRoute.post('/login', validateUser, async (req, res) => {
  const gautasEmail = req.body.email;
  const gautasPassword = req.body.password;

  // tikrinam ar yra toks email jau uzregintas
  const foundUser = await findUserByEmail(gautasEmail);
  console.log('foundUser ===', foundUser);

  // jei nera tokio email
  if (!foundUser) {
    res.status(400).json(`Vartotojas su ${gautasEmail} el.pastu neegzistuoja`);
    return;
  }
  // jei yra toks email, tikrinam ar sutampa su slaptazodziu
  if (!bcrypt.compareSync(gautasPassword, foundUser.password)) {
    res.status(400).json('Ivestas blogas slaptazodis');
    return;
  }
  // generuojam jwt token
  const payload = { userId: foundUser.id };
  const token = jwt.sign(payload, jwtSecret, { expiresIn: '3h' });
  console.log('token ===', token);
  res.json({ success: true, token });
});

module.exports = userRoute;
