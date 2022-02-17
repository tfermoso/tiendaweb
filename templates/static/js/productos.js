
window.onload = function () {
    // Declaración de variables
    let productos = [];

    // Funciones
    function cargarDatos() {
        ajax = new XMLHttpRequest();

        ajax.onreadystatechange = () => {

            if (ajax.readyState == 4) {
                if (ajax.status == 200) {
                    productos = JSON.parse(ajax.responseText);
                    mostrarProductos(productos);
                }
            } else {
                console.log(ajax.readyState);
            }
        }
        //ajax.open('GET', 'https://restcountries.com/v3.1/all', true);
        ajax.open('GET', 'http://localhost:8085/getproducts', true);
        ajax.send(null);
    }


    function mostrarProductos(productos) {
        let contenido = "";
        for (let i = 0; i < productos.length; i++) {
            contenido += `
                <div class="filaProducto">
                    <img src="static/img/${productos[i].img}" alt="">
                    <div class="tituloProducto">
                        <h4>${productos[i].nombre}</h4>
                        <p>${productos[i].descripcion}</p>
                    </div>
                    <div>
                        <label>Precio:</label><span>${productos[i].precio}</span>
                        <label>Cantidad:</label><span>${productos[i].cantidad}</span>
                    </div>
                    <div>
                        <img src="static/img/borrar.jpg" id="btnEliminar${productos[i].id}" class="btnBorrar" alt="">
                        <img src="static/img/editar.svg" id="btnEditar${productos[i].id}" class="btnEditar" alt="">
                    </div>
                </div>
            `;
        }
        document.getElementById("listadoProductos").innerHTML = contenido;
        asociarEventos();

    }
    setTimeout(cargarDatos, 1500);


    function asociarEventos() {
        let papeleras = document.getElementsByClassName("btnBorrar");
        for (let i = 0; i < papeleras.length; i++) {
            const papelera = papeleras[i];
            papelera.onclick = (evt) => {
                let idProducto = evt.currentTarget.id.substring(11);
                ajax = new XMLHttpRequest();
                /*
                ajax.onreadystatechange = () => {
                    if (ajax.readyState == 4){
                        if (ajax.status == 200) {
                            productos = JSON.parse(ajax.responseText);
                            mostrarProductos(productos)
                        }
                        if(ajax.status==500){
                            alert("Error en el Servidor")
                        }
                    }                               
                }
                */
                ajax.onload = () => {
                    productos = JSON.parse(ajax.responseText);
                    mostrarProductos(productos);
                }

                ajax.onerror = () => {
                    alert("Error en la petición");
                }

                let url = `http://localhost:8085/eliminarproducto?id=${idProducto}`;
                //let url="http://localhost:8085/eliminarproducto?id="+idProducto;
                //let url2="http://localhost:8085/eliminarproducto";
                let params = "id=" + idProducto;
                ajax.open("GET", url, true);
                //ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                ajax.send(params);
            }
        }

        // Editar Productos
        let lapices = document.getElementsByClassName("btnEditar");
        for (let i = 0; i < lapices.length; i++) {
            const elementoEditar = lapices[i];

            elementoEditar.onclick = (evento) => {
                
                let idProducto = parseInt(evento.currentTarget.id.substring(9));
                
                productos.forEach(elemento => {
                    if (elemento.id == idProducto) {
                        document.getElementById("inputIdProducto").value = idProducto;
                        document.getElementById("inputNombre").value = elemento.nombre;
                        document.getElementById("inputDescripcion").value = elemento.descripcion;
                        document.getElementById("inputPrecio").value = elemento.precio;
                        document.getElementById("inputCantidad").value = elemento.cantidad;
                        document.getElementById("inputArchivo").required = false;
                        document.getElementById("inputSubmit").value = "Editar Producto";
                        document.getElementById("inputSubmit").style.backgroundColor = "blue";
                        document.forms[0].action = "http://localhost:8085/editarproducto";
                    }
                });
            }
        }
    }
}