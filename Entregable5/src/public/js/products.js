//cosulto al session storage si hay carrito, y con un get veo cuantos productos tiene

let countItem = 0;
let cantidadCarrito = document.getElementById("numerito");

async function countItemCart() {
  let cartUser = await JSON.parse(sessionStorage.getItem("carrito"));
  console.log(await cartUser);
  let idCart = "";
  if (cartUser) {
    idCart = await cartUser;
    let getCart = await fetch(`/api/carts/${idCart}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let objCart = await getCart.json();
    let productList = await objCart[0].products;
    countItem = productList.length;
  } else {
    countItem = 0;
  }
  cantidadCarrito.innerHTML = countItem;

  console.log(countItem);
}

countItemCart();

// guardo en el sessionStorage el ID del carrito en el que va trabajar el cliente. sino existe lo crea.
async function validarCarrito() {
  let cartUser = await JSON.parse(sessionStorage.getItem("carrito"));
  console.log(await cartUser);
  let idCart = "";
  if (cartUser) {
    idCart = await cartUser;
  } else {
    let createCart = await fetch("/api/carts", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let objCart = await createCart.json();
    idCart = await objCart._id;
  }
  sessionStorage.setItem("carrito", JSON.stringify(idCart));
  return idCart;
}

//agrego el ID al href del navbar para redirigir al carrito

async function hrefCarrito() {
  let hrefCarrito = document.getElementById("carrito");
  let idCarrito = await validarCarrito();
  if (idCarrito) {
    hrefCarrito.href = `http://localhost:8080/cart/${await idCarrito}`;
  } else {
    hrefCarrito.href = "";
  }
}

hrefCarrito();

// hago un fetch para agregar el producto al carrito

async function addToCart(idProducto) {
  let idCart = await validarCarrito();

  try {
    let addProd = await fetch(`api/carts/${idCart}/product/${idProducto}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Se agrego el producto");
    await countItemCart();
    await hrefCarrito();
  } catch (err) {
    console.log("fallo " + err);
  }
}

//genero los botones de agregar Producto

function botonAddProduct() {
  let botonAdd = document.getElementsByClassName("botonAdd");
  let idElementAdd = null;
  for (i in botonAdd) {
    botonAdd[i].onclick = (event) => {
      idElementAdd = event.target.attributes.id.nodeValue;
      addToCart(idElementAdd);
    };
  }
}

botonAddProduct();
