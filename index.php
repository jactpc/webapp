<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Diseñador de Camisetas</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Playwrite+AU+SA&family=Tomorrow:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">

</head>
<body>
    <!-- Hero Section -->
    <div class="hero">
        <h1>Diseña tu Camiseta Personalizada</h1>
        <p>Elige colores, tamaños y añade tus propios diseños. ¡Crea algo único!</p>
        <button onclick="scrollToFeatures()">Comenzar</button>
    </div>
    <!-- Features Section -->
    <div class="features" id="features">
        <div class="feature-card">
            <h3>Variedad de Colores</h3>
            <p>Escoge entre una amplia gama de colores para tu camiseta.</p>
            <div class="color-buttons">
                <div class="color-button color-black" onclick="changeTshirtColor('black', this)"></div>
                <div class="color-button color-white" onclick="changeTshirtColor('white', this)"></div>
                <div class="color-button color-gray" onclick="changeTshirtColor('gray', this)"></div>
                <div class="color-button color-red" onclick="changeTshirtColor('red', this)"></div>
                <div class="color-button color-blue" onclick="changeTshirtColor('blue', this)"></div>
            </div>
        </div>
        <div class="feature-card">
            <h3>Diversidad de Tamaños</h3>
            <p>Disponemos de tallas desde XXS hasta XXL para todos los gustos.</p>
            <div class="size-buttons">
                <div class="size-button">XXS<span class="quantity" id="quantity-XXS" contenteditable="true">0</span></div>
                <div class="size-button">XS<span class="quantity" id="quantity-XS" contenteditable="true">0</span></div>
                <div class="size-button">S<span class="quantity" id="quantity-S" contenteditable="true">0</span></div>
                <div class="size-button">M<span class="quantity" id="quantity-M" contenteditable="true">0</span></div>
                <div class="size-button">L<span class="quantity" id="quantity-L" contenteditable="true">0</span></div>
                <div class="size-button">XL<span class="quantity" id="quantity-XL" contenteditable="true">0</span></div>
                <div class="size-button">XXL<span class="quantity" id="quantity-XXL" contenteditable="true">0</span></div>
            </div>
        </div>

        <div class="feature-card">
            <h3>Personalización Total</h3>
            <p>Agrega texto, imágenes o logos de tu preferencia.</p>
            <div class="tabs">
                <div class="tab active" data-tab="front" onclick="switchTab('front')">Pecho</div>
                <div class="tab" data-tab="back" onclick="switchTab('back')">Espalda</div>
                <div class="tab" data-tab="leftsleeve" onclick="switchTab('leftsleeve')">Manga Izquierda</div>
                <div class="tab" data-tab="rightsleeve" onclick="switchTab('rightsleeve')">Manga Derecha</div>
            </div>
            <div id="text-message" style="display: none;">¡Texto agregado!</div>
            <div class="canvas-container" id="front-canvas-container">
                <canvas id="front-canvas" width="620" height="800"></canvas>
            </div>
            <div class="canvas-container" id="back-canvas-container" style="display:none;">
                <canvas id="back-canvas" width="620" height="800"></canvas>
            </div>
            <div class="canvas-container" id="leftsleeve-canvas-container" style="display:none;">
                <canvas id="leftsleeve-canvas" width="620" height="800"></canvas>
            </div>
            <div class="canvas-container" id="rightsleeve-canvas-container" style="display:none;">
                <canvas id="rightsleeve-canvas" width="620" height="800"></canvas>
            </div>
            <div class="zoom-controls">
                <button class="button controlsbtn" onclick="addText()">✍️</button>
                <button class="button controlsbtn" onclick="addImage()">🖼️</button>
                <button id="zoom-in" onclick="zoomIn()">✚</button>
                <button id="zoom-out" onclick="zoomOut()">-</button>
                <button id="reset-zoom" onclick="resetZoom()">🔄</button>
            </div>
            <div class="mini-map-container">
                <canvas id="mini-map" width="150" height="200"></canvas>
            </div>

            <div class="controls">
                <div id="context-menu" class="context-menu" style="display:none;">
                    <div class="toolbar" id="text-toolbar">
                        <label for="text-color">Color de Texto:</label>
                        <input type="color" id="text-color" oninput="updateTextColor()">

                        <label for="text-size">Tamaño:</label>
                        <input type="number" id="text-size" value="24" min="10" max="100" onchange="updateTextSize()">
                        
                        <label for="text-font">Fuente:</label>
                        <select id="text-font" onchange="updateTextFont()">
                            <option value="Arial">Arial</option>
                            <option value="VT323">VT323</option>
                            <option value="Pacifico">Pacifico</option>
                            <option value="Lato100">Lato (Light)</option>
                            <option value="Lato900">Lato (Bold)</option>
                            <option value="Playwrite AU SA">Playwrite Australia SA</option>
                            <option value="Tomorrow">Tomorrow</option>
                            <option value="Roboto">Roboto</option>
                            <option value="Montserrat">Montserrat</option>
                            <option value="Open Sans">Open Sans</option>
                            <option value="Oswald">Oswald</option>
                            <option value="Raleway">Raleway</option>
                            <option value="Merriweather">Merriweather</option>
                            <option value="Dancing Script">Dancing Script</option>
                            <option value="Bebas Neue">Bebas Neue</option>
                        </select>

                        <label for="text-border">Borde:</label>
                        <input type="color" id="text-border" oninput="updateTextBorder()">

                        <button class="dlt" onclick="deleteSelectedObject()">Eliminar</button>
                    </div>

                    <div class="toolbar" id="image-toolbar">
                        <label for="image-border">Borde:</label>
                        <input type="color" id="image-border" oninput="updateImageBorder()">
                        <button class="dlt" onclick="deleteSelectedObject()">Eliminar</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="feature-card">
        <h3>Previsualización</h3>
        <div id="preview-container" class="grid grid-cols-2 gap-2">
            <canvas id="preview-front" width="180" height="220" class="border" onclick="switchTab('front')"></canvas>
            <canvas id="preview-back" width="180" height="220" class="border" onclick="switchTab('back')"></canvas>
            <canvas id="preview-leftsleeve" width="180" height="220" class="border" onclick="switchTab('leftsleeve')"></canvas>
            <canvas id="preview-rightsleeve" width="180" height="220" class="border" onclick="switchTab('rightsleeve')"></canvas>
        </div>
        </div>
        <div class="feature-card">
            <h3>Descargar</h3>
            <button onclick="exportDesign()">Descargar PNG</button>
        </div>
    </div>

    <input type="file" id="image-input" style="display: none;" accept="image/*" onchange="uploadImage()">

    <script src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/4.5.0/fabric.min.js"></script>
    <div class="footer">
        <p>© 2025 Diseñador de Camisetas. Todos los derechos reservados.</p>
    </div>
    <script>
        // === Diseñador de Camisetas — JS optimizado (reemplaza tu <script> actual) ===
