document.addEventListener("DOMContentLoaded", function () {
    let imageCount = 0; // Contador para el correlativo de imágenes

    // Lista de cultivos en español (solo hortalizas, papa y café)
    const cropsList = ["Hortaliza", "Papa", "Café"];

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

    var selecionado;
    document.getElementById('crop').addEventListener('change', function (parametro) {
        selecionado= parametro.target.value;
    });

    // Función para enviar la imagen a la API y manejar la respuesta
    sendToAPIButton.addEventListener('click', function () {
        const currentImage = document.querySelector("#imageDetailsTable tbody tr:last-child img");
        const currentRow = document.querySelector("#imageDetailsTable tbody tr:last-child");
        const cropSelected = currentRow.cells[5].querySelector('select').value;

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

    function addToEvaluationTable(apiData) {
        const evalTable = document.getElementById('evaluationTable').getElementsByTagName('tbody')[0];

        apiData.forEach(data => {
            const newRow = evalTable.insertRow();

            newRow.insertCell(0).textContent = data.common_name || '';
            newRow.insertCell(1).textContent = data.scientific_name || '';
            newRow.insertCell(2).textContent = data.pathogen_class || '';
            newRow.insertCell(3).textContent = data.diagnosis_likelihood || '';
            newRow.insertCell(4).textContent = data.treatment_chemical || '';

            const vfSelectCell = newRow.insertCell(5);
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
