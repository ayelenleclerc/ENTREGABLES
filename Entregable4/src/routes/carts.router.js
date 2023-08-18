import { Router } from "express";
import CartManager from "../managers/cartsManager.js";
import { __dirname } from "../utils.js";
const cartManager = new CartManager(__dirname + "/files/carts.json");
const router = Router();

router.get("/", async (req, res) => {
  const carts = await cartManager.getCarts();
  if (carts.length === 0) {
    res.status(200).json({ message: "No carts created" });
  } else {
    res.status(200).json({ carts });
  }
});

router.get("/:cid", async (req, res) => {
  const cid = parseInt(req.params.cid);
  const cart = await cartManager.getCartById(cid);

  if (cart === "Not Found") {
    res.status(400).json({ message: "Cart not found" });
  } else if (cart) {
    res.status(200).json(cart);
  } else {
    res.status(400).json({ message: "Cart not found" });
  }
});

router.post("/", async (req, res) => {
  const cart = await cartManager.createCart();
  if (cart) {
    res.status(201).json({ message: "Cart created", cart });
  } else {
    res.status(400).json({ message: "Error creating cart" });
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);
    await cartManager.addProductToCart(cid, pid);
    res.status(200).json({ message: "Product added to cart successfully." });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to add product to cart." });
  }
});

export default router;
