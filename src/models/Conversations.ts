import { model, Schema, Types } from 'mongoose';

const schema = new Schema({
  name: {
    type: String,
  },
  topic: {
    type: String,
  },
  members: [{
    type: Types.ObjectId,
    ref: 'User',
  }],
  messages: [{
    type: Types.ObjectId,
    ref: 'Message',
  }]
});

export default model('Conversation', schema);
