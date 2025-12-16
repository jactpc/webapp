<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Diseñador de Poleras Jactpcl</title>
  <link rel="icon" href="favicon.ico" type="image/x-icon">
  <link rel="icon" type="image/png" sizes="32x32" href="assets/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="assets/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="assets/apple-touch-icon.png">
  <link rel="manifest" href="site.webmanifest">
  <link rel="stylesheet" href="styles.css">
  <link href="https://fonts.googleapis.com/css2?family=Playwrite+AU+SA&family=Tomorrow:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
</head>
<body>
  <div class="hero" id="hero">
    <h1>Diseña tu Camiseta Personalizada</h1>
    <p>Elige colores, tamaños y añade tus propios diseños. ¡Crea algo único!</p>
    <button onclick="startDesignProcess()">Comenzar</button>
  </div>
  <div class="hero2 hidden" id="hero2">
    <h1>Diseña tu Polera</h1>
  </div>

  <div class="steps-container" id="steps-container" style="display: none;">
    <div class="step-indicator">
      <div class="step active" id="step-1">
        <div class="step-circle">1</div>
        <div class="step-title">Tipo</div>
        <div class="step-line"></div>
      </div>
      <div class="step" id="step-2">
        <div class="step-circle">2</div>
        <div class="step-title">Color</div>
        <div class="step-line"></div>
      </div>
      <div class="step" id="step-3">
        <div class="step-circle">3</div>
        <div class="step-title">Tallas</div>
        <div class="step-line"></div>
      </div>
      <div class="step" id="step-4">
        <div class="step-circle">4</div>
        <div class="step-title">Diseño</div>
        <div class="step-line"></div>
      </div>
      <div class="step" id="step-5">
        <div class="step-circle">5</div>
        <div class="step-title">Resumen</div>
        <div class="step-line"></div>
      </div>
    </div>
  </div>

  <div class="features" id="features" style="display: none;">
    <!-- Step 1: tipo Selection -->
    <div class="feature-card active" id="step1-content">
      <h3>Paso 1: Elige el material Textil</h3>
      <div class="type-buttons"></div>
      <div class="step-validation" id="step1-validation">Por favor, selecciona el material de polera para continuar</div>
    </div>
    <!-- Step 2: Color Selection -->
    <div class="feature-card" id="step2-content">
      <h3>Paso 2: Elige el Color de tu Camiseta</h3>
      <p>Selecciona el color base para tu Polera personalizada.</p>
      <div class="color-buttons"></div>
      <div class="step-validation" id="step2-validation">Por favor, selecciona un color para continuar</div>
    </div>
    <!-- Step 3: Size Selection -->
    <div class="feature-card" id="step3-content">
      <h3>Paso 3: Selecciona las Tallas y Cantidades</h3>
      <p>Elige las tallas que necesitas y especifica la cantidad para cada una.</p>
      <div class="size-buttons"></div>
      <div class="step-validation" id="step3-validation">Por favor, selecciona al menos una talla e introduzca la cantidad</div>
    </div>
    <!-- Step 4: Design -->
    <div class="feature-card" id="step4-content">
      <h3>Paso 4: Personaliza tu Camiseta</h3>
      <p>Agrega texto, imágenes o logos de tu preferencia.</p>
      <div class="editor-container">
        <div class="canvas-left">
          <div class="canvas-container tshit_container" id="front-canvas-container">
            <canvas id="front-canvas" width="620" height="800"></canvas>
          </div>
          <div class="canvas-container tshit_container hidden" id="back-canvas-container">
            <canvas id="back-canvas" width="620" height="800"></canvas>
          </div>
          <div class="canvas-container tshit_container hidden" id="leftsleeve-canvas-container">
            <canvas id="leftsleeve-canvas" width="620" height="800"></canvas>
          </div>
          <div class="canvas-container tshit_container hidden" id="rightsleeve-canvas-container">
            <canvas id="rightsleeve-canvas" width="620" height="800"></canvas>
          </div>
          <div class="mini-map-container">
            <i class="material-icons btnzoom" onclick="zoomOut()">zoom_out</i>
              <input style="width: 79px;" id="zoom-slider" type="range" min="0.2" max="4" step="0.01" value="1" class="zoom-slider">
            <i class="material-icons btnzoom" onclick="zoomIn()">zoom_in</i>
            <i class="material-icons btnzoom" id="reset-zoom" onclick="resetZoom()">zoom_in_map</i>
            <canvas id="mini-map" width="175" height="200"></canvas>
          </div>
        </div>
        <div class="canvas-right">
          <h2 class="panel-title">Ubicacion del estampado</h2>
          <div class="tabs">
            <div class="tab active" data-tab="front" onclick="switchTab('front')">
              <span class="tab-title">Pecho</span>
            </div>
            <div class="tab" data-tab="back" onclick="switchTab('back')">
              <span class="tab-title">Espalda</span>
            </div>
            <div class="tab" data-tab="leftsleeve" onclick="switchTab('leftsleeve')">
              <span class="tab-title">Manga Izq.</span>
            </div>

            <div class="tab" data-tab="rightsleeve" onclick="switchTab('rightsleeve')">
              <span class="tab-title">Manga Der.</span>
            </div>
          </div>
          <h2 class="panel-title">Herramientas de Diseño</h2>
          <div class="canvas-controls">
            <h2 class="panel-titlec">Agregar</h2>
            <div class="tool-wrapper">
              <span class="tool-title">Texto</span>
              <span class="tool-desc">Añade palabras o frases</span>
              <button class="button controlsbtn" title="Agregar texto" onclick="addText()">T</button>
            </div>
            <div class="tool-wrapper">
              <span class="tool-title">Imagen</span>
              <span class="tool-desc">Sube una imagen PNG/JPG</span>
              <button class="button controlsbtn" title="Agregar imagen" onclick="addImage()">🖼️</button>
            </div>
            <div class="tool-wrapper">
              <span class="tool-title">Emoji</span>
              <span class="tool-desc">Selecciona un emoji</span>
              <button class="button controlsbtn" title="Agregar emoji" onclick="addEmoji()">😀</button>
            </div>
          </div>
          <div>
            <h3 class="list-title" id="title-front">Elementos agregados – Pecho</h3>
            <ul id="elements-front" class="elements-list"><p class="panel-title" id="desc-front">Objetos colocados en la parte frontal.</p></ul>
          </div>
          <div>
            <h3 class="list-title hidden" id="title-back">Elementos agregados - Back</h3>
            <ul id="elements-back" class="elements-list hidden"></ul>
          </div>
          <div>
            <h3 class="list-title hidden" id="title-leftsleeve">Elementos agregados - Left Sleeve</h3>
            <ul id="elements-leftsleeve" class="elements-list hidden"></ul>
          </div>
          <div>
            <h3 class="list-title hidden" id="title-rightsleeve">Elementos agregados - Right Sleeve</h3>
            <ul id="elements-rightsleeve" class="elements-list hidden"></ul>
          </div>
        </div>
      </div>
      <div class="step-validation" id="step4-validation">Puedes personalizar tu diseño o continuar con el diseño básico</div>
    </div>
    
    <!-- Step 5: Summary -->
    <div class="feature-card" id="step5-content">
        <h3>Paso 5: Resumen y Descarga</h3>
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
        <p><strong>Material seleccionado:</strong> <span id="final-Material">Negro</span></p>
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
    <div class="summary-item" id="summary-material">
      <strong>Material:</strong> <span id="summary-material-text">No seleccionado</span>
    </div>
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
  <div class="save-notification" id="save-notification"></div>

  <input type="file" id="image-input" style="display: none;" accept="image/*" onchange="uploadImage()">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/4.5.0/fabric.min.js"></script>
  
  <div class="footer">
    <p>© 2025 JACTPCL Diseñador de Poleras. Todos los derechos reservados.</p>
  </div>
  <div id="emojiModal" class="emoji-modal">
    <div class="emoji-content">
      <span class="close-emoji" onclick="closeEmojiModal()">×</span>
      <h3>Selecciona un Emoji</h3>
      <div class="emoji-tabs">
            <button class="emoji-tab active" data-cat="faces">😀</button>
            <button class="emoji-tab" data-cat="gestures">👋</button>
            <button class="emoji-tab" data-cat="animals">🐶</button>
            <button class="emoji-tab" data-cat="food">🍎</button>
            <button class="emoji-tab" data-cat="objects">🔥</button>
            <button class="emoji-tab" data-cat="travel">✈️</button>
            <button class="emoji-tab" data-cat="symbols">💟</button>
            <button class="emoji-tab" data-cat="flags">🇨🇱</button>
      </div>
      <div id="emojiGrid" class="emoji-grid scrollable"></div>
    </div>
  </div>
  <script>
