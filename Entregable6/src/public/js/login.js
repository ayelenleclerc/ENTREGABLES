///boton de login
let botonLogin = document.getElementById("botonLogin");
botonLogin.onclick = (event) => {
  event.preventDefault();
  login();
};
//boton de github
let botonLoginGH = document.getElementById("botonGitHub");
botonLoginGH.onclick = (event) => {
  event.preventDefault();
  location.href = "/api/session/github";
};

//oculto el navBar cuando estoy en login
let navBar = document.getElementById("navBar");
console.log(navBar);
console.log(navBar.className);
navBar.className = navBar.className + " ocultarElemento";

async function login() {
  let user = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  let consulta = await fetch(
    `http://localhost:8080/api/session/login?email=${user}&password=${password}`,
    {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  let loginUser = await consulta.json();
  if ((await loginUser.status) == "ERROR") {
    let alerta = document.getElementById("alerta");
    alerta.innerHTML = await loginUser.message;
  } else {
    let usuarioLoged = document.getElementById("usuario");
    usuarioLoged.innerHTML = await loginUser.datos.first_name;
    window.location.href = "/products";
  }

  return loginUser;
}
