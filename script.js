document.addEventListener("DOMContentLoaded", function() {
    let imageCount = 0; // Contador para el correlativo de imágenes

    // Lista de cultivos
    const cropsList = ["apple", "banana", "bean", "carrot", "cabbage", "cauliflower", "citrus", "coffee", "cucumber", "eggplant", "corn", "mango", "melon", "pepper", "peach", "papaya", "onion", "potato", "rice", "sorghum", "soy", "strawberries", "cane", "sweet potato", "tomato", "wheat", "zucchini"];

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

        newRow.insertCell(0).textContent = correlativo;
        newRow.insertCell(1).textContent = JSON.stringify(apiData);

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
    document.getElementById('imageLoader').addEventListener('change', function(event) {
        const imageFile = event.target.files[0];
        if (!imageFile) {
            console.log("No file selected.");
            return;
        }
        const token = '2b0080cfd58f564046a1104db36c9163091c2a07';
        const url = 'https://api.plantix.net/v2/image_analysis';
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('application_used_image_gallery', 'false');
       
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data', // Asegúrate de definir o tener el token
        };
   
        // Reemplaza 'url' con la URL de la API a la que deseas enviar la solicitud
        fetch(url, {
            method: 'POST',
            headers: headers,
            body: formData
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    });
    // ... (Cualquier otra lógica o funciones adicionales)

    // Ejemplo: Función para resetear la interfaz
    function resetInterface() {
        // Código para resetear elementos de la interfaz, si es necesario
    }

    // Ejemplo: Agregar eventos adicionales o lógica
    // document.getElementById('someElement').addEventListener('click', someFunction);

    // ... (resto del código)
});
