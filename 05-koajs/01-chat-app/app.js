const path = require('path');
const Koa = require('koa');
const app = new Koa();
const Emitter = require('node:events');


app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();
const emitter = new Emitter();


router.get('/subscribe', async (ctx, next) => {
  ctx.body = await waitMessage();
});

router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body.message;
  if (message !== undefined && message.length > 0) {
    emitter.emit('receivedMessage', message);
    ctx.status = 200;
  }
});

app.use(router.routes());

async function waitMessage() {
  return new Promise((resolve, reject) => {
    emitter.on('receivedMessage', (message) => resolve(message));
  });
}

module.exports = app;
