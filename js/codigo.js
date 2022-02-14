/* Menú Cambiar de Pestannas*/
document.querySelector("#routerMenu").addEventListener("ionRouteWillChange", navegacionMenu)

function navegacionMenu(event) {
    let paginaMenu = document.querySelectorAll(".paginaMenu"); /* Aqui se llaman todas las paginas de mi sitio */
    //console.log(event)
    for (i = 0; i < paginaMenu.length; i++) {
        paginaMenu[i].style.display = "none";
    }

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

        if (event.detail.to === "/") {
            document.querySelector("#pRegistro").style.display = "block";
        } else if (event.detail.to === "/Login") {
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

        if (event.detail.to === "/CalcularEnvios") {
            document.querySelector("#pCalcularEnvios").style.display = "block";
        } else if (event.detail.to === "/AgregarEnvios") {
            document.querySelector("#pAgregarEnvios").style.display = "block";
        } else if (event.detail.to === "/AccionesEnvios") {
            document.querySelector("#pAccionesEnvios").style.display = "block";
            mostrarEnvio();
        } else if (event.detail.to === "/Estadisticas") {
            document.querySelector("#pEstadisticas").style.display = "block";
        } else if (event.detail.to === "/CiudadCercana") {
            document.querySelector("#pCiudadCercana").style.display = "block";
        } else if (event.detail.to === "/CerrarSesion") {
            document.querySelector("#pCerrarSesion").style.display = "block";
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

function irPagina() {
    this.navCtrl.push("pR");
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

let idDeUsuario = 0; 
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
                idDeUsuario = data.id;
                console.log(idDeUsuario); 
                /* Almaceno el valor del token en una variable */
                localStorage.setItem("token", data.apiKey);
                /* Oculto el login y muestro una página de estadisticas */
                document.querySelector("#pLogin").style.display = "none";
                document.querySelector("#pEstadisticas").style.display = "block";

            })
            .catch(function (Error) {
                handleButtonClick(Error);
            })

    } catch (error) {

        handleButtonClick(error);
    }

}

/* Api Ciudad */
mostrarCiudad();/* Muestro las ciudades */
function mostrarCiudad() {

    fetch("https://envios.develotion.com/ciudades.php",
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
                document.querySelector("#mostrarCiudadOrigenCE").innerHTML += `<ion-select-option value="${element.id_departamento}">${element.nombre}</ion-select-option>`
                document.querySelector("#mostrarCiudadDestinoCE").innerHTML += `<ion-select-option value="${element.id_departamento}">${element.nombre}</ion-select-option>`
                document.querySelector("#mostrarCiudadOrigenAE").innerHTML += `<ion-select-option value="${element.id_departamento}">${element.nombre}</ion-select-option>`
                document.querySelector("#mostrarCiudadDestinoAE").innerHTML += `<ion-select-option value="${element.id_departamento}">${element.nombre}</ion-select-option>`
            });
        })
        .catch(function (error) {
            handleButtonClick(error);
        })

}

/* Api Electrodomesticos */
mostrarElectrodomesticos();/* Muestro las ciudades */
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
    fetch(`https://envios.develotion.com/envios.php?idUsuario=${idDeUsuario}`, //La idea es encontrar el ID de usuario con un for 
    {
        headers: {
            apiKey: localStorage.getItem("token")
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)
            /* data.envios.forEach(function (element) {
                
                document.querySelector("#pListarEnvios").innerHTML += `
                    <ion-list>
                    <ion-item>
                        <ion-label>${element.idCiudadOrigen}</ion-label>
                    </ion-item>
                    <ion-item>
                        <ion-label>${element.idCiudadDestino}</ion-label>
                    </ion-item>
                    <ion-item>
                        <ion-label>${element.distancia}</ion-label>
                    </ion-item>
                    <ion-item>
                        <ion-label>${element.precio}</ion-label>
                    </ion-item>
                    <ion-button color="secondary" id="btnDetalleEnvio">
                            Detalle
                    </ion-button>
                    </ion-list>
                
            `
            }) */
        })
        .catch(function (error) {
            handleButtonClick(error);
        })

}

/* Api Detalles de Envio */
/* mostrarDetalle();*/
function mostrarDetalle() {
    fetch(`https://envios.develotion.com/envios.php?idUsuario=${idDeUsuario}`, //La idea es encontrar el ID de usuario con un for 
    {
        headers: {
            apiKey: localStorage.getItem("token")
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            data.envios.forEach(function (element) {
                document.querySelector("#pListaEnvios").innerHTML += `
                    <ion-list>
                        <ion-item>
                            <ion-label>${element.idCiudadOrigen}</ion-label>
                        </ion-item>
                        <ion-item>
                            <ion-label>${element.idCiudadDestino}</ion-label>
                        </ion-item>
                        <ion-item>
                            <ion-label>${element.peso}</ion-label>
                        </ion-item>
                        <ion-item>
                            <ion-label>${element.distancia}</ion-label>
                        </ion-item>
                        <ion-item>
                            <ion-label>${element.precio}</ion-label>
                        </ion-item>
                        <ion-item>
                            <ion-label>${element.idCategoria}</ion-label>
                        </ion-item>
                    </ion-list>
                
            `
            })
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


