import models from '../models/index.js'
import { snakeToCamel, getDefinedValues } from '../helpers/index.js'
import { ValidationError, Op } from 'sequelize'
import XLSX from 'xlsx'
import Joi from 'joi'

const { posts, user } = models
export default {
  getAll,
  findAll,
  findById,
  create,
  update,
  destroy,
  importPosts,
}

async function getAll(req, res) {
  try {
    const resPosts = await posts
      .find({ user: req.user.user_id })
      .populate('user')
    const resObject = {
      // row_count: resPosts.count,
      data: resPosts,
    }
    res.send(resObject)
  } catch (error) {
    res.status(500)
    res.send(error)
  }
}

async function findAll(req, res) {
  try {
    const keyword = req.query.keyword
    const condition = keyword ? { title: { [Op.like]: `%${keyword}%` } } : null
    const limit = req.query.limit ? Number(req.query.limit) : null
    const resPosts = await posts.findAll({
      include: ['user'],
      attributes: { exclude: ['user_id'] },
      where: condition,
      limit: limit,
    })
    const resObject = {
      row_count: resPosts.length,
      data: resPosts,
    }
    res.send(resObject)
  } catch (error) {
    console.log(error)
    res.status(500)
    res.send({ message: 'Something wrong while finding posts.' })
  }
}

async function findByUser() {
  try {
    const resUser = await user.findByPk(req.user.user_id, {
      include: ['posts'],
    })
    const resPosts = await posts.findAndCountAll({
      order: [['id', 'DESC']],
    })
    const resObject = {
      row_count: resPosts.count,
      data: resPosts.rows,
    }
    res.send(resUser)
  } catch (error) {
    res.status(500)
    res.send(error)
  }
}

async function findById(req, res) {
  try {
    const post = await posts.find({
      _id: req.params.id,
      user: req.user.user_id,
    })
    if (post.length === 0) {
      res.status(404)
      res.send({ message: 'Post is not found.' })
      return
    }
    res.send({ data: post })
  } catch (error) {
    res.status(500)
    if (!error.messageFormat) {
      res.status(404)
      res.send({ message: 'Post is not found.' })
      return
    }
    res.send({ message: 'Something wrong while finding post.' })
  }
}

async function create(req, res) {
  try {
    const auth = await user.findById(req.user.user_id)
    const { title, description } = req.body
    const params = {
      title,
      description,
      user: auth,
    }
    const resPost = await posts.create(params)
    const resObject = {
      message: 'Post was created successfully.',
      data: resPost,
    }
    res.send(resObject)
  } catch (error) {
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
    errorObject.message = 'Something wrong while creating post.'
    res.send(errorObject)
  }
}

async function update(req, res) {
  const post = await posts.findOne({
    where: { id: req.params.id, user_id: req.user.user_id },
    include: ['user'],
    attributes: { exclude: ['user_id'] },
  })
  if (!post) {
    res.status(404)
    res.send({ message: 'Post is not found.' })
    return
  }
  const params = {
    title: req.body.title,
    description: req.body.description,
  }
  await post.update(getDefinedValues(params))
  const resObject = {
    message: 'Post was updated successfully.',
    data: post,
  }
  res.send(resObject)
}

async function destroy(req, res) {
  const post = await posts.findOne({
    where: { id: req.params.id, user_id: req.user.user_id },
  })
  if (!post) {
    res.status(404)
    res.send({ message: 'Post is not found.' })
    return
  }
  post.destroy()
  res.send({ message: 'Post was deleted successfully.' })
}

async function importPosts(req, res) {
  try {
    if (!req.file) {
      res.status(400)
      res.send({ message: 'Please upload excel file!' })
      return
    }
    if (
      req.file.mimetype !==
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      res.status(400)
      res.send({ message: 'File is invalid!' })
      return
    }
    const dataExcel = XLSX.readFile(req.file.path, {})
    const dataWorkSheet = dataExcel.Sheets[dataExcel.SheetNames[0]]
    const dataXlJsons = XLSX.utils.sheet_to_json(dataWorkSheet)
    const validateMsg = imporExcelValidator(dataXlJsons)
    if (validateMsg !== true) {
      return res.status(400).send({ validate: validateMsg })
    }
    // deleteDirectory(TPM)
    const resPosts = await posts.bulkCreate(dataXlJsons)
    res.send({
      message: 'Import file was created successfully.',
      data: resPosts,
    })
  } catch (error) {
    res.status(400).send(error)
  }
}

function imporExcelValidator(data) {
  const schema = Joi.array().items(
    Joi.object({
      title: Joi.string().max(100).required(),
      description: Joi.string(),
      user_id: Joi.number().required(),
    })
  )

  const { error } = schema.validate(data, { abortEarly: false })
  if (error) {
    return error.details
  }
  return true
}
