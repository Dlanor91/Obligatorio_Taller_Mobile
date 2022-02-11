/* Funcion Registro */
document.querySelector("#btnRegistro").addEventListener("click", regsitroUsuario);


function regsitroUsuario(){
    let userRegister = document.querySelector("#userRegister").value.trim();
    let paswRegister = document.querySelector("#paswRegister").value.trim();

    /* Creo mi arreglo de datos para pasar al sistema */
    let datosIngresados ={
        "usuario": userRegister, /* el de "" es el de el post y el otro la variable q le igualo */
        "password":paswRegister
    }
   
    /* Validacion de JS */
    try {
        if(userRegister===""){
            throw new Error("Complete el campo de Usuario.");
        }
        if(paswRegister===""){
            throw new Error("Complete el campo de Contraseña.");
        }

        fetch("https://envios.develotion.com/usuarios.php",
        {
            method: "POST",
            body:JSON.stringify(datosIngresados), /* Aqui paso el arreglo de datos para el post */
            headers:{
                "content-type":"application/json"
            }
        })
        .then(function(response){
            
            if(response.status === 409){
                throw new Error("Usuario existente, registrese con otro nombre de usuario.");
            }
            if(response.status != 200){
                throw new Error("Ingrese los datos correctamente.");
            }
            return response.json();
        })
        .then(function (data){ 
            //console.log(data); 
            registroCorrecto();               
        })
        .catch(function(Error){
           handleButtonClick(Error); 
        })

    } catch (error) {        
        handleButtonClick(error);
    }  
}

/* Codigo del Toast para carteles emergentes Errores*/
async function handleButtonClick(showError) {
    const toast = await toastController.create({
      color: 'dark',
      duration: 2000,
      message: showError.message,
      showCloseButton: true,
    });

    await toast.present();            
}

/* Codigo del Toast para carteles emergentes - Registro*/
async function registroCorrecto() {
    const toast = await toastController.create({
      color: 'dark',
      duration: 2000,
      message: "Usuario registrado correctamente.",
      showCloseButton: true,
    });

    await toast.present();            
}

 
