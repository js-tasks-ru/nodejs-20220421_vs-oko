const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User.js');


module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    async function(email, password, done) {
      try {
        let info;
        let user = await User.findOne({email})
        if(user) {
          const passwordIsValid = await user.checkPassword(password)
          if (!passwordIsValid) {
            info = 'Неверный пароль';
            user = false;
          }
        } else {
          info = 'Нет такого пользователя'
          user = false;
        }
        done(null, user, info);
      } catch (err) {
        done(err, null, null);
      }

    },
);
