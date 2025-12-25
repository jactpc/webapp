<?php
session_start();
require_once '../db.php';

if (!isset($_SESSION['admin'])) {
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit;
}

$materialId = $_GET['material_id'] ?? 0;
$colorId = $_GET['color_id'] ?? 0;

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
  AND (da.color_id = ? OR da.color_id IS NULL)
  AND da.active = 1
  AND da.side IN ('front', 'back', 'leftsleeve', 'rightsleeve', 'thumbnail')
ORDER BY 
    da.side,
    CASE 
        WHEN da.color_id = ? THEN 1  -- Prioridad 1: color específico
        WHEN da.color_id IS NULL THEN 2  -- Prioridad 2: genérico
        ELSE 3
    END,
    da.priority
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("iii", $materialId, $colorId, $colorId);
$stmt->execute();
$result = $stmt->get_result();

$assets = [];
while ($row = $result->fetch_assoc()) {
    $side = $row['side'];
    // Agregar prefijo ../img/ a la URL de la imagen si existe
    if (!empty($row['image_url'])) {
        $row['image_url'] = '../' . $row['image_url'];
    }
    // Solo mantener el primer registro por lado (el de mayor prioridad)
    if (!isset($assets[$side])) {
        $assets[$side] = $row;
    }
}

echo json_encode(['success' => true, 'assets' => $assets]);
?>