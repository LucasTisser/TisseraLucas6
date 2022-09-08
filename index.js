const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const PORT = process.env.PORT || 8080;
app.use(express.static("public"));

// Array de mensajes depositados
const messages = [];

// Array de productos agregados
const products = [
  {
    title: "Shampoo",
    price: "5USD",
    thumbnails:
      "https://www.pngall.com/wp-content/uploads/4/Shampoo-PNG-Image-HD.png",
    id: 1,
  },
  {
    title: "Acondicionador",
    price: "7USD",
    thumbnails:
      "https://sevilla.abc.es/estilo/bulevarsur//wp-content/uploads/sites/14/2021/09/Garnier-Acondicionador-Fructis-NutriRizos-768x1024.png",
    id: 2,
  },
  {
    title: "Jabon",
    price: "2USD",
    thumbnails:
      "https://www.nicepng.com/png/full/417-4172056_jabon-png-imagenes-de-javon-de-bao.png",
    id: 3,
  },
];

// Evento de conexion de un cliente
io.on("connection", (socket) => {
  // Emision al cliente sobre los productos agregados y los mensajes recibidos
  socket.emit("products", products);
  socket.emit("newChatMessage", messages);

  // Evento del mensaje recibido tomado desde el boton de enviar mensaje
  socket.on("newMessage", (message) => {
    messages.push(message);
    // Emision al cliente sobre los mensajes recibidos
    io.sockets.emit("newChatMessage", messages);
  });

  // Evento del mensaje recibido tomado desde el boton de enviar mensaje
  socket.on("newProduct", (product) => {
    products.push(product);
    console.log(product);
    // Emision al cliente sobre los productos agregados
    io.sockets.emit("products", products);
  });
});

// Conexion del server
const connectedServer = httpServer.listen(PORT, () => {
  console.log(`Server on ${PORT}`);
});
connectedServer.on("error", (error) => console.log(error));