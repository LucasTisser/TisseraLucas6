// Conexion de socket
const socket = io.connect();

// La siguiente funcion, retorna una promesa con los productos, a traves de Handlebars
function obtenerPlantillaProductos(productos) {
  return fetch("plantillas/tabla-productos.handlebars")
    .then((res) => res.text())
    .then((plantilla) => {
      const plantillaHBS = Handlebars.compile(plantilla);
      const htmlCompleto = plantillaHBS({ productos });
      return htmlCompleto;
    });
}

// Boton de enviar mensaje en chat y boton de agregar un producto
const buttonMessage = document.getElementById("submitMessage");
const buttonProduct = document.getElementById("submitProduct");

// Evento de click, sobre el boton de enviar mensaje en chat
buttonMessage?.addEventListener("click", () => {
  const date = new Date(); // Hora actual del mensaje enviado
  const hourmessage = [
    date.getDate(),
    date.getMonth(),
    date.getFullYear(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  ];
  const message = {
    name: document.getElementById("name").value,
    message: document.getElementById("message").value,
    email: document.getElementById("emailInput").value,
    hora: hourmessage,
  };
  // Emision del mensaje al Backend, index.js
  socket.emit("newMessage", message);
});

// Eventro de click, sobre el boton de agregar un producto
buttonProduct?.addEventListener("click", () => {
  const product = {
    title: document.getElementById("titleProductInput").value,
    price: document.getElementById("priceProductInput").value,
    thumbnails: document.getElementById("imageProductInput").value,
  };
  // Emision del producto al Backend, index.js
  socket.emit("newProduct", product);
});


// Evento de recepcion de mensajes recibidos desde index.js
socket.on("newChatMessage", (messages) => {
  const html = messages
    .map((message) => {
      return `
        <div>
                <strong class="email text-primary">[${message.email}]</strong>
                <span class="hour hora">(${message.hora})</span>
                <span class="name">${message.name}:</span>
                <i class="message text-green">${message.message}</i>
         </div>
        `;
    })
    .join(" ");
  document.getElementById("chat").innerHTML = html;
});

// Evento de recepcion de productos recibidos desde index.js
socket.on("products", async (productos) => {
  const html = await obtenerPlantillaProductos(productos);
  document.getElementById("productsContainer").innerHTML = html;
});