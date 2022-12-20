let productos = [];
let total = 0;

function add(producto, precio) {
  console.log(producto, precio);
  products.push(producto);
  total = total + precio;
}

function pay() {
  console.log(producto, precio);
  window.alert(productos.join(","));
}


window.onload = async () => {
  var listaproductos = JSON.parse(localStorage.getItem("listaproductos") || "[]");
  mostrarProducto(listaproductos);
}

function mostrarProducto(listaproductos) {
  let carroHTML = '';
  listaproductos.forEach(element => {
    carroHTML +=
      `<div class="row main align-items-center">
    <p><img class="img-fluid" src="${element.imagen}"/></p>
       <div class="Column">
          <h4 class="row">${element.nombre}</h4>
          <div class="row">Talla:${element.talla}</div>
          <div class='row'>Color:${element.color}</div>
          <div class='row'>Tienda:${element.tienda}</div>
      </div>
    </p>
      <h3 class="col">${element.precio}</h3>
    </div>`
  });
  document.getElementById('cont-producto').innerHTML = carroHTML;
}

