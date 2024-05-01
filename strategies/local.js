import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from 'bcrypt';
import db from '../configs/db.js'

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
},
    function(username, password, done) {
        db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
            if (err) { 
                return done(err)
            }
            if (results.length === 0) {
                return done(null, false, {message: 'Incorrect Username'})
            }
            const user = results[0];
            bcrypt.compare(password, user.password, (err, matches) => {
                if (err) { 
                    return done(err)
                }
                if (matches) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Incorrect Password'});
                }
            })
        })
    }
))

// Serialize user into the sessions
passport.serializeUser((user, done) => {
    done(null, user.id_user)
})

// Deserialize user from the session
passport.deserializeUser((id, done) => {
    db.query('SELECT * FROM users WHERE id_user = ?', [id], (err, results) => {
        if (err) { 
            return done(err) 
        }
        done(null, results[0])
    })
})

export default passport