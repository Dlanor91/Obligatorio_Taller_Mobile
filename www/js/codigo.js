/* Variables Globales */
/* Menu */
let route = document.querySelector("#routerMenu") /* Creo variable que adquiere los parametro del menu */
route.addEventListener("ionRouteWillChange",navegacionMenu); /* Detecto el cambio de evento */
let usuarioNoLogueado = false; /* Para saber si esta registrado o no un usuario */

/* Variables Para Funciones */
let distanciaEnvios;
let precioEnvios;
let totalPrecioEnvios = 0;

/* Para todos los mapas a mostrar */
let map;
let latitudCiudadOrigen;
let longitudCiudadOrigen;
let latitudCiudadDestino;
let longitudCiudadDestino;
let nombreDeCategoria;

/* Para la geolocalizacion */
let latitudUsuarioLogueado;
let longitudUsuarioLogueado;
let distanciaMinimaCiudad;

/* Banderas para mapas activos  */
let flagCalcularEnvio = false;
let flagAgregarEnvio = false;
let flagDetalleEnvio = false;
let flagCiudadCercana = false;

/* Arreglo de Top5 */
let ciudadesCantidad = [];
let departamentosCantidad = [];

/* Menú Cambiar de Pestannas*/
document.querySelector("#routerMenu").addEventListener("ionRouteWillChange", navegacionMenu)

function navegacionMenu(event) {
    let paginaMenu = document.querySelectorAll(".paginaMenu"); /* Aqui se llaman todas las paginas de mi sitio */
    //console.log(event)
    for (i = 0; i < paginaMenu.length; i++) {
        paginaMenu[i].style.display = "none";
    }
    let paginaActiva = event.detail.to;    

    /* Validacion para Mostrar elementos sin registrar */    
    if (localStorage.length === 0) {
        /* No se muestran los enlaces en el menu de las paginas que precisan estar registrados */
        let elementoMenuNoMostrar = document.querySelectorAll(".usuarioNoRegistrado");
        for (i = 0; i < elementoMenuNoMostrar.length; i++) {
            elementoMenuNoMostrar[i].style.display = "none";
        }

        /* Se muestran los enlaces en el menu de las paginas que no se precisa estar registrado */
        let elementoMenuMostrar = document.querySelectorAll(".usuarioRegistrado");
        for (i = 0; i < elementoMenuMostrar.length; i++) {
            elementoMenuMostrar[i].style.display = "block";
        }

        if (paginaActiva === "/") {
            document.querySelector("#pRegistro").style.display = "block";
        } else if (paginaActiva === "/Login") {
           
            document.querySelector("#pLogin").style.display = "block";
        }
    }    

    if (localStorage.getItem("token")) {
         /* Mantengo pagina por si mi token esta activo */
     if (!usuarioNoLogueado) {
        /* Cargo estadisticas */
        paginaActiva = "/Estadisticas";
        usuarioNoLogueado = true;
    }

        /* No se muestran los enlaces en el menu de las paginas que precisan estar registrados */
        let elementoMenuNoMostrar = document.querySelectorAll(".usuarioRegistrado");
        for (i = 0; i < elementoMenuNoMostrar.length; i++) {
            elementoMenuNoMostrar[i].style.display = "none";
        }

        /* Se muestran los enlaces en el menu de las paginas que no se precisa estar registrado */
        let elementoMenuMostrar = document.querySelectorAll(".usuarioNoRegistrado");
        for (i = 0; i < elementoMenuMostrar.length; i++) {
            elementoMenuMostrar[i].style.display = "block";
        }
        
        if (paginaActiva === "/CalcularEnvios") {  
            
            document.querySelector("#pCalcularEnvios").style.display = "block";
            document.querySelector(".bloqueCiudadOrigenCE").style.display = "none";
            document.querySelector(".bloqueCiudadDestinoCE").style.display = "none";
            document.querySelector(".mostrarDepartamentoOrigenCE").innerHTML ="";                    
            document.querySelector(".mostrarDepartamentoDestinoCE").innerHTML = "" ;               
                               
            mostrarDepartamentos();  

        } else if (paginaActiva === "/AgregarEnvios") {
            
            document.querySelector("#pAgregarEnvios").style.display = "block"; 
            document.querySelector(".bloqueCiudadOrigenAE").style.display = "none";
            document.querySelector(".bloqueCiudadDestinoAE").style.display = "none";   
            document.querySelector(".mostrarDepartamentoOrigenAE").innerHTML ="";                       
            document.querySelector(".mostrarDepartamentoDestinoAE").innerHTML = "" ; 
                                  
            mostrarDepartamentos();      
            mostrarCategorias() ;/* Muestro las electrodomesticos */

        } else if (paginaActiva === "/Envios") {

            document.querySelector("#pEnvios").style.display = "block"; 
            setTimeout(mostrarEnvio,2000); 

        }else if (paginaActiva === "/Detalle-Envios") {
            
            document.querySelector("#pDetalleEnvios").style.display = "block";
            
        }else if (paginaActiva === "/Estadisticas") {

            document.querySelector("#pEstadisticas").style.display = "block";
            precioTotalEnvios();
            setTimeout(contarCiudades,1500);
            setTimeout(buscarDepartamento,1500);
            
        } else if (paginaActiva === "/CiudadCercana") {

            mostrarCiudadCercana();

            document.querySelector("#pCiudadCercana").style.display = "block";

        } else if (paginaActiva === "/CerrarSesion") {

            localStorage.clear(); //elimina todos las claves del localStorage 
            usuarioNoLogueado = false;
            route.push("/Login")   /* Envia a pagina de Login */        
        }
    }
}

/* Menu cerrar menu */
let menu = document.querySelector("#menu");

function cerrarMenu() {
    menu.close();       //permite cerrar el menu
}

