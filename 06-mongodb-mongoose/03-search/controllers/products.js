const Product = require('../models/Product');
const mapProduct = require('../mappers/product');


module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  console.log(ctx.query.query);
  const query = ctx.query.query;
  const products = await Product
    .find({ $text: { $search: query } }, { score: { $meta: "textScore" } })
    .sort( { score: { $meta: "textScore" } } )
  ctx.body = {products: products.map(el => mapProduct(el))};
};
