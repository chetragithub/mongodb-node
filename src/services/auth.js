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
    const { first_name, last_name, email, gender, image, password, role_id, store_id } = req.body
    const encryptedPassword = await bcrypt.hash(password, 10)
    const params = {
      first_name,
      last_name,
      email,
      gender,
      image,
      password: encryptedPassword,
      role_id,
      store_id
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
      data: { id: resUser.id, first_name, last_name, email, gender, image },
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
    const resUser = await user.findOne({ email: email }).select('+password').populate({ path: 'store_id role_id' })
    if (resUser && (await bcrypt.compare(password, resUser.password))) {
      const { id, store_id, role_id } = resUser
      const token = Jwt.sign(
        { user_id: id, store_id: store_id.id, role_id: role_id.id },
        'TOKEN-KEY',
        {
          expiresIn: '24h',
        }
      )
      resUser.password = 'hidden'
      const resObject = {
        user: resUser,
        token,
        message: 'Login is successful.'
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