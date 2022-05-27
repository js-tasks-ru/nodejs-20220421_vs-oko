const path = require('path');
const Koa = require('koa');
const app = new Koa();
app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();
const clients = [];

router.get('/subscribe', async (ctx, next) => {
  clients.push(
   new Promise(resolve => {
          const timer =  setInterval(()=>{if (ctx.app.message) resolve(timer)}, 100);
          return timer;
      }).then(timer => clearInterval(timer))
    );
  for await (const client of clients) {
    ctx.body = ctx.app.message;
    clients.splice(clients.indexOf(client), 1)
  }
  ctx.app.message = null;
});

router.post('/publish', async (ctx, next) => {
  ctx.app.message = ctx.request.body.message;
  ctx.body = '';
});

app.use(router.routes());

module.exports = app;