function cambiarEnlace() {
    menu.click();       //permite cerrar el menu
}

/* Funcion Registro */
document.querySelector("#btnRegistro").addEventListener("click", regsitroUsuario);

function regsitroUsuario() {
    let userRegister = document.querySelector("#userRegister").value.trim();
    let paswRegister = document.querySelector("#paswRegister").value.trim();

    /* Creo mi arreglo de datos para pasar al sistema */
    let datosIngresados = {
        "usuario": userRegister, /* el de "" es el de el post y el otro la variable q le igualo */
        "password": paswRegister
    }

    /* Validacion de JS */
    try {
        if (userRegister === "") {
            throw new Error("Complete el campo de Usuario.");
        }
        if (paswRegister === "") {
            throw new Error("Complete el campo de Contraseña.");
        }

        fetch("https://envios.develotion.com/usuarios.php",
            {
                method: "POST",
                body: JSON.stringify(datosIngresados), /* Aqui paso el arreglo de datos para el post */
                headers: {
                    "content-type": "application/json"
                }
            })
            .then(function (response) {

                if (response.status === 409) {
                    throw new Error("Usuario existente, registrese con otro nombre de usuario.");
                }
                if (response.status != 200) {
                    throw new Error("Ingrese los datos correctamente.");
                }
                return response.json();
            })
            .then(function (data) {
                //console.log(data); 
                document.querySelector("#userRegister").value = "";
                document.querySelector("#paswRegister").value = "";
                let registroExitoso = "Usuario registrado correctamente.";
                registroCorrecto(registroExitoso);
            })
            .catch(function (Error) {
                handleButtonClick(Error);
            })

    } catch (error) {
        handleButtonClick(error);
    }
}

/* Funcion Iniciar Sesion */
document.querySelector("#btnLogin").addEventListener("click", loginUsuario);

function loginUsuario() {
    let userLogin = document.querySelector("#userLogin").value.trim();
    let paswLogin = document.querySelector("#paswLogin").value.trim();

    let datosLogin = {
        "usuario": userLogin,
        "password": paswLogin
    }

    try {
        if (userLogin === "") {
            throw new Error("Complete el campo de Usuario.");
        }
        if (paswLogin === "") {
            throw new Error("Complete el campo de Contraseña.");
        }

        fetch("https://envios.develotion.com/login.php",
            {
                method: "POST",
                body: JSON.stringify(datosLogin),
                headers: {
                    "content-type": "application/json"
                }
            })
            .then(function (response) {

                if (response.status === 409) {
                    throw new Error("Usuario y/o contraseña incorrectos.");
                }
                if (response.status != 200) {
                    throw new Error("Ingrese los datos correctamente.");
                }
                return response.json();
            })
            .then(function (data) {
                //console.log(data); 
                /* Limpio los campos inputs */
                document.querySelector("#userLogin").value = "";
                document.querySelector("#paswLogin").value = "";
                /* Almaceno el valor del token en una variable */
                localStorage.setItem("token", data.apiKey);
                /* Almacenamos el ID en el local storage */
                localStorage.setItem("id",data.id)
                /* Oculto el login y muestro una página de estadisticas */
                route.push("/Estadisticas");

            })
            .catch(function (Error) {
                handleButtonClick(Error);
            })

    } catch (error) {

        handleButtonClick(error);
    }
}

/* Function Calcular Envios */
document.querySelector("#btnCalcularEnvios").addEventListener("click", calcularEnvios)

function calcularEnvios(){
   
    let pEnvios = document.querySelector("#mostrarCalculoEnvio");
    let pDetalleEnvio = document.querySelector("#detalleEnvios");  
    let pAgregarEnvios = document.querySelector("#mostrarAgregarEnvios");  
    let mostrarCiudadCercanaUsuario = document.querySelector("#mostrarCiudadCercanaUsuario");
    let departamentoOrigen = Number(document.querySelector(".mostrarDepartamentoOrigenCE").value);    
    let departamentoDestino = Number(document.querySelector(".mostrarDepartamentoDestinoCE").value);
    let ciudadOrigen = Number(document.querySelector(".mostrarCiudadOrigenCE").value);    
    let ciudadDestino = Number(document.querySelector(".mostrarCiudadDestinoCE").value);  
    

    try {
        if (departamentoOrigen === "" || isNaN(departamentoOrigen) ) {
            throw new Error("Seleccione un Departamento Origen.");
        }
        if (ciudadOrigen === 0 || isNaN(ciudadOrigen)) {
            throw new Error("Seleccione una Ciudad Origen.");
        }
        if (departamentoDestino === "" || isNaN(departamentoDestino) ) {
            throw new Error("Seleccione un Departamento Destino.");
        }        
        if (ciudadDestino === 0 || isNaN(ciudadDestino) ) {
            throw new Error("Seleccione una Ciudad Destino.");
        }
         
        let mapa = document.querySelector("#map");
        /* Creo el div de mapa */
        if(map!=null && !flagCalcularEnvio){
            
            if(flagAgregarEnvio){

                pAgregarEnvios.removeChild(mapa);
                flagAgregarEnvio = false;

           }else if(flagDetalleEnvio){

                pDetalleEnvio.removeChild(mapa);
                flagDetalleEnvio = false;

           }else if(flagCiudadCercana){

                mostrarCiudadCercanaUsuario.removeChild(mapa);
                flagCiudadCercana = false
           }
        }else if(flagCalcularEnvio){ 
            let parrafoCreado = document.querySelector("#distanciaEnvios");                     
            pEnvios.removeChild(mapa); 
            if (parrafoCreado!=null) {
                parrafoCreado.remove();
            }  
        }

        let divMapa = document.createElement("div");
        divMapa.style.height = "200px";
        divMapa.setAttribute("id","map");
        pEnvios.appendChild(divMapa);
        flagCalcularEnvio = true;

        mostrarCiudades(ciudadOrigen,ciudadDestino); /* Invoco las APIs de Latitud y Longitud */
        setTimeout(function () { let itemLabel = document.createElement("ion-label");
        let parrafo = document.createElement("p");
        parrafo.setAttribute("id","distanciaEnvios")
        let texto = document.createTextNode("La distancia entre ciudades es de: " + distanciaEnvios.toFixed(2) + " kms.");
        parrafo.appendChild(texto);
        itemLabel.appendChild(parrafo);        

        document.querySelector("#mostrarCalculoEnvio").appendChild(itemLabel);}, 2500);
             
    } catch (Error) {
        handleButtonClick(Error);
    }
}

