window.onload = function () {

    function cargarDatos() {
        ajax = new XMLHttpRequest();
        ajax.onreadystatechange = () => {
            if (ajax.readyState == 4) {
                if (ajax.status == 200) {
                    productos = JSON.parse(ajax.responseText);

                    mostrarProductos(productos)
                }
            } else {
                console.log(ajax.readyState)
            }
        }
        //ajax.open('GET', 'https://restcountries.com/v3.1/all', true);
        ajax.open('GET', 'http://localhost:8085/getproducts', true);
        ajax.send(null);


    }

    function mostrarProductos(productos) {
        let contenido = "";
        for (let i = 0; i < productos.length; i++) {
            contenido += `<div class="filaProducto">
            <img src="static/img/${productos[i].img}" alt="">
            <div class="tituloProducto"><h4>${productos[i].nombre}</h4>
            <p>${productos[i].descripcion}</p></div>
            <div><label>Precio:</label><span>${productos[i].precio}</span><label>Cantidad:</label><span>${productos[i].cantidad}</span></div>
            <div><img src="static/img/borrar.jpg" id="btnEliminar${productos[i].id}" class="btnBorrar" alt=""></div>
            <div><img src="static/img/btnEdit.png" id="btnEditar${productos[i].id}" class="btnEditar" alt=""></div></div>`;
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
                mostrarProductos(productos)
               }
               ajax.onerror=()=>{
                   alert("Error en la petición");
               }
                let url = `http://localhost:8085/eliminarproducto?id=${idProducto}`;
                //let url="http://localhost:8085/eliminarproducto?id="+idProducto;
                //let url2="http://localhost:8085/eliminarproducto";
                let params = "id=" + idProducto;
                ajax.open("GET", url, true)
                //ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                ajax.send(params)
            }
        }
        let edit = document.getElementsByClassName("btnEditar");
        for (let i = 0; i < edit.length; i++) {
            const edicion = edit[i];
            edicion.onclick = (evt) => {
                let idProducto = evt.currentTarget.id.substring(9);
                productos.forEach(element => {
                    if(element.id==idProducto){
                        document.getElementById("idProducto").value=idProducto;
                        document.getElementById("nombre").value=element.nombre;
                        document.getElementById("descripcion").value=element.descripcion;
                        document.getElementById("precio").value=element.precio;
                        document.getElementById("cantidad").value=element.cantidad;
                        document.getElementById("archivo").required=false;
                        document.getElementById("submit").value="Editar Producto"
                        document.forms[0].action="";
                    }
                });
                document.forms[0].onsubmit=(e)=>
                {
                    let sendedit = document.getElementById("submit");
                    if (sendedit.value=="Editar Producto" || document.forms[0].action==""){
                        e.preventDefault()
                        ajax = new XMLHttpRequest();
                        let url = `http://localhost:8085/crearproducto`;
                        var formData = new FormData(document.getElementById('form'));
                        ajax.open("POST", url, true)
                        ajax.send(formData);
                        ajax.onload=()=>{
                            productos = JSON.parse(ajax.responseText);
                            mostrarProductos(productos);
                            document.getElementById("idProducto").value="";
                            document.getElementById("nombre").value="";
                            document.getElementById("descripcion").value="";
                            document.getElementById("precio").value="";
                            document.getElementById("cantidad").value="";
                            document.getElementById("archivo").required=true;
                            document.getElementById("submit").value="Crear Producto"
                            document.forms[0].action="http://localhost:8085/crearproducto"
                        }
                        ajax.onerror=()=>{
                            alert("Error en la petición");
                        }
                    }
                }
            }
        }
    }
}