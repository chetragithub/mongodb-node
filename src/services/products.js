import models from '../models/index.js'
import { snakeToCamel, getDefinedValues } from '../helpers/index.js'

const { products, productCustomizes, user } = models
export default {
  getAll,
  getById,
  create,
  update,
  destroy,
}

async function getAll(req, res) {
  const resData = await products.find({ store_id: req.user.store_id }).populate('product_customizes')
  res.send({ success: true, message: `Get all products successful.`, data: resData })
}
async function getById(req, res) {
  if (req.params.id.length === 24) {
    const resData = await products.findByIdAndDelete(req.params.id)
    if (!resData) {
      return res.status(404).send({ success: false, message: `Not Found.` })
    }
    return res.status(200).send({ success: true, message: `Get ${tableName} successful.`, data: resData })
  }
  res.status(400).send({ success: false, message: "Bad request." })
}
async function create(req, res) {
  const productData = { ...req.body }
  productData.store_id = req.user.store_id
  productData.product_customizes = []
  const resProduct = await products.create(productData)
  req.body.product_customizes.forEach(prodCusData => {
    prodCusData.product_id = resProduct.id
    productCustomizes.create(prodCusData)
    console.log(prodCusData);
  });
  res.send({ success: true, message: `products created successful.`, data: req.body })
}
async function update(req, res) {
  if (req.params.id.length === 24) {
    const resData = await products.findByIdAndUpdate(req.params.id, req.body)
    if (!resData) {
      return res.status(404).send({ success: false, message: `Not Found.` })
    }
    return res.status(200).send({ success: true, message: `products updated successful.`, data: await products.findById(req.params.id) })
  }
  res.status(400).send({ success: false, message: "Bad request." })
}
async function destroy(req, res) {
  if (req.params.id.length === 24) {
    const resData = await products.findByIdAndDelete(req.params.id)
    if (!resData) {
      return res.status(404).send({ success: false, message: `Not Found.` })
    }
    return res.status(200).send({ success: true, message: `products deleted successful.` })
  }
  res.status(400).send({ success: false, message: "Bad request." })
}