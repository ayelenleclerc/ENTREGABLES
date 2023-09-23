import { Router } from "express";
import ProductManager from "../dao/ProductManager.js";

//instancio la clase Productmanager

const PM = new ProductManager();

const productRouter = Router();

productRouter.get("/products", async (req, resp) => {
  let productos = await PM.getProducts(req.query);

  resp.send(productos);
});
productRouter.get("/products/:pid", async (req, resp) => {
  let pid = req.params.pid;

  if (pid == undefined) {
    resp.send(await PM.getProducts());
  } else {
    let respuesta = await PM.getProductById(pid);
    if (respuesta == false) {
      resp.send("no existe el id");
    } else {
      resp.send(await PM.getProductById(pid));
    }
  }
});

productRouter.post("/products/", async (req, resp) => {
  let { title, description, category, price, thumbnail, code, stock } =
    req.body;

  let productos = await PM.addProduct(
    title,
    description,
    category,
    price,
    thumbnail,
    code,
    stock
  );

  if (productos == "valorVacio") {
    resp
      .status(400)
      .send({ status: "error", message: "complete los campos obligatorios" });
  } else if (productos == "codeRepetido") {
    resp
      .status(400)
      .send({ status: "error", message: "ya existe producto con ese code" });
  } else {
    resp.status(200).send("se agrego correctamente");
  }
});

productRouter.put("/products/:pid", async (req, resp) => {
  const id = req.params.pid;
  let { title, description, category, price, thumbnail, code, stock } =
    req.body;

  let productos = await PM.updateProduct(
    id,
    title,
    description,
    category,
    price,
    thumbnail,
    code,
    stock
  );

  if (productos == "valorVacio") {
    resp
      .status(400)
      .send({ status: "error", message: "complete los campos obligatorios" });
  } else if (productos == "codeRepetido") {
    resp
      .status(400)
      .send({ status: "error", message: "ya existe producto con ese code" });
  } else if (productos == "idInvalido") {
    resp
      .status(400)
      .send({ status: "error", message: "no existen productos con ese ID" });
  } else {
    resp.status(200).send("se actualizo correctamente");
  }
});

productRouter.delete("/products/:pid", async (req, resp) => {
  const id = req.params.pid;

  let productos = await PM.deleteProduct(id);

  if (productos) {
    resp.status(200).send("se elimino el producto correctamente");
  } else {
    resp
      .status(400)
      .send({ status: "error", message: "no se encontro el elemento" });
  }
});

export default productRouter;