/* Function Agregar Envios */
document.querySelector("#btnAgregarEnvios").addEventListener("click", agregarEnvios)

function agregarEnvios(){
    let departamentoOrigen = Number(document.querySelector(".mostrarDepartamentoOrigenAE").value);    
    let departamentoDestino = Number(document.querySelector(".mostrarDepartamentoDestinoAE").value);
    let ciudadOrigen = Number(document.querySelector(".mostrarCiudadOrigenAE").value);    
    let ciudadDestino = Number(document.querySelector(".mostrarCiudadDestinoAE").value);    
    let mostrarCategorias  = document.querySelector("#mostrarCategorias").value;
    let pesoEnvio = Number(document.querySelector("#pesoEnvio").value);   
    let pEnvios = document.querySelector("#mostrarCalculoEnvio");    
    let pDetalleEnvio = document.querySelector("#detalleEnvios");  
    let pAgregarEnvios = document.querySelector("#mostrarAgregarEnvios");  
    let mostrarCiudadCercanaUsuario = document.querySelector("#mostrarCiudadCercanaUsuario");
    
    try {
        if (departamentoOrigen === "" || isNaN(departamentoOrigen) ) {
            throw new Error("Seleccione un Departamento Origen.");
        }
        if (ciudadOrigen === 0 || isNaN(ciudadOrigen)) {
            throw new Error("Seleccione una Ciudad Origen.");
        }
        if (departamentoDestino === "" || isNaN(departamentoDestino) ) {
            throw new Error("Seleccione un Departamento Destino.");
        }        
        if (ciudadDestino === 0 || isNaN(ciudadDestino) ) {
            throw new Error("Seleccione una Ciudad Destino.");
        }
        if (mostrarCategorias === 0 || isNaN(mostrarCategorias) ) {
            throw new Error("Seleccione una Categoría.");
        }
        if (pesoEnvio <=0 || isNaN(pesoEnvio) ) {
            throw new Error("Seleccione un Peso y que sea numérico y mayor que 0.");
        }
        
        /* Invoco las APIs de Latitud y Longitud */
         /* Creo el div de mapa */
         let mapa = document.querySelector("#map");
         if(map!=null && !flagAgregarEnvio){
             
             if(flagCalcularEnvio){
                pEnvios.removeChild(mapa);
                flagCalcularEnvio = false;
            }else if(flagDetalleEnvio){

                pDetalleEnvio.removeChild(mapa);
                flagDetalleEnvio = false;
            }else if(flagCiudadCercana){

                mostrarCiudadCercanaUsuario.removeChild(mapa)
                flagCiudadCercana = false
           }
         }else if(flagAgregarEnvio){ 
            let parrafoCreado = document.querySelector("#distanciaAgregarEnvios");                     
            pAgregarEnvios.removeChild(mapa); 
            if (parrafoCreado!=null) {
                parrafoCreado.remove();
            }  
        }
         
         let divMapa = document.createElement("div");
         divMapa.style.height = "200px";
         divMapa.setAttribute("id","map");
         pAgregarEnvios.appendChild(divMapa);
         flagAgregarEnvio = true

        mostrarCiudades(ciudadOrigen,ciudadDestino);
        
        setTimeout(function () { 
            let distancia = 0;
            distancia = distanciaEnvios/100;
            distancia = Math.ceil(distancia);
            let precio = 0;
            precio = (50 + (pesoEnvio*10) + (50*distancia));
            precio = precio.toFixed(2);  
            precioEnvios = precio;          
            agregarEnvio(ciudadOrigen,ciudadDestino,pesoEnvio,distanciaEnvios,precio,mostrarCategorias);//funciona que llama la api de almacenar
        }, 2500);
              
        
            let itemLabel2 = document.createElement("ion-label");
            let parrafo = document.createElement("p");
            parrafo.setAttribute("id","distanciaAgregarEnvios")            
            setTimeout(function () { 
            texto = document.createTextNode("El precio del envío es de: $" + precioEnvios);
            parrafo.appendChild(texto);
            itemLabel2.appendChild(parrafo);
            document.querySelector("#mostrarAgregarEnvios").appendChild(itemLabel2); }, 2500);

        
    } 
    
    catch (Error) {
        handleButtonClick(Error);
    }
}

/* Funcion Retornar en detalles */
document.querySelector("#volverDetalle").addEventListener("click", VolveraPaginaDetalles);
function VolveraPaginaDetalles() {
    route.back();
}

/* Funcion mostrar ciudad mas cercana */

function mostrarCiudadCercana(){

    /* Datos de Mi posicion actual que me proveen las mismas api siempre que mi navegador lo tenga activo*/
navigator.geolocation.getCurrentPosition(GuardarPosicionUsuario, MostrarErrorUbicacion);

    function GuardarPosicionUsuario(positionActual) {       
        latitudUsuarioLogueado = positionActual.coords.latitude;
        longitudUsuarioLogueado = positionActual.coords.longitude;
        mostrarCiudadCercanaMapa(latitudUsuarioLogueado,longitudUsuarioLogueado);
    }
    function MostrarErrorUbicacion(error) {        
        if(error){
            let errorMostrar = "Active su Geo Localización";
            registroCorrecto(errorMostrar);
            route.push("/Estadisticas");
        }  
    }
}