document.addEventListener("DOMContentLoaded", () => {
    loadMaterials();
});
function loadMaterials() {
    const container = document.querySelector("#step1-content .type-buttons");
    
    // Mostrar loading para materiales
    showLoadingState(
        container, 
        "Buscando materiales", 
        "Estamos cargando las mejores opciones para ti...",
        "materials"
    );
    
    // Deshabilitar navegación mientras carga
    disableNavigation(true);
    
    // Configurar timeout
    const timeout = 10000;
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Tiempo de espera agotado")), timeout);
    });
    
    // Hacer la petición
    Promise.race([
        fetch("get_data.php?type=step1"),
        timeoutPromise
    ])
    .then(res => {
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        return res.json();
    })
    .then(data => {
        // Función para renderizar cada material
        const renderMaterial = (item) => {
            const div = document.createElement("div");
            div.classList.add("type-button");
            div.setAttribute("onclick", `selectType("${item.id}", "${item.nombre}", this)`);
            div.innerHTML = `
                <img src="img/icon/${item.imgSrc}" alt="${item.nombre}">
                <span>${item.nombre}</span>
            `;
            return div;
        };
        
        // Mostrar éxito
        showSuccessState(
            container, 
            data.materials, 
            renderMaterial,
            `${data.materials.length} materiales disponibles`
        );
        
        // Habilitar navegación
        disableNavigation(false);
    })
    .catch(error => {
        showErrorState(container, error, loadMaterials, "Error al cargar materiales");
        disableNavigation(false);
    });
}

