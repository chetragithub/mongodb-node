import mongoose from 'mongoose'

export default async function initDb() {
  const dbURL = process.env.MONGOOSE_URL
  await mongoose
    .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log('connected to db')
    })
    .catch((err) => console.log(err))
}