// Requisitos: Fabric.js 4.x ya cargado en la página

/*
Cambios clave:
- Estado por pestaña (objetos y fondo) sin perder diseños al cambiar color o pestaña.
- Cambio de color solo altera el fondo, NO borra objetos.
- Menú contextual flotante junto al objeto seleccionado.
- Zoom centrado con zoomToPoint() y mini-mapa sincronizado.
- Mejor manejo de fuentes y de eventos por pestaña.
- Función exportDesign() para descargar PNG del lienzo activo.
*/

// ——— DOM fijos ———
const deleteIcon = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E"; // tu SVG codificado
const contextMenu = document.getElementById('context-menu');
const textToolbar = document.getElementById('text-toolbar');
const imageToolbar = document.getElementById('image-toolbar');

// ——— Canvases (uno por sección) ———
const canvases = {
  front: new fabric.Canvas('front-canvas'),
  back: new fabric.Canvas('back-canvas'),
  leftsleeve: new fabric.Canvas('leftsleeve-canvas'),
  rightsleeve: new fabric.Canvas('rightsleeve-canvas')
};

let selectedTab = 'front';
let currentColor = 'black';

// Estado por sección: JSON de objetos + src de fondo actual
const sectionsState = {
  front: { json: null, bgSrc: `img/1.front.${currentColor}.jpg` },
  back: { json: null, bgSrc: `img/1.back.${currentColor}.jpg` },
  leftsleeve: { json: null, bgSrc: `img/1.leftsleeve.${currentColor}.jpg` },
  rightsleeve: { json: null, bgSrc: `img/1.rightsleeve.${currentColor}.jpg` }
};

