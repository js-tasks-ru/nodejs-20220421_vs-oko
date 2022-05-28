const User = require('../../models/User.js');

module.exports = async function authenticate(strategy, email, displayName, done) {

  try{

    if ( !email ) return done(null, false, 'Не указан email');

    let user = await User.findOne({email});

    if ( !user ) {
      user = await User.create({
        email,
        displayName,
      });

    }
    return done(null, user);

  } catch (err) {

    return done(err)

  }
};
