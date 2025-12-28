<?php
header('Content-Type: image/svg+xml');
header('Cache-Control: max-age=86400');

// Obtener el color del parámetro stFondo, por defecto #303030
$stFondo = isset($_GET['stFondo']) ? $_GET['stFondo'] : '303030';

// Validar que sea un color hexadecimal válido
if (!preg_match('/^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/', $stFondo)) {
    $stFondo = '303030';
}
$stFondo = '#' . $stFondo;
// El SVG original con el color dinámico
echo '<?xml version="1.0" encoding="UTF-8"?>
<svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 750.2 950.7">
  <!-- Generator: Adobe Illustrator 29.1.0, SVG Export Plug-In . SVG Version: 2.1.0 Build 142)  -->
  <defs>
    <style>
      .st0 {
        stroke-dasharray: 2 2;
      }

      .st0, .st1, .st2 {
        fill: none;
      }

      .st0, .st1, .st2, .st3 {
        stroke: #000;
        stroke-miterlimit: 10;
      }

      .st2 {
        stroke-dasharray: 2;
      }
      .st3 {
        fill: ' . $stFondo . ';
      }
    </style>
  </defs>
  <path id="front" class="st3" d="M665.7,215.6s71.4,173.1,76.7,174.1c0,0-100.5,62.6-105.3,59.9,0,0-16.6,8.6-38,4.8l-23-41.7,11.2,466.7s-49.7,31-202.6,20.8-103.7,9.6-231-24.1l21.4-468.9-25.1,45.4-26.2-2.1s-93.6-41.2-116-63.6l22.5-41.2,57.7-140.1,13.9-18.2,40.6-34.8,82.9-45.4,44.4-15,18.2-13.9s70.6,33.7,168.4,0l20.3,13.9s50.8,16,57.7,21.4l63.1,35.3,52.9,41.7s12.5,18.2,15.2,24.7v.3h0Z"/>
  <g id="Lines">
    <g id="Front-lines">
      <path class="st1" d="M156.9,871.4s84.5-3.2,139,15,132,6.4,132,6.4c0,0,115.5-33.7,160.4-15.5"/>
      <path class="st1" d="M158.5,837.4h1"/>
      <path class="st0" d="M161.4,837.3c15.5-.4,87.6-1.1,136,15.1,54.5,18.2,132,6.4,132,6.4,0,0,112.4-32.8,158.5-16.2"/>
      <path class="st1" d="M158.5,846.1h1"/>
      <path class="st0" d="M161.4,846c15.5-.4,87.6-1.1,136,15.1,54.5,18.2,132,6.4,132,6.4,0,0,112.4-32.8,158.5-16.2"/>
      <path class="st2" d="M591.3,431.8s56-11.1,135.1-69.2"/>
      <path class="st2" d="M594.2,437.2s56-11.1,135.1-69.1"/>
      <path class="st2" d="M24.9,361s41.3,39.3,134.5,70.4"/>
      <path class="st2" d="M22.2,366.4s41.3,39.3,134.5,70.4"/>
      <path class="st1" d="M176.1,406.8s11.2-99.8-72.4-221.6"/>
      <path class="st1" d="M654.2,191.6s-69.9,72.8-76.4,221"/>
      <path class="st1" d="M287.5,87.8s102,29,178.5,0"/>
      <path class="st1" d="M290.7,99.1s98.2,28.7,171.7-.5"/>
      <path class="st1" d="M272.2,89.6c1.6,16.1,13.5,74.5,100.3,70.8,100.5-4.3,98.9-43.8,108-68.4"/>
      <path class="st1" d="M286.1,78.8c2.7,26.5,19.3,50.9,44.5,59.9,30.3,11.4,64.4,5.7,94.7-1.9,24.6-7.6,37.9-28.4,42.1-53.5"/>
    </g>
  </g>
</svg>';
?>