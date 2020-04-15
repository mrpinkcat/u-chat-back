import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import socketIo from 'socket.io';
import http from 'http';
// import morgan from 'morgan';
import cors from 'cors';

dotenv.config();

import auth from './routes/auth';
import conv from './routes/conv';
import user from './routes/user';

import socketRoutes from './socket.io/index';

/* Définition du port d'écoute de l'app */
const port = process.env.PORT || 3000;

/* Fix des déprécation warning de mongoose */
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const app = express();

const httpServer = http.createServer(app);

export const io = socketIo(httpServer);

// parse body application/json
app.use(bodyParser.json());
app.use(cors({
  origin: '*',
}));
// app.use(morgan('combined'));

// Use des routes
app.use('/user', user);
app.use('/conversation', conv);
app.use('/auth', auth);

/* Route de HeartBeat */
app.get('/heartbeat', (req, res) => res.sendStatus(200));

/* Connexion à la base de données */
mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@ds057538.mlab.com:57538/u-chat`)
.then(() => {
  console.log('Connected to database');
  /* Lancement de l'app */
  httpServer.listen(port, () => {
    console.log(`App started on port :${port}`);

    io.on('connection', socketRoutes);
  });
})
.catch((err) => {
  throw console.error('ERROR DURRING THE CONNECTION TO MONGO DATABASE', err);
});
