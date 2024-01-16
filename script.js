document.addEventListener("DOMContentLoaded", function () {
    let imageCount = 0; // Contador para el correlativo de imágenes

    // Variables para manejar los menús desplegables de país y personas
    const countrySelect = document.createElement('select');
    const personSelect = document.createElement('select');
    const countries = {
        "Colombia": ["Cárdenas López Daniel Santiago", "Castillo Ariza Eliana María", "Guarín", "Muñoz Boris Nicolas", "Herrera Yanez Rafael Eduardo", "Narváez Quiceno Cristian Eduardo", "Ramírez Celís Jesús Fernando", "Santander periferia", "Burgos Bedoya Camila Andrea", "Burbano Rojas Mónica Georgina", "Escobar Montealegre Betty", "Escobar Vélez Julián Hernando", "Gallego Diosa Kelin Tatiana", "García Prada Adalberto", "León Chaurra Katherine", "Mayorga Calderón Carlos Enrique", "Pava Torres Hermes Ricardo", "Torres Montoya Ana María", "Millán Valencia Juan Carlos", "Ángel Vargas José Jaime", "Arenas Rivera Laura Cristina", "Carvajal Moreno Juan Guillermo", "Hoyos Rodríguez Jaime Andrés", "Peralta Ramírez Deiby Yamit", "Pinto Ortiz Yeferson David", "Triana Quintero Juan Camilo", "Morales Peña Diego Fernando", "Fique Jiménez Daniel Alfonso", "Guaviare", "Luis Ayala Jorge Antonio", "Mesa Piracoca Cristian Yesid", "Montaño Subia Roberto Santiago", "Peña Rivera José Antonio", "Quevedo Trujillo Jessica Paola", "Varila Martínez William Camilo", "Nope Molano Viviana Katherine", "Juan Diego Múnera", "Víctor Ochoa", "Andrés Felipe Mahecha", "John Alejandro Bernal"], // Reemplaza con nombres reales
        "Costa Rica": ["Ronald Murillo", "Mauricio Camacho", "Marisol Zanher", "Julián Araya", "Sofía Delgado", "Ricardo Barrantes", "Diego Cordero", "Joshua Quriós", "Melania Arroyo"],
        "El Salvador": ["Cristian Torres", "Ivonne Corado", "Ricardo Pacheco", "Benjamín Najarro", "Javier Hernández", "Luis Mario Ascencio", "Angel Miranda", "Benedicto Ramírez", "Carlos Aparicio", "Douglas Lemus", "César Chacón"],
        "Guatemala": ["Bernardo Gregorio Toc", "Ronald Romeo Arroyo Vidal", "Amilcar Baltazar Chaman Tot", "Vagheri Jesus Juarez Pacay", "Armindo Ottoniel López de León", "Juan Enrique Vicente Lucas", "Ariel Villatoro Castillo", "Julio Fernando Aquino Morales", "Hector Eduardo Calderon de León", "Benito Zacarias Clemente Velasquez", "Luis Adolfo Giron Dardon", "José Eduardo Paz Coronado", "Wilmer Baltazar Diaz García", "Jonathan Rufino Arredondo Tobar", "Byron Elias Rodríguez Cifuentes", "Byron Estuardo Arrecis León", "Jorge Alberto Mejicanos Donis", "Cristian Waldemar Zuñiga Zuñiga", "Jorge Alberto Quintana Coronado", "José Carlos Ramírez Ortega", "Marlon Agustin Xicay Salomon", "Josue Daniel Xicay Canú", "Gilberto Elias Morales Serech", "Edwin Aroldo Matzar Vicente", "Ronal Estuardo Vásquez Vega", "Pedro Roberto Guarcas Morales", "Vidal Francisco Ramírez Ceto", "Eladio Renardo Macz Recinos", "Rudy Amilcar Xol Ico", "Juan Jose Contreras Meza", "Elias Antonio Godinez Chacón", "Maycon Jasmin Montepeque Monterroso", "Gustavo Adolfo Queej Caal", "Alfredo Rosa Meda", "Adriana Jovita Ortiz Castillo", "Hugo Javier Ruiz Medina", "Maite Adalis Carrera Alas", "Denis Gamaliel Donis Ramos", "César Obdulio Marroquin Yuc", "Roberto Carlos Montoya Rohr", "Gustavo Indalecio Ventura Tobar", "Nestor Díaz", "Julio Sequén", "Luis Carlos Lemus", "Jennifer Cordero", "Brayan Luna", "Joel Lopez", "Marvin Fernandez"],
        "Honduras": ["Marcial Valeriano", "Ronel Zuniga", "Jorge Abastida", "Raul Amador", "Franklin Meza", "David Castro", "Carlos Amador", "Milton Peña", "Eduard Barahona", "Neri Reyes"],
        "Nicaragua": ["Alfredo Salomón Sanchez", "Ariel Antonio Rivera Rodriguez", "Boanerges Ismael Cardoza Ballesteros", "Byron Gutierrez Montenegro", "Carlos Ramón Gomez Ponce", "Erick Esquivel Altamirano", "Gabriel Alejandro Garcia", "Kevin Soza Peralta", "Lester Orlando Iglesias Altamirano", "Liuxmilia Jaxari Rivera Umanzor", "Luis Alfonso Lopez Collado", "Luis Jason Jiron", "Oscar Danilo Ubeda Pineda", "Yader Augusto Rizo Rivera"],
        "Panamá": ["Nayesli Mendez", "Rosmel Bosque", "Euribiades Broce", "Erain Oses", "Melvin Murillo", "Juan Castillo", "Miguel Martinez", "Cristel Caballero", "Yasmary Medina"],
        // Agrega aquí los demás países y personas
    };

    // Agregar opciones a los menús desplegables
    countrySelect.id = "countrySelect";
    Object.keys(countries).forEach(country => {
        const option = new Option(country, country);
        countrySelect.add(option);
    });

    personSelect.id = "personSelect";
    updatePersonSelect("Colombia"); // Inicializa con el primer país

    // Función para actualizar el menú desplegable de personas según el país
    function updatePersonSelect(country) {
        while (personSelect.options.length > 0) {
            personSelect.remove(0);
        }
        countries[country].forEach(person => {
            const option = new Option(person, person);
            personSelect.add(option);
        });
    }

    // Evento para actualizar el menú desplegable de personas cuando se cambia el país
    countrySelect.addEventListener('change', function () {
        updatePersonSelect(this.value);
    });

    // Agregar menús desplegables después de la casilla 'cliente'
    const clientInput = document.getElementById('clientInput');
    clientInput.after(countrySelect, personSelect);

    // Manejar carga de imagen
    document.getElementById('imageLoader').addEventListener('change', function (e) {
        handleImage(e, addImageToPreview);
    }, false);

    // Configuración de la cámara y botones
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const cameraButton = document.getElementById('cameraButton');
    const takePhotoButton = document.getElementById('takePhotoButton');
    const removePhotoButton = document.getElementById('removePhotoButton');
    const sendToAPIButton = document.getElementById('sendAndDownloadButton');
    const clearImageButton = document.createElement('button');

    clearImageButton.textContent = 'Eliminar Imagen y Datos';
    clearImageButton.addEventListener('click', clearImageAndData);
    document.getElementById('imagePreview').after(clearImageButton);

    // Activar cámara
    cameraButton.addEventListener('click', function () {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
                video.srcObject = stream;
                video.play();
                video.style.display = 'block';
                takePhotoButton.style.display = 'block';
                removePhotoButton.style.display = 'none';
            });
        }
    });

    // Tomar foto
    takePhotoButton.addEventListener('click', function () {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        handleImage({ target: { files: [canvas.toDataURL('image/png')] } }, addImageToPreview);
        removePhotoButton.style.display = 'block';
    });

    // Eliminar foto
    removePhotoButton.addEventListener('click', function () {
        document.getElementById('imagePreview').innerHTML = '';
        removePhotoButton.style.display = 'none';
        imageCount--;
    });

    // Función para limpiar imagen y datos de la tabla
    function clearImageAndData() {
        document.getElementById('imagePreview').innerHTML = '';
        document.getElementById('imageDetailsTable').getElementsByTagName('tbody')[0].innerHTML = '';
        imageCount = 0;
    }

    // Función para manejar imágenes y agregar previsualización
    function handleImage(e, callback) {
        const reader = new FileReader();
        reader.onload = function (event) {
            callback(event.target.result);
        }
        if (e.target.files[0] instanceof Blob) {
            reader.readAsDataURL(e.target.files[0]);
        } else {
            callback(e.target.files[0]);
        }
    }

    // Función para agregar imágenes a la tabla
    function addImageToPreview(src) {
        const imagePreview = document.getElementById('imagePreview');
        if (imagePreview.innerHTML != '') {
            return; // Evitar agregar más de una imagen
        }

        imageCount++;
        const datetime = new Date().toLocaleString();
        let latitude = '';
        let longitude = '';

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                latitude = position.coords.latitude.toFixed(6);
                longitude = position.coords.longitude.toFixed(6);
                addToTable(src, datetime, latitude, longitude, imageCount);
            }, function () {
                addToTable(src, datetime, latitude, longitude, imageCount); // Si falla la geolocalización
            });
        } else {
            addToTable(src, datetime, latitude, longitude, imageCount);
        }

        // Mostrar miniatura
        const thumbnail = new Image();
        thumbnail.src = src;
        thumbnail.style.width = '100px';
        thumbnail.style.height = '100px';
        imagePreview.appendChild(thumbnail);
    }

    // Función para agregar detalles a la tabla
    function addToTable(src, datetime, latitude, longitude, count) {
        const table = document.getElementById('imageDetailsTable').getElementsByTagName('tbody')[0];
        const newRow = table.insertRow();

        // Columna de miniatura
        const cellThumbnail = newRow.insertCell(0);
        const thumbnail = new Image();
        thumbnail.src = src;
        thumbnail.style.width = '50px';
        cellThumbnail.appendChild(thumbnail);

        // Columnas de fecha, latitud, longitud y correlativo
        newRow.insertCell(1).textContent = datetime;
        newRow.insertCell(2).textContent = latitude;
        newRow.insertCell(3).textContent = longitude;
        newRow.insertCell(4).textContent = `Foto_${count}_${datetime.replaceAll(' ', '_').replaceAll(':', '').replaceAll('/', '')}`;
    }
    // Continuación del código...

    var selecionado;
    document.getElementById('crop').addEventListener('change', function (parametro) {
        selecionado = parametro.target.value;
    });

    // Evento para manejar el envío de datos y bloquear edición
    sendToAPIButton.addEventListener('click', function () {
        // Bloquear edición de campos
        document.getElementById('clientInput').disabled = true;
        document.getElementById('observationsTextarea').disabled = true;

        const currentImage = document.querySelector("#imageDetailsTable tbody tr:last-child img");
        const currentRow = document.querySelector("#imageDetailsTable tbody tr:last-child");

        var formdata = new FormData();

        // Obteniendo el archivo de imagen del elemento de carga de imagen
        var imageLoader = document.getElementById('imageLoader');
        if (imageLoader.files.length > 0) {
            var file = imageLoader.files[0];
            formdata.append("imagen", file, file.name);
        }

        formdata.append("texto", selecionado);

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        fetch("https://us-central1-agritecgeo.cloudfunctions.net/plantix-api-function", requestOptions)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    addToEvaluationTable(data);
                } else {
                    alert('Los datos recibidos no son un array', data);
                }
            })
            .catch(error => console.log('error', error));
    });

    /*
    // Función para agregar datos a la tabla de evaluación
    function addToEvaluationTable(apiData) {
        const evalTable = document.getElementById('evaluationTable').getElementsByTagName('tbody')[0];

        // Remover la columna de 'Tratamiento o Recomendación' si existe
        const headerRow = document.querySelector("#evaluationTable thead tr");
        if (headerRow.cells.length > 4) {
            headerRow.deleteCell(4); // Asumiendo que es la última columna
        }

        apiData.forEach(data => {
            const newRow = evalTable.insertRow();

            const fields = [
                data.common_name,
                data.scientific_name,
                data.pathogen_class,
                translateProbability(data.diagnosis_likelihood)
            ];

            fields.forEach((field, index) => {
                newRow.insertCell(index).textContent = field;
            });

            // Agregar menú desplegable al final de cada fila
            const selectCell = newRow.insertCell(fields.length);
            const select = createDropdown(["Verdadero", "Falso", "No lo sé"]);
            selectCell.appendChild(select);
        });
    }
    */


    // Función para crear menús desplegables
    function createDropdown(options) {
        const select = document.createElement('select');
        options.forEach(optionText => {
            const option = document.createElement('option');
            option.value = optionText;
            option.textContent = optionText;
            select.appendChild(option);
        });
        return select;
    }
    
    // Función para agregar datos a la tabla de evaluación
    function addToEvaluationTable(apiData) {
        const evalTable = document.getElementById('evaluationTable').getElementsByTagName('tbody')[0];

        apiData.forEach(data => {
            const newRow = evalTable.insertRow();

            newRow.insertCell(0).textContent = data.common_name || '';
            newRow.insertCell(1).textContent = data.scientific_name || '';
            newRow.insertCell(2).textContent = data.pathogen_class || '';
            newRow.insertCell(3).textContent = data.diagnosis_likelihood || '';

            const vfSelectCell = newRow.insertCell(4);
            const vfSelect = document.createElement('select');
            ["Verdadero", "Falso", "No lo sé"].forEach(optionText => {
                const option = document.createElement('option');
                option.value = optionText;
                option.textContent = optionText;
                vfSelect.appendChild(option);
            });
            vfSelectCell.appendChild(vfSelect);
        });
    }
    

    // Traducir valores de probabilidad al español
    function translateProbability(probability) {
        const translations = {
            "very_likely": "Muy probable",
            "likely": "Probable",
            "possible": "Posible",
            "unlikely": "Improbable",
            "very_unlikely": "Muy improbable"
        };
        return translations[probability] || probability;
    }

    /*
    // Función para crear menús desplegables
    function createDropdown(options) {
        const select = document.createElement('select');
        options.forEach(optionText => {
            const option = document.createElement('option');
            option.value = optionText;
            option.textContent = optionText;
            select.appendChild(option);
        });
        return select;
    }
    */
});
