//Creamos la Base de Datos con los productos que tenemos

class BaseDeDatos{
    constructor() {
      this.productos = [];
      this.agregarRegistro(1, "Silla Butterfly", 6000 , "pic1.jpg");
      this.agregarRegistro(2, "Silla Ant", 5000, "pic2.jpg");
      this.agregarRegistro(3, "Silla Cesca", 6000, "pic3.jpg");
      this.agregarRegistro(4, "Silla Eames", 5000, "pic4.jpg");
      this.agregarRegistro(5, "Silla Plegable", 6000, "pic5.jpg");
      this.agregarRegistro(6, "Silla Wiggle", 5000, "pic6.jpg");
      this.agregarRegistro(7, "Silla Hill House", 6000, "pic7.jpg");
      this.agregarRegistro(8, "Silla Aluminiun", 5000, "pic8.jpg");
    }
  
    agregarRegistro(id, nombre, precio, imagen) {
      const producto = new Producto(id, nombre, precio, imagen);
      this.productos.push(producto);
    }
  
    traerRegistros() {
      return this.productos;
    }
  
    registroPorId(id) {
      return this.productos.find((producto) => producto.id === id);
    }
  
    registrosPorNombre(palabra) {
      return this.productos.filter((producto) => producto.nombre.toLowerCase().includes(palabra));
    }
  }
  
  //Creamos la clase carrito

  class Carrito {
    constructor() {
      const carritoStorage = JSON.parse(localStorage.getItem("carrito"));
      this.carrito = carritoStorage || [];
      this.total = 0;
      this.totalProductos = 0;
      this.listar();
    }
  
    estaEnCarrito({ id }) {
      return this.carrito.find((producto) => producto.id === id);
    }

    //Agregamos productos al carrito
  
    agregar(producto) {
      let productoEnCarrito = this.estaEnCarrito(producto);
      if (productoEnCarrito) {
        // Sumar cantidad
        productoEnCarrito.cantidad++;
      } else {
        // Agregar al carrito
        this.carrito.push({ ...producto, cantidad: 1 });
        localStorage.setItem("carrito", JSON.stringify(this.carrito));
      }
      this.listar();
    }

    //Quitamos productos del carrito
  
    quitar(id) {
      const indice = this.carrito.findIndex((producto) => producto.id === id);
      // Si la cantidad del producto es mayor a 1, le resto
      if (this.carrito[indice].cantidad > 1) {
        this.carrito[indice].cantidad--;
      } else {
        // Sino, lo borro del carrito
        this.carrito.splice(indice, 1);
      }
      localStorage.setItem("carrito", JSON.stringify(this.carrito));
      this.listar();
    }
  
    //Hacemos una lista de los productos que tenemos en el carrito

    listar() {
      this.total = 0;
      this.totalProductos = 0;
      divCarrito.innerHTML = "";
      for (const producto of this.carrito) {
        divCarrito.innerHTML += `
          <div class="producto">
              <h2>${producto.nombre}</h2>
              <p>$${producto.precio}</p>
              <p>Cantidad: ${producto.cantidad}</p>
              <a href="#" data-id="${producto.id}" class="btnQuitar">Quitar del carrito</a>
          </div>
      `;
        this.total += producto.precio * producto.cantidad;
        this.totalProductos += producto.cantidad;
      }
      // Botones de quitar producto
      const botonesQuitar = document.querySelectorAll(".btnQuitar");
      for (const boton of botonesQuitar) {
        boton.onclick = (event) => {
          event.preventDefault();
          this.quitar(Number(boton.dataset.id));
        };
      }
      // Actualizamos variables del carrito
      spanCantidadProductos.innerText = this.totalProductos;
      spanTotalCarrito.innerText = this.total;
    }
  }
  
  // Clase molde para los productos
  class Producto {
    constructor(id, nombre, precio, imagen = false) {
      this.id = id;
      this.nombre = nombre;
      this.precio = precio;
      this.imagen = imagen;
    }
  }
  
  // Objeto de la base de datos
  const bd = new BaseDeDatos();
  
  // Elementos
  const divProductos = document.querySelector("#productos");
  const divCarrito = document.querySelector("#carrito");
  const spanCantidadProductos = document.querySelector("#cantidadProductos");
  const spanTotalCarrito = document.querySelector("#totalCarrito");
  const formBuscar = document.querySelector("#formBuscar");
  const inputBuscar = document.querySelector("#inputBuscar");
  
  // Llamamos a la función
  cargarProductos(bd.traerRegistros());
  
  // Muestra los registros de la base de datos en nuestro HTML
  function cargarProductos(productos) {
    divProductos.innerHTML = "";
    for (const producto of productos) {
      divProductos.innerHTML += `
          <div class="producto">
              <h2>${producto.nombre}</h2>
              <p>$${producto.precio}</p>
              <img src="img/${producto.imagen}" width="150" />
              <p><a href="#" class="btnAgregar" data-id="${producto.id}">Agregar al carrito</a></p>
          </div>
      `;
    }
    // Botones de agregar al carrito
    const botonesAgregar = document.querySelectorAll(".btnAgregar");
    for (const boton of botonesAgregar) {
      boton.addEventListener("click", (event) => {
        event.preventDefault();
        const id = Number(boton.dataset.id);
        const producto = bd.registroPorId(id);
        carrito.agregar(producto);
      });
    }
  }
  
  // Evento buscador
  formBuscar.addEventListener("submit", (event) => {
    event.preventDefault();
    const palabra = inputBuscar.value;
    cargarProductos(bd.registrosPorNombre(palabra.toLowerCase()));
  });
  inputBuscar.addEventListener("keyup", (event) => {
    event.preventDefault();
    const palabra = inputBuscar.value;
    cargarProductos(bd.registrosPorNombre(palabra.toLowerCase()));
  });
  
  // Objeto carrito
  const carrito = new Carrito();