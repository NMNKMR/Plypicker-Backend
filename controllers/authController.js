//Importing Passprt and it's Local Strategy
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../models/user');
//Importing Passprt-JWT strategy.
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

//Creating Local Strategy to Login Users 
//finding them in User Database and Validating their entered password.
passport.use(new localStrategy(async (username, password, done) => {
  try {
    const email = username;
    const user = await UserModel.findOne({ email });
    if (!user) return done(null, false, 'User not found'); //User not found in DB.

    const isMatch = await user.isValidPassword(password); //If user found then validates password.
    if (!isMatch) return done(null, false, 'Wrong Password'); //Wrong Password

    return done(null, user, 'Logged in Successfully'); //If Successfull then Logged In.
  } catch (error) {
    return done(error);
  }
}));

//Passport-JWT Startegy to Authorize Users (on particular routes where JWT enabled).
//by extracting token from Header and verify.
passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);