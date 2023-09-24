let botonRestore = document.getElementById("botonRestore");
botonRestore.onclick = (event) => {
  event.preventDefault();
  restore();
};

async function restore() {
  let user = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  let consulta = await fetch(
    `http://localhost:8080/api/session/restore/?user=${user}&pass=${password}`,
    {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  let RestoreUser = await consulta.json();
  console.log(RestoreUser);
  if ((await RestoreUser.status) == "ERROR") {
    let alerta = document.getElementById("alerta");
    alerta.innerHTML = await RestoreUser.message;
  } else {
    let alerta = document.getElementById("alerta");
    alerta.innerHTML = await RestoreUser.message;
    //window.location.href="/products"
  }

  return RestoreUser;
}
