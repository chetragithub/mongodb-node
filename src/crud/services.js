import { model } from 'mongoose'
import models from '../models/index.js'
const { products } = models

export default function initServices(tableName, config) {
  const models = model(tableName)
  return { create, getAll, getById, update, destroy }
  async function getAll(req, res) {
    const resData = await models.find({ store_id: req.user.store_id }).select('-store_id')
    res.send({ success: true, message: `Get all ${tableName} successful.`, data: resData })
  }
  async function getById(req, res) {
    if (req.params.id.length === 24) {
      const resData = await models.findByIdAndDelete(req.params.id)
      if (!resData) {
        return res.status(404).send({ success: false, message: `Not Found.` })
      }
      return res.status(200).send({ success: true, message: `Get ${tableName} successful.`, data: resData })
    }
    res.status(400).send({ success: false, message: "Bad request." })
  }
  async function create(req, res) {
    const createData = req.body
    createData.store_id = req.user.store_id
    const resData = await models.create(createData)
    res.send({ success: true, message: `${tableName} created successful.`, data: resData })
  }
  async function update(req, res) {
    if (req.params.id.length === 24) {
      const resData = await models.findByIdAndUpdate(req.params.id, req.body)
      if (!resData) {
        return res.status(404).send({ success: false, message: `Not Found.` })
      }
      return res.status(200).send({ success: true, message: `${tableName} updated successful.`, data: await models.findById(req.params.id) })
    }
    res.status(400).send({ success: false, message: "Bad request." })
  }
  async function destroy(req, res) {
    if (req.params.id.length === 24) {
      const resData = await models.findByIdAndDelete(req.params.id)
      if (!resData) {
        return res.status(404).send({ success: false, message: `Not Found.` })
      }
      if (tableName === 'categories') {
        await products.deleteMany({ category_id: req.params.id })
      }
      return res.status(200).send({ success: true, message: `${tableName} deleted successful.` })
    }
    res.status(400).send({ success: false, message: "Bad request." })
  }
}
