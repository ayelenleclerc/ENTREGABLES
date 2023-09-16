import { Router } from "express";
import messageMananger from "../dao/messageManager.js";

let MM = new messageMananger();

const messageRouter = Router();

messageRouter.get("/message", async (req, resp) => {
  resp.send(await MM.getMessage());
});

messageRouter.post("/message", async (req, resp) => {
  let { usuario, mensaje } = param.body;

  resp.send(await MM.createMessage(usuario, mensaje));
});

export default messageRouter;
