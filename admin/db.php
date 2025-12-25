<?php
$conn = new mysqli("localhost", "root", "", "camisetas");
if ($conn->connect_error) {
    die("Error DB");
}
$conn->set_charset("utf8mb4");
