const Session = require('../models/Session');

module.exports = async function mustBeAuthenticated(ctx, next) {
  const header = ctx.request.get('Authorization');

  if (!header) {
    ctx.status = 401;
    ctx.body = {error: 'Пользователь не залогинен'};
    return;
  }

  const token = header.split(' ')[1];

  const session = await Session.findOne({token}).populate('user');
  ctx.user = session.user;
  return next();
};
