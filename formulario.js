/*creo la clase producto que es la que me va permitir crear nuevos productos */
class producto{
    constructor(id,nombre,categoria,subcategoria,precio, cantidad,descripcion,imagen){
    this.id = id;
    this.nombre=nombre;
    this.categoria=categoria;
    this.subcategoria=subcategoria;
    this.descripcion=descripcion;
    this.precio=precio;
    this.cantidad=cantidad;
    this.imagen=imagen    
    }
    subirStock(ingresos){
        this.cantidad=this.cantidad+ingresos
    }
    venta(cantidadVendida){
        this.cantidad=this.cantidad-cantidadVendida
    }
}


// Creo la funcion para hacer la consulta GET a la base de datos.

let listaProductos=[]

function consultaProductosServer(){
    fetch('https://643ac4e990cd4ba563012af5.mockapi.io/Articulos')
        .then((response)=>response.json())
        .then((respJSON)=>{
            listaProductos=respJSON
            actualizarProductos(listaProductos);
            botonesEliminar();
            botonesStock();
        })
}
consultaProductosServer()

// Creo la funcion para hacer el post a la base de datos.


function crearProductoServer(producto){
    fetch('https://643ac4e990cd4ba563012af5.mockapi.io/Articulos',{
        method:'POST',
        body:JSON.stringify(producto),
    })
        .then((response)=>response.json())
        .then((respJSON)=>{
            listaProductos=respJSON
            mensajeAddOk()
            consultaProductosServer()
        })
}

// Creo la funcion para modificar elemento de la base de datos.

function modificarProductosServer(id,producto,cantidadAsubir){
    fetch(`https://643ac4e990cd4ba563012af5.mockapi.io/Articulos/${id}`,{
        method:'PUT',
        body:JSON.stringify({producto}),
    })
        .then((response)=>response.json())
        .then((respJSON)=>{
            listaProductos=respJSON
            mensajeStockOk(cantidadAsubir);
            consultaProductosServer()
        })
}


// Creo la funcion para eliminar elemento de la base de datos.

function eliminarProductosServer(id){
    fetch(`https://643ac4e990cd4ba563012af5.mockapi.io/Articulos/${id}`,{
        method:'DELETE',
    })
        .then((response)=>response.json())
        .then((respJSON)=>{
            listaProductos=respJSON
            mensajeDeleteOk();
            consultaProductosServer()
        })
}



// al ID lo genero de manera automatica validando siempre que no exista previamente.

function idGenerador(){
  
  let idGenerado=Math.floor(Math.random()*100000)

  // creo una lista de los id y con la funcion include veo si existe
  let listaId=Array.from(listaProductos,elemento=>elemento.id)
  while (listaId.includes(idGenerado)){
      idGenerado=math.floor(Math.random()*100000)
  }
  return idGenerado
}

/**Creo la funcion para crear productos */

let id=idGenerador()
function crearProductos(nombre,categoria,subcategoria,precio, cantidad,descripcion,imagen){
    
    newProduct=new producto(id,nombre,categoria,subcategoria,precio, cantidad,descripcion,imagen)
    return newProduct
}

// creo la funcion para levantar stock y vender.

function levantarStock(producto,cantidad){
    producto.subirStock(cantidad)
}
function vender(producto,cantidad){
    producto.venta(cantidad)
}

// tomo las variables del html para poder crear el objeto

let productName=''
let category=''
let subcategory=''
let price=''
let stock=''
let description=''
let imagen=''
let atributtesList=[]

function obtenerElementos(){
    productName=document.getElementById('nombreProducto')
    category=document.getElementById('categoria')
    subcategory=document.getElementById('subcategoria')
    price=document.getElementById('precio')
    stock=document.getElementById('cantidad')
    description=document.getElementById('descripcion')
    imagen=document.getElementById('imagen')

// creo una lista de estos elementos para manejarlos de manera mas facil
 atributtesList=[productName.value,category.value,subcategory.value,price.value,stock.value,description.value,imagen.value]

    
}
let idNumber=document.getElementById('idProducto')
let buttonAdd=document.getElementById('boton')
let formProduct=document.getElementById('formulario')
idNumber.value=id


//Tengo que validar que todos los parametros no esten vacios. para evitar errores al crear el objeto.

function validarProducto(){
    // pongo un contador para que si es mayor a 0 al finalizar el ciclo for arroje la alerta.
    let contador=0
    atributtesList.forEach((elemento)=>{
        if(elemento=='imagen del producto (link)' || elemento=='Producto' || elemento=='Categoria' ||  elemento=='Subcategoria' || elemento=='Descripción del producto' || elemento.value==''){
            contador+=1
        }
    })
    if(contador!=0){
        Swal.fire('complete todos los campos antes de continuar');
    }
    return contador
}
// genero una funcion para agregar el producto nuevo a la lista de productos para la venta. 

function nuevosProductos(){
    if(validarProducto()==0){
        let producto=crearProductos(atributtesList[0],atributtesList[1],atributtesList[2],parseFloat(atributtesList[3]),parseInt(atributtesList[4]),atributtesList[5],atributtesList[6])
        
        crearProductoServer(producto);
    }
}



// agrego la funcion para que no actualice pagina al hacer click en el boton

formProduct.addEventListener('submit',recargaformulario)

function recargaformulario(event){
    event.preventDefault();
}

// agrego las card de los productos que tengo.
let cardForm=document.getElementById('productCard')
let botonEliminar=document.getElementsByClassName('eliminarProducto')
let botonStock=document.getElementsByClassName('aumentarStock')



