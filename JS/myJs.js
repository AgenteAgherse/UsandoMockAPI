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
var productosParciales = [];

//Me permitirá agregar un nuevo dato.
async function appendDatatoJSON(url = '', data = {}){
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data)
    });
    alert('agregado!');
    return response.json();
}


//OBTENER TODOS LOS PRODUCTOS SELECCIONADOS DENTRO DE LA 
/*
______________________________________________________________________________________________________________
                                    MÉTODOS PARA LA REALIZACIÓN DE CONSULTAS.
                                                    NO ELIMINAR.
______________________________________________________________________________________________________________
*/

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
                            <td>${products.idProducto}</td>
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

async function adicionarProductos(){
    let productos = [];
    const response = await fetch(urlProducts).then(response => response.json());
    let data = {};
    let cantidad = document.getElementsByClassName('cantidadElemento');
    let i = 0;
    response.forEach(element => {
        if (cantidad[i].value != 0) {
            data = {
                "nombre": element.nombre,
                "precio": element.precio,
                "cantidad": element.cantidad,
                "categoria": element.categoria,
                "idproducto": element.idProducto
            };
            productos.push(data);
        }
        ++i;
    });
    console.log(productos);
}

function sobra(){
    let productos = [];
    let data = {};
    let cantidad = document.getElementsByClassName('cantidadElemento');
    let i = 0;
    fetch(urlProducts).then(response => response.json()).then(respuesta => respuesta.forEach(element => {
        
        i += 1;
        
    }));
    alert(productos.length);
}

//Método para eliminar las filas de la tabla
function deleteRows(cuerpoTabla){
    const datosTabla = document.getElementById(cuerpoTabla);
    const filas = datosTabla.getElementsByTagName('tr');
    for(i = filas.length-1; i >= 0; i--){
        datosTabla.removeChild(filas[i]);
    }
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
                <td id="contadorProductos">
                    <input type="number" class="cantidadElemento" value=0>
                </td>
            </tr>
        `;
    }));
}

function crearSeccionAgregarCliente(){
    const seccion = document.querySelector('#campoCreacion');

    let agregado = document.querySelector('.contenedor_parcial_busqueda');
    if(agregado != null){
        agregado.parentNode.removeChild(agregado);
    }

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
                            <button type="button" class="btn btn-dark" onclick="adicionarProductos()">Agregar Persona</button>
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
    //ELIMINAR VALOR
    let agregado = document.querySelector('.contenedor_parcial_agregar');
    if(agregado!=null){
        agregado.parentNode.removeChild(agregado);
    }

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
        crearSeccionBusquedaHistorial();
    }
    else if(document.getElementById('agregar').checked){
        crearSeccionAgregarCliente();
    }
}