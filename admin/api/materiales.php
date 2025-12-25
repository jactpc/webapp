<?php
session_start();
require_once '../db.php';

if (!isset($_SESSION['admin'])) {
    echo json_encode([]);
    exit;
}

// Consulta para obtener materiales con sus colores y thumbnails
$sql = "SELECT * FROM material_polera;";

$result = $conn->query($sql);
$materials = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $materials[] = $row;
    }
}

echo json_encode($materials);
?>