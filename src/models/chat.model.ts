import moment from 'moment'
import { model, Schema } from 'mongoose'
import { BACKGROUND_COLOR, MAIN_COLOR, MAIN_EMOJI } from '../interfaces'

const Chat = new Schema(
  {
    host_id: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    guest_id: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    nickname_host: {
      type: String,
      require: false,
    },
    nickname_guest: {
      type: String,
      require: false,
    },
    guest_chat_id: {
      type: Schema.Types.ObjectId,
      ref: 'chats',
    },
    readed: {
      type: Boolean,
      require: true,
    },
    color: {
      type: String,
      require: true,
      default: MAIN_COLOR.PRIMARY,
    },
    background_color: {
      type: String,
      require: true,
      default: BACKGROUND_COLOR.white,
    },
    emoji: {
      type: String,
      require: true,
      default: MAIN_EMOJI.LIKE,
    },
    last_message_time: {
      type: Date,
      require: true,
      default: moment(),
    },
  },
  { timestamps: true },
)

export default model('chats', Chat)
