function conectarBD(){
    const abrirConexion=window.indexedDB.open('estudiantes',1);
    abrirConexion.onerror=function(){
        console.log("hubo un error");
    }
    abrirConexion.onsuccess=function(){
        DB=abrirConexion.result;
    }
}
function mostrarAlerta(mensaje,tipo){
    const alerta=document.querySelector('.alerta');
    if(!alerta){
        const divMensaje=document.createElement('div');
        divMensaje.classList.add('px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'bolder', 'alerta');
        divMensaje.textContent=mensaje;
        formulario.appendChild(divMensaje);
    
        if (tipo === 'error'){
           divMensaje.classList.add('bg-red-100', 'border-red-400', 'text-red-700');
        } else {
           divMensaje.classList.add('bg-green-100', 'border-green-400', 'text-green-700');
        }
    
        setTimeout(() => {
           divMensaje.remove();
        }, 3000);
    }
}
