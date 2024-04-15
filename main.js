const productosContainer = document.querySelector("#productosContainer");
const carritoContainer = document.querySelector("#carritoContainer");
const totalContainer = document.querySelector("#totalContainer");
const finalizarPedidoButton = document.querySelector("#finalizarPedidoButton");
const vaciarCarritoButton = document.querySelector("#vaciarCarritoButton");
const filtroTipo = document.querySelector("#filtroTipo");
const filtroMarca = document.querySelector("#filtroMarca");
const ordenPrecio = document.querySelector("#ordenPrecio");
const busquedaProducto = document.querySelector("#busquedaProducto");
const buscarButton = document.querySelector("#buscarButton");

const productos = [
  {
    nombre: "NIKE Sb",
    tipo: "sneakers",
    precio: 300000,
    marca: "nike",
  },
  {
    nombre: "NIKE Jordans",
    tipo: "sneakers",
    precio: 320000,
    marca: "nike",
  },
  {
    nombre: "ADIDAS Campus 2000",
    tipo: "sneakers",
    precio: 180000,
    marca: "adidas",
  },
  {
    nombre: "ADIDAS Forum",
    tipo: "sneakers",
    precio: 300000,
    marca: "adidas",
  },
  {
    nombre: "VANS KNU Skool",
    tipo: "sneakers",
    precio: 290000,
    marca: "vans",
  },
  {
    nombre: "Socks NIKE Sb",
    tipo: "socks",
    precio: 15000,
    marca: "nike",
  },
  {
    nombre: "Socks ADIDAS 3 tiras",
    tipo: "socks",
    precio: 14000,
    marca: "adidas",
  },
  {
    nombre: "Socks NIKE Jordan",
    tipo: "socks",
    precio: 16000,
    marca: "nike",
  },
  {
    nombre: "Socks VANS",
    tipo: "socks",
    precio: 14500,
    marca: "vans",
  },
];

let carrito = obtenerCarritoGuardado();

function obtenerCarritoGuardado() {
  const carritoGuardado = localStorage.getItem("carrito");
  return carritoGuardado ? JSON.parse(carritoGuardado) : [];
}

const guardarCarrito = () => {
  localStorage.setItem("carrito", JSON.stringify(carrito));
};

const actualizarCarrito = () => {
  carritoContainer.innerHTML = "";
  let total = 0;

  carrito.forEach(({ producto, cantidad }) => {
    const carritoItem = document.createElement("div");
    carritoItem.className = "carrito-item";

    const carritoTexto = document.createElement("p");
    carritoTexto.innerText = `${producto.nombre} x${cantidad}`;
    carritoItem.appendChild(carritoTexto);

    const btnEliminar = document.createElement("button");
    btnEliminar.innerText = "Eliminar Producto";
    btnEliminar.addEventListener("click", () => {
      carrito = carrito.filter(
        (item) => item.producto.nombre !== producto.nombre
      );
      actualizarCarrito();
      guardarCarrito();
    });
    carritoItem.appendChild(btnEliminar);

    const btnRestar = document.createElement("button");
    btnRestar.innerText = "-";
    btnRestar.addEventListener("click", () => {
      if (cantidad > 1) {
        carrito.find((item) => item.producto.nombre === producto.nombre)
          .cantidad--;
        actualizarCarrito();
        guardarCarrito();
      }
    });
    carritoItem.appendChild(btnRestar);

    const cantidadProducto = document.createElement("span");
    cantidadProducto.innerText = cantidad;

    const btnSumar = document.createElement("button");
    btnSumar.innerText = "+";
    btnSumar.addEventListener("click", () => {
      carrito.find((item) => item.producto.nombre === producto.nombre)
        .cantidad++;
      actualizarCarrito();
      guardarCarrito();
    });
    carritoItem.appendChild(btnSumar);

    carritoContainer.appendChild(carritoItem);
    total += producto.precio * cantidad;
  });

  totalContainer.innerText = `Total: $${total.toFixed(2)}`;
};

const agregarProducto = (producto) => {
  const carritoItem = carrito.find(
    (item) => item.producto.nombre === producto.nombre
  );

  if (carritoItem) {
    carritoItem.cantidad++;
  } else {
    carrito.push({ producto, cantidad: 1 });
  }

  guardarCarrito();
  actualizarCarrito();
};

const finalizarPedido = () => {
  if (carrito.length > 0) {
    let total = carrito.reduce(
      (accumulator, { producto, cantidad }) =>
        accumulator + producto.precio * cantidad,
      0
    );

    Swal.fire({
      icon: "success",
      title: "¡Pedido finalizado!",
      text: `El Total es: $${total} ¡Gracias por su compra!`,
      confirmButtonText: "Aceptar",
    });
    carrito = [];
    guardarCarrito();
    actualizarCarrito();
  } else {
    Swal.fire({
      icon: "error",
      title: "¡El carrito está vacío!",
      text: "Agrega productos antes de finalizar el pedido.",
    });
  }
};

ordenPrecio.innerHTML =
  '<option value="" selected>Seleccionar</option>' +
  '<option value="ascendente">Menor a Mayor</option>' +
  '<option value="descendente">Mayor a Menor</option>';

const filtrarProductosPorTipo = (tipo) => {
  const tipoSeleccionado = tipo.toLowerCase();
  const productosFiltrados = productos.filter((producto) =>
    tipoSeleccionado === "todos" ? true : producto.tipo === tipoSeleccionado
  );
  mostrarProductos(productosFiltrados);
};

const filtrarProductosPorMarca = (marca) => {
  const marcaSeleccionada = marca.toLowerCase();
  const productosFiltrados = productos.filter((producto) =>
    marcaSeleccionada === "todasMarcas"
      ? true
      : producto.marca === marcaSeleccionada
  );
  mostrarProductos(productosFiltrados);
};

