
<?php
// Asegúrate de que los datos POST estén disponibles
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Decodificar JSON del cuerpo de la solicitud
    $data = json_decode(file_get_contents('php://input'), true);
 
    // Asignar los valores a variables
    $id = $data['id'];
    $fechaHora = $data['fechaHora'];
    $latitud = $data['latitud'];
    $longitud = $data['longitud'];
    $correlativo = $data['correlativo'];
    $cliente = $data['cliente'];
    $pais = $data['pais'];
    $persona = $data['persona'];
    $cultivo = $data['cultivo'];
    $observaciones = $data['observaciones'];
    $commonName = $data['commonName'];
    $scientificName = $data['scientificName'];
    $pathogen = $data['pathogen'];
    $probability = $data['probability'];
    $evaluation = $data['evaluation'];
    $observationsEval = $data['observationsEval'];
 
    // Abrir o crear el archivo CSV para añadir los datos
    $file = fopen("C:/Users/deromero/Desktop/JSON/JSON/registro_general.csv", "a");
 
    // Añadir los datos al archivo CSV
    fputcsv($file, array(
        $id, $fechaHora, $latitud, $longitud, $correlativo, $cliente, $pais, $persona, 
        $cultivo, $observaciones, $commonName, $scientificName, $pathogen, $probability, 
        $evaluation, $observationsEval
    ));
 
    // Cerrar el archivo
    fclose($file);
 
    // Enviar una respuesta al cliente
    echo json_encode(array("message" => "Datos guardados exitosamente."));
} else {
    // Manejar método de solicitud incorrecto
    echo json_encode(array("message" => "Método no permitido."));
}
 
?>