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
}/*******************clases********************************/
class Producto {
    constructor(codigo, tipo, precio, marca, img) {
        this.codigo = codigo;
        this.tipo = tipo;
        this.precio = precio;
        this.marca = marca;
        this.img = img;
    }
}

class Lista {
    constructor() {
        this.listaItems = [];
    }

    agregarHTML(producto) {
        this.listaItems.push(producto);
    }

    mostrarHTML() {
        const contenedor = document.getElementById("contenedor");
        this.listaItems.forEach(p => {
            const tarjetaProducto = document.createElement("div");
            tarjetaProducto.className = "tarjeta-producto";

            tarjetaProducto.innerHTML = `
                <img src="${p.img}">
                <div class="detalle-producto">
                    <h2>Precio: $ ${p.precio}</h2>
                    <p>Código: ${p.codigo}</p>
                    <p>Marca: ${p.marca}</p>
                    <button id="btn-${p.codigo}" class="btnAddCarrito"><img src="./img/Shopping-Cart.png"></button>
                </div>`;
            contenedor.appendChild(tarjetaProducto);

            const btn = document.getElementById(`btn-${p.codigo}`);
            btn.addEventListener("click", () => manejadorCarrito.agregar(p));
        });
    }
}

class Carrito {
    constructor() {
        this.listaItems = [];
    }

    agregar(p) {
        const carritoStorage = JSON.parse(localStorage.getItem("carritoStorage"));
        const nuevoProducto = p;
        if (!carritoStorage) {
            nuevoProducto.cantidad = 1;
            localStorage.setItem("carritoStorage", JSON.stringify([nuevoProducto]));
            Toasty(nuevoProducto);
        } else {
            const indice = carritoStorage.findIndex(item => item.codigo === p.codigo);
            const nuevoCarritoStorage = carritoStorage.slice();
            if (indice >= 0) {
                nuevoCarritoStorage[indice].cantidad++;
            } else {
                nuevoProducto.cantidad = 1;
                nuevoCarritoStorage.push(nuevoProducto);
            }
            localStorage.setItem("carritoStorage", JSON.stringify(nuevoCarritoStorage));
            Toasty(nuevoProducto);
        }
    }

    restarCantidad(producto) {
        const carritoStorage = JSON.parse(localStorage.getItem("carritoStorage"));
        const indice = carritoStorage.findIndex(item => item.codigo === producto.codigo);
        
        if (indice >= 0 && carritoStorage[indice].cantidad > 1) {
            carritoStorage[indice].cantidad--;
            localStorage.setItem("carritoStorage", JSON.stringify(carritoStorage));
            this.actualizarCarrito();
        } else if (indice >= 0 && carritoStorage[indice].cantidad === 1) {
            Swal.fire({
                title: 'Eliminar producto',
                text: '¿Deseas eliminar este producto del carrito?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Eliminar'
            }).then((result) => {
                if (result.isConfirmed) {
                    carritoStorage.splice(indice, 1);
                    localStorage.setItem("carritoStorage", JSON.stringify(carritoStorage));
                    this.actualizarCarrito();
                }
            });
        }
    }


    sumarCantidad(producto) {
        const carritoStorage = JSON.parse(localStorage.getItem("carritoStorage"));
        const indice = carritoStorage.findIndex(item => item.codigo === producto.codigo);
        if (indice >= 0) {
            carritoStorage[indice].cantidad++;
            localStorage.setItem("carritoStorage", JSON.stringify(carritoStorage));
            this.actualizarCarrito();
        }
    }

