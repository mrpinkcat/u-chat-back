import express from 'express';

const conv = express.Router();

/*
 * Obtenir toutes les convs
 */
conv.get('/', (req, res) => {
  res.status(200).send({
    message: 'all conv info',
  });
});

/*
 * Obtenir toutes les infos de la conv
 */
conv.get('/:id', (req, res) => {
  res.status(200).send({
    message: `${req.params.id} conv info`,
  });
});

/*
* Créer une nouvelle conversation
*/
conv.post('/', (req, res) => {
  res.status(200).send({
    message: 'post new conv',
  });
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
