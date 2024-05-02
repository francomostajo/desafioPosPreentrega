import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import path from 'path';
import routesProduct from './routes/routesProducts.js';
import routesCart from './routes/routesCarts.js';
import __dirname from './utils.js';
import routesView from './routes/routesViews.js';




const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, console.log(`Server running on port ${PORT}`))
const socketServer = new Server(httpServer)



app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/products', routesProduct);
app.use('/api/carts', routesCart);

app.use(express.static(__dirname + "/public"))
//handlebars
app.engine("handlebars",handlebars.engine())
app.set("views", __dirname+"/views")
app.set("view engine","handlebars")

app.use('/', routesView)
socketServer.on('connection', socket =>{
    console.log("cliente conectado")
    socket.on('message', data => {console.log(data)});
})

export { socketServer };

