import nodemailer from 'nodemailer'
const transporter = nodemailer.createTransport({
  service: 'hongchetra12@gmail.com',
  auth: {
    user: 'hongchetra12@gmail.com',
    pass: 'gjbomztkbzabiscx'
  }
})

export default transporter