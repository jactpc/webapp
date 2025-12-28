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
      .st0, .st1 {
        fill: none;
      }

      .st0, .st1, .st3 {
        stroke: #000;
        stroke-miterlimit: 10;
      }

      .st1 {
        stroke-dasharray: 2;
      }
      .st3 {
        fill: ' . $stFondo . ';
      }
    </style>
  </defs>
  <path id="side-sleeve" class="st3" d="M192.4,870.9s221.6,43.3,329.1,4.3c0,0-5.2-126.6-20.8-162.3-15.7-35.6-10-169.7-10-169.7l10.7-126.2,5.7-215.3s-4.3-120.5-44.9-136.2c-40.6-15.7-144-5.7-198.2,76.3-54.2,82-74.7,122.6-71.5,220.3v508.7h0Z"/>
  <path id="side" class="st3" d="M333.9,419.3s104.9,17.7,166.8-.9c0,0,21.6-140.7,29.4-156,0,0,31.4-114.2-65.6-137-97-22.8-137.1,89.9-140.5,104s-9.9,59-1.7,85.5c8.2,26.5,11.7,104.2,11.7,104.2v.2h-.1Z"/>
  <g id="Lines">
    <g id="side-lines">
      <path class="st0" d="M399.1,134.1c-3-17.4-6.1-34.8-10.5-51.8"/>
      <path class="st0" d="M390.9,891.7c0-154.9,0-309.2,1.9-464.8"/>
      <path class="st1" d="M335.9,384.3c11.5,2.6,23.2,4,34.8,5.1,25.3,2.3,50.8,2.4,76.1,1,19.8-1.1,39.4-3.2,59-6"/>
      <path class="st1" d="M335,392.9c11,2.5,22.3,3.9,33.5,5,25.5,2.5,51.2,2.7,76.7,1.3,20.2-1.1,40.4-3.2,60.4-6.1"/>
      <path class="st0" d="M260,151s113.2-98.4,217.4-70.6"/>
      <path class="st1" d="M195,844.2s186.8,39.6,323.2,7.5"/>
      <path class="st1" d="M195.1,836.9s186.8,39.6,323.2,7.5"/>
    </g>
  </g>
</svg>';
?>