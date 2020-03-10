import express from 'express';
import Users from '../models/Users';
import { needAuth } from './utils';

const user = express.Router();

/*
 * Route pour get tous les amis d'un utilisateur
 */
user.get('/friends', needAuth, (req, res) => {
  console.log('get /friends');
  Users.findOne({ username: res.locals.username })
  .populate('friends', '_id firstName lastName')
    .then((doc) => {
      if (doc) {
        console.log('doc');
        console.log(doc);
        res.status(200).send(doc.toJSON());
      } else {
        res.status(500).send({
          error: 'MongoDB error : user disapear',
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        error: 'MongoDB error',
        err,
      });
    });
});

/*
 * Route pour ajouter un amis à l'utilisateur
 */
user.post('/friend', needAuth, (req, res) => {
  if (req.body.friendId) {
    Users.findOneAndUpdate({ username: res.locals.username }, { '$push': { friends: req.body.friendId } })
    .populate('friends', '_id firstName lastName')
    .then((doc) => {
      if (doc) {
        console.log('doc');
        console.log(doc);
        res.status(200).send(doc.toJSON());
      } else {
        res.status(500).send({
          error: 'MongoDB error : user disapear',
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        error: 'MongoDB error',
        err,
      });
    });
  } else {
    res.status(400).send({
      error: 'friendId needed',
    });
  }
});

/*
 * Route pour supprimer un amis de l'utilisateur
 */
user.delete('/friends', needAuth, (req, res) => {
  console.log(res.locals.username);
});

/*
 * Route pour get toutes les info du user
 */
user.get('/:id', (req, res) => {
  res.status(200).send({
    message: 'user info',
  });
});

export default user;
