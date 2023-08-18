import express from "express";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./managers/productsManager.js";
import { __dirname } from "./utils.js";

const app = express();

const PORT = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);

//rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
const pmanager = new ProductManager(__dirname + "/files/products.json");
const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {
  console.log("Cliente conectado con id: ", socket.id);

  const listProducts = await pmanager.getProducts({});
  socketServer.emit("sendProducts", listProducts);

  socket.on("addProduct", async (obj) => {
    await pmanager.addProduct(obj);
    const listProducts = await pmanager.getProducts({});
    socketServer.emit("sendProducts", listProducts);
  });

  socket.on("deleteProduct", async (id) => {
    await pmanager.deleteProduct(id);
    const listProducts = await pmanager.getProducts({});
    socketServer.emit("sendProducts", listProducts);
  });
  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});
