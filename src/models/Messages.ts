import { model, Schema, Types } from 'mongoose';

const schema = new Schema({
  content: {
    type: String,
    required: true,
    unique: false,
  },
  sender: [{
    type: Types.ObjectId,
    required: true,
    unique: false,
    ref: 'User'
  }],
  reciver: [{
    type: Types.ObjectId,
    required: true,
    unique: false,
    ref: 'User'
  }],
  conv: [{
    type: Types.ObjectId,
    required: true,
    unique: false,
    ref: 'Conv'
  }],
});

export default model('Message', schema);
