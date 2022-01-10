/*
______________________________________________________________________________________________________________
                                    VARIABLES GLOBALES PARA CRUD CON EL DOC JSON.
                                                    NO ELIMINAR.
______________________________________________________________________________________________________________
*/
const urlCostumers = 'https://61db14134593510017aff7f0.mockapi.io/api/v1/costumer';
const urlProducts = 'https://61db14134593510017aff7f0.mockapi.io/api/v1/products';
var estado = function cambiarEstado(para){
    estado = {
        method: para
    }
};


/*
______________________________________________________________________________________________________________
                                    MÉTODOS PARA LA REALIZACIÓN DE CONSULTAS.
                                                    NO ELIMINAR.
______________________________________________________________________________________________________________
*/

/*Verificación de ID para no repetir la misma en caso que se esté agregando una persona*/
verificar = function verificarId(id){
    fetch(urlCostumers, estado('GET')).then(respuesta => respuesta.json()).then(obtenerDatos => {
        obtenerDatos.forEach(element => {
            console.log(element.id);
            if(element.id == id){
                verificar = true;
            }
        });
    });
    verificar = false;
}

/*Función para agregar a un comprador. Se verifica primero si el id de la persona no se ha encontrado con anterioridad*/
function agregarComprador(){
    let id = document.getElementById('agregarId').value;
    
    if(verificar){
        alert('PERSONA YA AGREGADA CON ANTERIORIDAD!');
    }
}




function buscar(){
    let identificacion = document.getElementById('id').value;
    let hallado = false;
    let total = 0;
    let contador = 0;
    const tabla = document.getElementById('cuerpoProductos');

    fetch(urlCostumers, estado('GET')).then(respuesta => respuesta.json()).then(obtener => {
       obtener.forEach(element => {
           console.log(identificacion);
           if(element.id == identificacion){
               hallado = true;
               deleteRows('cuerpoProductos');
                element.productos.forEach(products => {                    
                    total = total + (products.cantidad * products.precio);
                    
                    tabla.innerHTML += `
                        <tr>
                            <td>${products.id}</td>
                            <td>${products.nombre}</td>
                            <td>${products.precio}</td>
                            <td>${products.cantidad}</td>
                            <td>${products.categoria}</td>
                        </tr>

                    `;
                });
                document.getElementById('totalCompra').innerHTML = `<p>Total: $ ${total} COP</p>`;
           }
           else{
               ++contador;
           }

           if(!hallado && contador == element.length){
               alert('No hay una persona registrada con esta id');
           }
       },
       ); 
    });
}


//Método para eliminar las filas de la tabla
function deleteRows(cuerpoTabla){
    const datosTabla = document.getElementById(cuerpoTabla);
    const filas = datosTabla.getElementsByTagName('tr');
    for(i = filas.length-1; i >= 0; i--){
        datosTabla.removeChild(filas[i]);
    }
    alert('Done!');
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
                <td>${element.idProducto}</td>
                <td>${element.nombre}</td>
                <td>${element.precio}</td>
                <td>${element.categoria}</td>
                <td>
                    <input type="number" name="${element.nombre}" id="${element.nombre}" placeholder="0">
                </td>
            </tr>
        `;
    }));
}

function crearSeccionAgregarCliente(){
    const seccion = document.querySelector('#campoCreacion');
    seccion.innerHTML = `
    <div class="contenedor_parcial_agregar">
            <div class="row">
                <div class="col-3"></div>
                <div class="col-6">
                    <fieldset>
                        <legend style="text-align: center;">Ingrese a la nueva persona</legend>
                        <table class="table">
                            <thead>
                                <th class="col">ID</th>
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
                            <button type="button" class="btn btn-dark">Agregar Persona</button>
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
    const seccion = document.querySelector('#campoBusqueda');
    seccion.innerHTML += `
        <div class="contenedor_parcial_busqueda">
            <div class="row" style="background-color: azure;">
                <div class="col-3"><p></p></div>
                <div class="input-group mb-3 identificador">
                        <input type="number" class="form-control" name="id" id="id" placeholder="Identificación">
                        <button class="btn btn-dark btn-outline-secondary" onclick="buscar()">Buscar</button>
                </div>
                <div class="col-3"><p></p></div>
            </div>
            <div class="row">
                <div class="col-12">
                    <table class="table" id="tablaProductos">
                        <thead>
                            <th class="col">ID</th>
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




/*
______________________________________________________________________________________________________________
                                                GENERADOR DE MENÚ.
                                                    NO ELIMINAR.
______________________________________________________________________________________________________________
*/

function generarMenu(){
    if(document.getElementById('buscar').checked){
        crearSeccionAgregarCliente();
    }
    else if(document.getElementById('agregar').checked){
        crearSeccionBusquedaHistorial();
    }
}