const Order = require('../models/Order');
const Product = require('../models/Product');
const sendMail = require('../libs/sendMail');
const mapOrder = require('../mappers/order.js');


module.exports.checkout = async function checkout(ctx, next) {

  try {
    const product = await Product.findById(ctx.request.body.product);
    const order = await Order.create({
      user: ctx.user,
      product: ctx.request.body.product,
      phone: ctx.request.body.phone,
      address: ctx.request.body.address,
    });
    await sendMail({
      template: 'order-confirmation',
      locals: {id: product.id, product},
      to: ctx.user.email,
      subject: 'Подтверждение заказа',
    })
    ctx.body = {order: order.id};
  } catch (err) {
    throw err;
  }
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const orders = await Order.find({user: ctx.user}).populate('product')

  ctx.body = {orders: orders.map(item => mapOrder(item))};
};
