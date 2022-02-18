window.onload = function () {


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
            contenido += 
            `<div class="filaProducto">
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
                    <a href="editarproducto?id=${productos[i].id}"><img class="btnEditar" src="static/img/editar.svg" alt=""></a>
                </div>
            </div>`;
        }
        document.getElementById("listadoProductos").innerHTML = contenido;
        asociarEventos();
    }

    setTimeout(cargarDatos, 3000);


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
               ajax.onload=()=>{
                productos = JSON.parse(ajax.responseText);
                mostrarProductos(productos);
               }
               ajax.onerror=()=>{
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
    }
}