/* Mostrar Top 5 Ciudades con mas envios */
document.querySelector("#btnTop5").addEventListener("click",mostrarTop5)
function mostrarTop5() {    
    let totalEnviosDepartamento = 0
    let buscarDepartamentoContar = false;
    
    departamentosCantidad=[];
    if(ciudadesCantidad.length===0){
        document.querySelector("#top5Mostrar").innerHTML = `<ion-label>No tiene envios para mostrar datos.</ion-label>`;
    }else{
        document.querySelector("#top5Mostrar").innerHTML = "";
        for (let i = 0; i<ciudadesCantidad.length; i++) {
            const unDepartamento = ciudadesCantidad[i];        
            totalEnviosDepartamento = unDepartamento.cant;
            buscarDepartamentoContar = false;

            for (let k = 0; k < departamentosCantidad.length; k++) {
                const unDepartamentoExistente = departamentosCantidad[k];
                if (unDepartamento.idDepartamento === unDepartamentoExistente.idDepartamento) {
                    buscarDepartamentoContar = true;
                    break;
                }
            }
        
            if (!buscarDepartamentoContar) {
                for (let j = i+1; j < ciudadesCantidad.length; j++) {
                    const undepartamentoBuscado = ciudadesCantidad[j];
                    if (unDepartamento.idDepartamento === undepartamentoBuscado.idDepartamento) {
                        totalEnviosDepartamento += undepartamentoBuscado.cant;                                          
                    }
                
                }
                departamentosCantidad.push({idDepartamento: unDepartamento.idDepartamento, nombre: "", totalEnviosDepartamento})
            }  
            
        }    

        /* Ordeno los envios*/
       departamentosCantidad.sort(ordenarElementos);
       buscarDepartamentoNombre()

       setTimeout(function (params) {
         /* Muestro los 5 más enviados */ 
         let mostrar = `<ion-list-header>Top 5</ion-list-header>`;
         let control = 0;
         let maximo;
         if (departamentosCantidad.length>5) {
             maximo = 5;
         }else{
            maximo = departamentosCantidad.length;
         }
         //Inserto el nombre del departamento.        
         while(control<maximo){
            mostrar+=`                
            <ion-item>
                <ion-label>${departamentosCantidad[control].nombre}</ion-label>
                <ion-note slot="end" color="dark">${departamentosCantidad[control].totalEnviosDepartamento}</ion-note>                    
            </ion-item>`
            control++;
        }
            
        document.querySelector("#top5Mostrar").innerHTML = mostrar;  
        },2000)

    }
           
}

/* Ordeno los envios */
function ordenarElementos(a, b) {
    if (a.totalEnviosDepartamento < b.totalEnviosDepartamento) {
      return 1;
    }
    if (a.totalEnviosDepartamento > b.totalEnviosDepartamento) {
      return -1;
    }
    // a must be equal to b
    return 0;
} 

/* APIs */

/* API Mostrar Ciudad */
function mostrarCiudades(idCiudadOrigen,idCiudadDestino){
    fetch(`https://envios.develotion.com/ciudades.php`,
    {
        headers: {
            apiKey: localStorage.getItem("token")
        }
    })
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {  
        let ciudadOrigenEnc = false;
        let ciudadDestinoEnc = false;          
        for(let i=0; i<data.ciudades.length; i++){
            const ciudadBusc = data.ciudades[i];
            if(idCiudadOrigen === ciudadBusc.id){                    
                latitudCiudadOrigen = ciudadBusc.latitud;
                longitudCiudadOrigen = ciudadBusc.longitud;
                ciudadOrigenEnc = true;
            }

            if(idCiudadDestino === ciudadBusc.id){                    
                latitudCiudadDestino = ciudadBusc.latitud;
                longitudCiudadDestino = ciudadBusc.longitud;
                ciudadDestinoEnc = true;
            }
            if (ciudadOrigenEnc && ciudadDestinoEnc) {
               break;
            }
        }
            
        
        if (map != null) {
            map.remove();
        }
            map = L.map('map').setView([latitudCiudadDestino, longitudCiudadDestino], 12);
                
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);   

        L.marker([latitudCiudadOrigen, longitudCiudadOrigen]).addTo(map)
        .bindPopup('Ciudad Origen')
        .openPopup();  
        
        L.marker([latitudCiudadDestino, longitudCiudadDestino]).addTo(map)
        .bindPopup('Ciudad Destino')
        .openPopup(); 

        
        distanciaEnvios = map.distance([latitudCiudadOrigen, longitudCiudadOrigen], [latitudCiudadDestino, longitudCiudadDestino]);
    
        /* LLevo a KMs */
        distanciaEnvios  /= 1000;        
        
    })
    .catch(function (error) {
        handleButtonClick(error);
    })   
    
}

