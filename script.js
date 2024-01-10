document.addEventListener("DOMContentLoaded", function() {
    let imageCount = 0; // Contador para el correlativo de imágenes

    // Lista de cultivos
    const cropsList = [
        "apple", "banana", "bean", "carrot", "cabbage", "cauliflower",
        "citrus", "coffee", "cucumber", "eggplant", "corn", "mango",
        "melon", "pepper", "peach", "papaya", "onion", "potato",
        "rice", "sorghum", "soy", "strawberries", "cane", "sweet potato",
        "tomato", "wheat", "zucchini"
    ];

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
    const sendToAPIButton = document.getElementById('sendAndDownloadButton'); 

    // Activar cámara
    cameraButton.addEventListener('click', function() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
                video.srcObject = stream;
                video.play();
                video.style.display = 'block';
                takePhotoButton.style.display = 'block';
            });
        }
    });

    // Tomar foto
    takePhotoButton.addEventListener('click', function() {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        handleImage({target: {files: [canvas.toDataURL('image/png')]}}, addImageToPreview);
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
        const correlativo = `Foto_${count}_${datetime.replaceAll(' ', '_').replaceAll(':', '').replaceAll('/', '')}`;
        newRow.insertCell(4).textContent = correlativo;

        // Columna de selección de cultivo
        const cropSelectCell = newRow.insertCell(5);
        const cropSelect = document.createElement('select');
        cropsList.forEach(crop => {
            const option = document.createElement('option');
            option.value = crop;
            option.textContent = crop;
            cropSelect.appendChild(option);
        });
        cropSelectCell.appendChild(cropSelect);
    }

    // Función para cargar y analizar el archivo CSV
    function loadCSV(url) {
        return fetch(url)
            .then(response => response.text())
            .then(csvText => Papa.parse(csvText, { header: true }).data);
    }

    // Función para enviar la imagen a la API y manejar la respuesta
    sendToAPIButton.addEventListener('click', function() {
        // Cargar el archivo CSV
        loadCSV('https://filedn.com/lRAMUKU4tN3HUnQqI5npg4H/Plantix/diagnosticos_plantix.csv')
            .then(data => {
                // Suponemos que data es un array de objetos donde cada objeto representa una fila del CSV
                const imageDetailsRows = document.querySelectorAll("#imageDetailsTable tbody tr");
                imageDetailsRows.forEach((row, index) => {
                    const correlativo = row.cells[4].textContent;
                    const diagnosisInfo = data.find(diag => diag.Correlativo === correlativo);
                    if (diagnosisInfo) {
                        addToEvaluationTable(correlativo, diagnosisInfo['Diagnóstico']);
                    }
                });
            })
            .catch(error => {
                console.error('Error al cargar el archivo CSV:', error);
                displayStatusMessage('Error al cargar el archivo CSV: ' + error.message);
            });
    });

    // Función para agregar la respuesta de la API a la segunda tabla
    function addToEvaluationTable(correlativo, diagnosis) {
        const evalTable = document.getElementById('evaluationTable').getElementsByTagName('tbody')[0];
        const newRow = evalTable.insertRow();

        newRow.insertCell(0).textContent = correlativo;
        newRow.insertCell(1).textContent = diagnosis; // Aquí agregas la información del CSV

        // Menú desplegable para Verdadero/Falso
        const vfSelectCell = newRow.insertCell(2);
        const vfSelect = document.createElement('select');
        ["Verdadero", "Falso"].forEach(optionText => {
            const option = document.createElement('option');
            option.value = optionText;
            option.textContent = optionText;
            vfSelect.appendChild(option);
        });
        vfSelectCell.appendChild(vfSelect);
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
