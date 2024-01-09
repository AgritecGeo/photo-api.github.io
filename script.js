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
    const sendToAPIButton = document.getElementById('sendImageToAPI'); // Botón para enviar la imagen a la API y descargar CSV

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
            fetch('https://api.plantix.net/v2/image_analysis', {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                // Generar el archivo CSV y descargarlo
                const csv = generateCSV(data);
                downloadCSV(csv);
            })
            .catch(error => console.error('Error:', error));
        } else {
            alert("No hay una imagen cargada para enviar a la API.");
        }
    });

   // Función para generar el contenido del archivo CSV a partir de los datos de la respuesta de la API
function generateCSV(data) {
    // Crear una cadena de encabezado CSV
    let csvData = 'Crop Health,Crops,Diagnoses,Diagnosis Likelihood,Scientific Name,Symptoms,Treatment (Chemical),Treatment (Organic)\n';

    // Iterar a través de los diagnósticos predichos en la respuesta de la API
    for (const diagnosis of data.predicted_diagnoses) {
        const cropHealth = data.crop_health;
        const crops = diagnosis.hosts.join(', '); // Convertir la matriz de cultivos en una cadena
        const commonName = diagnosis.common_name;
        const diagnosisLikelihood = diagnosis.diagnosis_likelihood;
        const scientificName = diagnosis.scientific_name;
        const symptoms = diagnosis.symptoms;
        const treatmentChemical = diagnosis.treatment_chemical;
        const treatmentOrganic = diagnosis.treatment_organic;

        // Escapar las comas en los campos de texto
        const escapedSymptoms = symptoms.replace(/,/g, ';');
        const escapedTreatmentChemical = treatmentChemical.replace(/,/g, ';');
        const escapedTreatmentOrganic = treatmentOrganic.replace(/,/g, ';');

        // Agregar una fila al archivo CSV
        csvData += `${cropHealth},${crops},${commonName},${diagnosisLikelihood},${scientificName},"${escapedSymptoms}","${escapedTreatmentChemical}","${escapedTreatmentOrganic}"\n`;
    }

    return csvData;
}

    // Función para descargar un archivo CSV
    function downloadCSV(csv) {
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'respuesta_api.csv'; // Nombre del archivo CSV
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
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
            fetch('https://api.plantix.net/v2/image_analysis', {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                // Generar el archivo CSV y descargarlo
                const csv = generateCSV(data);
                downloadCSV(csv);
            })
            .catch(error => console.error('Error:', error));
        } else {
            alert("No hay una imagen cargada para enviar a la API.");
        }
    });

   // Función para generar el contenido del archivo CSV a partir de los datos de la respuesta de la API
function generateCSV(data) {
    // Crear una cadena de encabezado CSV
    let csvData = 'Crop Health,Crops,Diagnoses,Diagnosis Likelihood,Scientific Name,Symptoms,Treatment (Chemical),Treatment (Organic)\n';

    // Iterar a través de los diagnósticos predichos en la respuesta de la API
    for (const diagnosis of data.predicted_diagnoses) {
        const cropHealth = data.crop_health;
        const crops = diagnosis.hosts.join(', '); // Convertir la matriz de cultivos en una cadena
        const commonName = diagnosis.common_name;
        const diagnosisLikelihood = diagnosis.diagnosis_likelihood;
        const scientificName = diagnosis.scientific_name;
        const symptoms = diagnosis.symptoms;
        const treatmentChemical = diagnosis.treatment_chemical;
        const treatmentOrganic = diagnosis.treatment_organic;

        // Escapar las comas en los campos de texto
        const escapedSymptoms = symptoms.replace(/,/g, ';');
        const escapedTreatmentChemical = treatmentChemical.replace(/,/g, ';');
        const escapedTreatmentOrganic = treatmentOrganic.replace(/,/g, ';');

        // Agregar una fila al archivo CSV
        csvData += `${cropHealth},${crops},${commonName},${diagnosisLikelihood},${scientificName},"${escapedSymptoms}","${escapedTreatmentChemical}","${escapedTreatmentOrganic}"\n`;
    }

    return csvData;
}

    // Función para descargar un archivo CSV
    function downloadCSV(csv) {
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'respuesta_api.csv'; // Nombre del archivo CSV
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    }
});
