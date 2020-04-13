import { model, Schema, Types } from 'mongoose';

const schema = new Schema({
  content: {
    type: String,
    required: true,
    unique: false,
  },
  // created_at: {
  //   type: Date,
  //   required: true,
  //   unique: false,
  // },
  // ObjectId("5349b4ddd2781d08c09890f4").getTimestamp()
  sender: {
    type: Types.ObjectId,
    required: true,
    unique: false,
    ref: 'User',
    select: 'username',
  },
  conversation: {
    type: Types.ObjectId,
    required: true,
    unique: false,
    ref: 'Conv',
    select: '_id',
  },
});

export default model('Message', schema);
