import { model, Schema, Types } from 'mongoose';

const schema = new Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
    unique: false,
  },
  lastName: {
    type: String,
    required: true,
    unique: false,
  },
  password: {
    type: String,
    required: true,
    unique: false,
  },
  friends: [{
    type: Types.ObjectId,
    ref: 'User',
  }],
  convs: [{
    type: Types.ObjectId,
    ref: 'Conv',
  }],
});

export default model('User', schema);
