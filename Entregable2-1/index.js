import ProductManager from "./manager/productManager.js";

const manager = new ProductManager("./files/products.json");

const product1 = {
  title: "Naranja",
  description: "Es una fruta naranja",
  price: 150,
  thumbnail: "url imagen",
  code: 1234,
  stock: 25,
};

const product2 = {
  title: "Pera",
  description: "Es una fruta amarilla",
  price: 250,
  thumbnail: "url imagen",
  code: 1245,
  stock: 20,
};
const product3 = {
  title: "Durazno",
  description: "Es una fruta anaranjada",
  price: 450,
  thumbnail: "url imagen",
  code: 1256,
  stock: 35,
};
const product4 = {
  title: "Banana",
  description: "Es una fruta amarilla",
  price: 225,
  thumbnail: "url imagen",
  code: 1278,
  stock: 45,
};
const product5 = {
  title: "Manzana",
  description: "Es una fruta roja",
  price: 550,
  thumbnail: "url imagen",
  code: 1289,
  stock: 55,
};
const product6 = {
  title: "Ciruela",
  description: "Es una fruta violeta",
  price: 650,
  thumbnail: "url imagen",
  code: 1298,
  stock: 150,
};

const product7 = {
  title: "Naranja",
  description: "Es una fruta naranja",
  price: 150,
  thumbnail: "url imagen",
  code: 1234,
  stock: 25,
};

const newProducts = async () => {
  await manager.addProduct(product1);
  await manager.addProduct(product2);
  await manager.addProduct(product3);
  await manager.addProduct(product4);
  await manager.addProduct(product5);
  await manager.addProduct(product6);
  await manager.addProduct(product7);

  console.log(await manager.getProducts());
  console.log(await manager.getProductsById(1));
  console.log(await manager.updateProduct({ id: 2, stock: 60 }));
  console.log(await manager.deleteProduct(1));

  await manager.addProduct(product1);
};

newProducts();
