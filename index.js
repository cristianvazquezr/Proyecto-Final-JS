let cardIndex=document.getElementById('productCard')

class objetosComprados{
    constructor(id,nombre, cantidad, precio){
        this.id=id
        this.nombre=nombre
        this.cantidad=cantidad
        this.precio=precio
        
    }

}

// agrego las card de los productos que tengo disponibles para vender.
// Creo funcion para consultar a la base de datos los productos
let listaProducto=[]
function consultaServer(){
    fetch('https://643ac4e990cd4ba563012af5.mockapi.io/Articulos',{
        method:'GET'
    })
        .then((response)=>response.json())
        .then((responseJSON)=>{
            listaProducto=responseJSON
            agregarProductosHTML(listaProducto)
            
        })
}

// Creo la funcion para agregar los productos html
function agregarProductosHTML(listaProducto){
    cardIndex.innerHTML = null
    for(const i in listaProducto){
        cardIndex.innerHTML += 
        `<div class="card col-3" id="${listaProducto[i].id}" style="width: 18rem;"> 
            <img src="${listaProducto[i].imagen}" class="card-img-top" alt="...">
            <div class="card-body p-3">
                <h5 class="card-title">Nombre</h5>
                <p class="card-text">${listaProducto[i].nombre}</p>
                <h5 class="card-title">Descripción</h5>
                <p class="card-text">${listaProducto[i].descripcion}</p>
                <h5 class="card-title">Precio</h5>
                <p class="card-text">$ ${listaProducto[i].precio}</p>
                <p class="card-text">Quedan disponibles ${listaProducto[i].cantidad}!</p>
                <div class="my-3">
                    <input class="form-control my-3 cantidadCompra" type="number" name="cantidadCompra" id="cantidadCompra${listaProducto[i].id}" size="50" max="${listaProducto[i].cantidad}" value=0>
                    <a href="#" class="btn btn-primary btnComprar" id=comprar${listaProducto[i].id}>Comprar</a>
                </div>
            </div>
        </div>`
    }
    btnComprar(listaProducto)
    controlStock(listaProducto)
}

// creo la funcion para que se asigne la funcionalidad al boton de comprar


function btnComprar(listaProducto){
    let botonComprar=document.getElementsByClassName('btnComprar')
    let idElementoComprar=null
    for (let i in botonComprar){
        botonComprar[i].onclick=(event)=>{
            idElementoComprar=parseInt((event.target.attributes.id.nodeValue).substring(7))
            let cantidadAcomprar=document.getElementById(`cantidadCompra${idElementoComprar}`).value
            if (cantidadAcomprar==0){
                Swal.fire(
                    {icon: 'error',
                    title: 'Oops...',
                    text:'agregue una cantidad distinta de cero!'}
                )
            }
            else{
                carritoCompra(idElementoComprar, listaProducto, cantidadAcomprar);
                modifcarStock(listaProducto,idElementoComprar, cantidadAcomprar)
                actualizarItemsCarrito()
                mensajeOKcarrito()
            }
        }
    }
}

// funcion mensaje se agrego correctamente el producto al carrito

function mensajeOKcarrito(){
    Toastify({
        text: `Producto agregado con éxito`,
        className: "info",
        position: "left",
        style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
    }).showToast();
}


//// creo los objetos que van a ser comprado y los agrega al sesion storage. De esta forma la lista perdura mientras perdure la sesion.

let listaComprar=[]
let cantidadProductos=0

function carritoCompra(idElementos, lista, cantidad){
    if (listaComprar.length==0){
        listaComprar.push(new objetosComprados(idElementos,lista.find( producto => producto.id == idElementos).nombre,cantidad, lista.find( producto => producto.id == idElementos).precio))
    }
    else{
        for (let j in listaComprar){
            if (listaComprar[j].id==idElementos){
                listaComprar[j].cantidad=parseFloat(cantidad)+parseFloat(listaComprar[j].cantidad)
            }
            else{
                listaComprar.push(new objetosComprados(idElementos,lista.find( producto => producto.id == idElementos).nombre,cantidad, lista.find( producto => producto.id == idElementos).precio) )
            }
        }
    }
    sessionStorage.setItem('carrito',JSON.stringify(listaComprar))
    cantidadProductos=listaComprar.length
    itemsCompra(cantidadProductos)
}

// funcion para que se actualice el numero en el carrito de compras cada vez que realizo la compra

function itemsCompra(cantidad){
    let cantidadCarrito = document.getElementById('numerito')
    cantidadCarrito.innerHTML=cantidad

}

// function para consultar el sesion storage y ver cuantos productos hay en el carrito

function consultarSSCarrito(){
    if (JSON.parse(sessionStorage.getItem('carrito'))==null){
        listaComprar=[]
    }
    else{
        listaComprar=JSON.parse(sessionStorage.getItem('carrito'))
    }
    cantidadProductos=listaComprar.length
    itemsCompra(cantidadProductos)
}

// funcion para actualizar la lista del carrito de compras

