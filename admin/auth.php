<?php
session_start();
require "../includes/db.php";

$user = $_POST['usuario'];
$pass = $_POST['password'];

$stmt = $pdo->prepare("SELECT * FROM usuarios WHERE usuario=?");
$stmt->execute([$user]);
$u = $stmt->fetch();

if ($u && password_verify($pass, $u['password'])) {
    $_SESSION['admin'] = $u['usuario'];
    header("Location: dashboard.php");
} else {
    header("Location: login.php?error=1");
}
