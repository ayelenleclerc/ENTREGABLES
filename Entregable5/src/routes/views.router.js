import { Router } from "express";
import ProductManager from "../dao/ProductManager.js";
import cartManager from "../dao/cartManager.js";

//instancio la clase Productmanager

const PM = new ProductManager();
const CM = new cartManager();

const viewsRouter = Router();

viewsRouter.get("/", async (req, resp) => {
  let productos = await PM.getProducts(req.query);

  resp.render("home", {
    product: productos.payLoad,
    style: "style.css",
  });
});

viewsRouter.get("/products", async (req, resp) => {
  let productos = await PM.getProducts(req.query);

  resp.render("products", {
    product: productos,
    style: "style.css",
  });
});

viewsRouter.get("/realtimeproducts", async (req, resp) => {
  resp.render("realTimeProducts", {
    style: "style.css",
  });
});

viewsRouter.get("/chat", async (req, resp) => {
  resp.render("chat", {
    style: "style.css",
  });
});

viewsRouter.get("/cart/:cid", async (req, resp) => {
  let cid = req.params.cid;
  let respuesta = await CM.getCartById(cid);
  resp.render("cartId", {
    productos: respuesta[0].products,
    style: "../../css/style.css",
  });
});

export default viewsRouter;
