const socketClient=io()

const socket = io();
socket.emit('message', "Comunicacion desde web Socket!");

socketClient.on('productAdded', (products) => {
  updateProductList(products);
});

socketClient.on('productDeleted', (products) => {
  updateProductList(products);
});

let form = document.getElementById("formProduct")
form.addEventListener("submit", (evt) => {
  evt.preventDefault()

  let title = form.elements.title.value
  let description = form.elements.description.value
  let stock = form.elements.stock.value
  let thumbnail = form.elements.thumbnail.value
  let category = form.elements.category.value
  let price = form.elements.price.value
  let code = form.elements.code.value
  let status = form.elements.status.checked

  socket.emit("addProduct", {
      title,
      description,
      stock,
      thumbnail,
      category,
      price,
      code,
    status, 

  })

  form.reset()
})