const {v4: uuid} = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const verificationToken = uuid();
  const user = new User({
    email: ctx.request.body.email,
    displayName: ctx.request.body.displayName,
    verificationToken,
  });

  await user.setPassword(ctx.request.body.password);
  await user.save();

  await sendMail({
<<<<<<< HEAD
    template: 'confirmation',
    locals: {token: verificationToken},
    to: user.email,
    subject: 'Подтвердите почту',
=======
    to: user.email,
    subject: 'Подтвердите почту',
    locals: {token: verificationToken},
    template: 'confirmation',
>>>>>>> 5f78af4cf1e0d0425a8694503618cf376a17af90
  });

  ctx.body = {status: 'ok'};
};

module.exports.confirm = async (ctx, next) => {
  const user = await User.findOne({
    verificationToken: ctx.request.body.verificationToken,
  });

  if (!user) {
    ctx.throw(400, 'Ссылка подтверждения недействительна или устарела');
  }

  user.verificationToken = undefined;
  await user.save();

  const token = uuid();

  ctx.body = {token};
};
