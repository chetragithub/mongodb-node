import mongoose from 'mongoose'

export default function initDb() {
  const dbURL =
    'mongodb+srv://chetra-mongo-db:chetra12345@cluster0.bpdatys.mongodb.net/?retryWrites=true&w=majority'
  mongoose
    .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('connected to db'))
    .catch((err) => console.log(err))
}
