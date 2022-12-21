let carrito = [];
let total = 0;
let number,tnumber = 0;
titulo='';
precio=0;

window.onload = async () => {
  var listaproductos = JSON.parse(localStorage.getItem("listaproductos") || "[]");
  var usuariocliente = JSON.parse(localStorage.getItem("usuariocliente") || "[]");
  mostrarProducto(listaproductos);
  mostrarPrecio(listaproductos);
  mostrarDetalles(usuariocliente);
  mostrarTotal(listaproductos);
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
    titulo = element.nombre;
  });
  document.getElementById('cont-producto').innerHTML = carroHTML;
}

function mostrarPrecio(listaproductos) {
  let precioHTML = '';
  listaproductos.forEach(element => {
    var currency = element.precio; //it works for US-style currency strings as well
    var cur_re = /\D*(\d+|\d.*?\d)(?:\D+(\d{2}))?\D*$/;
    var parts = cur_re.exec(currency);
    number = parseFloat(parts[1].replace(/\D/, '') + '.' + (parts[2] ? parts[2] : '00'));
    number = (number*860);
    precioHTML +=
      '$'+ number
  });
  document.getElementById('precio-checkout').innerHTML = precioHTML;
}


function mostrarTotal(listaproductos) {
  let totalHTML = '';
  listaproductos.forEach(element => {
    var currency = element.precio; //it works for US-style currency strings as well
    var cur_re = /\D*(\d+|\d.*?\d)(?:\D+(\d{2}))?\D*$/;
    var parts = cur_re.exec(currency);
    number = parseFloat(parts[1].replace(/\D/, '') + '.' + (parts[2] ? parts[2] : '00'));
    number = (number*860) + 32000;
    precio = number;
    totalHTML +=
      '$'+ number
  });
  document.getElementById('total-checkout').innerHTML = totalHTML;
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











/*
async function pay() {
  carrito.push(titulo);
  const productlist = await (await fetch ("/api/productos",{
    method: "post",
    body: JSON.stringify(carrito),
    headers: {
      "Content Type": "aplication/json"
    }

  })).JSON();

}*/