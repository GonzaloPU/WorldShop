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
  var usuariocliente = JSON.parse(localStorage.getItem("usuariocliente") || "[]");
  mostrarProducto(listaproductos);
  mostrarPrecio(listaproductos);
  mostrarDetalles(usuariocliente);
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

function mostrarPrecio(listaproductos) {
  let precioHTML = '';
  listaproductos.forEach(element => {
    precioHTML +=
      `${element.precio}`
  });
  document.getElementById('precio-checkout').innerHTML = precioHTML;
}

function mostrarDetalles(usuariocliente) {
  let detallesHTML = '';
  usuariocliente.forEach(element => {
    detallesHTML += 
    `<div class="details personal">
      <fieldset id="fieldset-billing">
       <legend>Detalles Boleta y Envio</legend>
        <div>
          <label for="name">Nombre</label>
          <input type="text" name="name" id="name" data-type="string" value="${element.cnombre}" readonly>
        </div>
        <div>
          <label for="address">Direccion</label>
          <input type="text" name="address" id="address" data-type="string" value="${element.cdireccion}" readonly>
        </div>
        <div>
          <label for="email">Email</label>
          <input type="email" name="email" id="email" data-type="expression" value="${element.ccorreo}" readonly>
        </div>
        <div>
         <label for="telefono">Telefono</label>
         <input type="tel" name="telefono" id="telefono" data-type="string" value="${element.ctelefono}" readonly>
        </div>
        <div>
         <label for="genero">Genero</label>
         <input type="text" name="genero" id="genero" data-type="string" value="${element.cgenero}" readonly>
        </div>
      </fieldset>
    </div>`;
  });
  document.getElementById('detalles-envio').innerHTML = detallesHTML;
}