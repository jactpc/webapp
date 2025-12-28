<?php
session_start();
require_once '../db.php';
error_reporting(E_ALL);
ini_set('display_errors', 1);
if (!isset($_SESSION['admin'])) {
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit;
}

$materialId = $_GET['material_id'] ?? 0;

// Consulta para obtener assets del material y color
$sql = "
SELECT 
    da.side,
    da.image_url,
    da.scale_x,
    da.scale_y,
    da.offset_x,
    da.offset_y,
    da.area_x,
    da.area_y,
    da.area_width,
    da.area_height,
    da.area_unit,
    da.name as area_name,
    da.active
FROM design_assets da
WHERE da.material_id = ?
  AND da.active = 1
  AND da.side IN ('front', 'back', 'leftsleeve', 'rightsleeve', 'thumbnail')
ORDER BY 
    da.side,
    da.priority
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $materialId);
$stmt->execute();
$result = $stmt->get_result();

$assets = [];
while ($row = $result->fetch_assoc()) {
    $side = $row['side'];
    if (!empty($row['image_url'])) {
        $row['image_url'] = '../' . $row['image_url'].'?stFondo=303030';
    }
    // Solo mantener el primer registro por lado (el de mayor prioridad)
    if (!isset($assets[$side])) {
        $assets[$side] = $row;
    }
}

echo json_encode(['success' => true, 'assets' => $assets]);
?>