import express from 'express';
import bcrypt from 'bcrypt';
import uniqid from 'uniqid';

import Users from './../models/Users';

const auth = express.Router();

/* Connexion */
auth.post('/login', (req, res) => {
  console.log('/auth/login');

  /* Check si il a bien le username et le password dans le body */
  if (req.body.username && req.body.password) {
    const username = req.body.username;
    const password = req.body.password;
    Users.findOne({ username })
    .then((user) => {
      if (!user) {
        res.status(400).send({ 
          error: 'User not found.',
        });
      } else {
        bcrypt.compare(password, user.toJSON().password)
        .then((same) => {
          if (same) {
            res.status(200).send({
              token: user.toJSON().token,
            });
          } else {
            res.status(400).send({
              error: 'Invalid password.',
            });
          }
        })
        .catch((err) => {
          res.status(500).send({
            error: 'bcrypt error',
            bcryptError: err,
          });
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        error: 'Mongoose error',
        mongooseError: err,
      });
    });
  } else {
    res.status(400).send({
      error: 'Body must contain username and password',
    });
  }
});

/* Création de compte */
auth.post('/register', (req, res) => {
  console.log('/register');
  console.log(req.body);

  /* Check les fields du le body */
  if (req.body.username && req.body.password && req.body.firstName && req.body.lastName) {
    const username: string = req.body.username;
    const password: string = req.body.password;
    const firstName: string = req.body.firstName;
    const lastName: string = req.body.lastName;

    bcrypt.hash(password, 10)
    .then((encryptedPassword) => {

      const token = uniqid();

      new Users({
        username,
        firstName,
        lastName,
        password: encryptedPassword,
        token,
      })
      .save()
      .then((doc) => {
        res.status(200).send({
          status: 'User created.',
          token: doc.toJSON().token,
        });
      })
      .catch((err) => {
        res.status(500).send({
          error: 'Mongoose error',
          mongooseError: err,
        });
      });
    })
    .catch((err) => {
      res.status(500).send({
        error: 'bcrypt error',
        bcryptError: err,
      });
    });
  } else {
    res.status(400).send({
      error: 'Body must contain username, firstName, lastName and password',
    });
  }
});

export default auth;
