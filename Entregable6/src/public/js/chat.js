const socket = io();

socket.on("mensajes", (data) => {
  let contenedorChat = document.getElementById("contenedorMensajes");
  let contenedor = "";
  data.forEach((mensaje) => {
    contenedor += `<div>
            <span><h5>[ ${mensaje.usuario} ] : </h5></span>
            <span><p class="lead">${mensaje.mensaje}</p></span>
            
        </div>`;
  });
  contenedorChat.innerHTML = contenedor;
});

// capturo los elementos del chat

let newMessage = document.getElementById("message");
let newUser = document.getElementById("user");
let alert = document.getElementById("alert");

function handleClick() {
  let message = {};
  if (newMessage.value == "" || newUser.value == "") {
    alert.innerHTML = `<h5>complete todos los campos</h5>`;
  } else {
    message = {
      user: newUser.value,
      message: newMessage.value,
    };
    socket.emit("newMessage", message);
  }
}