/* API Mostrar Ciudad mas Cercana */
function mostrarCiudadCercanaMapa(latUsuario,longUsuario){
    let mostrarCiudadCercanaUsuario = document.querySelector("#mostrarCiudadCercanaUsuario");
    let pEnvios = document.querySelector("#mostrarCalculoEnvio");
    let pDetalleEnvio = document.querySelector("#detalleEnvios");  
    let pAgregarEnvios = document.querySelector("#mostrarAgregarEnvios");
    distanciaMinimaCiudad = Number.POSITIVE_INFINITY; /* Inicializa en un numero positivo infinito */
    let latCiudadCercana;
    let longCiudadCercana;
    let distanciaCiudadCercana;

   fetch(`https://envios.develotion.com/ciudades.php`,
    {
        headers: {
            apiKey: localStorage.getItem("token")
        }
    })
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        
        if(map!=null && !flagCiudadCercana){
            let mapa = document.querySelector("#map");
            if(flagAgregarEnvio){

                pAgregarEnvios.removeChild(mapa);
                flagAgregarEnvio = false;

           }else if(flagDetalleEnvio){

                pDetalleEnvio.removeChild(mapa);
                flagDetalleEnvio = false;

           }else if(flagCalcularEnvio){

                pEnvios.removeChild(mapa)
                flagCalcularEnvio = false
           }
        }else if(flagCiudadCercana){ 
            let parrafoCreado = document.querySelector("#ciudadCercana");                     
            mostrarCiudadCercanaUsuario.removeChild(mapa); 
            if (parrafoCreado!=null) {
                parrafoCreado.remove();
            } 
        }

        let divMapa = document.createElement("div");
        divMapa.style.height = "200px";
        divMapa.setAttribute("id","map");
        mostrarCiudadCercanaUsuario.appendChild(divMapa);
        flagCiudadCercana = true;

        map = L.map('map').setView([latUsuario, longUsuario], 13);
                  
        for(let i=0; i<data.ciudades.length; i++){
            const ciudadCercana = data.ciudades[i];

            distanciaCiudadCercana = map.distance([latUsuario, longUsuario], [ciudadCercana.latitud, ciudadCercana.longitud]);
            if(distanciaCiudadCercana<distanciaMinimaCiudad){

                distanciaMinimaCiudad = distanciaCiudadCercana;
                latCiudadCercana = ciudadCercana.latitud;
                longCiudadCercana = ciudadCercana.longitud;                
            }
        }
                                    
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);   

        L.marker([latUsuario, longUsuario]).addTo(map)
        .bindPopup('Mi posición.')
        .openPopup(); 

        L.marker([latCiudadCercana, longCiudadCercana]).addTo(map)
        .bindPopup('Ciudad mas cercana')
        .openPopup();

        let itemLabel2 = document.createElement("ion-label");
        let parrafo = document.createElement("p");
        parrafo.setAttribute("id","ciudadCercana")            
        setTimeout(function () { 
        distanciaMinimaCiudad /=1000;
        texto = document.createTextNode("La distancia a la ciudad más cercana es de: " + distanciaMinimaCiudad.toFixed(2) + " kms.");
        parrafo.appendChild(texto);
        itemLabel2.appendChild(parrafo);
        document.querySelector("#mostrarCiudadCercanaUsuario").appendChild(itemLabel2); }, 2500);
        
    })
    .catch(function (error) {
        handleButtonClick(error);
    })   
     
}


/* Api Departamentos */
function mostrarDepartamentos(){
    
    fetch("https://envios.develotion.com/departamentos.php",
        {
            headers: {
                apiKey: localStorage.getItem("token")
            }

        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            //console.log(data)        
            data.departamentos.forEach(function (element) {
                document.querySelector(".mostrarDepartamentoOrigenCE").innerHTML += `<ion-select-option value="${element.id}">${element.nombre}</ion-select-option>`
                document.querySelector(".mostrarDepartamentoDestinoCE").innerHTML += `<ion-select-option value="${element.id}">${element.nombre}</ion-select-option>`
                document.querySelector(".mostrarDepartamentoOrigenAE").innerHTML += `<ion-select-option value="${element.id}">${element.nombre}</ion-select-option>`
                document.querySelector(".mostrarDepartamentoDestinoAE").innerHTML += `<ion-select-option value="${element.id}">${element.nombre}</ion-select-option>`
            });
           
        })
        .catch(function (error) {
            handleButtonClick(error);
        })

}

/* Api Ciudad Origen Calcular Envios*/

document.querySelector(".mostrarDepartamentoOrigenCE").addEventListener("ionChange", mostrarCiudadPorDepartamentosOrigenCE)

function mostrarCiudadPorDepartamentosOrigenCE() {
    
    document.querySelector(".bloqueCiudadOrigenCE").style.display = "block";
    document.querySelector(".mostrarCiudadOrigenCE").value="";
    document.querySelector(".mostrarCiudadOrigenCE").innerHTML=""; 
    
    let departamentoOrigenCE = document.querySelector(".mostrarDepartamentoOrigenCE").value;    

    fetch(`https://envios.develotion.com/ciudades.php?idDepartamento=${departamentoOrigenCE}`,
        {
            headers: {
                apiKey: localStorage.getItem("token")
            }
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            //console.log(data)        
            data.ciudades.forEach(function (element) {
                document.querySelector(".mostrarCiudadOrigenCE").innerHTML += `<ion-select-option value="${element.id}">${element.nombre}</ion-select-option>`
            });
        })
        .catch(function (error) {
            handleButtonClick(error);
        })
}

/* Api Ciudad Destino Calcular Envios*/

document.querySelector(".mostrarDepartamentoDestinoCE").addEventListener("ionChange", mostrarCiudadPorDepartamentosDestinoCE)

function mostrarCiudadPorDepartamentosDestinoCE() {
    
    document.querySelector(".bloqueCiudadDestinoCE").style.display = "block";
    document.querySelector(".mostrarCiudadDestinoCE").value="";
    document.querySelector(".mostrarCiudadDestinoCE").innerHTML="";
    let departamentoDestinoCE = document.querySelector(".mostrarDepartamentoDestinoCE").value;
    fetch(`https://envios.develotion.com/ciudades.php?idDepartamento=${departamentoDestinoCE}`,
        {
            headers: {
                apiKey: localStorage.getItem("token")
            }
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            //console.log(data)        
            data.ciudades.forEach(function (element) {
                document.querySelector(".mostrarCiudadDestinoCE").innerHTML += `<ion-select-option value="${element.id}">${element.nombre}</ion-select-option>`
            });
        })
        .catch(function (error) {
            handleButtonClick(error);
        })
}

