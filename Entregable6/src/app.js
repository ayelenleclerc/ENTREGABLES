import express from "express";
import expressHandlebars from "express-handlebars";
import Handlebars from "handlebars";
import productRouter from "./routes/products.router.js";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import cartRouter from "./routes/cart.router.js";
import __dirname from "./utils.js";
import viewsRouter from "./routes/views.router.js";
import { Server } from "socket.io";
import ProductManager from "./dao/ProductManager.js";
import mongoose from "mongoose";
import messageMananger from "./dao/messageManager.js";
import messageRouter from "./routes/message.router.js";
import cookieParser from "cookie-parser";
import sessionRouter from "./routes/session.router.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import initiliazePassport from "./config/passport.config.js";

//Creo el servidor

const puerto = 8080;

const app = express();

const httpServer = app.listen(puerto, async () => {
  console.log(`servidor conectado al puerto ${puerto}`);
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
    secret: "cr1st14n",
    resave: false,
    saveUninitialized: false,
  })
);

initiliazePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use("/", viewsRouter);
app.use("/api", productRouter);
app.use("/api", cartRouter);
app.use("/api", sessionRouter);
app.use("/", messageRouter);
app.use(cookieParser());

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
