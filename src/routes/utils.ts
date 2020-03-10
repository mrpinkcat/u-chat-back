import { Request, Response, NextFunction } from 'express';
import Users from '../models/Users';

const needAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization || req.headers.authorization.slice(0, 7) !== 'Bearer ') {
    res.status(403).json({ error: 'No bearer credentials sent' });
  } else {
    Users.findOne({ token: getTokenFromAuthHeader(req.headers.authorization)})
    .then((doc) => {
      if (doc) {
        res.locals._id = doc.toJSON()._id;
        res.locals.username = doc.toJSON().username;
        if (doc.toJSON().firstName) {
          res.locals.firstName = doc.toJSON().firstName;
        }
        if (doc.toJSON().lastName) {
          res.locals.lastName = doc.toJSON().lastName;
        }
        if (doc.toJSON().friends) {
          res.locals.friends = doc.toJSON().friends;
        }
        next();
      } else {
        res.status(403).send({
          error: 'Invalid token',
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        error: 'Mongo error during checking auth',
        err,
      });
    });
  }
}

const getTokenFromAuthHeader = (authHeader: string) => {
  return authHeader.slice(7);
}

export {
  needAuth,
}