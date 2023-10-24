import { Schema, model } from 'mongoose'

const RoleScema = {
  name: {
    type: String,
    maxlength: 20,
    require: true,
  },
  // users: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: 'users'
  //   },
  // ],
}

const Role = model(
  'roles',
  new Schema(RoleScema, {
    timestamps: true,
    versionKey: false,
  })
)

export default Role