const ordenarProductosPorPrecio = (orden, listaProductos = productos) => {
  const comparador =
    orden === "ascendente"
      ? (a, b) => a.precio - b.precio
      : (a, b) => b.precio - a.precio;
  const productosOrdenados = [...listaProductos].sort(comparador);
  mostrarProductos(productosOrdenados);
};

const buscarProductosPorNombre = (nombre, tipoSeleccionado) => {
  const productosFiltrados = productos.filter(
    (producto) =>
      (tipoSeleccionado === "todos" || producto.tipo === tipoSeleccionado) &&
      producto.nombre.toLowerCase().includes(nombre)
  );

  mostrarProductos(productosFiltrados);
};

const mostrarProductos = (productosMostrados) => {
  productosContainer.innerHTML = "";

  productosMostrados.forEach((producto) => {
    productosContainer.innerHTML += `
      <div class="producto-container">
        <h3>${producto.nombre}</h3>
        <p>$${producto.precio.toFixed(2)}</p>
        <button class="agregar-button" data-producto="${
          producto.nombre
        }">Agregar al carrito</button>
      </div>
    `;
  });

  const agregarButtons = document.querySelectorAll(".agregar-button");
  agregarButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const nombreProducto = event.target.getAttribute("data-producto");
      const productoSeleccionado = productos.find(
        (producto) => producto.nombre === nombreProducto
      );
      agregarProducto(productoSeleccionado);
    });
  });
};

productos.forEach((producto) => {
  const productoContainer = document.createElement("div");
  productoContainer.className = "producto-container";

  const productNombre = document.createElement("h3");
  productNombre.innerText = producto.nombre;
  productoContainer.appendChild(productNombre);

  const productPrecio = document.createElement("p");
  productPrecio.innerText = `$${producto.precio.toFixed(2)}`;
  productoContainer.appendChild(productPrecio);

  const btnAgregar = document.createElement("button");
  btnAgregar.innerHTML = "Agregar al carrito";
  btnAgregar.addEventListener("click", () => {
    agregarProducto(producto);
  });

  productoContainer.appendChild(btnAgregar);
  productosContainer.appendChild(productoContainer);
});

finalizarPedidoButton.addEventListener("click", finalizarPedido);
vaciarCarritoButton.addEventListener("click", () => {
  Swal.fire({
    title: "¿ Deseas vaciar el carrito?",
    text: "¿Estás seguro?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, vaciar carrito",
    cancelButtonText: "Cancelar",
    cancelButtonColor: "#d33",
  }).then((result) => {
    if (result.isConfirmed) {
      carrito = [];
      guardarCarrito();
      actualizarCarrito();
      Swal.fire({
        icon: "success",
        title: "Carrito vacío",
        text: "Tu carrito ha sido vaciado exitosamente.",
      });
    }
  });
});

ordenPrecio.addEventListener("change", () => {
  const tipoSeleccionado = filtroTipo.value; // Obtiene el valor seleccionado en el filtro de tipo
  const marcaSeleccionada = filtroMarca.value; // Obtiene el valor seleccionado en el filtro de marca
  const ordenSeleccionado = ordenPrecio.value; // Obtiene el valor seleccionado en el filtro de precio

  // Llama a la función para filtrar y ordenar los productos con los valores actuales de los filtros
  filtrarProductos(tipoSeleccionado, marcaSeleccionada, ordenSeleccionado);
});

filtroTipo.addEventListener("change", () => {
  const tipoSeleccionado = filtroTipo.value; // Obtiene el valor seleccionado en el filtro de tipo
  const marcaSeleccionada = filtroMarca.value; // Obtiene el valor seleccionado en el filtro de marca
  const ordenSeleccionado = ordenPrecio.value; // Obtiene el valor seleccionado en el filtro de precio

  // Llama a la función para filtrar y ordenar los productos con los valores actuales de los filtros
  filtrarProductos(tipoSeleccionado, marcaSeleccionada, ordenSeleccionado);
});

filtroMarca.addEventListener("change", () => {
  const tipoSeleccionado = filtroTipo.value; // Obtiene el valor seleccionado en el filtro de tipo
  const marcaSeleccionada = filtroMarca.value; // Obtiene el valor seleccionado en el filtro de marca
  const ordenSeleccionado = ordenPrecio.value; // Obtiene el valor seleccionado en el filtro de precio

  // Llama a la función para filtrar y ordenar los productos con los valores actuales de los filtros
  filtrarProductos(tipoSeleccionado, marcaSeleccionada, ordenSeleccionado);
});

// Función para filtrar y ordenar los productos según los valores de los filtros
const filtrarProductos = (
  tipoSeleccionado,
  marcaSeleccionada,
  ordenSeleccionado
) => {
  // Filtra los productos según el tipo, la marca y el precio seleccionados
  const productosFiltrados = productos.filter((producto) => {
    const tipoValido =
      tipoSeleccionado === "todos" || producto.tipo === tipoSeleccionado;
    const marcaValida =
      marcaSeleccionada === "todasMarcas" ||
      producto.marca === marcaSeleccionada;
    return tipoValido && marcaValida;
  });

  // Ordena los productos filtrados por precio
  ordenarProductosPorPrecio(ordenSeleccionado, productosFiltrados);
};

buscarButton.addEventListener("click", () => {
  const nombreProducto = busquedaProducto.value.toLowerCase();
  buscarProductosPorNombre(nombreProducto);
});

busquedaProducto.addEventListener("input", () => {
  const tipoSeleccionado = filtroTipo.value;
  const nombreProducto = busquedaProducto.value.toLowerCase();
  buscarProductosPorNombre(nombreProducto, tipoSeleccionado);
});

actualizarCarrito();
