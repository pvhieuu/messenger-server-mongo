import { model, Schema } from 'mongoose'

const User = new Schema(
  {
    phone_number: {
      type: String,
      require: false,
    },
    email: {
      type: String,
      require: false,
    },
    password: {
      type: String,
      require: true,
    },
    fullname: {
      type: String,
      require: true,
    },
    fresh_name: {
      type: String,
      require: true,
    },
    avatar: {
      type: String,
      require: false,
      maxLength: 6000,
    },
    status_online: {
      type: Boolean,
      require: true,
      default: false,
    },
    last_logout: {
      type: Date,
      require: false,
    },
  },
  { timestamps: true },
)

export default model('users', User)
