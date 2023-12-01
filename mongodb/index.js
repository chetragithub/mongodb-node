import mongoose from 'mongoose'

export default function initDb() {
  const dbURL =
    'MONGO_URL'
  mongoose
    .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('connected to db'))
    .catch((err) => console.log(err))
}
