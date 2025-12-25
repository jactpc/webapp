<?php
session_start();
$isLogged = isset($_SESSION['admin']);
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Admin Poleras</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="admin.css">
</head>
<body>

<?php if (!$isLogged): ?>
<!-- ================= LOGIN ================= -->
<div class="login">
  <h2>Acceso Administrador</h2>
  <input id="user" placeholder="Usuario">
  <input id="pass" type="password" placeholder="Contraseña">
  <button onclick="login()">Ingresar</button>
  <p id="login-error"></p>
</div>

<script src="admin-login.js"></script>

<?php else: ?>
<!-- ================= PANEL ================= -->
<nav class="menu">
  <button onclick="loadPedidos()">Pedidos</button>
  <button onclick="loadMaterial()">Administrar Prendas de Vestir</button>
  <button onclick="logout()">Salir</button>
</nav>

<div class="editor-container">
    <main id="content"></main>
    <div class="canvas-left">
        <div class="canvas-container" id="front-canvas-container">
            <canvas id="canvas-front" width="620" height="800"></canvas>
        </div>
        <div class="canvas-container hidden" id="back-canvas-container">
            <canvas id="canvas-back" width="620" height="800"></canvas>
        </div>
        <div class="canvas-container hidden" id="leftsleeve-canvas-container">
            <canvas id="canvas-leftsleeve" width="620" height="800"></canvas>
        </div>
        <div class="canvas-container hidden" id="rightsleeve-canvas-container">
            <canvas id="canvas-rightsleeve" width="620" height="800"></canvas>
        </div>
    </div>
    <div class="canvas-right">
        <h2 class="panel-title"> Fondo</h2>
        <div class="tabs">
            <div class="tab active" data-tab="front" onclick="switchOpt('front')">
                <span class="tab-title">Pecho</span>
            </div>
            <div class="tab" data-tab="back" onclick="switchOpt('back')">
                <span class="tab-title">Espalda</span>
            </div>
            <div class="tab" data-tab="leftsleeve" onclick="switchOpt('leftsleeve')">
                <span class="tab-title">Manga Izq.</span>
            </div>

            <div class="tab" data-tab="rightsleeve" onclick="switchOpt('rightsleeve')">
                <span class="tab-title">Manga Der.</span>
            </div>
        </div>
        <h2 class="panel-title">Opciones</h2>
        <div class="canvas-controls">

        <div class="tool-wrapper">
            <span class="tool-title">Area</span>

            <label>X
            <input type="number" id="rect-x">
            </label>

            <label>Y
            <input type="number" id="rect-y">
            </label>

            <label>Ancho
            <input type="number" id="rect-width">
            </label>

            <label>Alto
            <input type="number" id="rect-height">
            </label>
        </div>

        <div class="tool-wrapper">
            <span class="tool-title">Área de diseño</span>
            <button id="toggle-rect">Guardar</button>
        </div>

        </div>

    </div>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/4.5.0/fabric.min.js"></script>
<script src="admin.js"></script>

<?php endif; ?>

</body>
</html>
