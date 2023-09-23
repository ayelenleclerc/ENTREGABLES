import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

import UserManager from "../dao/userManager.js";
import auth from "../services/auth.js";
import { validateJWT } from "../middlewares/jwtExtractor.js";

const router = Router();
const usersService = new UserManager();

router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/api/sessions/authFail",
    failureMessage: true,
  }),
  async (req, res) => {
    //Al final el usuarios siempre te va a llegar en req.user
    res.send({ status: "success", payload: req.user._id });
  }
);

router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/authFail",
    failureMessage: true,
  }),
  async (req, res) => {
    //Al final el usuarios siempre te va a llegar en req.user
    req.session.user = req.user;
    res.send({ status: "success", message: "Logged in" });
  }
);

router.post("/loginJWT", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .send({ status: "error", error: "Incomplete values" });
  const user = await usersService.getBy({ email });
  if (!user)
    return res
      .status(400)
      .send({ status: "error", error: "Incorrect Credentials" });
  //Ya que existe el usuario, ahora debo comparar las contraseñas
  const isValidPassword = await auth.validatePassword(password, user.password);
  if (!isValidPassword)
    return res
      .status(400)
      .send({ status: "error", error: "Incorrect Credentials" });
  //Si se logueó bien, AHORA LE CREO UN TOKEN
  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role, name: user.firstName },
    "secretjwt",
    { expiresIn: "1h" }
  );
  //Si la idea es delegarle el token al usuario, tengo que enviarselo de alguna manera
  /**
   * Desde el body, *** HOY ***
   * Desde una Cookie ***** PRÓXIMA VEZ *****
   */
  console.log(token);
  res.send({ status: "success", token });
});

//Para autenticaciones de terceros, SIEMPRE ocuparemos DOS endpoints

router.get("/github", passport.authenticate("github"), (req, res) => {}); //Trigger de mi estrategia de passport
router.get("/githubcallback", passport.authenticate("github"), (req, res) => {
  //Aquí es donde cae toda la info
  req.session.user = req.user;
  res.redirect("/");
});

router.get("/authFail", (req, res) => {
  //Si cayó a este endpoint, significa que falló.
  console.log(req.session.messages);
  if (req.session.messages) {
    res.status(401).send({ status: "error", error: req.session.messages[0] });
  } else {
    res.status(401).send({
      status: "error",
      error: "Error de input incompleto para estrategia de passport",
    });
  }
});

router.get("/logout", async (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.log(error);
      return res.redirect("/");
    } else {
      res.redirect("/");
    }
  });
});

router.get("/eliminarProductos", (req, res) => {
  //Número uno, ¿Ya tiene credenciales (ya puedo identificarlo)?
  if (!req.session.user)
    return res.status(401).send({ status: "error", error: "Not logged in" });
  //Si llega a esta línea, entonces ya sé quién es
  //Ahora necesito corroborar si tiene el permiso suficiente
  if (req.session.user.role !== "admin")
    return res.status(403).send({ status: "error", error: "No permitido" });
  //Si llegué hasta acá, sí te conozco, y SÍ tienes permisos
  res.send({ status: "success", message: "Productos eliminados" });
});

router.get("/profileInfo", validateJWT, async (req, res) => {
  //Éste debe devolver la información a partir del token
  console.log(req.user);
  res.send({ status: "success", payload: req.user });
});

export default router;
