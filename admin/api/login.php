<?php
session_start();
require "../db.php";

$data = json_decode(file_get_contents("php://input"), true);
$user = $data['user'];
$pass = $data['pass'];

$stmt = $conn->prepare("SELECT id, password FROM usuarios WHERE usuario=?");
$stmt->bind_param("s", $user);
$stmt->execute();
$res = $stmt->get_result()->fetch_assoc();

if ($res && password_verify($pass, $res['password'])) {
    $_SESSION['admin'] = $res['id'];
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false]);
}
