import express from 'express'
import cors from 'cors'
import path from 'path'
import { WebSocketServer } from 'ws'
const app = express()

app.use(cors('*'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const wss = new WebSocketServer({ port: 10000 })
const clients = []
wss.on('connection', (ws) => {
  clients.push(ws)
  ws.on('message', (msg) => {
    for (const client of clients) {
      client.send(JSON.stringify(JSON.parse(msg)))
    }
  })
  console.log('client connected.')
})

export default app
