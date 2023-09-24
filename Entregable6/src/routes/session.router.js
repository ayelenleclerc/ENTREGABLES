import { Router } from "express";
import UserMananger from "../dao/UserManager.js";
import passport from "passport";
import { generateToken, authToken } from "../utils.js";

//isntancio la clase cartManager

const UM = new UserMananger();

const sessionRouter = Router();

//login con passport

sessionRouter.get(
  "/session/login",
  passport.authenticate("login"),
  async (req, res) => {
    if (!req.user)
      return res
        .status(400)
        .send({ status: "error", message: "credenciales invalidas" });
    req.session.user = {
      fist_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email,
      admin: req.user.admin,
    };
    delete req.user.password;
    const access_token = generateToken(req.user);
    console.log(access_token);
    res.send({ status: "success", access_token, datos: req.user });
  }
);

sessionRouter.get("/session/current", authToken, (req, res) => {
  res.send({ status: "success", datos: req.user });
});

//login con passport github

sessionRouter.get(
  "/session/github",
  passport.authenticate("github", { scope: "user:email" }),
  async (req, res) => {}
);

sessionRouter.get(
  "/session/githubCallBack",
  passport.authenticate("github", { failureRedirect: "/session/login" }),
  async (req, res) => {
    console.log(req.user);
    req.session.user = {
      fist_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email,
      admin: req.user.admin,
    };
    const access_token = generateToken(req.user);
    res.redirect("/products");
  }
);

//registro con passport

sessionRouter.post(
  "/session/register",
  passport.authenticate("register"),
  async (req, res) => {
    const access_token = generateToken(req.user);
    res.send({ status: "success", access_token });
  }
);

//logout

sessionRouter.get("/session/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

//restore
sessionRouter.post("/session/restore", async (req, resp) => {
  let { user, pass } = req.query;
  let userlogged = await UM.restore(user, pass);
  delete userlogged.password;
  if (userlogged == "invalidUser") {
    resp.status(400).send({ status: "ERROR", message: "Usuario incorrecto" });
  } else {
    req.session.users = userlogged;
    resp.send({
      status: "OK",
      message: "Clave modificada exitosamente ",
      datos: userlogged,
    });
  }
});

export default sessionRouter;
