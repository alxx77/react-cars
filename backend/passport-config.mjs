import * as Crypto from "crypto";

import LocalStrategy from "passport-local";

function initialize(passport, getUserByEmail, getUserById) {
  //autentifikacija korisnika
  const authenticateUser = async (email, password, done) => {
    //nađi korisnika po emailu
    const user = await getUserByEmail(email);

    //ako ga nema
    if (user == null) {
      //vrati poruku
      return done(null, false, { message: "No user with that email" });
    }

    //ako ga ima
    try {
      //uporedi passworde
      const hash = Crypto.createHash("md5");

      hash.update(password + user.pwdsalt);

      const pwdhash = hash.digest("hex");

      //
      if (pwdhash === user.pwdhash) {
        //vrati korisnika
        return done(null, user);
      } else {
        return done(null, false, { message: "Password incorrect" });
      }
    } catch (error) {
      return done(error);
    }
  };

  //nov passport objekt
  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));

  //user-> simbol
  passport.serializeUser((user, done) => done(null, user.user_id));

  //simbol->user
  passport.deserializeUser((user_id, done) =>
    getUserById(user_id).then(
      (user) => {
        return done(null, user);
      },
      (err) => {
        return done(err, null);
      }
    )
  );
}

export default initialize;
