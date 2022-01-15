/*
______________________________________________________________________________________________________________
                                    VARIABLES GLOBALES PARA CRUD CON EL DOC JSON.
                                                    NO ELIMINAR.
______________________________________________________________________________________________________________
*/
const urlCostumers = 'https://61db14134593510017aff7f0.mockapi.io/api/v1/costumer';
const urlProducts = 'https://61db14134593510017aff7f0.mockapi.io/api/v1/products';
var estado = function cambiarEstado(para){
    return {
        method: para
    }
};

//Me permitirá agregar un nuevo dato.



//OBTENER TODOS LOS PRODUCTOS SELECCIONADOS DENTRO DE LA 
/*
______________________________________________________________________________________________________________
                                    MÉTODOS PARA LA REALIZACIÓN DE CONSULTAS.
                                                    NO ELIMINAR.
______________________________________________________________________________________________________________
*/

function buscar(){
    let identificacion = document.getElementById('id').value;
    let total = 0;
    const tabla = document.getElementById('cuerpoProductos');
    const info = document.getElementById('infoCliente');
    deleteRows();
    //infoCliente
    fetch(urlCostumers).then(response => response.json()).then(respuesta => {
        respuesta.forEach(element => {
            console.log(identificacion + '/' + element.id);
            if(identificacion == element.id){
                info.innerHTML = `
                    <div class="row" style="text-align: center;">
                        <p><strong>Información</strong></p>
                        <p>Nombre: ${element.nombre}</p>
                        <p>Teléfono: ${element.telefono}</p>
                    </div>
                `;
            }
        })
    });
    document.getElementById('totalCompra').innerHTML = `<p>Total: $0 COP</p>`;
    fetch(urlCostumers, estado('GET')).then(respuesta => respuesta.json()).then(obtener => {
        
       obtener.forEach(element => {
           if(element.id == identificacion){
               hallado = true;
                element.productos.forEach(products => {                    
                    total = total + (products.cantidad * products.precio);
                    
                    tabla.innerHTML += `
                        <tr class="productoConsumidor">
                            <td>${products.nombre}</td>
                            <td>${products.precio}</td>
                            <td>${products.cantidad}</td>
                            <td>${products.categoria}</td>
                        </tr>

                    `;
                });
                document.getElementById('totalCompra').innerHTML = `<p>Total: $ ${total} COP</p>`;
           }
           
       },
       ); 
    });
}


/*
______________________________________________________________________________________________________________
                                            MÉTODOS AGREGAR AL DOCUMENTO.
                                                    NO ELIMINAR.
______________________________________________________________________________________________________________
*/

