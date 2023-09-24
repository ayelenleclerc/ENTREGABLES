import { Router } from "express";
import ProductManager from "../dao/ProductManager.js";
import cartManager from "../dao/cartManager.js";

//creo el middleware para autenticar administrador
function authAdmin(req, res, next) {
  if (req.session?.admin) {
    return next();
  }
  return res
    .status(401)
    .send("error de autorización! Ingrese con un usuario administrador");
}

//creo el middleware para autenticar logueo
function auth(req, res, next) {
  if (req.session.user) {
    return next();
  }
  return res.status(401).send("error de autorización!");
  //res.redirect("/login")
}

//creo el middleware para autenticar logueo
function authLogin(req, res, next) {
  if (req.session.user) {
    res.redirect("/products");
    return res.status(401).send("error de autorización!");
  }
  return next();
}

//instancio la clase Productmanager

const PM = new ProductManager();
const CM = new cartManager();

const viewsRouter = Router();

viewsRouter.get("/", auth, async (req, resp) => {
  let userLogged = req.user.first_name;

  let productos = await PM.getProducts(req.query);

  resp.render("home", {
    product: productos.payLoad,
    user: userLogged,
    style: "style.css",
  });
});

viewsRouter.get("/products", auth, async (req, resp) => {
  let userLogged = req.user.first_name;
  console.log("holasssssss " + userLogged);

  let productos = await PM.getProducts(req.query);

  resp.render("products", {
    product: productos,
    user: userLogged,
    style: "../../css/style.css",
  });
});

viewsRouter.get("/realtimeproducts", authAdmin, async (req, resp) => {
  let userLogged = req.user.first_name;

  resp.render("realTimeProducts", {
    user: userLogged,
    style: "style.css",
  });
});

viewsRouter.get("/chat", auth, async (req, resp) => {
  let userLogged = req.user.first_name;

  resp.render("chat", {
    user: userLogged,
    style: "../../css/style.css",
  });
});

viewsRouter.get("/cart/:cid", auth, async (req, resp) => {
  let userLogged = req.user.first_name;

  let cid = req.params.cid;
  let respuesta = await CM.getCartById(cid);
  resp.render("cartId", {
    user: userLogged,
    productos: respuesta[0].products,
    style: "../../css/style.css",
  });
});

viewsRouter.get("/login", authLogin, async (req, resp) => {
  resp.render("login", {
    style: "../../css/style.css",
  });
});
viewsRouter.get("/register", authLogin, async (req, resp) => {
  resp.render("register", {
    style: "../../css/style.css",
  });
});
viewsRouter.get("/profile", async (req, resp) => {
  let userLogged = req.user.first_name;

  resp.render("profile", {
    user: userLogged,
    style: "../../css/style.css",
  });
});

viewsRouter.get("/restore", async (req, resp) => {
  resp.render("restore", {
    style: "../../css/style.css",
  });
});

export default viewsRouter;
