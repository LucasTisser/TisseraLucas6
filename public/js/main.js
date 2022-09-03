const socket = io.connect();

function obtenerPlantillaProductos(productos) {
  // return html completo de la plantilla con los productos
  return fetch("plantillas/tabla-productos.handlebars")
    .then((res) => res.text())
    .then((plantilla) => {
      const plantillaHBS = Handlebars.compile(plantilla);
      const htmlCompleto = plantillaHBS({ productos });
      return htmlCompleto;
    });
}

const buttonMessage = document.getElementById("submitMessage");
const buttonProduct = document.getElementById("submitProduct");

buttonMessage?.addEventListener("click", () => {
  const date = new Date();
  const hourmessage = [
    date.getDate(),
    date.getMonth(),
    date.getFullYear(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  ];
  console.log(hourmessage);
  const message = {
    name: document.getElementById("name").value,
    message: document.getElementById("message").value,
    email: document.getElementById("emailInput").value,
    hora: hourmessage,
  };
  console.log(message);
  socket.emit("newMessage", message);
});

buttonProduct?.addEventListener("click", () => {
  const product = {
    title: document.getElementById("titleProductInput").value,
    price: document.getElementById("priceProductInput").value,
    thumbnails: document.getElementById("imageProductInput").value,
  };
  socket.emit("newProduct", product);
});

socket.on("newChatMessage", (messages) => {
  // document.querySelector("p").innerText = mensajes
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

socket.on("products", async (productos) => {
  const html = await obtenerPlantillaProductos(productos);
  document.getElementById("productsContainer").innerHTML = html;

  // const html = products.map((product)=>{
  //     return (`
  //     <tr>
  //         <td class="fs-3">${product.title}</td>
  //         <td class="fs-3">${product.price}</td>
  //         <td><img src=${product.thumbnails} alt="" style="height:100px;width:50px"> </td>
  //     </tr>
  //     `)
  // }).join(' ');
  // document.getElementById("productsContainer").innerHTML=html
});
