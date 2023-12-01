import nodemailer from 'nodemailer'
const transporter = nodemailer.createTransport({
  service: 'admin@example.com',
  auth: {
    user: 'admin@example.com',
    pass: 'secret'
  }
})

export default transporter
