var ventanaAgregar, ventanaDescripcion, ventanaItem; //div ventanas emergentes y sus datos
var dProducto, dSerie, dCantidad, dCostoTotal, dFechaDeCaducidad, dPrecioUnitario;
var infoProducto, infoSerie, infoCantidad, infoCostoTotal, infoFechaDeCaducidad, infoPrecioUnitario;
var item, imgsrc;
var cantidadActual;
var botonGuardarCambios;
var divProductosImprimir = document.getElementById('divProductosImprimir');

window.onload = function () {
    //Guarda en variables todos los elementos html necesarios
    //de la ventana agregar
    ventanaAgregar = document.getElementById('ventanaAgregar');
    dProducto = document.getElementById('dproducto');
    dSerie = document.getElementById('dserie');
    dCantidad = document.getElementById('dcantidad');
    dCostoTotal = document.getElementById('dcostototal');
    dFechaDeCaducidad = document.getElementById('dfechadecaducidad');
    dPrecioUnitario = document.getElementById('dpreciounitario');
    //de la ventana descripcion
    ventanaDescripcion = document.getElementById('ventanaDescripcion');
    infoProducto = document.getElementById('infoproducto');
    infoSerie = document.getElementById('infoserie');
    infoCantidad = document.getElementById('infocantidad');
    infoCostoTotal = document.getElementById('infocostototal');
    infoFechaDeCaducidad = document.getElementById('infofechadecaducidad');
    infoPrecioUnitario = document.getElementById('infopreciounitario');
    cantidadActual = document.getElementById('cantidadActual')
    botonGuardarCambios = document.getElementById('guardarCambios')
    //de la ventana item
    ventanaItem = document.getElementById('ventanaItem');
    item = document.getElementById('item');
    imgsrc = document.getElementById('imgsrc');
    
    if (localStorage.getItem("productos") == null){
        localStorage.setItem("productos", JSON.stringify(productos));
    }
    var arrproductos = JSON.parse(localStorage.getItem("productos"));
    //agrega las opciones al <select> de productos en la ventana agregar 
    for (let i = 0; i < arrproductos.length; i++) {
        var opcion = arrproductos[i].nombre;
        dProducto.innerHTML += "<option value='" + opcion + "'>" + opcion + "</option>";
    }
    imprimirProductos();
    verificarCantidadesActuales();
}

//CONSTRUCTOR DE PRODUCTOS
function constructorProductos(nombre, imagen, cantidad, precioUnitario, total, fechaCaducidad) {
    this.Nombre = nombre;
    this.Imagen = imagen;
    this.Cantidad = cantidad;
    this.Precio = precioUnitario;
    this.Total = total;
    this.Caducidad = fechaCaducidad;
    this.CantidadActual = cantidad;
}
//CONSTRUCTOR NUEVO ITEM
function constructorItem(item, img){
    this.nombre = item;
    this.img = img;
}
//OBJETOS DE PRODUCTOS ESPECIFICOS DENTRO DE ARREGLO
var productos = [
    { nombre: "Verde", img: "imagenes/verde.jpg" },
    { nombre: "Huevos", img: "imagenes/huevos.jpg" },
    { nombre: "Queso", img: "imagenes/queso.jfif" },
];


//AGREGAR PRODUCTOS
function agregarProducto() {
    var nombre = dProducto.value;
    var serie = dSerie.value;
    var cantidad = +dCantidad.value;
    var caducidad = dFechaDeCaducidad.value;
    var precio = Number(dPrecioUnitario.innerHTML);
    var total = +dCostoTotal.value;

    //busca y devuelve la src de la imagen del producto
    var i = -1;
    var img = "";
    var arrproductos = JSON.parse(localStorage.getItem("productos"));
    do {
        i++;
        img = arrproductos[i].img;
    }
    while (arrproductos[i].nombre != nombre);
    //construye un objeto del producto
    var productoAgregar = new constructorProductos(nombre, img, cantidad, precio, total, caducidad);
    localStorage.setItem(serie, JSON.stringify(productoAgregar));
    alert("Producto agregado exitosamente!");
    imprimirProductos();
    cerrarVentanaAgregar();
}

//ELIMINAR y ACTUALIZAR PRODUCTO
function eliminarProducto(clave) {
    if (confirm("Esta a punto de eliminar el producto, esta seguro?")){
        localStorage.removeItem(clave);
        imprimirProductos();
        cerrarVentanaDescripcion();
    }
}

//MODIFICAR PRODUCTO
function modificarProducto(clave) {
    var nuevaCantidad = cantidadActual.value;
    var valor = JSON.parse(localStorage.getItem(clave));
    valor.CantidadActual = nuevaCantidad;
    if (valor.CantidadActual <= 0){
        if (confirm("Esta a punto de eliminar el producto, esta seguro?")){
            localStorage.removeItem(clave);
            cerrarVentanaDescripcion();
            imprimirProductos();    
        }
    } else {
        localStorage.setItem(clave, JSON.stringify(valor));
        cerrarVentanaDescripcion();
        imprimirProductos();
    }
}

