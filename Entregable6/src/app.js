import express from "express";
import expressHandlebars from "express-handlebars";
import Handlebars from "handlebars";
import session from "express-session";
import MongoStore from "connect-mongo";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import __dirname from "./utils.js";

import cartRouter from "./routes/cart.router.js";
import viewsRouter from "./routes/views.router.js";
import sessionRouter from "./routes/session.router.js";
import productRouter from "./routes/products.router.js";
import messageRouter from "./Routes/message.router.js";

import ProductManager from "./dao/ProductManager.js";
import messageMananger from "./dao/messageManager.js";

//Creo el servidor

const PORT = process.env.PORT || 8080;

const app = express();

const httpServer = app.listen(PORT, async () => {
  console.log(`servidor conectado al puerto ${PORT}`);
});
const socketServer = new Server(httpServer);

mongoose.connect(
  "mongodb+srv://Ayelenleclerc:yuskia13@backend.xrrgkdz.mongodb.net/ecommerce?retryWrites=true&w=majority"
);

app.use(express.static(__dirname + "/public"));
app.engine(
  "handlebars",
  expressHandlebars.engine({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://Ayelenleclerc:yuskia13@backend.xrrgkdz.mongodb.net/ecommerce?retryWrites=true&w=majority",
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 15000,
    }),
    secret: "c0d3rS3cr3t",
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/", viewsRouter);
app.use("/api", productRouter);
app.use("/api", cartRouter);
app.use("/", messageRouter);
app.use("/api/sessions", sessionRouter);
app.use(cookieParser("c0d3rS3cr3t"));

// instancio la clase para poder enviar a todos los clientes los productos

socketServer.on("connection", async (socket) => {
  let PM = new ProductManager();
  let productos = await PM.getProducts({
    limit: "",
    page: "",
    query: "",
    sort: "",
  });
  let MM = new messageMananger();
  let mensajes = await MM.getMessage();
  console.log("nueva conexion realizada");
  socketServer.emit("productos", productos);
  socketServer.emit("mensajes", mensajes);

  socket.on("agregarProducto", async (product) => {
    let PM = new ProductManager();
    await PM.addProduct(
      product.title,
      product.description,
      product.category,
      product.price,
      product.thumbnail,
      product.code,
      product.stock
    );
    let productos = await PM.getProducts({
      limit: "",
      page: "",
      query: "",
      sort: "",
    });
    socketServer.emit("productos", productos);
  });

  socket.on("eliminarProducto", async (id) => {
    let PM = new ProductManager();
    await PM.deleteProduct(id);
    let PmNEW = new ProductManager();
    let productos = await PmNEW.getProducts({
      limit: "",
      page: "",
      query: "",
      sort: "",
    });
    socketServer.emit("productos", productos);
  });
  socket.on("newMessage", async (message) => {
    let MM = new messageMananger();
    await MM.createMessage(message.user, message.message);
    let newMessage = await MM.getMessage();
    socketServer.emit("mensajes", newMessage);
  });
});
