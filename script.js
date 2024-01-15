document.addEventListener("DOMContentLoaded", function() {
    let imageCount = 0; // Contador para el correlativo de imágenes

    // Lista de cultivos en español con sus correspondientes valores en inglés
    const cropsList = {
        "Frijol": "Bean",
        "Zanahoria": "Carrot",
        "Repollo": "Cabbage",
        "Coliflor": "Cauliflower",
        "Pepino": "Cucumber",
        "Berenjena": "Eggplant",
        "Pimiento": "Pepper",
        "Cebolla": "Onion",
        "Papa": "Potato",
        "Camote": "Sweet_Potato",
        "Tomate": "Tomato",
        "Zucchini": "Zucchini",
        "Café": "Coffee"
    };

    // Manejar carga de imagen
    document.getElementById('imageLoader').addEventListener('change', function(e) {
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

    // Activar cámara
    cameraButton.addEventListener('click', function() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
                video.srcObject = stream;
                video.play();
                video.style.display = 'block';
                takePhotoButton.style.display = 'block';
                removePhotoButton.style.display = 'none';
            });
        }
    });

    // Tomar foto
    takePhotoButton.addEventListener('click', function() {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        handleImage({target: {files: [canvas.toDataURL('image/png')]}}, addImageToPreview);
        removePhotoButton.style.display = 'block';
    });

    // Eliminar foto
    removePhotoButton.addEventListener('click', function() {
        document.getElementById('imagePreview').innerHTML = '';
        removePhotoButton.style.display = 'none';
        imageCount--;
    });

    // Función para manejar imágenes y agregar previsualización
    function handleImage(e, callback) {
        const reader = new FileReader();
        reader.onload = function(event) {
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
            navigator.geolocation.getCurrentPosition(function(position) {
                latitude = position.coords.latitude.toFixed(6);
                longitude = position.coords.longitude.toFixed(6);
                addToTable(src, datetime, latitude, longitude, imageCount);
            }, function() {
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

        // Columna de selección de cultivo
        const cropSelectCell = newRow.insertCell(5);
        const cropSelect = document.createElement('select');
        for (const [cropName, cropValue] of Object.entries(cropsList)) {
            const option = document.createElement('option');
            option.value = cropValue;
            option.textContent = cropName;
            cropSelect.appendChild(option);
        }
        cropSelectCell.appendChild(cropSelect);
    }

    // Función para enviar la imagen a la API y manejar la respuesta
    sendToAPIButton.addEventListener('click', function() {
        const currentImage = document.querySelector("#imageDetailsTable tbody tr:last-child img");
        const currentRow = document.querySelector("#imageDetailsTable tbody tr:last-child");
        const cropSelected = currentRow.cells[5].querySelector('select').value;

        if (currentImage && cropSelected) {
            fetch(currentImage.src)
                .then(res => res.blob())
                .then(blob => {
                    const formData = new FormData();
                    formData.append('image', blob, 'image.png');
                    formData.append('crop', cropSelected);

                    fetch('https://api.plantix.net/v2/image_analysis', {
                        method: 'POST',
                        headers: {
                            'Authorization': '2b0080cfd58f564046a1104db36c9163091c2a07'
                        },
                        body: formData
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        addToEvaluationTable(currentRow.cells[4].textContent, data);
                        displayStatusMessage("Conexión Establecida Exitosamente");
                        document.getElementById('observationsTextarea').readOnly = true;
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        displayStatusMessage('Error: ' + error.message);
                    });
                });
        } else {
            displayStatusMessage("No hay una imagen cargada o no se seleccionó un cultivo.");
        }
    });

    function addToEvaluationTable(correlativo, apiData) {
        const evalTable = document.getElementById('evaluationTable').getElementsByTagName('tbody')[0];
        const newRow = evalTable.insertRow();

        // Agregar columnas con menús desplegables para calificar
        const columnsToAdd = 5; // Cantidad de columnas en las que se requiere el menú desplegable
        for (let i = 0; i < columnsToAdd; i++) {
            const cell = newRow.insertCell(i);
            const select = document.createElement('select');
            ["Verdadero", "Falso", "No lo sé"].forEach(optionText => {
                const option = document.createElement('option');
                option.value = optionText;
                option.textContent = optionText;
                select.appendChild(option);
            });
            cell.appendChild(select);
        }
    }

    function displayStatusMessage(message) {
        const statusContainer = document.getElementById('statusContainer');
        if (!statusContainer) {
            const newStatusContainer = document.createElement('div');
            newStatusContainer.id = 'statusContainer';
            newStatusContainer.style.color = 'blue';
            newStatusContainer.textContent = message;
            document.body.appendChild(newStatusContainer);
        } else {
            statusContainer.textContent = message;
        }
    }
});
