document.addEventListener("DOMContentLoaded", function() {
    let imageCount = 0; // Contador para el correlativo de imágenes

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

    // Botón para enviar a Plantix
    document.getElementById('sendToPlantixButton').addEventListener('click', function() {
        sendImagesToPlantix();
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

        const cellThumbnail = newRow.insertCell(0);
        const thumbnail = new Image();
        thumbnail.src = src;
        thumbnail.style.width = '50px';
        cellThumbnail.appendChild(thumbnail);

        newRow.insertCell(1).textContent = datetime;
        newRow.insertCell(2).textContent = latitude;
        newRow.insertCell(3).textContent = longitude;
        newRow.insertCell(4).textContent = `Foto ${count}`;
    }

    // Función para enviar imágenes a Plantix
    function sendImagesToPlantix() {
        const images = document.querySelectorAll('#imagePreviewContainer img');
        images.forEach((img, index) => {
            const imageData = img.src;
            if (imageData) {
                sendImageToPlantixApi(imageData, index);
            }
        });
    }

    function sendImageToPlantixApi(imageData, index) {
        const url = 'https://api.plantix.net/v2/image_analysis';
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Authorization', 'Bearer 2b0080cfd58f564046a1104db36c9163091c2a07');
        xhr.setRequestHeader('Content-Type', 'multipart/form-data');

        const formData = new FormData();
        formData.append('image', imageData);
        formData.append('application_used_image_gallery', false);

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                console.log('Imagen ' + index + ' enviada con éxito');
                // Aquí podrías manejar la respuesta de la API
            }
        }
        xhr.send(formData);
    }
});
