function alerta(){
    alert("Hola");
}

function crearSeccion(){
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

function buscar(){
    var identificacion = document.getElementById('id').value;
    var hallado = false;
    let total = 0;
    var contador = 0;
    const tabla = document.getElementById('cuerpoProductos');
    const url = 'https://61db14134593510017aff7f0.mockapi.io/api/v1/costumer';
    const opcion = {
        method: 'GET'
    };

    fetch(url, opcion).then(respuesta => respuesta.json()).then(obtener => {
       obtener.forEach(element => {
           console.log(identificacion);
           if(element.id == identificacion){
               hallado = true;
               deleteRows();
                element.productos.forEach(products => {
                    total = total + (products.contador * products.precio);
                    console.log(products.contador * products.precio);
                    
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
                document.getElementById('totalCompra').innerHTML = `<p>Total: ${total}</p>`;
           }
           else{
               ++contador;
           }

           if(!hallado && contador == 20){
               alert('No hay una persona registrada con esta id');
           }
       },
       ); 
    });
}

function deleteRows(){
    const datosTabla = document.getElementById('cuerpoProductos');
    const filas = datosTabla.getElementsByTagName('tr');
    for(i = filas.length-1; i >= 0; i--){
        datosTabla.removeChild(filas[i]);
    }
    alert('Done!');
}