// ——— Utilidades de fondo ———
function loadBackground(section, renderNow = true) {
  const canvas = canvases[section];
  const url = sectionsState[section].bgSrc;
  fabric.Image.fromURL(url, (img) => {
    img.selectable = false;
    img.evented = false;
    img.scaleToWidth(canvas.width);
    img.scaleToHeight(canvas.height);
    canvas.setBackgroundImage(img, () => {
      if (renderNow) canvas.renderAll();
      updateMiniMap();
      updatePreviews();
    });
  }, { crossOrigin: 'anonymous' });
}

function saveSection(section) {
  const canvas = canvases[section];
  // Guardamos solo atributos útiles; el fondo se maneja aparte
  sectionsState[section].json = canvas.toJSON(['selectable', 'evented', 'stroke', 'fontFamily', 'fontSize', 'fill']);
}

function restoreSection(section) {
  const canvas = canvases[section];
  canvas.clear();
  const json = sectionsState[section].json || { objects: [] };
  canvas.loadFromJSON(json, () => {
    loadBackground(section);
    canvas.renderAll();
    updateMiniMap();
  });
}

// ——— Inicialización de fondos ———
['front','back','leftsleeve','rightsleeve'].forEach(sec => loadBackground(sec, false));

// ——— Cambio de pestaña ———
function switchTab(tab) {
  if (!tab || !canvases[tab]) {
    console.error('Pestaña no válida:', tab);
    return;
  }

  // Guardar el estado de la pestaña actual
  saveSection(selectedTab);

  // Actualizar pestaña
  selectedTab = tab;

  // Restaurar estado de la nueva pestaña
  restoreSection(selectedTab);

  // Actualizar UI de pestañas
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  const activeTabEl = document.querySelector(`.tab[data-tab="${tab}"]`);
  if (activeTabEl) activeTabEl.classList.add('active');

  // Mostrar solo el contenedor activo
  Object.keys(canvases).forEach(section => {
    const container = document.getElementById(`${section}-canvas-container`);
    if (container) container.style.display = (section === tab) ? 'flex' : 'none';
  });

  hideContextMenu();
  updateMiniMap();
}

// ——— Cambio de color de camiseta (solo fondo) ———
function changeTshirtColor(color, element) {
  currentColor = color;

  // Actualiza los fondos de todas las secciones
  Object.keys(canvases).forEach(section => {
    sectionsState[section].bgSrc = `img/1.${section}.${currentColor}.jpg`;
    loadBackground(section);
  });

  // Quita la clase active de todos
  document.querySelectorAll(".color-button").forEach(btn => {
    btn.classList.remove("active");
  });

  // Agrega la clase active al botón seleccionado
  if (element) element.classList.add("active");
}


