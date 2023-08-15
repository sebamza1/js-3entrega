

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
                <h2>Precio: ${producto.precio}</h2>
                <p>Código: ${producto.codigo}</p>
                <p>Marca: ${producto.marca}</p>
                <button id="btn-${producto.codigo}"><img src="./img/Shopping-Cart.png"></button>
            `;
            contenedor.appendChild(tarjetaProducto);
        });
    }
}

const p1 = new Producto("M023", 32412, "RedDragon", "./img/productos/m01.png");
const p2 = new Producto("M024", 42412, "BlueFalcon", "./img/productos/m02.png");
const p3 = new Producto("M025", 52412, "GreenPhoenix", "./img/productos/m01.png");
const p4 = new Producto("M026", 62412, "RedDragon", "./img/productos/t02.png");
const p5 = new Producto("M027", 72412, "BlueFalcon", "./img/productos/a01.png");
const p6 = new Producto("M028", 82412, "GreenPhoenix", "./img/productos/mic02.png");

const listaProductos = new Lista();

listaProductos.agregar(p1);
listaProductos.agregar(p2);
listaProductos.agregar(p3);
listaProductos.agregar(p4);
listaProductos.agregar(p5);
listaProductos.agregar(p6);

listaProductos.mostrarLista();

listaProductos.items.forEach(producto => {
    const btn = document.getElementById(`btn-${producto.codigo}`);

    btn.addEventListener("click", () => agregarCarrito(producto));
});

function agregarCarrito(producto) {
    console.log("*******" + producto.codigo);
    let carritoStorage = "carrito"; // Cambia esto a tu nombre de almacenamiento correcto
    let productosCarrito = JSON.parse(localStorage.getItem(carritoStorage));
    console.log(productosCarrito);

    if (!productosCarrito) {
        console.log("carrito Vacio");
        let nuevoProducto = producto;
        nuevoProducto.cantidad = 1;
        localStorage.setItem(carritoStorage, JSON.stringify([nuevoProducto]));
        toasty(producto);
    } else {
        console.log("carrito con elementos");
        let indice = productosCarrito.findIndex(pCarrito => pCarrito.codigo === producto.codigo);
        console.log(indice);
        const nuevoproductosCarrito = [...productosCarrito];

        if (indice === -1) {
            let nuevoProducto = producto;
            nuevoProducto.cantidad = 1;
            nuevoproductosCarrito.push(nuevoProducto);
        } else {
            nuevoproductosCarrito[indice].cantidad++;
        }
        localStorage.setItem(carritoStorage, JSON.stringify(nuevoproductosCarrito));
        toasty(producto);
    }
}

function toasty(producto) {
    Toastify({
        text: `${producto.marca} \n Agregado al Carrito`,
        duration: 2000,
        style: {
            background: "linear-gradient(to right, #420885, #313130 )",
          },
    }).showToast();
}


/**********************************************/

document.getElementById("mostrar-carrito-btn").addEventListener("click", mostrarCarrito);

function mostrarCarrito() {
    const carritoStorage = "carrito"; // Asegúrate de que coincida con el nombre usado para almacenar en localStorage
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
  
        imageHeight: 50 // Define la altura de la imagen (opcional)
    });

   

}