/* Api Ciudad Origen Agregar Envios*/

document.querySelector(".mostrarDepartamentoOrigenAE").addEventListener("ionChange", mostrarCiudadPorDepartamentosOrigenAE)

function mostrarCiudadPorDepartamentosOrigenAE() {
    
    document.querySelector(".bloqueCiudadOrigenAE").style.display = "block";
    document.querySelector(".mostrarCiudadOrigenAE").value="";
    document.querySelector(".mostrarCiudadOrigenAE").innerHTML=""; 
    
    let departamentoOrigenAE = document.querySelector(".mostrarDepartamentoOrigenAE").value;    

    fetch(`https://envios.develotion.com/ciudades.php?idDepartamento=${departamentoOrigenAE}`,
        {
            headers: {
                apiKey: localStorage.getItem("token")
            }
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            //console.log(data)        
            data.ciudades.forEach(function (element) {
                document.querySelector(".mostrarCiudadOrigenAE").innerHTML += `<ion-select-option value="${element.id}">${element.nombre}</ion-select-option>`
            });
        })
        .catch(function (error) {
            handleButtonClick(error);
        })
}

/* Api Ciudad Destino Agregar Envios*/

document.querySelector(".mostrarDepartamentoDestinoAE").addEventListener("ionChange", mostrarCiudadPorDepartamentosDestinoAE)

function mostrarCiudadPorDepartamentosDestinoAE() {
    
    document.querySelector(".bloqueCiudadDestinoAE").style.display = "block";
    document.querySelector(".mostrarCiudadDestinoAE").value="";
    document.querySelector(".mostrarCiudadDestinoAE").innerHTML="";
    let departamentoDestinoAE = document.querySelector(".mostrarDepartamentoDestinoAE").value;
    fetch(`https://envios.develotion.com/ciudades.php?idDepartamento=${departamentoDestinoAE}`,
        {
            headers: {
                apiKey: localStorage.getItem("token")
            }
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            //console.log(data)        
            data.ciudades.forEach(function (element) {
                document.querySelector(".mostrarCiudadDestinoAE").innerHTML += `<ion-select-option value="${element.id}">${element.nombre}</ion-select-option>`
            });
        })
        .catch(function (error) {
            handleButtonClick(error);
        })
}

/* Api Electrodomesticos */

function mostrarCategorias() {

    fetch("https://envios.develotion.com/categorias.php",
        {
            headers: {
                apiKey: localStorage.getItem("token")
            }

        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            //console.log(data)        
            data.categorias.forEach(function (element) {
                document.querySelector("#mostrarCategorias").innerHTML += `<ion-select-option value="${element.id}">${element.nombre}</ion-select-option>`
            });
        })
        .catch(function (error) {
            handleButtonClick(error);
        })

}

/* Api Agregar un Envio */

function agregarEnvio(idCiudadOrigen,idCiudadDestino,peso,distancia,precio,idCategoria){

    let datosAgregarEnvio = {
        "idUsuario": localStorage.getItem("id"),
        "idCiudadOrigen": idCiudadOrigen,
        "idCiudadDestino": idCiudadDestino,
        "peso": peso,
        "distancia": distancia,
        "precio": precio,
        "idCategoria": idCategoria
    }

    fetch("https://envios.develotion.com/envios.php",
        {
            
           method: "POST",
           body: JSON.stringify(datosAgregarEnvio),
           headers: {
            apiKey: localStorage.getItem("token")
        }

        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            let envioIngresado = `Envio registrado correctamente.`;
            registroCorrecto(envioIngresado)
           
        })
        .catch(function (error) {
            handleButtonClick(error);
        })
}



/* Api Obtener Nombre Categoria */

function mostrarNombreCategoria(idCategoria){
    fetch("https://envios.develotion.com/categorias.php",
        {
            headers: {
                apiKey: localStorage.getItem("token")
            }

        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            for (let i = 0; i < data.categorias.length; i++) {
                const idEncontrado = data.categorias[i];
                if (idCategoria ===  idEncontrado.id) {
                    nombreDeCategoria =  idEncontrado.nombre;
                    break;
                }
            }     
           
        })
        .catch(function (error) {
            handleButtonClick(error);
        })
}

/* Api Listar Envios */
 
function mostrarEnvio() {
    let idDeUsuario = localStorage.getItem("id");
    document.querySelector("#pListarEnvios").innerHTML = "";
    fetch(`https://envios.develotion.com/envios.php?idUsuario=${idDeUsuario}`, 
    {
        headers: {
            apiKey: localStorage.getItem("token")
        }
    })
        .then(function (response) {
            if(response.status !=200){
                throw new error("Datos mal Ingresado")
            }
            return response.json();
        })
        .then(function (data) {
            if (data.envios.length === 0) {
                document.querySelector("#pListarEnvios").innerHTML = "Usted no tiene ningún envío realizado.";
            }else{      
                let idCiudad = 0;
                let idCiudadOrig;    
                let idCiudadDest;                       
                data.envios.forEach(function (element) {
                    idCiudad++;
                    idCiudadOrig = "CO"+idCiudad;
                    idCiudadDest = "CD"+idCiudad; 
                    mostrarCiudadDetalles(element.ciudad_origen,idCiudadOrig,element.ciudad_destino,idCiudadDest);
                    document.querySelector("#pListarEnvios").innerHTML += `
                        <ion-list>
                        <ion-item>
                            <ion-label>Envío: ${idCiudad}</ion-label>
                        </ion-item>
                        <ion-item>
                            <ion-label class="${idCiudadOrig}"></ion-label>
                        </ion-item>
                        <ion-item>
                            <ion-label class=${idCiudadDest}></ion-label>
                        </ion-item>
                        <ion-item>
                            <ion-label>Distancia: ${element.distancia} kms</ion-label>
                        </ion-item>                        
                        <ion-item>
                            <ion-label>Precio: $${element.precio}</ion-label>
                        </ion-item>
                        </ion-list>                        
                        <ion-button color="medium" onclick="btnDetalleEnvio(${element.id})">
                        <ion-icon name="reader-outline" slot="start"></ion-icon>Detalle
                        </ion-button>
                        <ion-button color="medium" onclick="btnEliminarEnvio(${element.id})">
                        <ion-icon name="trash-outline" slot="start"></ion-icon> Eliminar
                        </ion-button>
                          `
                })
                
            }           
        })
        .catch(function (error) {
            handleButtonClick(error);
        })
}

