let productos = JSON.parse(localStorage.getItem("productos")) || [];
let ventasTotales = Number(localStorage.getItem("ventasTotales")) || 0;

mostrarProductos();
actualizarDashboard();

function agregarProducto() {
    const nombre = document.getElementById("nombre").value.trim();
    const precioCompra = Number(document.getElementById("precioCompra").value);
    const precioVenta = Number(document.getElementById("precioVenta").value);
    const cantidad = Number(document.getElementById("cantidad").value);
    const fotoInput = document.getElementById("foto");

    if (!nombre || precioCompra <= 0 || precioVenta <= 0 || cantidad <= 0) {
        alert("Completa todos los campos correctamente.");
        return;
    }

    const archivo = fotoInput.files[0];

    if (archivo) {
        const lector = new FileReader();

        lector.onload = function(e) {
            guardarProducto(
                nombre,
                precioCompra,
                precioVenta,
                cantidad,
                e.target.result
            );
        };

        lector.readAsDataURL(archivo);
    } else {
        guardarProducto(
            nombre,
            precioCompra,
            precioVenta,
            cantidad,
            ""
        );
    }
}

function guardarProducto(nombre, compra, venta, cantidad, foto) {
    productos.push({
        id: Date.now(),
        nombre,
        compra,
        venta,
        cantidad,
        foto
    });

    localStorage.setItem("productos", JSON.stringify(productos));

    limpiarFormulario();
    mostrarProductos();
    actualizarDashboard();

    alert("Producto guardado correctamente.");
}

function mostrarProductos() {
    const lista = document.getElementById("listaProductos");

    lista.innerHTML = "";

    productos.forEach(producto => {
        lista.innerHTML += `
            <div class="producto">

                ${
                    producto.foto
                    ? `<img src="${producto.foto}">`
                    : ""
                }

                <h3>${producto.nombre}</h3>

                <p>Precio compra: S/ ${producto.compra}</p>

                <p>Precio venta: S/ ${producto.venta}</p>

                <p>Stock: ${producto.cantidad}</p>

                <button onclick="venderProducto(${producto.id})">
                    Vender 1 unidad
                </button>

                <br><br>

                <button onclick="eliminarProducto(${producto.id})">
                    Eliminar
                </button>

            </div>
        `;
    });
}

function venderProducto(id) {
    const producto = productos.find(p => p.id === id);

    if (!producto) return;

    if (producto.cantidad <= 0) {
        alert("No hay stock disponible.");
        return;
    }

    producto.cantidad--;

    ventasTotales += producto.venta;

    localStorage.setItem("productos", JSON.stringify(productos));
    localStorage.setItem("ventasTotales", ventasTotales);

    mostrarProductos();
    actualizarDashboard();
}

function eliminarProducto(id) {
    if (!confirm("¿Eliminar este producto?")) return;

    productos = productos.filter(p => p.id !== id);

    localStorage.setItem("productos", JSON.stringify(productos));

    mostrarProductos();
    actualizarDashboard();
}

function actualizarDashboard() {
    document.getElementById("totalProductos").textContent =
        productos.length;

    document.getElementById("stockBajo").textContent =
        productos.filter(p => p.cantidad <= 3).length;

    document.getElementById("ventasTotales").textContent =
        "S/ " + ventasTotales.toFixed(2);
}

function limpiarFormulario() {
    document.getElementById("nombre").value = "";
    document.getElementById("precioCompra").value = "";
    document.getElementById("precioVenta").value = "";
    document.getElementById("cantidad").value = "";
    document.getElementById("foto").value = "";
}