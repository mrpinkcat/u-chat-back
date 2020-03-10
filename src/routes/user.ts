import express from 'express';
import Users from '../models/Users';
import { needAuth } from './utils';

const user = express.Router();

/*
 * Route pour get tous les amis d'un utilisateur
 */
user.get('/friends', needAuth, (req, res) => {
  Users.findOne({ username: res.locals.username })
  .populate('friends', '_id firstName lastName')
    .then((doc) => {
      if (doc) {
        res.status(200).send(doc.toJSON().friends);
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
    Users.findOneAndUpdate({ username: res.locals.username }, { '$push': { friends: req.body.friendId } }, { new: true })
      .populate('friends', '_id firstName lastName')
      .then((doc) => {
        if (doc) {
          res.status(200).send(doc.toJSON().friends);
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
user.delete('/friend', needAuth, (req, res) => {
  const friendId = req.body.friendId;
  if (friendId) {}
  Users.findOneAndUpdate({ username: res.locals.username }, { '$pull': { friends: friendId } }, { new: true })
    .then((doc) => {
      if (doc) {
        res.status(200).send(doc.populate('friends', '_id firstName lastName').toJSON().friends);
      } else {
        res.status(500).send({
          error: 'Mongodb Error',
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        error: 'Mongodb Error',
        err,
      });
    });
});

/*
 * Route pour get toutes les info du user
 */
user.get('/:id', (req, res) => {
  Users.findById(req.params.id)
    .populate('friends', '_id firstName lastName')
    .populate('conversations', '-__v')
    .select('-token -password -__v')
    .then((doc) => {
      if (doc) {
        res.status(200).send(doc.toJSON());
      } else {
        res.status(404).send({
          error: 'User not found',
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

export default user;
