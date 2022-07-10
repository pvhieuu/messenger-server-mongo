import { model, Schema } from 'mongoose'
import { TYPE_MESSAGES } from '../constants'

const Message = new Schema(
  {
    content: {
      type: String,
      require: true,
    },
    type: {
      type: String,
      enum: TYPE_MESSAGES,
      require: true,
    },
    sender_id: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    receiver_id: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    chat_id: {
      type: Schema.Types.ObjectId,
      ref: 'chats',
    },
    guest_message_id: {
      type: Schema.Types.ObjectId,
      ref: 'messages',
    },
    emoji: {
      type: String,
      require: true,
      default: null,
    },
  },
  { timestamps: true },
)

export default model('messages', Message)
