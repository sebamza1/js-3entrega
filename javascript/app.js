class Producto {
    constructor(codigo, precio, marca, img) {
        this.codigo = codigo;
        this.precio = precio;
        this.marca = marca;
        this.img = img;
    }
}

class Lista {
    constructor() {
        this.items = [];
    }
    agregar(p) {
        this.items.push(p);
    }

    mostrarLista() {
        let contenedor = document.getElementById("contenedor");
        this.items.forEach(producto => {
            const tarjetaProducto = document.createElement("div");
            tarjetaProducto.classList.add("producto");
            tarjetaProducto.innerHTML = `
                <img src="${producto.img}">
                <div class="detalle-producto">
                <h2>Precio: ${producto.precio}</h2>
                <p>Código: ${producto.codigo}</p>
                <p>Marca: ${producto.marca}</p>
                <button id="btn-${producto.codigo}"><img src="./img/Shopping-Cart.png"></button>
                </div>
            `;
            contenedor.appendChild(tarjetaProducto);
        });
    }
}

class Carrito {
    constructor() {
        this.productos = [];
        this.carritoStorage = "carrito"; 
    }

    agregar(producto) {
        let productosCarrito = JSON.parse(localStorage.getItem(this.carritoStorage));

        if (!productosCarrito) {
            producto.cantidad = 1;
            localStorage.setItem(this.carritoStorage, JSON.stringify([producto]));
            this.productos.push(producto);
        } else {
            let indice = productosCarrito.findIndex(pCarrito => pCarrito.codigo === producto.codigo);
            const nuevoproductosCarrito = [...productosCarrito];

            if (indice === -1) {
                producto.cantidad = 1;
                nuevoproductosCarrito.push(producto);
            } else {
                nuevoproductosCarrito[indice].cantidad++;
            }
            localStorage.setItem(this.carritoStorage, JSON.stringify(nuevoproductosCarrito));
            this.productos = nuevoproductosCarrito;
        }
        toasty(producto);
    }

    mostrar() {
        const carritoStorage = "carrito"; 
        const productosCarrito = JSON.parse(localStorage.getItem(carritoStorage));

        if (!productosCarrito || productosCarrito.length === 0) {
            Swal.fire({
                title: 'Carrito vacío',
                text: 'No hay productos en el carrito',
                icon: 'warning',
                width: 250,
                position: 'top-end',
                confirmButtonText: 'Cerrar'
            });
            return;
        }

        const carritoHTML = productosCarrito.map(producto => `
            <div class="producto-carrito">
                <img src="${producto.img}" class="miniatura swal2-image">
                <p>${producto.marca}</p>
                <p>Precio: ${producto.precio}</p>
                <button> - </button>     ${producto.cantidad}     <button> + </button>
            </div>
        `).join("");

        Swal.fire({
            title: 'Carrito',
            html: carritoHTML,
            position: 'top-end',
            width: 250,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            
        });
    }
}

const listaProductos = new Lista();
const carrito = new Carrito();

const p1 = new Producto("M023", 32412, "RedDragon", "./img/productos/m01.png");
const p2 = new Producto("M024", 42412, "BlueFalcon", "./img/productos/m02.png");
const p3 = new Producto("M025", 52412, "GreenPhoenix", "./img/productos/mic01.png");
const p4 = new Producto("M026", 62412, "RedDragon", "./img/productos/t02.png");
const p5 = new Producto("M027", 72412, "BlueFalcon", "./img/productos/a01.png");
const p6 = new Producto("M029", 82412, "GreenPhoenix", "./img/productos/p01.png");
const p7 = new Producto("M030", 62412, "RedDragon", "./img/productos/a02.png");
const p8 = new Producto("M031", 72412, "BlueFalcon", "./img/productos/t01.png");
const p9 = new Producto("M032", 82412, "GreenPhoenix", "./img/productos/p02.png");

listaProductos.agregar(p1);
listaProductos.agregar(p2);
listaProductos.agregar(p3);
listaProductos.agregar(p4);
listaProductos.agregar(p5); 
listaProductos.agregar(p6);
listaProductos.agregar(p7);
listaProductos.agregar(p8);
listaProductos.agregar(p9);

listaProductos.mostrarLista();

listaProductos.items.forEach(producto => {
    const btn = document.getElementById(`btn-${producto.codigo}`);
    btn.addEventListener("click", () => carrito.agregar(producto));
});

document.getElementById("mostrar-carrito-btn").addEventListener("click", () => carrito.mostrar());

function toasty(producto) {
    Toastify({
        text: `${producto.marca} \n Agregado al Carrito`,
        duration: 2000,
        style: {
            background: "linear-gradient(to right, #420885, #313130 )",
          },
    }).showToast();
}