// ——— Fuentes Google ———
const fonts = [
  { name: 'Tomorrow', url: 'https://fonts.gstatic.com/s/tomorrow/v17/WBLhrETNbFtZCeGqgR0dWnXBDMWDikd56VY.woff2' },
  { name: 'Playwrite AU SA', url: 'https://fonts.gstatic.com/s/playwriteausa/v4/YcmhsZpNS1SdgmHbGgtRuUElnR3CmSC5bVQVlrclpZgRcuBjDIV1.woff2' },
  { name: 'Lato900', url: 'https://fonts.gstatic.com/s/lato/v24/S6u9w4BMUTPHh50XSwiPGQ3q5d0.woff2' },
  { name: 'Lato100', url: 'https://fonts.gstatic.com/s/lato/v24/S6u8w4BMUTPHh30AXC-qNiXg7Q.woff2' },
  { name: 'VT323', url: 'https://fonts.gstatic.com/s/vt323/v17/pxiKyp0ihIEF2isfFJXUdVNF.woff2' },
  { name: 'Pacifico', url: 'https://fonts.gstatic.com/s/pacifico/v22/FwZY7-Qmy14u9lezJ-6H6MmBp0u-.woff2' },
  { name: 'Roboto', url: 'https://cdn.jsdelivr.net/fontsource/fonts/roboto-flex@latest/latin-400-normal.woff2' },
  { name: 'Montserrat', url: 'https://cdn.jsdelivr.net/fontsource/fonts/montserrat:vf@latest/latin-wght-normal.woff2' },
  { name: 'Open Sans', url: 'https://cdn.jsdelivr.net/fontsource/fonts/open-sans@latest/latin-400-normal.woff2' },
  { name: 'Oswald', url: 'https://cdn.jsdelivr.net/wp/themes/airin-blog/1.5.2/fonts/oswald/oswald.woff2' },
  { name: 'Raleway', url: 'https://cdn.jsdelivr.net/fontsource/fonts/raleway:vf@latest/latin-wght-normal.woff2' },
  { name: 'Merriweather', url: 'https://cdn.jsdelivr.net/fontsource/fonts/merriweather:vf@latest/latin-wght-normal.woff2' },
  { name: 'Dancing Script', url: 'https://cdn.jsdelivr.net/fontsource/fonts/dancing-script:vf@latest/latin-wght-normal.woff2' },
  { name: 'Bebas Neue', url: 'https://cdn.jsdelivr.net/fontsource/fonts/bebas-neue@latest/latin-400-normal.woff2' }
];


function loadFonts(list) {
  const fontPromises = list.map(font => {
    const ff = new FontFace(font.name, `url(${font.url})`);
    return ff.load().then(loaded => document.fonts.add(loaded)).catch(err => console.error('Fuente falló:', font.name, err));
  });
  return Promise.all(fontPromises);
}

loadFonts(fonts).then(() => console.log('Fuentes listas.'));

// ——— Agregar Texto ———
function addText() {
  const text = new fabric.IText('Texto', {
    left: 350,
    top: 200,
    fontSize: 24,
    fill: '#FF0000',
    borderColor: 'black',
    cornerColor: 'blue',
    cornerSize: 8,
    transparentCorners: false,
  });
  canvases[selectedTab].add(text);

  const message = document.getElementById('text-message');
  if (message) {
    message.style.display = 'block';
    setTimeout(() => (message.style.display = 'none'), 2000);
  }
}

function updateTextFont() {
  const font = document.getElementById('text-font')?.value;
  const active = canvases[selectedTab].getActiveObject();
  if (active && active.type === 'i-text' && font) {
    active.set('fontFamily', font);
    canvases[selectedTab].renderAll();
  }
}

function updateTextColor() {
  const active = canvases[selectedTab].getActiveObject();
  if (active && active.type === 'i-text') {
    active.set('fill', document.getElementById('text-color').value);
    canvases[selectedTab].renderAll();
  }
}

function updateTextSize() {
  const active = canvases[selectedTab].getActiveObject();
  if (active && active.type === 'i-text') {
    active.set('fontSize', parseInt(document.getElementById('text-size').value, 10));
    canvases[selectedTab].renderAll();
  }
}

function updateTextBorder() {
  const active = canvases[selectedTab].getActiveObject();
  if (active && active.type === 'i-text') {
    active.set('stroke', document.getElementById('text-border').value);
    canvases[selectedTab].renderAll();
  }
}

// ——— Imágenes ———
function addImage() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';

  input.onchange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const imgElement = new Image();
      imgElement.src = e.target.result;
      imgElement.onload = function () {
        const canvas = canvases[selectedTab];
        const imgW = imgElement.width;
        const imgH = imgElement.height;
        const scaleX = (canvas.width * 0.5) / imgW;
        const scaleY = (canvas.height * 0.5) / imgH;
        const scale = Math.min(scaleX, scaleY);

        const img = new fabric.Image(imgElement, {
          scaleX: scale,
          scaleY: scale,
        });

        // Centrar
        img.left = (canvas.width - img.width * scale) / 2;
        img.top = (canvas.height - img.height * scale) / 2.5;

        canvas.add(img);
        canvas.setActiveObject(img); // opcional, selecciona la imagen
        canvas.renderAll();

        uploadImageToServer(file); // opcional, requiere backend
      };
    };
    reader.readAsDataURL(file);
  };

  input.click();
}


