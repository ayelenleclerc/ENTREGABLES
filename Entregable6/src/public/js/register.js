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
}

countItemCart();

//evito que recargue pagina al apretar boton
let botonRegister = document.getElementById("botonRegister");
botonRegister.onclick = (event) => {
  event.preventDefault();
  register();
};

async function register() {
  let nombre = document.getElementById("nombre").value;
  let apellido = document.getElementById("apellido").value;
  let edad = document.getElementById("edad").value;
  let email = document.getElementById("email").value;
  let contrasena = document.getElementById("contrasena").value;
  let admin = document.getElementById("admin").value == "si" ? true : false;

  let data = {
    first_name: nombre,
    last_name: apellido,
    email: email,
    age: edad,
    password: contrasena,
    admin: admin,
  };

  let consulta = await fetch(`http://localhost:8080/api/session/register`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  try {
    let registerUser = await consulta.json();
    let alerta = document.getElementById("alerta");
    alerta.innerHTML = "usuario registrado";
    return registerUser;
  } catch (err) {
    let alerta = document.getElementById("alerta");
    alerta.innerHTML =
      err +
      `fallo el registro, usuario ya registrado \n o no ingreso todos los datos`;
  }
}

//logout

async function logout() {
  try {
    let logout = await fetch(`/api/session/logout`, {
      method: "get",
    });
    console.log("Sesion eliminada");
    sessionStorage.removeItem("carrito");
    location.href = "http://localhost:8080/login";
  } catch (err) {
    console.log("fallo " + err);
  }
}
let logoutElement = document.getElementById("logout");
logoutElement.onclick = logout;
