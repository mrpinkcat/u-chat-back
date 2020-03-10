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
    lowercase: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  friends: [{
    type: Types.ObjectId,
    ref: 'User',
  }],
  conversations: [{
    type: Types.ObjectId,
    ref: 'Conv',
  }],
  // created_at: {
  //   type: Date,
  // },
  // ObjectId("5349b4ddd2781d08c09890f4").getTimestamp()
  last_login: {
    type: Date,
    required: true,
  },
});

export default model('User', schema);