function actualizarProductos(listaProductos){
    cardForm.innerHTML = null
    for(const i in listaProductos){
        cardForm.innerHTML += 
            `<div class="card col-3" id="${listaProductos[i].id}" style="width: 18rem;">
                <img src=${listaProductos[i].imagen}  class="card-img-top" alt="..."> 
                <div class="card-body">
                    <h5 class="card-title">Nombre</h5>
                    <p class="card-text">${listaProductos[i].nombre}</p>
                    <h5 class="card-title">cantidad</h5>
                    <p class="card-title">${listaProductos[i].cantidad}</p>
                    <h5 class="card-title">Descripción</h5><p class="card-text">${listaProductos[i].descripcion}</p>
                    <input class="form-control" type="number" name="idProducto" id="cantidad${listaProductos[i].id}" size="100" value=0 >
                    <div class="row p-3">
                        <div class="col">
                            <a class="btn btn-primary eliminarProducto mg-3" id=eliminar${listaProductos[i].id}>eliminar</a>
                        </div>
                        <div class="col">
                            <a class="btn btn-primary aumentarStock mg-3" id=stock${listaProductos[i].id}> ↑ Stock</a>
                        </div>
                    </div>
                </div>
            </div>`
    }
    botonesEliminar();
    botonesStock();
}

// creo funcion para notificacion de agregado Ok de producto
function mensajeAddOk(){
    Toastify({
        text: "El producto se agregó con éxito",
        className: "info",
        style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
    }).showToast();
}

// creo funcion para notificacion de elimino Ok de producto
function mensajeDeleteOk(){
    Toastify({
        text: "El producto se eliminó con éxito",
        className: "info",
        style: {
        background: "linear-gradient(to right, red, red)",
        }
    }).showToast();
}

// creo funcion para notificacion de aumento Ok de stock
function mensajeStockOk(unidades){
    Toastify({
        text: `Se agregaron ${unidades} unidades con éxito`,
        className: "info",
        style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
    }).showToast();
}

// creo funcion para preguntar si es correcto eliminar el producto
function confirmarDelete(idElementoEliminar){
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })
      
      swalWithBootstrapButtons.fire({
        title: 'Esta seguro que desea eliminar el siguiente producto?',
        text: "Si lo elimina no se podrá volver atras",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'SI, eliminar!',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
            eliminarProductos(idElementoEliminar);;
          swalWithBootstrapButtons.fire(
            'Eliminado!',
            'El producto fue eliminado',
            'Correcto'
          )
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelado',
            'El producto esta a salvo :)',
            'error'
          )
        }
      })
}


// Al hacer click sobre boton creo el objeto y valido que todos los atributos tengan datos
buttonAdd.onclick = () =>{
    obtenerElementos();
    id=idGenerador();
    idNumber.value=id;
    nuevosProductos();

}

// agrego la funcion para eliminar productos cuando presiono el boton elminar. Primero debo determinar el ID del elemento que deseo eliminar. por eso creo el evento onclick para obtener el ID del boton que es el mismo ID del producto como objeto. Lo tengo que meter dentro de una funcion, para que cuando yo actualice mi lista de productos se cree el evento on click sobre cada uno de los botones 'eliminar'

function botonesEliminar(){
    let botonEliminar=document.getElementsByClassName('eliminarProducto')
    let idElementoEliminar=null
    for (i in botonEliminar){
        botonEliminar[i].onclick=(event)=>{
            idElementoEliminar=parseInt((event.target.attributes.id.nodeValue).substring(8))
            confirmarDelete(idElementoEliminar);
        }
    }
}

// agrego la funcion para subir stock cuando presiono el boton stock. Primero debo determinar el ID del elemento que deseo modificar. por eso creo el evento onclick para obtener el ID del boton que es el mismo ID del producto como objeto. Lo tengo que meter dentro de una funcion, para que cuando yo actualice mi lista de productos se cree el evento on click sobre cada uno de los botones 'subir stock'. en este caso como yo modifico el input que es el stock que quiero agregar, tengo que crear el evento change para el input

function botonesStock(){
    let botonStock=document.getElementsByClassName('aumentarStock')
    let idElementoSubirStock=null
    for (i in botonStock){
        botonStock[i].onclick=(event)=>{
            idElementoSubirStock=parseInt((event.target.attributes.id.nodeValue).substring(5))
            let cantidadAsubir=document.getElementById(`cantidad${idElementoSubirStock}`).value
            subirCantidad(idElementoSubirStock,cantidadAsubir);
        }
    }
}


// En la card donde esta el producto a eliminar puse de id del elemento html el id del producto para eleminarlo. por eso busco el ID del elemento HTML


// funcion eliminar objeto de la lista de objetos. traigo la lista del server. Busco el ID del objeto dentro de la lista y luego vuelvo a guardar en el local storage.

function eliminarProductos(id){
    for (let elemento in listaProductos){
        if (listaProductos[elemento].id==id){
            eliminarProductosServer(id);
        }
    }
    
}

// funcion subir stock de objetos. traigo la lista del server. Busco el ID del objeto dentro de la lista y luego vuelvo a guardar en el server.

function subirCantidad(id,cantidad){
    let productoModificado=''
    for (let elemento in listaProductos){
        if (listaProductos[elemento].id==id){
            listaProductos[elemento].cantidad = parseFloat(listaProductos[elemento].cantidad) + parseFloat(cantidad);
            productoModificado=listaProductos[elemento]
        }
    }
    modificarProductosServer(id,productoModificado,cantidad)
}
