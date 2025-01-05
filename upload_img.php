<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['image'])) {
    $targetDir = "img/uploads/";

    // Obtener la extensión del archivo
    $imageFileType = strtolower(pathinfo($_FILES["image"]["name"], PATHINFO_EXTENSION));

    // Generar un nombre único usando el timestamp
    $newFileName = time() . '.' . $imageFileType;

    // El archivo destino con el nuevo nombre
    $targetFile = $targetDir . $newFileName;

    // Verificar si el archivo es una imagen real
    if (getimagesize($_FILES["image"]["tmp_name"]) === false) {
        echo json_encode(["success" => false, "error" => "No es una imagen válida."]);
        exit;
    }

    // Mover el archivo al directorio de destino con el nuevo nombre
    if (move_uploaded_file($_FILES["image"]["tmp_name"], $targetFile)) {
        echo json_encode(["success" => true, "filePath" => $targetFile]);
    } else {
        echo json_encode(["success" => false, "error" => "Hubo un error al subir la imagen."]);
    }
} else {
    echo json_encode(["success" => false, "error" => "No se envió ninguna imagen."]);
}
?>