function updateImageBorder() {
  const active = canvases[selectedTab].getActiveObject();
  if (active && active.type === 'image') {
    active.set('stroke', document.getElementById('image-border').value);
    canvases[selectedTab].renderAll();
  }
}

function uploadImageToServer(file) {
  // Esta función requiere upload_img.php en el servidor
  const formData = new FormData();
  formData.append('image', file);
  fetch('upload_img.php', { method: 'POST', body: formData })
    .then(r => r.json())
    .then(data => {
      if (data.success) console.log('Imagen subida:', data.filePath);
      else console.error('Error subida:', data.error);
    })
    .catch(err => console.error('Fallo subida:', err));
}

function uploadImage() {
  const input = document.getElementById('image-input');
  const file = input?.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    const imgElement = new Image();
    imgElement.src = e.target.result;
    imgElement.onload = function () {
      const img = new fabric.Image(imgElement, { left: 50, top: 50 });
      canvases[selectedTab].add(img);
    };
  };
  reader.readAsDataURL(file);
}

// ——— Menú contextual ———
function showContextMenu(pointer, canvasEl) {
  const canvas = canvases[selectedTab];
  const active = canvas.getActiveObject();
  if (!active) return;

  // Obtiene la posición del canvas en la página
  const rect = canvasEl.getBoundingClientRect();

  // Calcula la posición del objeto dentro del canvas
  const objLeft = active.left * canvas.getZoom() + canvas.viewportTransform[4];
  const objTop = active.top * canvas.getZoom() + canvas.viewportTransform[5];
  const objHeight = (active.height || 0) * active.scaleY * canvas.getZoom();

  // Posiciona el menú justo debajo del objeto
  contextMenu.style.left = `${rect.left + window.scrollX + objLeft}px`;
  contextMenu.style.top = `${rect.top + window.scrollY + objTop + objHeight + 8}px`; // 8px de separación
  contextMenu.style.display = 'block';

  // Muestra la barra correspondiente
  if (active.type === 'i-text') {
    textToolbar.style.display = 'block';
    imageToolbar.style.display = 'none';
    // precargar valores
    const tc = document.getElementById('text-color');
    const ts = document.getElementById('text-size');
    const tf = document.getElementById('text-font');
    if (tc) tc.value = active.fill || '#000000';
    if (ts) ts.value = active.fontSize || 24;
    if (tf) tf.value = active.fontFamily || 'Arial';
  } else if (active.type === 'image') {
    textToolbar.style.display = 'none';
    imageToolbar.style.display = 'block';
  }
}

function hideContextMenu() {
  contextMenu.style.display = 'none';
}

function deleteSelectedObject() {
  const active = canvases[selectedTab].getActiveObject();
  if (active) canvases[selectedTab].remove(active);
}

// ——— Eventos por lienzo ———
Object.keys(canvases).forEach((key) => {
  const canvas = canvases[key];
  const canvasEl = document.getElementById(`${key}-canvas`);

  canvas.on('mouse:down', function (e) {
    if (key !== selectedTab) return;
    const pointer = canvas.getPointer(e.e);
    const active = canvas.getActiveObject();
    if (active && (active.type === 'i-text' || active.type === 'image')) {
      showContextMenu(pointer, canvasEl);
    } else {
      hideContextMenu();
    }
  });

  canvas.on('selection:created', () => {
    if (key !== selectedTab) return;
    const active = canvas.getActiveObject();
    if (!active) return;
    const pointer = { x: active.left || 0, y: active.top || 0 };
    showContextMenu(pointer, canvasEl);
  });

  canvas.on('selection:updated', () => {
    if (key !== selectedTab) return;
    const active = canvas.getActiveObject();
    if (!active) return;
    const pointer = { x: active.left || 0, y: active.top || 0 };
    showContextMenu(pointer, canvasEl);
  });

  canvas.on('selection:cleared', () => {
    if (key !== selectedTab) return;
    hideContextMenu();
  });
});

