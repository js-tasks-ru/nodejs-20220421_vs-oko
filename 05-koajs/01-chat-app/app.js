const path = require('path');
const Koa = require('koa');
const app = new Koa();
app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();
const clients = [];

router.get('/subscribe', async (ctx) => {
  ctx.body = await new Promise((resolve) => {
    clients.push(resolve);

    ctx.res.on('close', function() {
      clients.splice(clients.indexOf(resolve), 1);
      resolve();
    });
  });
});

router.post('/publish', async (ctx) => {
  const message = ctx.request.body.message;

  if (!message) {
    ctx.throw(400);
  }

  clients.forEach(function(resolve) {
    resolve(message);
  });

  clients.length = 0;

  ctx.body = 'ok';
});

app.use(router.routes());

module.exports = app;
