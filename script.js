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
        reader.readAsDataURL(e.target.files[0]);
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
        newRow.insertCell(4).textContent = `Foto_${count}_${datetime.replaceAll(' ', '_').replaceAll(':', '').replaceAll('/', '')}`;

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

    // Manejador de eventos para el botón de enviar
    sendToAPIButton.addEventListener('click', function() {
        // Obtener el correlativo de la última imagen cargada
        const lastImageRow = document.querySelector("#imageDetailsTable tbody tr:last-child");
        if (lastImageRow) {
            const correlativo = lastImageRow.cells[4].textContent;
            addToEvaluationTable(correlativo);
        }
    });

    // Función para agregar detalles a la tabla de evaluación
    function addToEvaluationTable(correlativo) {
        const evalTable = document.getElementById('evaluationTable').getElementsByTagName('tbody')[0];
        const diagnoses = [
            { label: 'Enfermedad', value: 'Rust of coffee' },
            { label: 'Nombre Científico', value: 'Hemileia vastatrix' },
            { label: 'Clase de Patógeno', value: 'fungi' },
            { label: 'Diagnóstico', value: 'very_likely' },
            { label: 'Tratamientos o Medidas Preventivas', value: 'Plant more than one coffee variety and avoid monocultures.' },
            { label: 'Tratamientos o Medidas Preventivas', value: 'Practice wider spacing and appropriate pruning to prevent prolonged wetness and to increase penetration of fungicides sprayed into the tree canopy.' },
            { label: 'Tratamientos o Medidas Preventivas', value: 'Use more plants and shrubs that act as natural barriers to the spread of the disease.' }
        ];

        diagnoses.forEach(diagnosis => {
            const newRow = evalTable.insertRow();
            newRow.insertCell(0).textContent = correlativo;
            newRow.insertCell(1).textContent = `${diagnosis.label}: ${diagnosis.value}`;
            const vfSelectCell = newRow.insertCell(2);
            const vfSelect = document.createElement('select');
            ["Verdadero", "Falso"].forEach(optionText => {
                const option = document.createElement('option');
                option.value = optionText;
                option.textContent = optionText;
                vfSelect.appendChild(option);
            });
            vfSelectCell.appendChild(vfSelect);
        });
    }
});
