import models from '../models/index.js'
import { snakeToCamel, getDefinedValues } from '../helpers/index.js'
import { validRole } from '../utils/role.js'

const { products, productCustomizes, user } = models
export default {
  getAll,
  getById,
  create,
  update,
  destroy,
}

async function getAll(req, res) {
  const resData = await products.find({ store_id: req.user.store_id }).populate('category_id product_customizes')
  // resData.forEach( async (product, index) => {
  //   console.log(product);
  //   resData[index].product_customizes = await productCustomizes.find({ product_id: product.id })
  //   // product.product_customizes = await productCustomizes.find({ product_id: product.id })
  // });
  // let prods = [...resData]
  // prods[0].product_customizes = {name: 'oop'}
  // console.log(prods[0]);
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
  const validRoleRe = validRole(req.user.role_name)
  if (!validRoleRe.success) {
    return res.status(403).send(validRoleRe)
  }
  const productData = { ...req.body }
  productData.store_id = req.user.store_id
  productData.product_customizes = []
  const resProduct = await products.create(productData)
  req.body._id = resProduct.id
  for (const prodCus of req.body.product_customizes) {
    prodCus.product_id = resProduct.id
    const resProdCus = await productCustomizes.create(prodCus)
    productData.product_customizes.push(resProdCus.id)
  }
  await products.findByIdAndUpdate(resProduct.id, { product_customizes: productData.product_customizes})
  res.send({ success: true, message: `products created successful.`, data: req.body })
}
async function update(req, res) {
  const validRoleRe = validRole(req.user.role_name)
  if (!validRoleRe.success) {
    return res.status(403).send(validRoleRe)
  }
  if (req.params.id.length === 24) {
    const resProd = await products.findById(req.params.id)
    if (!resProd) {
      return res.status(404).send({ success: false, message: `Not Found.` })
    }
    for (const prodCus of req.body.product_customizes) {
      if (prodCus.product_customize_id) {
        await productCustomizes.findByIdAndUpdate(prodCus.product_customize_id, prodCus)
      } else {
        const resProdCus = await productCustomizes.create({ ...prodCus, product_id: req.params.id})
        resProd.product_customizes.push(resProdCus.id)
      }
    }
    req.body.product_customizes = resProd.product_customizes
    await products.findByIdAndUpdate(req.params.id, req.body)
    return res.status(200).send({ success: true, message: `products updated successful.`, data: await products.findById(req.params.id).populate('category_id product_customizes') })
  }
  res.status(400).send({ success: false, message: "Bad request." })
}
async function destroy(req, res) {
  const validRoleRe = validRole(req.user.role_name)
  if (!validRoleRe.success) {
    return res.status(403).send(validRoleRe)
  }
  if (req.params.id.length === 24) {
    const resData = await products.findByIdAndDelete(req.params.id)
    if (!resData) {
      return res.status(404).send({ success: false, message: `Not Found.` })
    }
    await productCustomizes.deleteMany({ product_id: req.params.id })
    return res.status(200).send({ success: true, message: `products deleted successful.` })
  }
  res.status(400).send({ success: false, message: "Bad request." })
}