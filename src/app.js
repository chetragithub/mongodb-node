import express from 'express'
import cors from 'cors'
import path from 'path'
import { WebSocketServer } from 'ws'
const app = express()

app.use(cors('*'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const wss = new WebSocketServer({ port: 3000 })

wss.on('connection', (ws) => {
  ws.on('message', (msg) => {
    console.log(`recieved message: ${msg}`)
  })
  ws.send('Hello, client!')
  console.log('Connect!!')
})

export default app
