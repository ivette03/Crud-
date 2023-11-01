(function () {
    let DB;
    const formulario = document.querySelector('#formulario');
    

    // Define the mostrarAlerta function

   

    document.addEventListener('DOMContentLoaded', () => {
        conectarBD();
        formulario.addEventListener('submit', validarCliente);
    });
    function conectarBD() {
        const abrirConexion = window.indexedDB.open('estudiantes', 1);
        abrirConexion.onerror = function () {
            console.log("Hubo un error");
        }
        abrirConexion.onsuccess = function () {
            DB = abrirConexion.result;
        }
    }

    function validarCliente(e) {
        e.preventDefault();
        const nombre = document.querySelector('#nombre').value;
        const curso = document.querySelector('#curso').value;
        const telefono = document.querySelector('#telefono').value;
        const email = document.querySelector('#email').value;

        if (nombre === '' || curso === '' || telefono === '' || email === '') {
            mostrarAlerta('Todos los campos son obligatorios', 'error');
            return;
        }
        // Create the estudiante object
        const estudiante = {
            nombre,
            curso,
            telefono,
            email
        };
        estudiante.id = Date.now();
        agregarEstudiante(estudiante);
    }

    function agregarEstudiante(estudiante) {
        const transaction = DB.transaction(['estudiantes'], 'readwrite');
        const objectStore = transaction.objectStore('estudiantes');
        objectStore.add(estudiante);
        transaction.onerror = function () {
            console.log("Hubo un error");
        }
        transaction.oncomplete = function () {
            formProcessing = false;
            console.log("Estudiante agregado");
        }
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 100);
    }
})();
