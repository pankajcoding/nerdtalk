const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((user, done) => {
        done(null, user);
    });
    passport.use(new GoogleStrategy({
            clientID: "322457436733-3f6e1i8sligc2voenbjvt6qkjt1cdb4s.apps.googleusercontent.com",
            clientSecret: "mgL7Q36YfleHxeYdmfGI2bpW",
            callbackURL: "https://newgit-pankajcoding.c9users.io/auth/google/callback"
        },
        (token, refreshToken, profile, done) => {
            return done(null, {     
                profile: profile,
                token: token
            });
        }));
};