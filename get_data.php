<?php
//ini_set("display_errors", 1);
//error_reporting(E_ALL);
header('Content-Type: application/json');

$pdo = new PDO("mysql:host=localhost;dbname=camisetas;charset=utf8", "root", "");
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$type = $_GET["type"] ?? "";   // step1 | colors | sizes | design_assets
$material = $_GET["material"] ?? "";
$color = $_GET["color"] ?? "";

$response = [];

try {
    if ($type === "step1") {
        // Solo trae materiales
        $stmt = $pdo->query("
            SELECT LPAD(material_polera.id, 4, '0') AS id,
                   material_polera.nombre AS nombre,
                   material_polera.imgIcon AS imgIcon,
                   COUNT(*) AS cont
            FROM material_polera
            JOIN stock_polera ON material_polera.id = stock_polera.id_material
            GROUP BY material_polera.id
            ORDER BY id ASC
        ");
        $response["materials"] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    else if ($type === "colors" && !empty($material)) {
        // Trae colores según el material seleccionado
        $stmt = $pdo->prepare("
            SELECT LPAD(color_polera.id, 4, '0') AS id,
                   color_polera.nombre AS nombre,
                   color_polera.code_back AS code_back
            FROM color_polera
            JOIN stock_polera ON color_polera.id = stock_polera.id_color
            WHERE LPAD(stock_polera.id_material, 4, '0') = ?
            GROUP BY stock_polera.id_color
        ");
        $stmt->execute([$material]);
        $response["colors"] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    else if ($type === "sizes" && !empty($material) && !empty($color)) {
        // Trae tallas según material y color
        $stmt = $pdo->prepare("
            SELECT LPAD(tallas_polera.id, 4, '0') as id,
                   tallas_polera.nombre as nombre,
                   TRUNCATE(medidasx, 0) as x, TRUNCATE(medidasy, 0) as y
            FROM tallas_polera
            JOIN stock_polera ON tallas_polera.id = stock_polera.id_tallas
            WHERE LPAD(stock_polera.id_material, 4, '0') = ?
              AND LPAD(stock_polera.id_color, 4, '0') = ?
            GROUP BY tallas_polera.id
            ORDER BY tallas_polera.id ASC
        ");
        $stmt->execute([$material, $color]);
        $response["sizes"] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    elseif ($type == 'design_assets') {
        // Obtener assets de diseño
        if (empty($material) || empty($color)) {
            throw new Exception('Material y color requeridos');
        }
        
        $stmt = $pdo->prepare("
            SELECT * FROM design_assets 
            WHERE material_id = ? AND color_id = ? 
            AND active = 1 
            AND side IN ('front', 'back', 'leftsleeve', 'rightsleeve')
            ORDER BY priority ASC, side ASC
        ");
        
        // Asegurar que los IDs sean numéricos (sin padding)
        $material_id = ltrim($material, '0');
        $color_id = ltrim($color, '0');
        
        $stmt->execute([$material_id, $color_id]);
        $assets = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Si no hay assets, intentar con IDs con padding
        if (empty($assets)) {
            $stmt->execute([$material, $color]);
            $assets = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
        
        // Formatear respuesta
        $formattedAssets = [];
        foreach ($assets as $row) {
            $formattedAssets[] = [
                'id' => $row['id'],
                'material_id' => $row['material_id'],
                'color_id' => $row['color_id'],
                'side' => $row['side'],
                'name' => $row['name'],
                'image_url' => $row['image_url'],
                'priority' => (int)$row['priority'],
                'scale_x' => (float)$row['scale_x'],
                'scale_y' => (float)$row['scale_y'],
                'offset_x' => (int)$row['offset_x'],
                'offset_y' => (int)$row['offset_y'],
                'area_x' => $row['area_x'] !== null ? (int)$row['area_x'] : null,
                'area_y' => $row['area_y'] !== null ? (int)$row['area_y'] : null,
                'area_width' => $row['area_width'] !== null ? (int)$row['area_width'] : null,
                'area_height' => $row['area_height'] !== null ? (int)$row['area_height'] : null,
                'area_unit' => $row['area_unit'] ?: 'px'
            ];
        }
        
        $response = [
            'success' => true,
            'assets' => $formattedAssets,
            'count' => count($formattedAssets)
        ];
        
        // Si no hay assets, devolver un array vacío pero con éxito
        if (empty($formattedAssets)) {
            $response['message'] = 'No se encontraron assets de diseño para esta combinación';
        }
    }
    else {
        $response["error"] = "Tipo de consulta no válido o parámetros faltantes";
    }
} catch (Exception $e) {
    http_response_code(500);
    $response = [
        'success' => false,
        'error' => 'Error en la consulta: ' . $e->getMessage(),
        'type' => $type,
        'material' => $material,
        'color' => $color
    ];
}

echo json_encode($response);