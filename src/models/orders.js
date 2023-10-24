import { Schema, model } from 'mongoose'

const OrderScema = {
  is_completed: {
    type: Boolean,
    require: true,
    default: false
  },
  is_paid: {
    type: Boolean,
    require: true,
    default: false
  },
  datetime: {
    type: Date,
    require: true,
  },
  store_id: {
    type: Schema.Types.ObjectId,
    ref: 'stores',
  },
  table_id: {
    type: Schema.Types.ObjectId,
    ref: 'tables',
  },
}

const Order = model(
  'products',
  new Schema(OrderScema, {
    timestamps: true,
    versionKey: false,
  })
)

export default Order
