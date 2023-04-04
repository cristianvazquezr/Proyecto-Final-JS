let cardIndex=document.getElementById('productCard')

// agrego las card de los productos que tengo disponibles para vender.

let productList=JSON.parse(localStorage.getItem('producto'))

console.log(productList)
cardIndex.innerHTML = null

for(const i in productList){
    cardIndex.innerHTML += `<div class="card col-3" id="${productList[i].id}" style="width: 18rem;"> <img src="./imagen/imagenDefault.jpg" class="card-img-top" alt="..."> <div class="card-body"><h5 class="card-title">Nombre</h5><p class="card-text">${productList[i].nombre}</p><h5 class="card-title">cantidad</h5><p class="card-title">${productList[i].cantidad}</p><h5 class="card-title">Descripción</h5><p class="card-text">${productList[i].descripcion}</p><a href="#" class="btn btn-primary">comprar</a></div></div>`
}