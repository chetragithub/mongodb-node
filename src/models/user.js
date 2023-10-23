import { Schema, model } from 'mongoose'

const UserScema = {
  first_name: {
    type: String,
    require: true,
  },
  last_name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
    select: false
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'posts',
      select: false
    },
  ],
}
const User = model(
  'users',
  new Schema(UserScema, {
    timestamps: true,
    versionKey: false,
    createdAt: 'date_creation',
  })
)

export default User
