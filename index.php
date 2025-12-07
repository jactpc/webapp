<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Diseñador de Camisetas</title>
  <link rel="stylesheet" href="styles.css">
  <link href="https://fonts.googleapis.com/css2?family=Playwrite+AU+SA&family=Tomorrow:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
</head>
<body>
  <!-- Hero Section -->
  <div class="hero" id="hero">
    <h1>Diseña tu Camiseta Personalizada</h1>
    <p>Elige colores, tamaños y añade tus propios diseños. ¡Crea algo único!</p>
    <button onclick="startDesignProcess()">Comenzar</button>
  </div>
  <div class="hero2 hidden" id="hero2">
    <h1>Diseña tu Polera</h1>
  </div>

<!-- Steps Indicator -->
  <div class="steps-container" id="steps-container" style="display: none;">
    <div class="step-indicator">
      <div class="step active" id="step-1">
        <div class="step-circle">1</div>
        <div class="step-title">Color</div>
        <div class="step-line"></div>
      </div>
      <div class="step" id="step-2">
        <div class="step-circle">2</div>
        <div class="step-title">Tallas</div>
        <div class="step-line"></div>
      </div>
      <div class="step" id="step-3">
        <div class="step-circle">3</div>
        <div class="step-title">Diseño</div>
        <div class="step-line"></div>
      </div>
      <div class="step" id="step-4">
        <div class="step-circle">4</div>
        <div class="step-title">Resumen</div>
        <div class="step-line"></div>
      </div>
    </div>
  </div>

  <!-- Features Section -->
    <div class="features" id="features" style="display: none;">
    <!-- Step 1: Color Selection -->
    <div class="feature-card active" id="step1-content">
      <h3>Paso 1: Elige el Color de tu Camiseta</h3>
      <p>Selecciona el color base para tu camiseta personalizada.</p>
      <div class="color-buttons">
        <div class="color-button color-black" onclick="selectColor('black', this)"></div>
        <div class="color-button color-white" onclick="selectColor('white', this)"></div>
        <div class="color-button color-gray" onclick="selectColor('gray', this)"></div>
        <div class="color-button color-red" onclick="selectColor('red', this)"></div>
        <div class="color-button color-blue" onclick="selectColor('blue', this)"></div>
      </div>
      <div class="step-validation" id="step1-validation">Por favor, selecciona un color para continuar</div>
    </div>
  <!-- Step 2: Size Selection -->
    <div class="feature-card" id="step2-content">
      <h3>Paso 2: Selecciona las Tallas y Cantidades</h3>
      <p>Elige las tallas que necesitas y especifica la cantidad para cada una.</p>
      <div class="size-buttons">
        <div class="size-button">XXS<span class="quantity" id="quantity-XXS" contenteditable="true">0</span></div>
        <div class="size-button">XS<span class="quantity" id="quantity-XS" contenteditable="true">0</span></div>
        <div class="size-button">S<span class="quantity" id="quantity-S" contenteditable="true">0</span></div>
        <div class="size-button">M<span class="quantity" id="quantity-M" contenteditable="true">0</span></div>
        <div class="size-button">L<span class="quantity" id="quantity-L" contenteditable="true">0</span></div>
        <div class="size-button">XL<span class="quantity" id="quantity-XL" contenteditable="true">0</span></div>
        <div class="size-button">XXL<span class="quantity" id="quantity-XXL" contenteditable="true">0</span></div>
      </div>
      <div class="step-validation" id="step2-validation">Por favor, selecciona al menos una talla e introduzca la cantidad</div>
    </div>

      <!-- Step 3: Design -->
    <div class="feature-card" id="step3-content">
      <h3>Paso 3: Personaliza tu Camiseta</h3>
      <p>Agrega texto, imágenes o logos de tu preferencia.</p>
      <div class="tabs">
        <div class="tab active" data-tab="front" onclick="switchTab('front')">Pecho</div>
        <div class="tab" data-tab="back" onclick="switchTab('back')">Espalda</div>
        <div class="tab" data-tab="leftsleeve" onclick="switchTab('leftsleeve')">Manga Izq.</div>
        <div class="tab" data-tab="rightsleeve" onclick="switchTab('rightsleeve')">Manga Der.</div>
      </div>
      <div id="text-message" style="display: none;">¡Texto agregado!</div>
      <div class="controls">
  <div id="context-menu" class="context-menu" style="display:none;">

    <!-- ====== TEXT TOOLBAR ====== -->
    <div class="toolbar" id="text-toolbar">

      <div class="tool-group">
        <div class="tool-label">
          <i class="material-icons">format_color_text</i> Color
        </div>
        <input type="color" id="text-color" oninput="updateTextColor()">
      </div>

      <div class="tool-group">
        <div class="tool-label">
          <i class="material-icons">text_fields</i> Tamaño
        </div>
        <input type="number" id="text-size" value="24" min="10" max="999" onchange="updateTextSize()">
      </div>

      <div class="tool-group">
        <div class="tool-label">
          <i class="material-icons">font_download</i> Fuente
        </div>
        <select id="text-font" onchange="updateTextFont()">
          <option value="Arial">Arial</option>
          <option value="VT323">VT323</option>
          <option value="Pacifico">Pacifico</option>
          <option value="Lato100">Lato (Light)</option>
          <option value="Lato900">Lato (Bold)</option>
          <option value="Playwrite AU SA">Playwrite AU SA</option>
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
      </div>

      <div class="tool-group">
        <div class="tool-label">
          <i class="material-icons">border_color</i> Borde
        </div>
        <input type="color" id="text-border" oninput="updateTextBorder()">
      </div>

      <button class="dlt" onclick="deleteSelectedObject()">Eliminar</button>
    </div>

    <!-- ====== IMAGE TOOLBAR ====== -->
    <div class="toolbar" id="image-toolbar">
      <div class="tool-group">
        <div class="tool-label">
          <i class="material-icons">crop_square</i> Borde Imagen
        </div>
        <input type="color" id="image-border" oninput="updateImageBorder()">
      </div>

      <button class="dlt" onclick="deleteSelectedObject()">Eliminar</button>
    </div>

  </div>
