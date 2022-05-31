const { v4: uuid } = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  try {
    const token = uuid();

    const user = await new User({
      email: ctx.request.body.email,
      displayName: ctx.request.body.displayName,
      verificationToken: token
    });
    await user.setPassword(ctx.request.body.password);
    await user.save();

    await sendMail({
      template: 'confirmation',
      locals: {token},
      to: user.email,
      subject: 'Подтвердите почту',

    })
    ctx.body = {"status": "ok"}

  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports.confirm = async (ctx, next) => {
  try {
    const verificationToken = ctx.request.body.verificationToken;

    const user = await User.findOne({verificationToken});
    if(!user) {
      ctx.status = 400;
      ctx.body = {error: 'Ссылка подтверждения недействительна или устарела'};
      return;
    }
    user.verificationToken = undefined;
    await user.save();

    const token = await ctx.login(user);

    ctx.body = {token}

  } catch (err) {
    throw err;
  }
};

