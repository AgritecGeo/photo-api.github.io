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
    const sendToAPIButton = document.getElementById('sendAndDownloadButton'); // Botón para enviar la imagen a la API y descargar CSV

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

    // Función para agregar imágenes al contenedor de previsualización y a la tabla
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
        newRow.insertCell(4).textContent = `Foto ${count}`;

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

        // Columnas para respuesta de la API y opciones Verdadero/Falso
        newRow.insertCell(6); // Respuesta de la API
        const trueFalseCell = newRow.insertCell(7);
        const trueButton = document.createElement('button');
        trueButton.textContent = 'Verdadero';
        const falseButton = document.createElement('button');
        falseButton.textContent = 'Falso';
        trueFalseCell.appendChild(trueButton);
        trueFalseCell.appendChild(falseButton);
    }

    // Función para enviar la imagen a la API y descargar la respuesta como un archivo CSV
    sendToAPIButton.addEventListener('click', function() {
        // Obtener la imagen actual
        const currentImage = document.querySelector("#imageDetailsTable tbody tr:last-child img");
        
        // Verificar si hay una imagen cargada
        if (currentImage) {
            // Crear un objeto FormData y agregar la imagen
            const formData = new FormData();
            formData.append('image', currentImage.src);

            // Realizar la solicitud a la API
            fetch('https://api.example.com/image_analysis', {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                // Aquí puedes manejar la respuesta de la API y actualizar la tabla
                // Por ejemplo, agregar la respuesta a la columna correspondiente
            })
            .catch(error => console.error('Error:', error));
        } else {
            alert("No hay una imagen cargada para enviar a la API.");
        }
    });

    // Las funciones para generar y descargar el CSV podrían ir aquí si son necesarias
});
