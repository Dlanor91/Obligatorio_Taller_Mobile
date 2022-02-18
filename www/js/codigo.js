/* Variables Globales */
/* Menu */
let route = document.querySelector("#routerMenu") /* Creo variable que adquiere los parametro del menu */
route.addEventListener("ionRouteWillChange",navegacionMenu); /* Detecto el cambio de evento */
let usuarioNoLogueado = false; /* Para saber si esta registrado o no un usuario */

/* Para todos los mapas a mostrar */
let map;
let latitudCiudadOrigen;
let longitudCiudadOrigen;
let latitudCiudadDestino;
let longitudCiudadDestino;
let distanciaEnvios;
let nombreDeCategoria;

/* Banderas para mapas activos  */
let flagCalcularEnvio = false;
let flagAgregarEnvio = false;
let flagDetalleEnvio = false;


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
            document.querySelector(".bloqueDepartamentoDestinoCE").style.display = "block";
            document.querySelector(".bloqueDepartamentoOrigenCE").style.display = "block";   
                               
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
            mostrarEnvio();

        }else if (paginaActiva === "/Detalle-Envios") {
            
            document.querySelector("#pDetalleEnvios").style.display = "block";
            
        }else if (paginaActiva === "/Estadisticas") {

            document.querySelector("#pEstadisticas").style.display = "block";
            
        } else if (paginaActiva === "/CiudadCercana") {

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
    let departamentoOrigen = Number(document.querySelector(".mostrarDepartamentoOrigenCE").value);    
    let departamentoDestino = Number(document.querySelector(".mostrarDepartamentoDestinoCE").value);
    let ciudadOrigen = Number(document.querySelector(".mostrarCiudadOrigenCE").value);    
    let ciudadDestino = Number(document.querySelector(".mostrarCiudadDestinoCE").value);  
    document.querySelector(".bloqueDepartamentoDestinoCE").style.display = "none";
    document.querySelector(".bloqueDepartamentoOrigenCE").style.display = "none"; 

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
         
        /* Creo el div de mapa */
        if(map!=null && !flagCalcularEnvio){
            let mapa = document.querySelector("#map");
            if(flagAgregarEnvio){

                pAgregarEnvios.removeChild(mapa);
               flagAgregarEnvio = false;

           }else if(flagDetalleEnvio){

               pDetalleEnvio.removeChild(mapa);
               flagDetalleEnvio = false;
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
        texto = document.createTextNode(""); 
        texto = document.createTextNode("La distancia entre ciudades es de: " + distanciaEnvios.toFixed(2) + " kms.");
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
         if(map!=null && !flagAgregarEnvio){
             let mapa = document.querySelector("#map");
             if(flagCalcularEnvio){
                pEnvios.removeChild(mapa);
                flagCalcularEnvio = false;
            }else if(flagDetalleEnvio){

                pDetalleEnvio.removeChild(mapa);
                flagDetalleEnvio = false;
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
            precio = precio.toFixed(2);}, 2500);
              
    } catch (Error) {
        handleButtonClick(Error);
    }
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
        for(let i=0; i<data.ciudades.length; i++){
            const ciudadBusc = data.ciudades[i];
            if(idCiudadOrigen === ciudadBusc.id){                    
                latitudCiudadOrigen = ciudadBusc.latitud;
                longitudCiudadOrigen = ciudadBusc.longitud;                 
                break;
            }
            for(let i=0; i<data.ciudades.length; i++){
                const ciudadBusc = data.ciudades[i];
                if(idCiudadDestino === ciudadBusc.id){                    
                    latitudCiudadDestino = ciudadBusc.latitud;
                    longitudCiudadDestino = ciudadBusc.longitud;                 
                    break;
                }
            }
        }
        if (map != null) {
            map.remove();
        }
            map = L.map('map').setView([latitudCiudadOrigen, longitudCiudadOrigen], 13);
                
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);   

        L.marker([latitudCiudadDestino, longitudCiudadDestino]).addTo(map)
        .bindPopup('Ciudad Destino')
        .openPopup(); 

        L.marker([latitudCiudadOrigen, longitudCiudadOrigen]).addTo(map)
        .bindPopup('Ciudad Origen')
        .openPopup();  
        
        distanciaEnvios = map.distance([latitudCiudadOrigen, longitudCiudadOrigen], [latitudCiudadDestino, longitudCiudadDestino]);
    
        /* LLevo a KMs */
        distanciaEnvios  /= 1000;        
        
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
                            <ion-label class="${idCiudadOrig}"></ion-label>
                        </ion-item>
                        <ion-item>
                            <ion-label class=${idCiudadDest}></ion-label>
                        </ion-item>
                        <ion-item>
                            <ion-label>${element.distancia}</ion-label>
                        </ion-item>
                        <ion-item>
                            <ion-label>${element.precio}</ion-label>
                        </ion-item>
                        <ion-button color="medium" onclick="btnDetalleEnvio(${element.id})">
                                Detalle
                        </ion-button>
                        <ion-button color="medium" onclick="btnEliminarEnvio()">
                                Eliminar
                        </ion-button>
                        </ion-list>                    
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
                        <ion-label>${idBusc.peso}</ion-label>
                    </ion-item>
                    <ion-item>
                        <ion-label>${idBusc.distancia}</ion-label>
                    </ion-item>
                    <ion-item>
                        <ion-label>${idBusc.precio}</ion-label>
                    </ion-item>
                    <ion-item>
                        <ion-label>${nombreDeCategoria}</ion-label>
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
        
          if(map!=null && !flagDetalleEnvio){
            let mapa = document.querySelector("#map");
            if(flagAgregarEnvio){

                agregarEnvios.removeChild(mapa);
               flagAgregarEnvio = false;

           }else if(flagCalcularEnvio){

                pEnvios.removeChild(mapa);
                flagCalcularEnvio = false;

           }
        }       
         
        setTimeout(function () {let divMapa = document.createElement("div");
        divMapa.style.height = "200px";
        divMapa.setAttribute("id","map");
        detalleEnvios.appendChild(divMapa);
        flagDetalleEnvio = true;
        mostrarCiudades(idCiudadOrigen,idCiudadDestino); },1500);

    })
    .then(function(){
        
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

/* Api Ciudad de Envio Origen/Destino Mostrar */

function mostrarCiudadDetalles(numeroCiudadOrign,idLabelOrign,numeroCiudadDest,idLabelDest) {
    let idCO = "."+idLabelOrign;
    let idCD = "."+idLabelDest;
    
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
                    document.querySelector(idCO).innerHTML = ciudadBusc.nombre;
                    break;
                }
            }

            for(let i=0; i<data.ciudades.length; i++){
                const ciudadBusc = data.ciudades[i];
                if(numeroCiudadDest === ciudadBusc.id){                    
                    document.querySelector(idCD).innerHTML = ciudadBusc.nombre;                     
                    break;
                }
            }
            
        })
        .catch(function (error) {
            handleButtonClick(error);
        })
}

 /* Para Detalles */
 /* Api Ciudad de Envio Origen/Destino Mostrar */

function mostrarCiudadOrigenEnviosD(numeroCiudad,idLabel) {
    let idCOD = "."+idLabel;
    
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
                if(numeroCiudad === ciudadBusc.id){                    
                    document.querySelector(idCOD).innerHTML = ciudadBusc.nombre;  
                                    
                    break;
                }
            }
        })
        .catch(function (error) {
            handleButtonClick(error);
        })
}

/* Api Ciudad de Envio Origen/Destino Mostrar */

function mostrarCiudadDestinoEnviosD(numeroCiudad,idLabel) {
    let idCDD = "."+idLabel;
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
                 if(numeroCiudad === ciudadBusc.id){                    
                     document.querySelector(idCDD).innerHTML = ciudadBusc.nombre;                     
                     break;
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