//IMPRIMIR DIVS DE PRODUCTOS
function imprimirProductos() {
    divProductosImprimir.innerHTML = "";
    for (let i = 0; i < localStorage.length; i++) {
        var clave = localStorage.key(i);
        if (clave != "productos"){
            var valor = localStorage.getItem(clave);
            var producto = JSON.parse(valor);
            divProductosImprimir.innerHTML += "<div class='productos' style='background-image:url(" +
                producto.Imagen + ")'><a onclick=\'desplegarVentanaDescripcion(\"" + clave + "\")\'><div class='tituloProductos'>" +
                producto.Nombre + "<span>" + producto.CantidadActual + "u</span>" + "</div></a></div>";
        }
    }
}

//INGRESAR NUEVO ITEM
function ingresarItem(){
    var itemValor = item.value;
    var imgsrcValor = imgsrc.value;
    var nuevoItem = new constructorItem(itemValor, imgsrcValor);
    var arrItems = JSON.parse(localStorage.getItem("productos"));
    arrItems.push(nuevoItem);
    localStorage.setItem("productos", JSON.stringify(arrItems));
    cerrarVentanaItem();
    //imprime nuevamente el select de productos
    dProducto.innerHTML = "";
    for (let i = 0; i < arrItems.length; i++) {
        var opcion = arrItems[i].nombre;
        dProducto.innerHTML += "<option value='" + opcion + "'>" + opcion + "</option>";
    }
}

//VERIFICAR CANTIDADES ACTUALES
function verificarCantidadesActuales(){
    var mensaje = "";
    var arrProductos = JSON.parse(localStorage.getItem("productos"));
    for (let i = 0; i<arrProductos.length; i++){ //recorre array de productos
        var nombre = arrProductos[i].nombre;
        var cantidadActual = 0;
        for (let j = 0; j<localStorage.length; j++){ //recorre localStorage
            let clave = localStorage.key(j);
            if (clave != "productos"){
                let valor = JSON.parse(localStorage.getItem(clave));
                if(valor.Nombre == nombre){
                    cantidadActual += +valor.CantidadActual;
                }
            }
        }
        if (cantidadActual <= 15  && cantidadActual > 0){
            if (cantidadActual == 1){
                mensaje += cantidadActual + " unidad restante de " + nombre + "\n";
            } else{
                mensaje += cantidadActual + " unidades restantes de " + nombre + "\n";
            }
        }
    }
    if (mensaje != ""){
        mensaje = "PRODUCTOS EN ESCASEZ!\n" + mensaje;
        alert(mensaje);
    }
}

//ABRIR Y CERRAR VENTANAS
//ABRIR Y CERRAR VENTANA DE AGREGAR PRODUCTO
function desplegarVentanaAgregar() {
    ventanaAgregar.style.display = "block";
    ventanaAgregar.style.animation = "desplegarVentana 0.7s";
}
function cerrarVentanaAgregar() {
    dCantidad.value = "";
    dCostoTotal.value = "";
    dSerie.value = "";
    dPrecioUnitario.innerHTML = "";
    ventanaAgregar.style.animation = "cerrarVentana 0.7s forwards";
}

function actualizarPrecioUnitario() {
    var cantidad = dCantidad.value;
    var costoTotal = dCostoTotal.value;
    var precioUnitario = costoTotal / cantidad;
    dPrecioUnitario.innerHTML = precioUnitario.toFixed(2);
}

//ABRIR Y CERRAR VENTANA DE DESCRIPCION DE CADA PRODUCTO
function desplegarVentanaDescripcion(clave) {
    ventanaDescripcion.style.display = "block";
    ventanaDescripcion.style.animation = "desplegarVentana 0.7s";
    //recupera el objeto del producto
    var producto = localStorage.getItem(clave);
    producto = JSON.parse(producto);
    //informacion que se imprime
    infoProducto.innerHTML = producto.Nombre;
    infoSerie.innerHTML = clave;
    infoCantidad.innerHTML = producto.Cantidad;
    infoCostoTotal.innerHTML = producto.Total;
    infoPrecioUnitario.innerHTML = producto.Precio;
    infoFechaDeCaducidad.innerHTML = producto.Caducidad;
    cantidadActual.value = producto.CantidadActual;
    //agrega un onclick al boton eliminar y modificar para poder pasar el parametro clave
    document.getElementById('botonEliminar').setAttribute("onClick", "eliminarProducto('" + clave + "')");
    botonGuardarCambios.setAttribute("onClick", "modificarProducto('" + clave + "')");
}
function cerrarVentanaDescripcion() {
    ventanaDescripcion.style.animation = "cerrarVentana 0.7s forwards";
    botonGuardarCambios.style.display = "none";
}
//ventana item
function desplegarVentanaItem() {
    ventanaItem.style.display = "block";
    ventanaItem.style.animation = "desplegarVentana 0.7s";
}
function cerrarVentanaItem() {
    item.value = "";
    imgsrc.value = "";
    ventanaItem.style.animation = "cerrarVentana 0.7s forwards";
}
function mostrarGuardarCambios() { botonGuardarCambios.style.display = "block"; }