const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (email === undefined) {
    done(null, false, 'Не указан email');
    return;
  };

  User.findOne({email}, async (err, user) => {
    if (err) done(err);
    if (user) {
      done(null, user);
    } else {
      const newUser = new User({email, displayName});

      try {
        await newUser.save();
        done(null, newUser);
      } catch (err) {
        done(err);
      }
    };
  });
};
