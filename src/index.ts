import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import mongoose, { connection } from 'mongoose';
import socketIo from 'socket.io';
import http from 'http';


const io = socketIo(http);

dotenv.config();

import auth from './routes/auth';
import conv from './routes/conv';
import user from './routes/user';

/* Définition du port d'écoute de l'app */
const port = process.env.PORT || 3000;

/* Fix des déprécation warning de mongoose */
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const app = express();

// parse body application/json
app.use(bodyParser.json());

// Use des routes
app.use('/user', user);
app.use('/conv', conv);
app.use('/auth', auth);

/* Route de HeartBeat */
app.get('/heartbeat', (req, res) => res.sendStatus(200));

/* Connexion à la base de données */
mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@ds057538.mlab.com:57538/u-chat`)
.then(() => {
  console.log('Connected to database');
  io.on('connection', (socket) => {
    console.log('User connected');
  })
  /* Lancement de l'app */
  app.listen(port, () => {
    console.log(`App started on port :${port}`);
  });
})
.catch((err) => {
  throw console.error('ERROR DURRING THE CONNECTION TO MONGO DATABASE', err);
});