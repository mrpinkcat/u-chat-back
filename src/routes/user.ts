import express from 'express';
import Users from '../models/Users';
import { needAuth } from './utils';

const user = express.Router();

/*
 * Route pour get tous les amis d'un utilisateur
 */
user.get('/friends', needAuth, (req, res) => {
  Users.findOne({ username: res.locals.username })
    .populate('friends', 'username firstName lastName')
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
  if (req.body.friendUsername) {
    Users.findOne({ username: req.body.friendUsername })
      .select('_id')
      .then((friendDoc) => {
        if (friendDoc) {
          Users.findOneAndUpdate({ username: res.locals.username }, { $push: { friends: friendDoc.toJSON()._id } }, { new: true })
            .populate('friends', 'username firstName lastName')
            .then((userDoc) => {
              if (userDoc) {
                res.status(200).send(userDoc.toJSON().friends);
              } else {
                res.status(500).send({
                  error: 'MongoDB error : wtf ... the user disapear',
                });
              }
            })
            .catch((err) => {
              res.status(500).send({
                error: 'MongoDB error',
                err,
              });
            });
        }
      });
  } else {
    res.status(400).send({
      error: 'friendUsername needed',
    });
  }
});

/*
 * Route pour supprimer un amis de l'utilisateur
 */
user.delete('/friend', needAuth, (req, res) => {
  const friendId = req.body.friendId;
  if (friendId) {}
  // TODO : Changer le mode de recherche par ID en recherche par username
  Users.findOneAndUpdate({ username: res.locals.username }, { $pull: { friends: friendId } }, { new: true })
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
 * Supprimer son compte
 */
user.delete('/', needAuth, (req, res) => {
  console.log('test');
  Users.findOneAndDelete({ username: res.locals.username })
    .then((doc) => {
      res.status(200).send({
        status: 'Deleted',
      });
    })
    .catch((err) => {
      res.status(200).send({
        error: 'MongoDB error',
        err,
      });
    });
});

/*
 * Route de recherche d'utilisateur
 * /search?q=name
 */
user.get('/search', needAuth, (req, res) => {
  console.log('/search')
  const query = req.query.q;
  if (query) {
    Users.find({ $text: { $search: query } }, { score : { $meta: "textScore" } })
      .sort({ score : { $meta: "textScore" } })
      .select('firstName lastName username')
      .then((docs) => {
        if (docs.length > 0) {
          res.status(200).send(docs);
        } else {
          res.status(200).send([]);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({
          error: 'MongoDB error',
          err,
        });
      });
  } else {
    res.status(400).send({
      error: 'must contain query q'
    });
  }
});

user.get('/image/:userId', needAuth, (req, res) => {
  res.status(200).send({
    ulr: 'https://static1.purebreak.com/articles/1/15/86/71/@/630415-les-simpson-et-si-homer-etait-humain-diapo-3.jpg',
  });
});

/*
 * Route pour get toutes les info du user
 */
user.get('/:id', needAuth, (req, res) => {
  Users.findById(req.params.id)
    .populate('friends', 'username firstName lastName')
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
