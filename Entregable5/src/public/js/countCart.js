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
