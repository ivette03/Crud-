(function () {
    let DB;
    const listadoEstudiantes = document.querySelector('#listado-estudiantes');

    document.addEventListener('DOMContentLoaded', () => {
        crearDB();
        if (window.indexedDB.open('estudiantes', 1)) {
            obtenerEstudiantes();
        }
        listadoEstudiantes.addEventListener('click', eliminarRegistro);
    });

    function eliminarRegistro(e) {
        if (e.target.classList.contains('eliminar')) {
            const idEliminar = Number(e.target.dataset.estudiante); // Parse the ID as a number
            const confirmar = confirm("¿Seguro que deseas eliminar?");
            if (confirmar) {
                e.target.parentElement.parentElement.remove();
                const transaction = DB.transaction(['estudiantes'], 'readwrite');
                const objectStore = transaction.objectStore('estudiantes');
                objectStore.delete(idEliminar);
            }
        }
    }

    function crearDB() {
        const crearDB = window.indexedDB.open('estudiantes', 1);
        crearDB.onerror = function () {
            console.log("Hubo un error");
        }
        crearDB.onsuccess = function () {
            DB = crearDB.result;
        }
        crearDB.onupgradeneeded = function (e) {
            const db = e.target.result;
            const objectStore = db.createObjectStore('estudiantes', { keyPath: 'id', autoIncrement: true });
            objectStore.createIndex('nombre', 'nombre', { unique: false });
            objectStore.createIndex('curso', 'curso', { unique: false });
            objectStore.createIndex('telefono', 'telefono', { unique: false });
            objectStore.createIndex('email', 'email', { unique: false }); // Change to unique: false
            console.log("Base de datos creada");
        }
    }

    function obtenerEstudiantes() {
        const abrirConexion = window.indexedDB.open('estudiantes', 1);
        abrirConexion.onerror = function () {
            console.log("Hubo un error");
        }
        abrirConexion.onsuccess = function () {
            DB = abrirConexion.result;
            const objectStore = DB.transaction('estudiantes').objectStore('estudiantes');
            objectStore.openCursor().onsuccess = function (e) {
                const cursor = e.target.result;
                if (cursor) {
                    const { nombre, curso, telefono, email, id } = cursor.value;

                    // Append the student data to the listadoEstudiantes
                    listadoEstudiantes.innerHTML += `
                    <tr>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                            <p class="text-sm leading-5 font-medium text-gray-700 text-lg font-bold">${nombre}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                            <p class="text-gray-700">${curso}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                            <p class="text-gray-700">${telefono}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 leading-5 text-gray-700">
                            <p class="text-gray-600">${email}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 ">
                            <a href="editarestudiante.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                            <a href="#" data-estudiante="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
                        </td>
                    </tr>
                `;

                    cursor.continue();
                } else {
                    console.log("No hay resultados");
                }
            }
        }
    }
})();
