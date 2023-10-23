import models from '../models/index.js'
import Jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { ValidationError } from 'sequelize'
import { snakeToCamel, getDefinedValues } from '../helpers/index.js'
const { user } = models
export default {
  register,
  login,
  getUser,
}

async function register(req, res) {
  try {
    if (!req.body.password) {
      res.status(400)
      res.send({ field: 'password', type: 'isNull' })
      return
    }
    const { first_name, last_name, email, password } = req.body
    const encryptedPassword = await bcrypt.hash(password, 10)
    const params = {
      first_name,
      last_name,
      email,
      password: encryptedPassword,
    }
    const resUser = await user.create(params)
    const token = Jwt.sign(
      { user_id: resUser.id, first_name, last_name, email },
      'TOKEN-KEY',
      {
        expiresIn: '24h',
      }
    )
    const resObject = {
      data: { id: resUser.id, first_name, last_name, email },
      token,
    }
    res.send(resObject)
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(409)
      res.send({ message: 'User already exist. Please login!' })
      return
    }
    const errorObject = {}
    if (error instanceof ValidationError) {
      errorObject.field = error.errors[0].path
      errorObject.type = snakeToCamel(error.errors[0].validatorKey)
      res.status(400)
      res.send(errorObject)
      return
    }
    console.log(error)
    res.status(500)
    res.send(errorObject)
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body
    const resUser = await user.findOne({ email: email }).select('+password')
    if (resUser && (await bcrypt.compare(password, resUser.password))) {
      const { id, first_name, last_name } = resUser
      const token = Jwt.sign(
        { user_id: id, first_name, last_name, email },
        'TOKEN-KEY',
        {
          expiresIn: '24h',
        }
      )
      const resObject = {
        data: { id, first_name, last_name, email },
        token,
      }
      res.send(resObject)
      return
    }
    res.status(400)
    res.send({ message: 'Invalid credentials.' })
  } catch (error) {
    console.log(error)
    res.status(400)
    res.send(error)
  }
}

async function getUser(req, res) {
  const { user_id, first_name, last_name, email } = req.user
  res.send({ user_id, first_name, last_name, email })
}