    actualizarCarrito() {
        const carritoStorage = JSON.parse(localStorage.getItem("carritoStorage"));
        let subTotal = 0;

        if (carritoStorage.length === 0) {
            Swal.fire({
                title: 'Carrito vacío',
                text: 'No hay productos en el carrito',
                icon: 'warning',
                width: 250,
                position: 'top-end',
                confirmButtonText: 'Cerrar'
            });
        } else {
            const carritoHTML = carritoStorage.map(producto => {
                const precioTotalProducto = producto.precio * producto.cantidad;
                subTotal += precioTotalProducto;
                return `
                    <div class="producto-carrito">
                        <img src="${producto.img}" class="miniatura swal2-image">
                        <p>${producto.marca}</p>
                        <p>Precio: ${producto.precio}</p>
                        <button id="btnMenos-${producto.codigo}"> - </button>${producto.cantidad}<button id="btnMas-${producto.codigo}"> + </button>
                    </div>
                `;
            }).join("");

            const subtotalHTML = `<p class="subtotal">Subtotal: $ ${subTotal}</p>`;

            Swal.fire({
                title: 'Carrito',
                html: carritoHTML + subtotalHTML,
                position: 'top-end',
                width: 250,
                showCancelButton: true,
                cancelButtonColor: '#d33',
                confirmButtonColor: '#3085d6',
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Comprar'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.pagar(subTotal);
                }
            });

            carritoStorage.forEach(producto => {
                const btnMenos = document.getElementById(`btnMenos-${producto.codigo}`);
                const btnMas = document.getElementById(`btnMas-${producto.codigo}`);

                btnMenos.addEventListener("click", () => this.restarCantidad(producto));
                btnMas.addEventListener("click", () => this.sumarCantidad(producto));
            });
        }
    }

    pagar(subTotal) {
        Swal.fire({
            title: 'Finalizar Compra?',
            text: "SubTotal: " + subTotal,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar Compra',
            confirmButtonText: 'Confirmar Pago'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.clear();
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Gracias por Su Compra',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        });
    }

    mostrar() {
        const btnVerCarrito = document.getElementById("btnVerCarrito");

        btnVerCarrito.addEventListener("click", () => {
            const carritoStorage = JSON.parse(localStorage.getItem("carritoStorage"));

            if (carritoStorage) {
                this.actualizarCarrito();
            } else {
                Swal.fire({
                    title: 'Carrito vacío',
                    text: 'No hay productos en el carrito',
                    icon: 'warning',
                    width: 250,
                    position: 'top-end',
                    confirmButtonText: 'Cerrar'
                });
            }
        });
    }
}

/*******************Instancia Obj********************************/

const produc1 = new Producto("M023","mouse", 32412, "RedDragon", "./img/productos/m01.png");
const produc2 = new Producto("M024", "mouse",42412, "BlueFalcon", "./img/productos/m02.png");
const produc3 = new Producto("M025", "microfono", 52412, "GreenPhoenix", "./img/productos/mic01.png");
const produc4 = new Producto("M026", "teclado",62412, "RedDragon", "./img/productos/t02.png");
const produc5 = new Producto("M027", "auricular",72412, "BlueFalcon", "./img/productos/a01.png");
const produc6 = new Producto("M029", "parlante",82412, "GreenPhoenix", "./img/productos/p01.png");
const produc7 = new Producto("M030", "auricular",62412, "RedDragon", "./img/productos/a02.png");
const produc8 = new Producto("M031", "teclado",72412, "BlueFalcon", "./img/productos/t01.png");
const produc9 = new Producto("M032", "parlante",82412, "GreenPhoenix", "./img/productos/p02.png");

const listaHTML = new Lista();

listaHTML.agregarHTML(produc1);
listaHTML.agregarHTML(produc2);
listaHTML.agregarHTML(produc3);
listaHTML.agregarHTML(produc4);
listaHTML.agregarHTML(produc5);
listaHTML.agregarHTML(produc6);
listaHTML.agregarHTML(produc7);
listaHTML.agregarHTML(produc8);
listaHTML.agregarHTML(produc9);

const manejadorCarrito = new Carrito();

/*********************************************************************/

listaHTML.mostrarHTML();
manejadorCarrito.mostrar();


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