// Estados visuales separados
function showLoadingState(container, title = "Cargando", message = "Por favor espera...", type = "default") {
    if (!container) return;
    
    const loadingId = `${type}-loading`;
    container.innerHTML = `
        <div class="loading-state" id="${loadingId}">
            <div class="loading-animation">
                <div class="dots">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
            </div>
            <div class="loading-text">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>

        </div>
    `;
    
}

function showSuccessState(container, items, renderItem, successMessage = null) {
    if (!container) return;
    
    // Limpiar intervalo de progreso si existe
    if (container.dataset.loadingInterval) {
        clearInterval(parseInt(container.dataset.loadingInterval));
        delete container.dataset.loadingInterval;
    }
    
    // Limpiar contenedor
    container.innerHTML = "";
    
    // Si no hay items, mostrar estado vacío
    if (!items || items.length === 0) {
        showEmptyState(container, "No hay elementos disponibles");
        return;
    }
    
    // Renderizar items con efecto de aparición
    items.forEach((item, index) => {
        setTimeout(() => {
            const element = renderItem(item);
            element.classList.add("fade-in");
            element.style.animationDelay = `${index * 30}ms`;
            container.appendChild(element);
        }, index * 30);
    });
    
    // Mostrar notificación de éxito si se especifica
    if (successMessage) {
        setTimeout(() => {
            showNotification(`✓ ${successMessage}`, "success", 2000);
        }, items.length * 30 + 200);
    }
}

function showErrorState(container, error, retryFunction, customMessage = null) {
    if (!container) return;
    
    // Limpiar intervalo de progreso si existe
    if (container.dataset.loadingInterval) {
        clearInterval(parseInt(container.dataset.loadingInterval));
        delete container.dataset.loadingInterval;
    }
    
    const errorMessage = customMessage || "No pudimos cargar los datos";
    
    container.innerHTML = `
        <div class="error-state">
            <div class="error-icon">
                <i class="material-icons">error_outline</i>
            </div>
            <h4>Error de conexión</h4>
            <p>${errorMessage}</p>
            <p class="error-detail">${error.message || "Error desconocido"}</p>
            <div class="error-actions">
                ${retryFunction ? `
                <button onclick="${retryFunction.name}()" class="btn-primary">
                    <i class="material-icons">refresh</i> Reintentar
                </button>
                ` : ''}
            </div>
        </div>
    `;
}
function showEmptyState(container, message = "No hay elementos disponibles") {
    container.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">
                <i class="material-icons">inbox</i>
            </div>
            <h4>Sin resultados</h4>
            <p>${message}</p>
        </div>
    `;
}
</script>
</body>
</html>
<script src="scripts.js"></script>