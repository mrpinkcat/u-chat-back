import { Socket } from 'socket.io';
import { io } from '../index';
import conv from '../routes/conv';
import Messages from '../models/Messages';
import Users from '../models/Users';
import Conversations from '../models/Conversations';

// Stoke les socket de chaque utilisateur pour chaque conv

const connection = (socket: Socket) => {

  // Post d'un message de chat;
  socket.on('chatMessage', (messageInfo: {convId: string, senderUsername: String, content: string}) => {
    console.log(`Socket message : ${messageInfo.content} from ${messageInfo.senderUsername} on ${messageInfo.convId}`);
    
    Users.findOne({ username: messageInfo.senderUsername })
    .then((doc) => {
      if (doc) {
        new Messages({ content: messageInfo.content, sender: doc.id, conversation: messageInfo.convId })
        .save()
        .then((doc) => {
          Conversations.findByIdAndUpdate(messageInfo.convId, { $push: { messages: doc.id } })
          .then((doc) => {
            socket.broadcast.to(messageInfo.convId).emit('messageRecived', { senderUsername: messageInfo.senderUsername, content: messageInfo.content });
            socket.emit('messageRecived', { senderUsername: messageInfo.senderUsername, content: messageInfo.content });
          });
        });
      }
    });
  });

  // Ouverture d'une conversation par un utilisateur
  socket.on('conversationConnection', (arg: { convId: string, username: String }) => {
    console.log('socket: conversationConnection');
    socket.join(arg.convId);
  });

  // Fermeture d'une conversation par un utilisateur
  socket.on('conversationDisconnection', (arg: { convId: string, username: String }) => {
    console.log('socket: conversationDisconnection');
    socket.leave(arg.convId);
  });
}

export default connection;