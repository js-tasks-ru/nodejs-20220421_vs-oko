const Category = require('../models/Category');
const mapCategory =  require('../mappers/Category')

module.exports.categoryList = async function categoryList(ctx, next) {
  const categoryArr = await Category.find()
  ctx.body = {categories: categoryArr.map(elem => mapCategory(elem))};
};
