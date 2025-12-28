<?php
session_start();
require_once '../db.php';

header('Content-Type: application/json');

if (!isset($_SESSION['admin'])) {
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit;
}

// Leer datos JSON del cuerpo de la solicitud
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['material_id']) || !isset($input['side'])) {
    echo json_encode(['success' => false, 'message' => 'Datos inválidos']);
    exit;
}

$materialId = intval($input['material_id']);
$side = $conn->real_escape_string($input['side']);
$areaX = isset($input['area_x']) ? intval($input['area_x']) : null;
$areaY = isset($input['area_y']) ? intval($input['area_y']) : null;
$areaWidth = isset($input['area_width']) ? intval($input['area_width']) : null;
$areaHeight = isset($input['area_height']) ? intval($input['area_height']) : null;

try {
    // Verificar si ya existe un registro para este material/color/lado
    $checkSql = "SELECT id FROM design_assets 
                 WHERE material_id = ? 
                 AND side = ?";
    
    $checkStmt = $conn->prepare($checkSql);
    $checkStmt->bind_param("is", $materialId, $side);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();
    
    if ($checkResult->num_rows > 0) {
        // Actualizar registro existente
        $row = $checkResult->fetch_assoc();
        $assetId = $row['id'];
        
        $updateSql = "UPDATE design_assets 
                      SET area_x = ?, area_y = ?, area_width = ?, area_height = ?,
                          updated_at = NOW()
                      WHERE id = ?";
        
        $updateStmt = $conn->prepare($updateSql);
        $updateStmt->bind_param("iiiii", $areaX, $areaY, $areaWidth, $areaHeight, $assetId);
        $success = $updateStmt->execute();
        $action = 'updated';
        
    } else {
        // Insertar nuevo registro
        $insertSql = "INSERT INTO design_assets 
                     (material_id, color_id, side, area_x, area_y, area_width, area_height, created_at, updated_at)
                     VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())";
        
        $insertStmt = $conn->prepare($insertSql);
        $insertStmt->bind_param("isiiii", $materialId, $side, $areaX, $areaY, $areaWidth, $areaHeight);
        $success = $insertStmt->execute();
        $assetId = $conn->insert_id;
        $action = 'created';
    }
    
    if ($success) {
        echo json_encode([
            'success' => true,
            'message' => 'Área guardada correctamente',
            'action' => $action,
            'id' => $assetId,
            'side' => $side
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Error en la base de datos: ' . $conn->error
        ]);
    }
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>