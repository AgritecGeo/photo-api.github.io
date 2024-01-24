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

    var countryLabel = document.createElement("label");
    countryLabel.textContent = "Seleccionar País: ";

    // Obtén el elemento del menú desplegable de países por su ID
    var countrySelect1 = document.getElementById("countrySelect");

    // Agrega la etiqueta antes del menú desplegable
    countrySelect1.before(countryLabel);

    var personLabel = document.createElement("label");
    personLabel.textContent = "Evaluador:";

    var personSelect1 = document.getElementById("personSelect");
    personSelect1.before(personLabel);

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

     /*
    // Activar cámara Antiguo
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
    */

    // Activar cámara
    cameraButton.addEventListener('click', function () {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            // Configuración para preferir la cámara trasera en dispositivos móviles
            var constraints = {
                video: { facingMode: "environment" }
            };
    
            navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
                video.srcObject = stream;
                video.play();
                video.style.display = 'block';
                takePhotoButton.style.display = 'block';
                removePhotoButton.style.display = 'none';
            }).catch(function (error) {
                console.log("Error al acceder a la cámara: ", error);
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
    var tiempo;
    // Evento para manejar el envío de datos y bloquear edición
    sendToAPIButton.addEventListener('click', function () {
        // Bloquear edición de campos
        document.getElementById('clientInput').disabled = true;
        document.getElementById('observationsTextarea').disabled = true;
        document.getElementById('countrySelect').disabled = true;
        document.getElementById('personSelect').disabled = true;
        document.getElementById('crop').disabled = true;
        document.getElementById('severity').disabled = true;
        document.getElementById('sendAndDownloadButton').disabled = true;
 
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

        Swal.fire({
            title: 'Cargando...',
            text: 'Por favor, espera.',
            willOpen: () => {
                Swal.showLoading()
            },
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false
        });

        fetch("https://us-central1-agritecgeo.cloudfunctions.net/plantix-api-function", requestOptions)
        .then(response => response.json())
        .then(data => {
            try {
                // Convertir la cadena en la propiedad 'result' a un objeto JavaScript
                const resultArray = JSON.parse(data.result);
                tiempo = JSON.parse(data.tiempo_respuesta);

                // Verificar si 'resultArray' es realmente un arreglo
                if (Array.isArray(resultArray)) {
                    addToEvaluationTable(resultArray);
                    Swal.close();
                } else {
                    alert('Los datos recibidos en "result" no son un array.');
                }
            } catch (error) {
                // Manejar errores, por ejemplo, si 'result' no es una cadena JSON válida
                console.error('Error al analizar la respuesta de la API:', error);
                alert('Hubo un error al procesar la respuesta de la API.');
            }
        })
        .catch(error => console.log('error', error));     
        });
        


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
            newRow.insertCell(3).textContent = translateProbability(data.diagnosis_likelihood) || '';

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

    document.getElementById('saveEvaluationButton').addEventListener('click', function() {
        // Generar un ID único para la sesión de datos
        const uniqueID = `ID_${new Date().getTime()}`;
     
        // Recolectar datos comunes
        const clientInput = document.getElementById('clientInput').value;
        const country = document.getElementById('countrySelect').value;
        const person = document.getElementById('personSelect').value;
        const crop = document.getElementById('crop').value;
        const severity = document.getElementById('severity').value;
        const observationsDoc = document.getElementById('observationsTextarea').value;
     
        // Recolectar datos de la tabla de Documentación
        const docData = [];
        const docRows = document.getElementById('imageDetailsTable').getElementsByTagName('tbody')[0].rows;
        for (let i = 0; i < docRows.length; i++) {
            const row = docRows[i];
            docData.push({
                id: uniqueID,
                fechaHora: row.cells[1].textContent,
                latitud: row.cells[2].textContent,
                longitud: row.cells[3].textContent,
                correlativo: row.cells[4].textContent,
                cliente: clientInput,
                pais: country,
                persona: person,
                cultivo: crop,
                severidad: severity,
                tiempo_consulta: tiempo, 
                observaciones: observationsDoc
            });
        }
     
     
        // Recolectar datos de la tabla de Evaluación
        const evaluationData = [];
        const evalRows = document.getElementById('evaluationTable').getElementsByTagName('tbody')[0].rows;
        for (let i = 0; i < evalRows.length; i++) {
            const row = evalRows[i];
            evaluationData.push({
                id: uniqueID, // Mismo ID que el módulo de documentación
                commonName: row.cells[0].textContent,
                scientificName: row.cells[1].textContent,
                pathogen: row.cells[2].textContent,
                probability: row.cells[3].textContent,
                evaluation: row.cells[4].querySelector('select').value,
                observationsEval: document.getElementById('evaluationObservationsTextarea').value
            });
        }
     
        // Crear objeto de datos para enviar
        const dataToSave = {
            documentacion: docData,
            evaluacion: evaluationData
        };
     
        // Convertir los datos a formato JSON
        const jsonData = JSON.stringify(dataToSave, null, 2);
     
        // Obtener la fecha y hora actual para el nombre del archivo
        const now = new Date();
        const dateString = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
        const timeString = `${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
     
        // Generar el nombre del archivo incluyendo el ID único
        const filename = `evaluacion_${dateString}_${timeString}_${uniqueID}.json`;
        
        // Envio de JSon a API de Cloud Fnctions

        var formdata = new FormData();
        const fileInput = document.getElementById('imageLoader');
        formdata.append("data", jsonData);
        formdata.append("imagen", fileInput.files[0]);
        
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
          };
          
        Swal.fire({
            title: 'Cargando...',
            text: 'Por favor, espera.',
            willOpen: () => {
                Swal.showLoading()
            },
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false
        });    

        fetch("https://us-central1-agritecgeo.cloudfunctions.net/update-data-plantix", requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log(result);
                if (result === "Archivos guardados correctamente") {
                    Swal.close();
                    Swal.fire({
                        title: "¡Bien hecho!",
                        text: "Datos ingresados correctamente",
                        icon: "success"
                    });


                } else {
                    console.log("La respuesta de la API no es la esperada.");
                }
            })
            .catch(error => console.log('error', error));
        
    });
     

    function downloadJSON(jsonData, filename) {
        const blob = new Blob([jsonData], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }
     
});