</div>
  <div class="editor-container">
    <div class="canvas-left">
      <div class="canvas-container tshit_container" id="front-canvas-container">
        <canvas id="front-canvas" width="620" height="800"></canvas>
      </div>
      <div class="canvas-container tshit_container" id="back-canvas-container" style="display:none;">
        <canvas id="back-canvas" width="620" height="800"></canvas>
      </div>
      <div class="canvas-container tshit_container" id="leftsleeve-canvas-container" style="display:none;">
        <canvas id="leftsleeve-canvas" width="620" height="800"></canvas>
      </div>
      <div class="canvas-container tshit_container" id="rightsleeve-canvas-container" style="display:none;">
        <canvas id="rightsleeve-canvas" width="620" height="800"></canvas>
      </div>
      <div class="mini-map-container">
        <button id="zoom-in" onclick="zoomIn()">➕</button>
        <button id="zoom-out" onclick="zoomOut()">➖</button>
        <button id="reset-zoom" onclick="resetZoom()">🔄</button>
        <canvas id="mini-map" width="175" height="200"></canvas>
      </div>
    </div>
    <div class="canvas-right">
      <div class="canvas-controls">
        <button class="button controlsbtn" onclick="addText()">T</button>
        <button class="button controlsbtn" onclick="addImage()">🖼️</button>
        <button class="button controlsbtn" onclick="addEmoji()">😀</button>
      </div>
        <h3>Elementos agregados</h3>
        <ul id="elements-list"></ul>

    </div>
  </div>
    <div class="step-validation" id="step3-validation">Puedes personalizar tu diseño o continuar con el diseño básico</div>
    </div>
    
    <!-- Step 4: Summary -->
    <div class="feature-card" id="step4-content">
      <h3>Paso 4: Resumen y Descarga</h3>
      <p>Revisa tu diseño y descarga las imágenes para producción.</p>
      
      <div class="preview-section">
        <h4>Previsualización de tu Diseño</h4>
        <div id="preview-container" class="grid grid-cols-2 gap-2">
          <div>
            <h4>Pecho</h4>
            <canvas id="preview-front" width="180" height="220" class="border" onclick="switchTab('front')"></canvas>
          </div>
          <div>
            <h4>Espalda</h4>
            <canvas id="preview-back" width="180" height="220" class="border" onclick="switchTab('back')"></canvas>
          </div>
          <div>
            <h4>Lado Izq.</h4>
            <canvas id="preview-leftsleeve" width="180" height="220" class="border" onclick="switchTab('leftsleeve')"></canvas>
          </div>
          <div>
            <h4>Lado Der.</h4>
            <canvas id="preview-rightsleeve" width="180" height="220" class="border" onclick="switchTab('rightsleeve')"></canvas>
          </div>
        </div>
      </div>
      
      <div class="order-summary">
        <h4>Resumen de tu Pedido</h4>
        <div class="summary-details">
          <p><strong>Color seleccionado:</strong> <span id="final-color">Negro</span></p>
          <p><strong>Tallas y cantidades:</strong></p>
          <ul id="final-sizes">
            <!-- Se llenará dinámicamente -->
          </ul>
          <p><strong>Elementos personalizados:</strong> <span id="final-design-count">0</span></p>
        </div>
      </div>
    </div>
  </div>

  <!-- Navigation Buttons -->
  <div class="navigation-buttons" id="navigation-buttons" style="display: none;">
    <button class="nav-btn btn-prev" onclick="prevStep()" id="btn-prev">
      <span>←</span> Anterior
    </button>
    <button class="nav-btn btn-next" onclick="nextStep()" id="btn-next">
      Siguiente <span>→</span>
    </button>
    <button class="nav-btn btn-finish" onclick="finishDesign()" id="btn-finish" style="display: none;">
      Finalizar y Descargar
    </button>
  </div>
    <!-- Progress Summary -->
  <div class="progress-summary" id="progress-summary">
    <h3>Resumen de tu diseño:</h3>
    <div class="summary-item" id="summary-color">
      <strong>Color:</strong> <span id="summary-color-text">No seleccionado</span>
    </div>
    <div class="summary-item" id="summary-sizes">
      <strong>Tallas:</strong> <span id="summary-sizes-text">No seleccionadas</span>
    </div>
    <div class="summary-item" id="summary-design">
      <strong>Diseño:</strong> <span id="summary-design-text">No personalizado</span>
    </div>
  </div>
  <!-- Save Notification -->
  <div class="save-notification" id="save-notification">
    ¡Progreso guardado automáticamente!
  </div>

  <input type="file" id="image-input" style="display: none;" accept="image/*" onchange="uploadImage()">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/4.5.0/fabric.min.js"></script>
  
  <div class="footer">
    <p>© 2025 JACTPCL Diseñador de Poleras. Todos los derechos reservados.</p>
  </div>
</body>
</html>
<script src="scripts.js"></script>