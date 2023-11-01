(function(){
    let DB;
    let idEstudiante;
    const nombreInput=document.querySelector('#nombre');
    const cursoInput=document.querySelector('#curso');
    const telefonoInput=document.querySelector('#telefono');
    const emailInput=document.querySelector("#email");
    const formulario=document.querySelector('#formulario');
    document.addEventListener('DOMContentLoaded', () =>{
        //conectad bd
        conectarBD();
        //actualizar formulario
        formulario.addEventListener('submit',actualizarDatos);
        //verificar el id de la url
        const parametroId= new URLSearchParams(window.location.search);
        idEstudiante=parametroId.get('id');
        if(idEstudiante){
            setTimeout(() => {
              obtenerEstudiante(idEstudiante);           
            }, 100);
           
        }

    });
    function actualizarDatos(e){
        e.preventDefault();
        if(nombreInput.value === ''|| cursoInput.value === '' || telefonoInput.value === '' || emailInput.value === ''){
            mostrarAlerta('Todo los campo son obligatorios','error');
            return;
        }
        const estudianteActualizado={
            nombre:nombreInput.value,
            curso:cursoInput.value,
            telefono:telefonoInput.value,
            email:emailInput.value,
            id:Number(idEstudiante)
        }
       
        const transaction=DB.transaction(['estudiantes'],'readwrite');
        const objectstore=transaction.objectStore('estudiantes');
        objectstore.put(estudianteActualizado);
        transaction.oncomplete=function(){
            mostrarAlerta("Editado correctamente");
            setTimeout(() => {
                window.location.href="index.html";
            }, 100);
        }
        transaction.onerror=function(){
            mostrarAlerta("hubo un error al editar estudiante",'error');
        }
           
    }
    function obtenerEstudiante(id){
        const transaction=DB.transaction(['estudiantes'], 'readwrite');
        const objectStore=transaction.objectStore('estudiantes');
        
        const estudiante=objectStore.openCursor();
        estudiante.onsuccess=function(e){
            const cursor=e.target.result;
            if(cursor){
                if(cursor.value.id === Number(id)){
                    llenarFormulario(cursor.value);

                }
                cursor.continue();
            }
        }
    }
    function llenarFormulario(datoCliente){
        const {nombre,curso,telefono,email}=datoCliente;
        nombreInput.value=nombre;
        cursoInput.value=curso;
        telefonoInput.value=telefono;
        emailInput.value=email;
        
        
    

    }
    
    function conectarBD(){
        const conectarBD=window.indexedDB.open('estudiantes', 1);
        conectarBD.onerror=function(){
            console.log("Hubo error para conectar")
        }
        conectarBD.onsuccess=function(){
            DB=conectarBD.result;
        }

    }
    

})();