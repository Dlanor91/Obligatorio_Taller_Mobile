/* Variables Globales */
let route = document.querySelector("#routerMenu") /* Creo variable que adquiere los parametro del menu */
route.addEventListener("ionRouteWillChange",navegacionMenu); /* Detecto el cambio de evento */

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
            document.querySelector(".mostrarDepartamentoOrigenCE").value ="";          
            document.querySelector(".mostrarDepartamentoDestinoCE").innerHTML = "" ; 
            document.querySelector(".mostrarDepartamentoDestinoCE").value = "" ;           
            mostrarDepartamentos();  

        } else if (paginaActiva === "/AgregarEnvios") {

            document.querySelector("#pAgregarEnvios").style.display = "block"; 
            document.querySelector(".bloqueCiudadOrigenAE").style.display = "none";
            document.querySelector(".bloqueCiudadDestinoAE").style.display = "none";   
            document.querySelector(".mostrarDepartamentoOrigenAE").innerHTML ="";  
            document.querySelector(".mostrarDepartamentoOrigenAE").value ="";           
            document.querySelector(".mostrarDepartamentoDestinoAE").innerHTML = "" ; 
            document.querySelector(".mostrarDepartamentoDestinoAE").value = "" ;            
            mostrarDepartamentos();      
            mostrarElectrodomesticos() ;/* Muestro las electrodomesticos */

        } else if (paginaActiva === "/Envios") {

            document.querySelector("#pEnvios").style.display = "block";                               
            mostrarEnvio();

        } else if (paginaActiva === "/Estadisticas") {

            document.querySelector("#pEstadisticas").style.display = "block";
            
        } else if (paginaActiva === "/CiudadCercana") {

            document.querySelector("#pCiudadCercana").style.display = "block";

        } else if (paginaActiva === "/CerrarSesion") {

            localStorage.clear(); //elimina todos las claves del localStorage 
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
    let ciudadOrigen = document.querySelector(".mostrarCiudadOrigenCE").value;    
    let ciudadDestino = document.querySelector(".mostrarCiudadDestinoCE").value;

    try {
        if (ciudadOrigen === "") {
            throw new Error("Seleccione una Ciudad Origen.");
        }
        if (ciudadDestino === "") {
            throw new Error("Seleccione una Ciudad Destino.");
        }
        fetch()

    } catch (Error) {
        handleButtonClick(Error);
    }
}

/* APIs */
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

/* Api Ciudad Origen Calcular Envios*/

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

/* Api Ciudad Destino Calcular Envios*/

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

function mostrarElectrodomesticos() {

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
                document.querySelector("#mostrarElectrodomesticos").innerHTML += `<ion-select-option value="${element.id}">${element.nombre}</ion-select-option>`
            });
        })
        .catch(function (error) {
            handleButtonClick(error);
        })

}

/* Api Listar Envios */
 
function mostrarEnvio() {
    let idDeUsuario = localStorage.getItem("id");
    document.querySelector("#pListarEnvios").innerHTML = "";
    fetch(`https://envios.develotion.com/envios.php?idUsuario=${idDeUsuario}`, //La idea es encontrar el ID de usuario con un for 
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
                let idLabel = 0;
                let idLabelCO;
                let idLabelCD;
                data.envios.forEach(function (element) {
                    idLabel ++;
                    idLabelCO = idLabel+"CO";
                    idLabelCD = idLabel+"CD";
                    mostrarCiudadOrigenEnvios(element.ciudad_origen);
                    console.log(mostrarCiudadOrigenEnvios);
                    mostrarCiudadDestinoEnvios(element.ciudad_destino);                    
                    document.querySelector("#pListarEnvios").innerHTML += `
                        <ion-list>
                        <ion-item>
                            <ion-label id="1"></ion-label>
                        </ion-item>
                        <ion-item>
                            <ion-label id="2"></ion-label>
                        </ion-item>
                        <ion-item>
                            <ion-label>${element.distancia}</ion-label>
                        </ion-item>
                        <ion-item>
                            <ion-label>${element.precio}</ion-label>
                        </ion-item>
                        <ion-button color="medium" id="btnDetalleEnvio">
                                Detalle
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

/* Api Ciudad de Envio Origen/Destino Mostrar */

function mostrarCiudadOrigenEnvios(numeroCiudad) {
    
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
                    document.querySelector("#1").innerHTML = ciudadBusc.nombre;                    
                    break;
                }
            }
        })
        .catch(function (error) {
            handleButtonClick(error);
        })
}

/* Api Ciudad de Envio Origen/Destino Mostrar */

function mostrarCiudadDestinoEnvios(numeroCiudad) {
    
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
                     document.querySelector("#2").innerHTML = ciudadBusc.nombre;                     
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

