const Koa = require('koa');
const Router = require('koa-router');
const mongoose = require('mongoose');
const {productsBySubcategory, productList, productById} = require('./controllers/products');
const {categoryList} = require('./controllers/categories');

const app = new Koa();

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.status) {
      ctx.status = err.status;
      ctx.body = {error: err.message};
    } else {
      console.error(err);
      ctx.status = 500;
      ctx.body = {error: 'Internal server error'};
    }
  }
});

const router = new Router({prefix: '/api'});

router.get('/categories', categoryList);
router.get('/products', productsBySubcategory, productList);
router.get('/products/:id',validateObjectID, productById);
function validateObjectID(ctx, next) {
  if(!mongoose.isValidObjectId(ctx.params.id)){
    ctx.status = 400;
    ctx.body = 'invalid id';
    return;
  }

    return next();
}
app.use(router.routes());

module.exports = app;
