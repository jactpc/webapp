<?php
//ini_set("display_errors", 1);
//error_reporting(E_ALL);
header('Content-Type: application/json');

$pdo = new PDO("mysql:host=localhost;dbname=camisetas;charset=utf8", "root", "");
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$type = $_GET["type"] ?? "";   // step1 | colors | sizes
$material = $_GET["material"] ?? ""; // para el paso 2
$color = $_GET["color"] ?? "";

$response = [];

if ($type === "step1") {

    // Solo trae materiales
    $stmt = $pdo->query("
        SELECT LPAD(material_polera.id, 4, '0') AS id,
               material_polera.nombre AS nombre,
               material_polera.imgSrc AS imgSrc,
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

    $stmt = $pdo->prepare("
        SELECT LPAD(tallas_polera.id, 4, '0') as id,
               tallas_polera.nombre as nombre
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

echo json_encode($response);