async function save(url = '', data = {}){
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

function tomarGeneral(){
    let persona = {
        nombre: document.getElementById('name').value,
        telefono: document.getElementById('tel').value,
    }
    save(urlCostumers, persona);
    saveProducts();
}

async function saveProducts(){
    const response = await fetch(urlProducts).then(response => response.json());
    const responseCostumer = await fetch(urlCostumers).then(respone => respone.json());
    let long = 0;
    responseCostumer.forEach(element => {
        ++long;
    });
    let data = {};
    let cantidad = document.getElementsByClassName('cantidadElemento');
    let i = 0;
    console.log(long);
    response.forEach(element => {
        if (cantidad[i].value != 0) {
            data = {
                "nombre": element.nombre,
                "precio": element.precio,
                "cantidad": element.cantidad,
                "categoria": element.categoria,
                "idProducto" : element.idProducto,
                "costumerId": long
            };
            save(urlCostumers + '/' + long + '/products', data);
        }
        ++i;
    });
    alert('Su ID es: ' + long);
}


/*
______________________________________________________________________________________________________________
                                        MÉTODOS PARA CAMBIAR INFORMACIÓN DEL COMPRADOR.
                                                    NO ELIMINAR.
______________________________________________________________________________________________________________
*/
async function modificarInfo(data = {}){
    let id = document.getElementById('idModificacion').value;
    console.log(data);
    console.log(id.length);
    console.log(id);
    let urlParcial = urlCostumers + '/' + id;
    console.log(urlParcial);
    const response = await fetch(urlParcial, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    alert('INFORMACIÓN GUARDADA');
    return response.json();
}

saveNewData = function(){
    saveNewData = {
        "nombre": document.getElementById('nombreModificacion').value,
        "telefono": document.getElementById('telefonoModificacion').value,
        "id": document.getElementById('idModificacion').value
    }
    modificarInfo(saveNewData);
}
/*
______________________________________________________________________________________________________________
                                        MÉTODOS PARA ELIMINAR COMPRADOR.
                                                    NO ELIMINAR.
______________________________________________________________________________________________________________
*/

async function getProductsIdToDelete(idDel){
    const responseProducts = await fetch(urlCostumers + '/' + idDel + '/products').then(response => response.json());
    let arr = [];
    responseProducts.forEach(element => {
        arr.push(element.idProducto);
    });
    return arr;
}
async function deleteCostumer(){
        let idDel = document.getElementById('deleteUser').value;
        let valores = getProductsIdToDelete(idDel);        
        (await valores).forEach(element => {
            const responseProducts = fetch(urlCostumers + '/' + idDel + '/products/' + element,{
                method: 'DELETE',
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
        }).then(response => response.json())});
        const response = await fetch(urlCostumers + '/' + idDel, {
            method: 'DELETE',
            headers: {
                "Content-type": "application/json; charset=UTF-8"}
        });
        const data = await response.json();
        alert('ELIMINADO');
}
/*
______________________________________________________________________________________________________________
                                    GENERADOR DE SECCIONES DEL DOCUMENTO HTML.
                                                    NO ELIMINAR.
______________________________________________________________________________________________________________
*/

function crearTablaProductos(){
    
    let tabla = document.querySelector('#generarProductos');
    fetch(urlProducts, estado('GET')).then(resultados => resultados.json()).then(generador => generador.forEach(element => {
        tabla.innerHTML += `
            <tr>
                <td>${element.nombre}</td>
                <td>${element.precio}</td>
                <td>${element.categoria}</td>
                <td id="contadorProductos">
                    <input type="number" class="cantidadElemento" value=0>
                </td>
            </tr>
        `;
    }));
}

function crearSeccionAgregarCliente(){
    const seccion = document.querySelector('#campoCreacion');
    eliminarCampos(false, true, true, true);

    seccion.innerHTML = `
    <div class="contenedor_parcial_agregar">
            <div class="row">
                <div class="col-3"></div>
                <div class="col-6">
                    <fieldset>
                        <legend style="text-align: center;">Ingrese a la nueva persona</legend>
                        <label for="nombre">Ingrese el nombre: </label>
                        <input type="text" name="nombre" id="name">
                        <br>
                        <br>
                        <label for="telefono">Ingrese el teléfono</label>
                        <input type="text" name="telefono" id="tel">
                        <table class="table">
                            <thead>
                                <th class="col">Nombre</th>
                                <th class="col">Precio</th>
                                <th class="col">Categoría</th>
                                <th class="col">Cantidad</th>
                            </thead>

                            <!--Cuerpo-->

                            <tbody id="generarProductos">
                                
                            </tbody>
                        </table>
                        <br>
                        <div class="btn-group espacio" role="group">
                            <button type="button" class="btn btn-dark" onclick="tomarGeneral()">Agregar Persona</button>
                            <button type="button" class="btn btn-light">Cancelar</button>
                        </div>
                        <div class="col"></div>
                    </fieldset>
                </div>
                <div class="col-3"></div>
            </div>
        </div>
    `;
    crearTablaProductos();
}
/*CREADOR DE LA SECCIÓN DE BÚSQUEDA*/
function crearSeccionBusquedaHistorial(){
    let seccion = document.querySelector('#campoBusqueda');
    eliminarCampos(true, false, true, true);

    seccion.innerHTML = `
        <div class="contenedor_parcial_busqueda">
            <div class="row" style="background-color: azure;">
                <div class="col-3"><p></p></div>
                <div class="input-group mb-3 identificador">
                        <input type="number" class="form-control" name="id" id="id" placeholder="Identificación">
                        <button class="btn btn-dark btn-outline-secondary" onclick="buscar()">Buscar</button>
                </div>
                <div class="col-3"><p></p></div>
            </div>
            <div class="row" id="infoCliente"></div>
            <div class="row">
                <div class="col-10">
                    <table class="table" id="tablaProductos">
                        <thead>
                            <th class="col">Nombre</th> 
                            <th class="col">Precio</th>
                            <th class="col">Cantidad</th>
                            <th class="col">Categoría</th>
                        </thead>
                        <tbody id="cuerpoProductos">
                            
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="row">
                <div class="col-3"></div>
                <div class="col-6" style="text-align: center;">
                    <p id="totalCompra">Total: 0</p>
            </div>
                <div class="col-3"></div>
        </div>
    `
}

function agregarSeccionEliminar(){
    let seccion = document.querySelector('#campoEliminar');
    //Eliminar Campos
    eliminarCampos(true, true, true, false);

    seccion.innerHTML += `
        <div class="contenedor_parcial_eliminar">
        <fieldset>
            <legend style="text-align: center;">Eliminar Comprador</legend>
            <label for="id">Ingrese identificación del usuario a eliminar: </label>
            <div class="btn-group" role="group">
                <input type="number" name="id" id="deleteUser" value="0">
                <button class="btn btn-danger" onclick="deleteCostumer()">Eliminar Comprador</button>
            </div>
        </fieldset>
        </div>
    `;
}


function agregarSeccionModificar(){
    let seccion = document.querySelector('#campoModificar');
    eliminarCampos(true,true,false,true);

    seccion.innerHTML += `
        <div class="container campo_parcial_modificar">
            <fieldset>
                <legend style="text-align: center;">Modificación de Usuario</legend>
                <div class="row">
                    <div class="col-10">
                        <div class="btn btn-group" role="group">
                            <label for="id">Ingrese el ID de la persona a modificar informacion:</label>
                            <input type="text" name="id" id="idModificacion">
                            <button class="btn btn-success" id="btnHab" onclick="habilitar()">Verificar</button>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-5">
                        <label for="nombre">Ingrese el nuevo nombre</label>
                        <input type="text" name="nombre" id="nombreModificacion" disabled>
                    </div>
                    <div class="col-5">
                        <label for="name">Ingrese el nuevo teléfono</label>
                        <input type="tel" name="tel" id="telefonoModificacion" disabled>
                    </div>
                    <div class="col">
                        <button class="btn btn-success" id="btnMod" disabled onclick="saveNewData()">Modificar</button>
                    </div>
                </div>
            </fieldset>
        </div>
    `;
}
/*
______________________________________________________________________________________________________________
                                                GENERADOR DE MENÚ.
                                                    NO ELIMINAR.
______________________________________________________________________________________________________________
*/

function deleteRows(){
    var eliminar = document.getElementById('cuerpoProductos');
    var cantidadFilas = eliminar.getElementsByTagName('tr');
    var cantidad = cantidadFilas.length;
    for(i = cantidad-1; i>=0; i--){
        eliminar.removeChild(cantidadFilas[i]);
    }
}

function generarMenu(){
    if(document.getElementById('buscar').checked){
        crearSeccionBusquedaHistorial();
    }
    else if(document.getElementById('agregar').checked){
        crearSeccionAgregarCliente();
    }
    else if(document.getElementById('delete').checked){
        agregarSeccionEliminar();
    }
    else if(document.getElementById('modificar').checked){
        agregarSeccionModificar();
    }
}

async function habilitar(){
    const verificar = await fetch(urlCostumers).then(response => response.json());
    let id = document.getElementById('idModificacion').value;
    verificar.forEach(element =>{
        if(element.id == id){
            let nom = document.querySelector('#nombreModificacion');
            let tel = document.querySelector('#telefonoModificacion');
            let btnMod = document.querySelector('#btnMod');
            let btnHab = document.querySelector('#btnHab');
            nom.disabled = false;
            tel.disabled = false;
            btnMod.disabled = false;
            btnHab.disabled = true;
        }
    });
}

function eliminarCampos(agregar=false, mostrar=false, modificar=false, eliminar=false){
    let agregado = document.querySelector('.contenedor_parcial_agregar');
    let mostrado = document.querySelector('.contenedor_parcial_busqueda');
    let eliminado = document.querySelector('.contenedor_parcial_eliminar');
    let modificado = document.querySelector('.campo_parcial_modificar');
    if(agregar && agregado != null){
        agregado.parentNode.removeChild(agregado);
    }
    if(mostrar && mostrado != null){
        mostrado.parentNode.removeChild(mostrado);
    }
    if(eliminar && eliminado != null){
        eliminado.parentNode.removeChild(eliminado);
    }
    if(modificar && modificado != null){
        modificado.parentNode.removeChild(modificado);
    }
}
