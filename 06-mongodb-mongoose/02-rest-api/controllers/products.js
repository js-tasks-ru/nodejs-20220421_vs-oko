const Product = require('../models/Product');
const mapProduct = require('../mappers/product.js')

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) return next();
  const productsArr = await Product.find({subcategory})

  ctx.body = {products: productsArr.map(elem => mapProduct(elem))};
};

module.exports.productList = async function productList(ctx, next) {
  const productsArr = await Product.find()

  ctx.body = {products: productsArr.map(elem => mapProduct(elem))};
};

module.exports.productById = async function productById(ctx, next) {
  const product = await Product.findById(ctx.params.id);
  if (product) ctx.body = {product: mapProduct(product)};
};

