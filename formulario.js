/*creo la clase producto que es la que me va permitir crear nuevos productos */
class producto{
    constructor(id,nombre,categoria,subcategoria,precio, cantidad,descripcion){
    this.id = id;
    this.nombre=nombre;
    this.categoria=categoria;
    this.subcategoria=subcategoria;
    this.descripcion=descripcion;
    this.precio=precio;
    this.cantidad=cantidad;    
    }
    subirStock(ingresos){
        this.cantidad=this.cantidad+ingresos
    }
    venta(cantidadVendida){
        this.cantidad=this.cantidad-cantidadVendida
    }
}

// creo mi lista de productos

let listaProductos=[
new producto(1,'arroz Gallo Oro','legumbres','saludables',200,200,'Arroz parbolizado x500gr'),
new producto(2,'Galletas Diversion','galletas','golosinas',150,300,'Galletas dulces Diversion x200gr'),
new producto(3,'Pan Integral','panaderia','TACC',100,2000,'pan integral marca Bimbo x300gr'),
new producto(4,'Caramelos Sugus','Golocinas','caramelos',200000,150,'caramelos sugus masticables x15un'),
]


// guardo mis productos en el local storage, lo convierto a json. Tengo que validar, si ya existen productos en el localstorage no ejecuto esto, si esta vacio lo ejecuto para cargar mis productos iniciales que ya traigo. En el if pongo igual a [] por que cuando borro todos los items es lo que queda almacenado dos elementos que son los corchetes.
if(localStorage.getItem('producto')==null || localStorage.getItem('producto')== '[]' ){
    let listaProductosJSON=JSON.stringify(listaProductos)
    localStorage.setItem('producto', listaProductosJSON)
}
else{
    listaProductos=JSON.parse(localStorage.getItem('producto'))
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
function crearProductos(nombre,categoria,subcategoria,precio, cantidad,descripcion){
    newProduct=new producto(id,nombre,categoria,subcategoria,precio, cantidad,descripcion)
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
let atributtesList=[]

function obtenerElementos(){
    productName=document.getElementById('nombreProducto')
    category=document.getElementById('categoria')
    subcategory=document.getElementById('subcategoria')
    price=document.getElementById('precio')
    stock=document.getElementById('cantidad')
    description=document.getElementById('descripcion')

    // creo una lista de estos elementos para manejarlos de manera mas facil
    atributtesList=[productName.value,category.value,subcategory.value,price.value,stock.value,description.value]

    
}
let idNumber=document.getElementById('idProducto')
let buttonAdd=document.getElementById('boton')
let formProduct=document.getElementById('formulario')
idNumber.value=id

console.log(atributtesList)

//Tengo que validar que todos los parametros no esten vacios. para evitar errores al crear el objeto.

function validarProducto(){
    // pongo un contador para que si es mayor a 0 al finalizar el ciclo for arroje la alerta.
    let contador=0
    atributtesList.forEach((elemento)=>{
        if(elemento=='Producto' || elemento=='Categoria' ||  elemento=='Subcategoria' || elemento=='Descripción del producto' || elemento.value==''){
            contador+=1
        }
    })
    if(contador!=0){
        alert("complete todos los campos antes de continuar")
    }
    return contador
}
// genero una funcion para agregar el producto nuevo a la lista de productos para la venta. 

function nuevosProductos(){
    if(validarProducto()==0){
        let producto=crearProductos(atributtesList[0],atributtesList[1],atributtesList[2],parseFloat(atributtesList[3]),parseInt(atributtesList[4]),atributtesList[5])
        listaProductos.push(producto)
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


let productList=null


function actualizarProductos(){
    cardForm.innerHTML = null
    productList=JSON.parse(localStorage.getItem('producto'))
    for(const i in productList){
        cardForm.innerHTML += `<div class="card col-3" id="${productList[i].id}" style="width: 18rem;"> <img src="../imagen/imagenDefault.jpg" class="card-img-top" alt="..."> <div class="card-body"><h5 class="card-title">Nombre</h5><p class="card-text">${productList[i].nombre}</p><h5 class="card-title">cantidad</h5><p class="card-title">${productList[i].cantidad}</p><h5 class="card-title">Descripción</h5><p class="card-text">${productList[i].descripcion}</p><input class="form-control" type="number" name="idProducto" id="cantidad${productList[i].id}" size="100" value=0 ><div class="row p-3"><div class="col"><a class="btn btn-primary eliminarProducto mg-3" id=eliminar${productList[i].id}>eliminar</a></div><div class="col"><a class="btn btn-primary aumentarStock mg-3" id=stock${productList[i].id}> ↑ Stock</a></div></div></div></div>`
    }
    botonesEliminar();
    botonesStock();
}



// llamo la funcion actualizar producto para que agregue las card del local storage

actualizarProductos()

// Al hacer click sobre boton creo el objeto y valido que todos los atributos tengan datos
buttonAdd.onclick = () =>{
    obtenerElementos();
    nuevosProductos();
    id=idGenerador();
    idNumber.value=id;
    listaProductosJSON=JSON.stringify(listaProductos);
    localStorage.setItem('producto', listaProductosJSON);
    actualizarProductos();
    botonesEliminar();
    botonesStock();
}

// agrego la funcion para eliminar productos cuando presiono el boton elminar. Primero debo determinar el ID del elemento que deseo eliminar. por eso creo el evento onclick para obtener el ID del boton que es el mismo ID del producto como objeto. Lo tengo que meter dentro de una funcion, para que cuando yo actualice mi lista de productos se cree el evento on click sobre cada uno de los botones 'eliminar'

function botonesEliminar(){
    botonEliminar=document.getElementsByClassName('eliminarProducto')
    let idElementoEliminar=null
    for (i in botonEliminar){
        botonEliminar[i].onclick=(event)=>{
            idElementoEliminar=parseInt((event.target.attributes.id.nodeValue).substring(8))
            eliminarProductos(idElementoEliminar);
            actualizarProductos();
        }
    }
}

// agrego la funcion para subir stock cuando presiono el boton stock. Primero debo determinar el ID del elemento que deseo modificar. por eso creo el evento onclick para obtener el ID del boton que es el mismo ID del producto como objeto. Lo tengo que meter dentro de una funcion, para que cuando yo actualice mi lista de productos se cree el evento on click sobre cada uno de los botones 'subir stock'. en este caso como yo modifico el input que es el stock que quiero agregar, tengo que crear el evento change para el input

function botonesStock(){
    botonStock=document.getElementsByClassName('aumentarStock')
    let idElementoSubirStock=null
    for (i in botonStock){
        botonStock[i].onclick=(event)=>{
            idElementoSubirStock=parseInt((event.target.attributes.id.nodeValue).substring(5))
            let cantidadAsubir=document.getElementById(`cantidad${idElementoSubirStock}`).value
            console.log(cantidadAsubir)
            subirCantidad(idElementoSubirStock,cantidadAsubir);
            actualizarProductos();
        }
    }
}
  
  



// En la card donde esta el producto a eliminar puse de id del elemento html el id del producto para eleminarlo. por eso busco el ID del elemento HTML

//let idCardDelete=document.getElementById('eliminarProducto').parentNode.parentNode.id


// funcion eliminar objeto de la lista de objetos. traigo la lista del localstorage. Busco el ID del objeto dentro de la lista y luego vuelvo a guardar en el local storage.

function eliminarProductos(id){
    listaProductos=JSON.parse(localStorage.getItem('producto'))
    for (let elemento in listaProductos){
        if (listaProductos[elemento].id==id){
            listaProductos.splice(elemento,1);
        }
    }
    localStorage.setItem('producto',JSON.stringify(listaProductos))
}

// funcion subir stock de objetos. traigo la lista del localstorage. Busco el ID del objeto dentro de la lista y luego vuelvo a guardar en el local storage.

function subirCantidad(id,cantidad){
    listaProductos=JSON.parse(localStorage.getItem('producto'))
    for (let elemento in listaProductos){
        if (listaProductos[elemento].id==id){
            listaProductos[elemento].cantidad = listaProductos[elemento].cantidad + parseInt(cantidad);
        }
    }
    localStorage.setItem('producto',JSON.stringify(listaProductos))
}


// evento change para el input de stock

/**function cantidadStock(id){
    let cantidadAumentada=null
    let inputStock=document.getElementById(id)
    inputStock.addEventListener('change',(event)=>{
        cantidadAumentada=event.target.value
        
    })
    return cantidadAumentada
}*/