/* Api para mostrar Detalle de un envio */
function btnDetalleEnvio(idDeEnvio){
    let idDeUsuario = localStorage.getItem("id");
    let idCiudadOrigen;
    let idCiudadDestino;
    document.querySelector("#detalleEnvios").innerHTML = "";
    fetch(`https://envios.develotion.com/envios.php?idUsuario=${idDeUsuario}`, {
        headers: {
            apiKey: localStorage.getItem("token")
        }
    })
    .then(function (response) {
        return response.json();
    })
    .then(function (data){
        let idCiudad = 0;
        let idCiudadOrig;
        let idCiudadDest;
        for (let i = 0; i < data.envios.length; i++) {
            const idBusc = data.envios[i];
            if (idDeEnvio === idBusc.id) {
                idCiudad++;
                idCiudadOrig = "COD"+idCiudad;
                idCiudadDest = "CDD"+idCiudad;
                /* Capturo los Id de ciudades para mostrar */
                idCiudadOrigen = idBusc.ciudad_origen
                idCiudadDestino = idBusc.ciudad_destino 
                mostrarNombreCategoria(idBusc.id_categoria);                
                setTimeout(function () {
                    mostrarCiudadDetalles(idBusc.ciudad_origen,idCiudadOrig,idBusc.ciudad_destino,idCiudadDest);
                    document.querySelector("#detalleEnvios").innerHTML += `
                    <ion-list>
                    <ion-item>
                        <ion-label class="${idCiudadOrig}"></ion-label>
                    </ion-item>
                    <ion-item>
                        <ion-label class=${idCiudadDest}></ion-label>
                    </ion-item>
                    <ion-item>
                        <ion-label>Peso: ${idBusc.peso} kgs</ion-label>
                    </ion-item>
                    <ion-item>
                        <ion-label>Distancia: ${idBusc.distancia} kms</ion-label>
                    </ion-item>
                    <ion-item>
                        <ion-label>Precio: $${idBusc.precio}</ion-label>
                    </ion-item>
                    <ion-item>
                        <ion-label>Categoria: ${nombreDeCategoria}</ion-label>
                    </ion-item>                                     
                ` 
                }, 1200);
                               
                break;
            }
           
        }    
      
    })
    .then(function(){
    /* Creo el div de mapa */
        let pEnvios = document.querySelector("#mostrarCalculoEnvio");
        let agregarEnvios = document.querySelector("#mostrarAgregarEnvios");
        let detalleEnvios = document.querySelector("#detalleEnvios");
        let mostrarCiudadCercanaUsuario = document.querySelector("#mostrarCiudadCercanaUsuario");
        
          if(map!=null && !flagDetalleEnvio){
            let mapa = document.querySelector("#map");
            if(flagAgregarEnvio){

                agregarEnvios.removeChild(mapa);
               flagAgregarEnvio = false;

           }else if(flagCalcularEnvio){

                pEnvios.removeChild(mapa);
                flagCalcularEnvio = false;

           }else if(flagCiudadCercana){

            mostrarCiudadCercanaUsuario.removeChild(mapa)
            flagCiudadCercana = false
            }
        }       
         
        setTimeout(function () {
            let divMapa = document.createElement("div");
            divMapa.style.height = "200px";
            divMapa.setAttribute("id","map");
            detalleEnvios.appendChild(divMapa);
            flagDetalleEnvio = true;
            mostrarCiudades(idCiudadOrigen,idCiudadDestino);
        }, 1500)
        

    })
    .then(function(){
        /* Te lleva al menu de Detalle de Envios */
        let routeDetalle = document.createElement("ion-route");
        routeDetalle.setAttribute("url", "/Detalle-Envios");
        routeDetalle.setAttribute("component", "pDetalleEnvios");
        route.appendChild(routeDetalle);
        route.push("/Detalle-Envios");
    })
    .catch(function (error) {
        handleButtonClick(error);
    })
}

/* Eliminar Envio de un Usuario */

function btnEliminarEnvio(idDeEnvio){

    
    let envioEliminar  = {
        "idEnvio": idDeEnvio,
    }

    fetch("https://envios.develotion.com/envios.php",
            {
                method: "DELETE",
                body: JSON.stringify(envioEliminar), 
                headers: {
                    apiKey: localStorage.getItem("token")
                }
            })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                let envioEliminado = `El envío ha sido eliminado correctamente.`;
                registroCorrecto(envioEliminado)
                mostrarEnvio();
            })
            .catch(function (error) {
                handleButtonClick(error);
            })
};

/* Api para Calcular Total */
 
function precioTotalEnvios(){
    totalPrecioEnvios = 0;
    let idDeUsuario = localStorage.getItem("id");
    fetch(`https://envios.develotion.com/envios.php?idUsuario=${idDeUsuario}`, 
    {
        headers: {
            apiKey: localStorage.getItem("token")
        }
    })
    .then(function (response) {
            return response.json();
    })
    .then(function (data){
       
        for (let i = 0; i < data.envios.length; i++) {
            const precioBuscar = data.envios[i];
            totalPrecioEnvios += precioBuscar.precio;
        }
        document.querySelector("#totalEnvios").innerHTML = `<ion-label>El precio final de todos sus envíos es: $${totalPrecioEnvios}.</ion-label>
        `
       })
    .catch(function (error) {
        handleButtonClick(error);
    })
}

