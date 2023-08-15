class Producto {
    constructor(codigo, precio, marca,img) {
        this.codigo = codigo;
        this.precio = precio;
        this.marca = marca;
        this.img=img;
    }
}

class listaProductos{
    constructor(){
        this.items=[]
    }
    agregar(producto){
        this.items.push(producto)
    }
}
// ... (definiciones de Producto y listaProductos)

const p1 = new Producto("M023", 52412, "RedDragon", "./img/productos/t01.png");
const p2 = new Producto("M024", 62412, "BlueFalcon", "./img/productos/a01.png");
const p3 = new Producto("M025", 72412, "GreenPhoenix", "./img/productos/m01.png");
const p4 = new Producto("M023", 52412, "RedDragon", "./img/productos/t01.png");
const p5 = new Producto("M024", 62412, "BlueFalcon", "./img/productos/a01.png");
const p6 = new Producto("M025", 72412, "GreenPhoenix", "./img/productos/m01.png");

const l = new listaProductos();

l.agregar(p1)
l.agregar(p2)
l.agregar(p3)
l.agregar(p4)
l.agregar(p4)
l.agregar(p5)

const contenedor = document.getElementById("contenedor");

l.items.forEach(p => {
    contenedor.innerHTML += `
        <div class="producto">
            <img src="${p.img}">
            <h2>Precio: ${p.precio}</h2>
            <p>Código: ${p.codigo}</p>
            <p>Marca: ${p.marca}</p>
            <button id="addCarrito">enviar al Carrito</button>
        </div>
    `;
});


let addCarrito  = document.getElementById("addCarrito") //capto el objeto y lo almaceno

addCarrito.addEventListener("click",respuesta)          // lo dejo a la escucha

function respuesta(){
    console.log("apreto el botonito")                   //respuesta al apretar el boton
    localStorage.setItem(`valor`,4)                     //coloco el elemento valor en memoria
                
    let valor= parseInt(localStorage.getItem(`valor`))            //capto el elemento valor
    valor=valor+4  
    console.log(valor)                                  //muestro por consola
}