// ——— Mini-mapa ———
const miniMapCanvas = new fabric.Canvas('mini-map');
const miniMapScale = 0.25;

function updateMiniMap() {
  const mainCanvas = canvases[selectedTab];
  if (!mainCanvas) return;

  miniMapCanvas.clear();

  // Fondo
  if (mainCanvas.backgroundImage) {
    mainCanvas.backgroundImage.clone((bg) => {
      bg.scaleX = mainCanvas.backgroundImage.scaleX * miniMapScale;
      bg.scaleY = mainCanvas.backgroundImage.scaleY * miniMapScale;
      miniMapCanvas.setBackgroundImage(bg, miniMapCanvas.renderAll.bind(miniMapCanvas));
    });
  }

  // Objetos
  const toClone = mainCanvas.getObjects();
  toClone.forEach((obj) => {
    obj.clone((clone) => {
      if (clone.type === 'i-text') {
        clone.set({
          fontSize: (obj.fontSize || 24) * miniMapScale,
          left: (obj.left || 0) * miniMapScale,
          top: (obj.top || 0) * miniMapScale,
          selectable: false,
          evented: false
        });
      } else {
        clone.set({
          scaleX: (obj.scaleX || 1) * miniMapScale,
          scaleY: (obj.scaleY || 1) * miniMapScale,
          left: (obj.left || 0) * miniMapScale,
          top: (obj.top || 0) * miniMapScale,
          selectable: false,
          evented: false
        });
      }
      miniMapCanvas.add(clone);
      miniMapCanvas.renderAll();
    });
  });
}

Object.keys(canvases).forEach((key) => {
  const c = canvases[key];
  c.on('object:modified', updateMiniMap);
  c.on('object:added', updateMiniMap);
  c.on('object:removed', updateMiniMap);
  c.on('after:render', updateMiniMap);
});

miniMapCanvas.on('mouse:down', function (e) {
  const mainCanvas = canvases[selectedTab];
  const pointer = miniMapCanvas.getPointer(e.e);
  const scale = 1 / miniMapScale;
  const centerX = pointer.x * scale - mainCanvas.width / 2;
  const centerY = pointer.y * scale - mainCanvas.height / 2;
  const transform = mainCanvas.viewportTransform;
  transform[4] = -centerX;
  transform[5] = -centerY;
  mainCanvas.setViewportTransform(transform);
  mainCanvas.renderAll();
});

// ——— Zoom ———
function zoomIn() {
  const canvas = canvases[selectedTab];
  const zoom = canvas.getZoom() * 1.2;
  canvas.zoomToPoint({ x: canvas.width / 2, y: canvas.height / 2 }, zoom);
}

function zoomOut() {
  const canvas = canvases[selectedTab];
  const zoom = canvas.getZoom() / 1.2;
  canvas.zoomToPoint({ x: canvas.width / 2, y: canvas.height / 2 }, zoom);
}

function resetZoom() {
  const canvas = canvases[selectedTab];
  canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
  canvas.setZoom(1);
}

document.querySelectorAll(".quantity").forEach(span => {
  // Hacer editable
  span.setAttribute("contenteditable", "true");

  // Al hacer click, si es 0, se borra
  span.addEventListener("click", () => {
    if (span.textContent.trim() === "0") {
      span.textContent = "";
    }
  });

  // Mientras escribes, solo permitir dígitos y actualizar color
  span.addEventListener("input", () => {
    span.textContent = span.textContent.replace(/\D/g, "");
    
    const value = parseInt(span.textContent, 10);
    const button = span.closest(".size-button"); // Obtener contenedor

    if (!isNaN(value) && value >= 1) {
      span.style.color = "white";
      button.classList.add("active"); // marcar como activo
    } else {
      span.style.color = "black";
      button.classList.remove("active"); // quitar activo
    }
  });

  // Al perder foco, si queda vacío poner 0
  span.addEventListener("blur", () => {
    if (span.textContent.trim() === "") {
      span.textContent = "0";
      span.style.color = "black";
      span.closest(".size-button").classList.remove("active");
    }
  });
});