function actualizarItemsCarrito(){
    let listaItemsCarrito=document.getElementById('itemsCarrito')
    let precioTotal=0
    listaItemsCarrito.innerHTML=null
    for (let items in listaComprar){
        precioTotal+=listaComprar[items].precio*listaComprar[items].cantidad
        listaItemsCarrito.innerHTML+=
        `<tr>
            <th scope="row">${items}</th>
            <td>${listaComprar[items].id}</td>
            <td>${listaComprar[items].nombre}</td>
            <td>${listaComprar[items].cantidad}</td>
            <td>$ ${listaComprar[items].precio}</td>
            <td>$ ${listaComprar[items].precio*listaComprar[items].cantidad}</td>
            <td><a type="button" class="btn btn-outline-dark delete" id='delete${listaComprar[items].id}'><i class="fa-solid fa-trash" id="delete${listaComprar[items].id}"></i></a></td>
        </tr>`
    }
    listaItemsCarrito.innerHTML+=
        `<tr>
            <th scope="row">TOTAL</th>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <th scope="row">$ ${precioTotal}</th>
            <td></td>
        </tr>`
    actualizarElementoCarrito()
    itemsCompra(listaComprar.length)
    
}

// Funcion para agregarle funcionalidad al boton eliminar del carrito

function actualizarElementoCarrito(){
    let botonEliminar=document.getElementsByClassName('delete')
    let idElementoEliminar=null
    for (let i in botonEliminar){
        botonEliminar[i].onclick=(event)=>{
            idElementoEliminar=parseInt((event.target.attributes.id.nodeValue).substring(6))
            eliminarElementoCarrito(idElementoEliminar)
            actualizarItemsCarrito()
            
        }
    }
    
}

function eliminarElementoCarrito(id){
    for (let i in listaComprar){
        if (listaComprar[i].id==id){
            listaComprar.splice(i,1)
        }
    }
    sessionStorage.setItem('carrito',JSON.stringify(listaComprar))
}

// funcion para finalizar compra y borrar carrito de compras

function finCompra(){
   let botonFinalizar=document.getElementById('finalizarCompra')
    botonFinalizar.onclick=()=>{
        sessionStorage.removeItem('carrito')
        consultarSSCarrito()
        actualizarItemsCarrito()
        Swal.fire(
            'Felicitaciones!',
            'La compra se ha realizado con éxito',
            'success'
          )
    
    }
}


// creo la funcion para validar que no se te deje comprar mas de lo que hay en stock

function controlStock(listaProducto){
    let inputCantidad=document.getElementsByClassName('cantidadCompra')
    let idElementoComprar=null
    for (let i in inputCantidad){
        inputCantidad[i].oninput=(event)=>{
            idElementoComprar=parseInt((event.target.attributes.id.nodeValue).substring(14))
            let cantidadAcomprar=document.getElementById(`cantidadCompra${idElementoComprar}`).value
            let cantidadStock=listaProducto.find( producto => producto.id == idElementoComprar).cantidad
            if (cantidadAcomprar>cantidadStock){
                Swal.fire('Su pedido excede el stock disponible!');
                cantidadAcomprar=cantidadStock
                document.getElementById(`cantidadCompra${idElementoComprar}`).value=cantidadAcomprar
            }
        }
    }
}


//  modificar stock con cada compra, creo la funcion para modificar el stock y para modificar el server.

function modifcarStock(lista,idElementoElegido, cantidadComprada){
    let productoModificado = lista.find(producto => producto.id==idElementoElegido)
    productoModificado.cantidad=parseFloat(productoModificado.cantidad)-parseFloat(cantidadComprada)
    modificarProducto(idElementoElegido,productoModificado)
}

function modificarProducto(id,producto){
    fetch(`https://643ac4e990cd4ba563012af5.mockapi.io/Articulos/${id}`,{
        method:'PUT',
        body:JSON.stringify(producto)
    })
    .then(response=>response.json)
    .then(responseJSON=>{
        listaProducto=responseJSON
        consultaServer()
    })
}

// tomo el usuario y lo guardo en el session storage, con esto voy a permitir que se pueda entrar a la seccion administrar

function loguearse(){
    let usuario=document.getElementById('login')
    let btnUsuario=document.getElementById('btnLogin')
    let admin=document.getElementById('admin')
    btnUsuario.onclick=()=>{
        let user=usuario.value
        if (user==''){
            Swal.fire(
                {icon: 'error',
                title: 'Oops...',
                text:'agregue una cantidad distinta de cero!'}
            )
        }
        else{
            sessionStorage.setItem('usuario',user)
            admin.setAttribute('href', './paginas/formulario.html')
            usuario.value=''

        }
    }

}

// corroborar login

function chequeoLogin(){
    let usuario= (sessionStorage.getItem('usuario'))
    console.log(usuario)
    if (usuario!=null){
        let admin=document.getElementById('admin')
        admin.setAttribute('href', './paginas/formulario.html')


    }



}



function main(){
    consultaServer()
    consultarSSCarrito()
    actualizarItemsCarrito()
    finCompra()
    loguearse()
    chequeoLogin()
}
main()