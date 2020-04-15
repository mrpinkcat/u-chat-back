import express from 'express';
import Users from '../models/Users';
import { needAuth } from './utils';
import { Document } from 'mongoose';
import Conversations from '../models/Conversations';

const conv = express.Router();

/*
 * Obtenir toutes les convs
 */
conv.get('/', needAuth, (req, res) => {
  Users.findById(res.locals._id)
  .populate({
    path: 'conversations',
    select: '-__v -messages',
    populate: [
      {
        path: 'members',
        model: 'User',
        select: '-_id username firstName lastName',
      },
    ],
  })
    .then((doc) => {
      if (doc) {
        res.status(200).send(doc.toJSON().conversations);
      }
    })
});

/*
 * Obtenir toutes les infos de la conv
 */
conv.get('/:id', (req, res) => {
  if (req.params.id) {
    Conversations.findById(req.params.id)
    .populate('members', '-_id -password -__v -token -friends -conversations')
    .populate({
      path: 'messages',
      select: '-_id -conversation -__v',
      options: { sort: { $natural: -1 }},
      limit: 20,
      populate: {
        path: 'sender',
        select: '-friends -conversations -_id -firstName -lastName -password -token -lastLogin -__v',
      },
    })
      .then((doc) => {
        if (doc) {
          res.status(200).send(doc.toJSON());
        }
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }
});

/*
* Créer une nouvelle conversation
*/
conv.post('/', needAuth, (req, res) => {
  if (req.body.name && req.body.members) {
    const name: string = req.body.name;
    const topic: string = req.body.topic;
    const members: { username: string, firstName: string, lastName: string }[] = req.body.members;

    let membersId: string[] = [ res.locals._id ];

    let convId: string;

    members.forEach((member, index) => {
      Users.findOne({ username: member.username })
      .select('_id')
        .then((doc) => {
          if (doc) {
            membersId.push(doc.id);
            if (membersId.length === members.length + 1) {
              continueRequest();
            }
          }
        });
    });
    
    const continueRequest = () => {
      new Conversations({ name, topic, members: membersId }).save()
        .then((doc) => {
          if (doc) {
            convId = doc.id;
            let totalMembersUpdated = 0;
            membersId.forEach((memberId) => {
              Users.findByIdAndUpdate(memberId, { $push: { conversations: convId } })
                .then(() => {
                  totalMembersUpdated++;
                  if (totalMembersUpdated === members.length + 1) {
                    res.status(200).send(doc.toJSON());
                  }
                });
            });
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send(err);
        });
    }
  } else {
    res.status(400).send({
      error: `Body must contain 'name' and 'members'. 'topic' is optional.`,
    });
  }
  // res.status(200).send({
  //   message: 'post new conv',
  // });
});

/*
* Supprimer une conversation
*/
conv.delete('/:id', (req, res) => {
  res.status(200).send({
    message: `remove ${req.params.id} conv`,
  });
});

export default conv;
