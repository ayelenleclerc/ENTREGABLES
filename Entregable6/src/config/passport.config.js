import passport from "passport";
import local from "passport-local";
import userModel from "../dao/models/userModel.js";
import { createHash } from "../utils.js";
import { isValidPassword } from "../utils.js";
import userMananger from "../dao/userManager.js";
import GitHubStategy from "passport-github2";

let UM = new userMananger();

const localStrategy = local.Strategy;
const initiliazePassport = () => {
  passport.use(
    "github",
    new GitHubStategy(
      {
        clientID: "Iv1.4137e4f2dd3e6616",
        clientSecret: "353ae059b1ff420033c685f1ab84e3c1a90ff3cc",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile);
          let user = await userModel.findOne({ email: profile._json.email });
          if (!user) {
            let newUser = {
              first_name: profile._json.name,
              last_name: "",
              age: "",
              email: profile._json.email,
              password: "",
              admin: false,
            };
            let result = await userModel.create(newUser);
            return done(null, result);
          } else {
            return done(null, user);
          }
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.use(
    "register",
    new localStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        let { first_name, last_name, email, age, admin } = req.body;
        try {
          let user = await userModel.findOne({ email: username });
          if (user) {
            console.log("ya existe el usuario");
            let alerta = document.getElementById("alerta");
            alerta.innerHTML = "Usuario ya registrado, pruebe otro email";
            return done(null, { message: "usuario registrado" });
          }
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            admin,
          };
          let result = await userModel.create(newUser);
          return done(null, result);
        } catch (error) {
          return done("error al obtener el usuario: " + error);
        }
      }
    )
  );

  passport.use(
    "login",
    new localStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await userModel.findOne({ email: username });
          if (!user) {
            console.log("el usuario elegido no existe");
            return done(null, false);
          }
          if (!isValidPassword(user, password)) return done(null, false);
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById(id);
    done(null, user);
  });
};

export default initiliazePassport;