/* Api Ciudad de Envio Origen/Destino Mostrar */

function mostrarCiudadDetalles(numeroCiudadOrign,idLabelOrign,numeroCiudadDest,idLabelDest) {
    let idCO = "."+idLabelOrign;
    let idCD = "."+idLabelDest;
    let ciudadOrigenEnc = false;
    let ciudadDestinoEnc = false;
    
   fetch(`https://envios.develotion.com/ciudades.php`,
        {
            headers: {
                apiKey: localStorage.getItem("token")
            }
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            for(let i=0; i<data.ciudades.length; i++){
                const ciudadBusc = data.ciudades[i];
                if(numeroCiudadOrign === ciudadBusc.id){                    
                    document.querySelector(idCO).innerHTML = "Ciudad Origen: " + ciudadBusc.nombre;
                    ciudadOrigenEnc = true;
                }
            
                if(numeroCiudadDest === ciudadBusc.id){                    
                    document.querySelector(idCD).innerHTML = "Ciudad Destino: " +ciudadBusc.nombre;                     
                    ciudadDestinoEnc = true;
                }

                if (ciudadOrigenEnc && ciudadDestinoEnc) {
                    break;
                    
                }
            }
            
        })
        .catch(function (error) {
            handleButtonClick(error);
        })
}

/* Api para contar todas las ciudades de envios */
function contarCiudades() {
    let idDeUsuario = localStorage.getItem("id");
    document.querySelector("#pListarEnvios").innerHTML = "";
    let cantidadContada = 0;
    let ciudadYaContada = false;
   
   
    /* Arreglo de Top 5 */
    ciudadesCantidad = []
    fetch(`https://envios.develotion.com/envios.php?idUsuario=${idDeUsuario}`, 
    {
        headers: {
            apiKey: localStorage.getItem("token")
        }
    })
        .then(function (response) {
            if(response.status !=200){
                throw new error("Datos mal Ingresado")
            }
            return response.json();
        })
        .then(function (data) {
             //console.log(data);  
             if(data.envios.length>0){
                for (let i = 0; i < data.envios.length; i++) {
                    const ciudadEncontrada = data.envios[i].ciudad_destino;
                    cantidadContada = 1;
                    ciudadYaContada = false;

                    /* Aqui revisamos si existe la ciudad en el arreglo */
                    for (let l = 0; l < ciudadesCantidad.length; l++) {
                        const ciudadArreglo = ciudadesCantidad[l].idCiudadDestino;
                            if (ciudadEncontrada === ciudadArreglo) {
                                ciudadYaContada = true;
                                break;
                            }
                    }

                    /* Si no se conto la ciudad, que la cuente */
                   if(!ciudadYaContada){
                        for (let j = i+1; j < data.envios.length; j++) {
                            const compararCiudad = data.envios[j].ciudad_destino;
                            if (ciudadEncontrada === compararCiudad) {
                                cantidadContada++;                                
                            }                      
                        }                        
                        ciudadesCantidad.push({idCiudadDestino: ciudadEncontrada, cant: cantidadContada,idDepartamento: ""});
                        
                   }
                }
             }  
             
        })
        .catch(function (error) {
            handleButtonClick(error);
        })
}

/* Api top 5 obtener el departamento del envio */
function buscarDepartamento() {    
    fetch(`https://envios.develotion.com/ciudades.php`,
        {
            headers: {
                apiKey: localStorage.getItem("token")
            }
        })
        .then(function (response) {
            if(response.status !=200){
                throw new error("Datos mal Ingresado")
            }
            return response.json();
        })
        .then(function (data) {
            //console.log(data)       
            
                for (let j = 0; j < ciudadesCantidad.length; j++) {
                    const ciudadEnvio = ciudadesCantidad[j];
                    for (let i = 0; i < data.ciudades.length; i++) {
                        const unaCiudad = data.ciudades[i];
                    if(unaCiudad.id === ciudadEnvio.idCiudadDestino){                        
                        ciudadEnvio.idDepartamento =unaCiudad.id_departamento;
                        break; 
                    }
                }
            }
            //console.log (ciudadesCantidad);
        })
        .catch(function (error) {
            handleButtonClick(error);
        })
}

/* Funcion que busca el nombre del departamento de top 5 */
function buscarDepartamentoNombre() {
    
    fetch(`https://envios.develotion.com/departamentos.php`,
        {
            headers: {
                apiKey: localStorage.getItem("token")
            }
        })
        .then(function (response) {
            if(response.status !=200){
                throw new error("Datos mal Ingresado")
            }
            return response.json();
        })
        .then(function (data) {
            //console.log(data) 
                for (let j = 0; j < departamentosCantidad.length; j++) {
                    const deptEnvio = departamentosCantidad[j];
                    for (let i = 0; i < data.departamentos.length; i++) {
                        const unDepartamento= data.departamentos[i];
                    if(unDepartamento.id === deptEnvio.idDepartamento){                        
                        deptEnvio.nombre =unDepartamento.nombre;
                        break; 
                    }
                }
            }
        })
        .catch(function (error) {
            handleButtonClick(error);
        })
}

/* Codigo del Toast para carteles emergentes Errores*/
async function handleButtonClick(showError) {
    const toast = await toastController.create({
        color: 'dark',
        duration: 3000,
        message: showError.message,
        showCloseButton: true,
    });

    await toast.present();
}

/* Codigo del Toast para carteles emergentes - Registro*/
async function registroCorrecto(showFine) {
    const toast = await toastController.create({
        color: 'dark',
        duration: 3000,
        message: showFine,
        showCloseButton: true,
    });

    await toast.present();
}