const socket = io();

socket.emit('message', "Comunicacion desde web Socket!");

socket.on('productAdded', (product) => {
    const productList = document.getElementById('list-products');
    const productElement = document.createElement('div');
    productElement.classList.add('col-md-6');
    productElement.innerHTML = `<label for="id-prod" class="form-label">ID: ${product.id}</label>`;
    productList.appendChild(productElement);
});

socket.on('productDeleted', (productId) => {
    const productList = document.getElementById('list-products');
    const productElement = productList.querySelector(`label[for="id-prod"][data-id="${productId}"]`);
    if (productElement) {
        productElement.parentElement.remove();
    }
});

document.addEventListener('DOMContentLoaded', () => {
  const formProduct = document.getElementById('formProduct');
  const deleteButton = document.getElementById('delete-btn');

  formProduct.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(formProduct);
      const title = formData.get('title');
      const category = formData.get('category');
      const description = formData.get('description');
      const price = formData.get('price');
      const thumbnail = formData.get('thumbnail');
      const code = formData.get('code');
      const stock = formData.get('stock');
      await addProduct(title, category, description, price, thumbnail, code, stock);
      
      socket.emit("addProduct", { // Corregir aquí: Usar socket en lugar de socketClient
          title,
          description,
          stock,
          thumbnail,
          category,
          price,
          code,
          status: true
      });
      
      formProduct.reset(); // Restablece el formulario después de enviarlo
  });

  deleteButton.addEventListener('click', async () => {
      const id = document.getElementById('id-prod').value;
      await deleteProduct(id);
  });
});






async function addProduct(title, category, description, price, thumbnail, code, stock) {
  const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          title,
          category,
          description,
          price,
          thumbnail,
          code,
          stock
      })
  });

  if (response.ok) {
      console.log('Producto agregado correctamente');
  } else {
      console.error('Error al agregar producto');
  }
}

async function deleteProduct(id) {
  const response = await fetch(`/api/products/${id}`, {
      method: 'DELETE'
  });

  if (response.ok) {
      console.log('Producto eliminado correctamente');
  } else {
      console.error('Error al eliminar producto');
  }
}
