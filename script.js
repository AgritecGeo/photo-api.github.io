document.addEventListener("DOMContentLoaded", function() {
    // Código para cargar y previsualizar imágenes
    document.getElementById('imageLoader').addEventListener('change', function(e) {
        handleImage(e, addImageToPreview);
    }, false);

    // Configurar la cámara
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const cameraButton = document.getElementById('cameraButton');

    // Solicitar acceso a la cámara
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
            video.srcObject = stream;
            video.play();
        });
    }

    // Capturar foto y agregar a la previsualización
    cameraButton.addEventListener('click', function() {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        video.style.display = 'none';
        canvas.style.display = 'none';
        addImageToPreview(canvas.toDataURL('image/png'));
    });

    // Mostrar ubicación
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const locationElement = document.getElementById('location');
            locationElement.textContent = 'Ubicación: Latitud ' + position.coords.latitude + ', Longitud ' + position.coords.longitude;
        });
    }

    // Mostrar fecha y hora
    const datetimeElement = document.getElementById('datetime');
    datetimeElement.textContent = 'Fecha y Hora: ' + new Date().toLocaleString();
});

// Funciones para manejar y previsualizar imágenes
function handleImage(e, callback) {
    const reader = new FileReader();
    reader.onload = function(event) {
        callback(event.target.result);
    }
    reader.readAsDataURL(e.target.files[0]);
}

function addImageToPreview(src) {
    const container = document.getElementById('imagePreviewContainer');
    const preview = document.createElement('div');
    preview.classList.add('image-preview');

    const img = new Image();
    img.src = src;
    preview.appendChild(img);

    const removeButton = document.createElement('button');
    removeButton.textContent = 'X';
    removeButton.classList.add('remove-image');
    removeButton.onclick = function() {
        container.removeChild(preview);
    };
    preview.appendChild(removeButton);

    container.appendChild(preview);
}