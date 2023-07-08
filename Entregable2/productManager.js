import { promises as fs, writeFile } from "fs";

class ProductManager {
  constructor() {
    this.path = "./products.json";
    this.products = [];
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    const product = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };
    const codeProduct = this.products.find((product) => product.code === code);
    if (!codeProduct) {
      if (this.products.length === 0) {
        product.id = 1;
      } else {
        product.id = this.products[this.products.length - 1].id + 1;
      }
      this.products.push(product);
      await fs.writeFile(this.path, JSON.stringify(this.products), "utf8");
    } else {
      return console.log("El código no puede repetirse");
    }
  }

  async getProducts() {
    const allProducts = await fs.readFile(this.path, "utf8");
    let parsedProducts = JSON.parse(allProducts);
    console.log(parsedProducts);
    return parsedProducts;
  }

  async getProductById(productId) {
    let allProducts = await this.getProducts();
    const idProduct = allProducts.find((product) => product.id === productId);
    if (idProduct) {
      console.log(idProduct);
      return idProduct;
    } else {
      return console.log("Not Found");
    }
  }

  async updateById({ id, ...product }) {
    await this.deleteById(id);
    let oldProduct = await this.getProducts();

    let updatedProduct = [{ id, ...product }, ...oldProduct];
    await fs.writeFile(this.path, JSON.stringify(updatedProduct), "utf8");
  }

  async deleteById(id) {
    let products = await fs.readFile(this.path, "utf8");
    let allProducts = JSON.parse(products);
    let deletedProduct = allProducts.filter((product) => product.id !== id);
    await fs.writeFile(this.path, JSON.stringify(deletedProduct), "utf8");

    console.log("Producto eliminado");
    console.log(deletedProduct);
  }
}

//------------------------TEST----------------------------------------
const product = new ProductManager();
product.addProduct(
  "Producto prueba1",
  "Este producto es una prueba",
  200,
  "Sin imagen",
  "abc123",
  25
);
product.addProduct(
  "Producto prueba2",
  "Este producto es una prueba",
  200,
  "Sin imagen",
  "abc124",
  25
);
product.addProduct(
  "Producto prueba3",
  "Este producto es una prueba",
  200,
  "Sin imagen",
  "abc125",
  25
);
product.addProduct(
  "Producto prueba3",
  "Este producto es una prueba",
  200,
  "Sin imagen",
  "abc125",
  25
);
product.addProduct(
  "Producto prueba4",
  "Este producto es una prueba",
  200,
  "Sin imagen",
  "abc126",
  25
);

product.getProducts();
product.getProductById(1);
product.getProductById(7);
product.deleteById(1);
product.updateById({
  title: "Producto prueba2",
  description: "Este producto es una prueba",
  price: 500,
  thumbnail: "Sin imagen",
  code: "abc129",
  stock: 25,
  id: 2,
});