function addSize(size) {
  console.log(`Se seleccionó la talla ${size}`);
}

// ——— Scroll ———
function scrollToFeatures() {
  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
}

// ——— Exportar PNG ———
function exportDesign() {
  const dataURL = canvases[selectedTab].toDataURL({ format: 'png', quality: 1 });
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = `${selectedTab}-camiseta.png`;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

fabric.Object.prototype.controls.deleteControl = new fabric.Control({
  x: 0.5, // derecha
  y: -0.5, // arriba
  offsetY: -10,
  offsetX: 10,
  cursorStyle: 'pointer',
  mouseUpHandler: function(eventData, transform) {
    const target = transform.target;
    const canvas = target.canvas || transform.canvas; // asegurar acceso al canvas
    if (canvas) {
      canvas.remove(target);
      canvas.requestRenderAll();
    }
    return true;
  },
  render: function(ctx, left, top, styleOverride, fabricObject) {
    const size = 20; // tamaño del ícono
    const img = new Image();
    img.src = deleteIcon;
    ctx.drawImage(img, left - size/2, top - size/2, size, size);
  }
});


// Activar controles extendidos
canvases[selectedTab].on('object:added', (e) => {
  e.target.setControlsVisibility({ mt: true, mb: true, ml: true, mr: true, bl: true, br: true, tl: true, tr: true, mtr: true, deleteControl: true });
});

// ——— Exponer funciones globales si se usa inline en HTML ———
Object.assign(window, {
  switchTab,
  changeTshirtColor,
  addText,
  updateTextFont,
  updateTextColor,
  updateTextSize,
  updateTextBorder,
  addImage,
  uploadImage,
  updateImageBorder,
  deleteSelectedObject,
  scrollToFeatures,
  zoomIn,
  zoomOut,
  resetZoom,
  exportDesign
});
// Canvases de preview (minimap)
const previews = {
  front: document.getElementById('preview-front'),
  back: document.getElementById('preview-back'),
  leftsleeve: document.getElementById('preview-leftsleeve'),
  rightsleeve: document.getElementById('preview-rightsleeve'),
};
function updatePreviews() {
  Object.keys(canvases).forEach((key) => {
    const mainCanvas = canvases[key];
    const previewCanvas = previews[key];
    const ctx = previewCanvas.getContext("2d");

    if (!mainCanvas || !previewCanvas) return;

    // fuerza render en el canvas principal
    mainCanvas.renderAll();

    // Limpia el preview
    ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);

    // Saca imagen en tamaño completo del canvas
    const dataURL = mainCanvas.toDataURL("png");

    const img = new Image();
    img.onload = () => {
      // Escala automáticamente a las dimensiones del preview
      ctx.drawImage(img, 0, 0, previewCanvas.width, previewCanvas.height);
    };
    img.src = dataURL;
  });
}


// Actualizar previews cada vez que cambie algo en los canvases
Object.values(canvases).forEach((canvas) => {
  canvas.on('object:modified', updatePreviews);
  canvas.on('object:added', updatePreviews);
  canvas.on('object:removed', updatePreviews);
});

Object.values(canvases).forEach((canvas) => {
  const canvasEl = canvas.upperCanvasEl; // canvas HTML real
  let lastDistance = 0;

  canvasEl.addEventListener('touchmove', function(e) {
    if (e.touches.length === 2) {
      e.preventDefault(); // evitar scroll

      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const distance = Math.sqrt(dx*dx + dy*dy);

      if (lastDistance) {
        const zoomFactor = distance / lastDistance;
        // Centro del gesto
        const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - canvasEl.getBoundingClientRect().left;
        const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - canvasEl.getBoundingClientRect().top;

        canvas.zoomToPoint({ x: centerX, y: centerY }, canvas.getZoom() * zoomFactor);
      }

      lastDistance = distance;
      canvas.renderAll();
    }
  });

  canvasEl.addEventListener('touchend', function(e) {
    if (e.touches.length < 2) lastDistance = 0;
  });
});

    </script>
</body>
</html>