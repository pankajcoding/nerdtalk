const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((user, done) => {
        done(null, user);
    });
    passport.use(new GoogleStrategy({
            clientID: "645749915463-6ibotc6pf51q87qg7vfrrfcvgitoob3i.apps.googleusercontent.com",
            clientSecret: "rGmYIQEoltkja5_m49YeJLMT",
            callbackURL: "http://localhost:3000/auth/google/callback"
        },
        (token, refreshToken, profile, done) => {
            return done(null, {     
                profile: profile,
                token: token
            });
        }));
};