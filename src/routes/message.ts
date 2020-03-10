import express from 'express';

const message = express.Router();

/*
 * Obtenir toutes les info du messages
 */
message.get('/:id', (req, res) => {
  res.status(200).send({
    message: 'message info',
  });
});

export default message;
