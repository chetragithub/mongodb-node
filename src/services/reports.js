import models from '../models/index.js'
import { validRole } from '../utils/role.js'

const { orders } = models
export default {
  filter,
}

async function filter(req, res) {
  const resData = await orders.aggregate([
    {
      $match: {
        $and: [
          // {
          //   store_id: '65376cc91e2314abaa4551b9',
          // },
          {
            $expr: {
              $eq: [{ $year: '$datetime' }, Number(req.query.year)],
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'order_details',
        localField: '_id',
        foreignField: 'order_id',
        as: 'details',
      },
    },
    {
      $unwind: '$details',
    },
    {
      $lookup: {
        from: 'product_customizes',
        localField: 'details.product_customize_id',
        foreignField: '_id',
        as: 'product_customize',
      },
    },
    {
      $unwind: '$product_customize',
    },
    {
      $group: {
        _id: {
          year: { $year: '$datetime' },
          month: { $month: '$datetime' },
          // store_id: '$store_id',
        },
        total_money: {
          $sum: {
            $multiply: ['$details.quantity', '$product_customize.price'],
          },
        },
      },
    },
    {
      $sort: {
        '_id.month': 1,
      },
    },
  ])
  // .find({ store_id: req.user.store_id })
  // .populate({ path: 'order_details' })
  // resData.forEach( async (product, index) => {
  //   console.log(product);
  //   resData[index].product_customizes = await productCustomizes.find({ product_id: product.id })
  //   // product.product_customizes = await productCustomizes.find({ product_id: product.id })
  // });
  // let prods = [...resData]
  // prods[0].product_customizes = {name: 'oop'}
  // console.log(prods[0]);
  res.send({ success: true, message: `Get reports successful.`, data: resData })
}
