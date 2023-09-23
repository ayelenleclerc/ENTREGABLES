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

// //creo el middleware para autenticar logueo
// function auth(req, res, next) {
//   if (req.session.user) {
//     return next();
//   }
//   res.redirect("/login");
//   return res.status(401).send("error de autorización!");
// }

// //creo el middleware para autenticar logueo
// function authLogin(req, res, next) {
//   if (!req.session.user) {
//     res.redirect("/products");
//     return res.status(401).send("error de autorización!");
//   }
//   return next();
// }

//instancio la clase Productmanager

const PM = new ProductManager();
const CM = new cartManager();

const router = Router();

// router.get("/", auth, async (req, resp) => {
//   let userLogged = req.session.user;

//   let productos = await PM.getProducts(req.query);

//   resp.render("home", {
//     product: productos.payLoad,
//     user: userLogged,
//     style: "style.css",
//   });
// });

router.get("/products", async (req, resp) => {
  let userLogged = req.session.user;

  let productos = await PM.getProducts(req.query);

  resp.render("products", {
    product: productos,
    user: userLogged,
    style: "../../css/style.css",
  });
});

router.get("/realtimeproducts", async (req, resp) => {
  let userLogged = req.session.user;

  resp.render("realTimeProducts", {
    user: userLogged,
    style: "style.css",
  });
});

router.get("/chat", async (req, resp) => {
  let userLogged = req.session.user;

  resp.render("chat", {
    user: userLogged,
    style: "../../css/style.css",
  });
});

router.get("/cart/:cid", async (req, resp) => {
  let userLogged = req.session.user;

  let cid = req.params.cid;
  let respuesta = await CM.getCartById(cid);
  resp.render("cartId", {
    user: userLogged,
    productos: respuesta[0].products,
    style: "../../css/style.css",
  });
});

// router.get("/login", authLogin, async (req, resp) => {
//   resp.render("login", {
//     style: "../../css/style.css",
//   });
// });
// router.get("/register", authLogin, async (req, resp) => {
//   resp.render("register", {
//     style: "../../css/style.css",
//   });
// });
// router.get("/profile", async (req, resp) => {
//   let userLogged = req.session.user;

//   resp.render("profile", {
//     user: userLogged,
//     style: "../../css/style.css",
//   });
// });

router.get("/", async (req, res) => {
  if (!req.session.user) {
    //Si ya murió la sesión, redirige al login
    return res.redirect("/login");
  }
  res.render("Profile", { user: req.session.user });
});

router.get("/profilejwt", async (req, res) => {
  res.render("ProfileJWT");
});

router.get("/register", async (req, res) => {
  res.render("Register");
});

router.get("/login", async (req, res) => {
  res.render("Login");
});

export default router;
