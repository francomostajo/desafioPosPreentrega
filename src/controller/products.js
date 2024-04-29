const fs = require('fs').promises;

class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
        this.lastId = 0;
        this.loadProducts();
    }
//carga el json
    async loadProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            this.products = JSON.parse(data);
            this.lastId = this.products.length > 0 ? this.products[this.products.length - 1].id : 0;
        } catch (error) {
            console.error('Error al cargar productos:', error);
        }
    }
//guarda los producto en json
    async saveProducts() {
        
        try {
            await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.error('Error al guardar productos:', error);
        }
    }

    async addProduct( title, category, description, price, thumbnail, code, stock) {
        await this.loadProducts();
        

        try {
            if (!(title && category && description && price && thumbnail && code && stock)) {
                console.error('Todos los campos son obligatorios.');
                return;
            }

            if (this.products.some(p => p.code === code)) {
                /* console.error('El código de producto ya existe.'); */
                return;
            }

            this.lastId++;
            const product = {
                id: this.lastId,
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                category,
                status: true
            };
            this.products.push(product);
            await this.saveProducts();
            console.log('Producto agregado:', product);
            return product; 
        } catch (error) {
            console.error('Error al agregar producto:', error);
            return null;
        }
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(p => p.id === id);
        if (!product) {
            console.error('Producto no encontrado.');
        }
        return product;
    }

    async updateProduct(id, updatedFields) {
        await this.loadProducts();
        try {
            const index = this.products.findIndex(p => p.id === id);
            if (index === -1) {
                console.error('Producto no encontrado.');
                return;
            }

            this.products[index] = { ...this.products[index], ...updatedFields };
            await this.saveProducts();
            console.log('Producto actualizado:', this.products[index]);
        } catch (error) {
            console.error('Error al actualizar producto:', error);
        }
    }

    async deleteProduct(id) {
        await this.loadProducts();
        try {
            const index = this.products.findIndex(p => p.id === id);
            if (index === -1) {
                console.error('Producto no encontrado.');
                return;
            }
    
            this.products.splice(index, 1);
    
            // Reorganizar los IDs para que sean secuenciales
            this.products.forEach((product, index) => {
                product.id = index + 1;
            });
    
            await this.saveProducts();
            console.log('Producto eliminado.');
        } catch (error) {
            console.error('Error al eliminar producto:', error);
        }
    }
}

// Pruebas
(async () => {
    const manager = new ProductManager('./src/data/Productos.json');


    await manager.addProduct('producto prueba 1',  'A', 'Este es un producto prueba1', 100, 'img1.jpg', 'abc123', 20);
    await manager.addProduct('producto prueba 2',  'B', 'Este es un producto prueba2', 200, 'img2.jpg', 'def456', 21);
    await manager.addProduct('producto prueba 3',  'C', 'Este es un producto prueba3', 300, 'img3.jpg', 'ghi789', 32);
    await manager.addProduct('producto prueba 4',  'D', 'Este es un producto prueba4', 400, 'img4.jph', 'abc124', 23);
    await manager.addProduct('producto prueba 5',  'E', 'Este es un producto prueba5', 500, 'img5.jph', 'abc125', 24);
    await manager.addProduct('producto prueba 6',  'F', 'Este es un producto prueba6', 600, 'img6.jph', 'abc126', 25);
    await manager.addProduct('producto prueba 7',  'G', 'Este es un producto prueba7', 700, 'img7.jph', 'abc127', 26);
    await manager.addProduct('producto prueba 8',  'F', 'Este es un producto prueba8', 800, 'img8.jph', 'abc128', 27);
    await manager.addProduct('producto prueba 9',  'I', 'Este es un producto prueba9', 900, 'img9.jph', 'abc129', 28);
    await manager.addProduct('producto prueba 10', 'J',  'Este es un producto prueba10', 1000, 'img10.jph', 'abc1210', 29);
/*     console.log(manager.getProductById(3));
    console.log(manager.getProductById(5)); // Producto no encontrado.

    await manager.updateProduct(1, { price: 250 });
    await manager.deleteProduct(2); */ // Eliminar producto ocultar porque al eliminar un producto, se elimina el id por lo que pasa el id 3 a ser id2 y se eliminan 

    console.log(manager.getProducts());
})();

module.exports = ProductManager;