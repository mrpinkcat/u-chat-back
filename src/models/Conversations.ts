import { model, Schema, Types } from 'mongoose';

const schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
  },
  members: {
    type: [{
      type: Types.ObjectId,
      ref: 'User',
    }],
    required: true,
    select: 'username firstName lastName',
  },
  messages: [{
    type: Types.ObjectId,
    ref: 'Message',
  }],
});

export default model('Conversation', schema);
