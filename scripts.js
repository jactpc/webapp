let designAssets = {};
let currentStep = 1;
const totalSteps = 5;
let selectedColor = null;
let selectedColorText = null;
let selectedColorcode = null;
let selectedMaterial = null;
let selectedMaterialText = null;
let designData = {
    color: null,
    sizes: {},
    design: {} // ← Ahora será dinámico
};
let canvases = null;
let selectedTab = '';
let currentColor = '';

// Estado por sección
let sectionsState = {};

// Canvases de preview
let previews = null;

// Mini-mapa
let miniMapCanvas = null;
let isMiniMapUpdating = false;
let miniMapUpdateTimeout = null;
let lastMiniMapUpdate = 0;
let isDraggingMiniMap = false;

// Zoom
const MIN_ZOOM = 0.6;
const MAX_ZOOM = 3;
let zoomFromDatabase = 1.4;
let zoomSlider = null;

// Design areas
let designAreas = {};

// Canvas lists
let canvasLists = null;
let canvasListsTitle = null;

// Fuentes
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

let objectCounter = 0;

// ========== INICIALIZACIÓN ==========

document.addEventListener('DOMContentLoaded', function() {
    initializeApplication();
});

function initializeApplication() {
    // Inicializar elementos del DOM
    initializeDOMElements();
    
    // Inicializar mini mapa
    initMiniMap();
    
    // Inicializar botones de navegación
    updateNavigationButtons();
    
    // Configurar eventos de tallas
    setupSizeQuantityEvents();
    
    // Cargar materiales iniciales
    loadMaterials();
    
    // Configurar controles de fabric.js
    setupFabricControls();
    
    console.log("Aplicación inicializada correctamente");
}

function initializeDOMElements() {
    // Inicializar elementos del DOM que se usan globalmente
    zoomSlider = document.getElementById("zoom-slider");
    
    previews = {
        front: document.getElementById('preview-front'),
        back: document.getElementById('preview-back'),
        leftsleeve: document.getElementById('preview-leftsleeve'),
        rightsleeve: document.getElementById('preview-rightsleeve'),
    };
    
    canvasLists = {
        "front": document.getElementById("elements-front"),
        "back": document.getElementById("elements-back"),
        "leftsleeve": document.getElementById("elements-leftsleeve"),
        "rightsleeve": document.getElementById("elements-rightsleeve")
    };
    
    canvasListsTitle = {
        "front": document.getElementById("title-front"),
        "back": document.getElementById("title-back"),
        "leftsleeve": document.getElementById("title-leftsleeve"),
        "rightsleeve": document.getElementById("title-rightsleeve")
    };
}

function initMiniMap() {
    const miniMapElement = document.getElementById('mini-map');
    if (miniMapElement) {
        miniMapCanvas = new fabric.Canvas('mini-map', {
            preserveObjectStacking: true
        });
        
        // Configurar eventos del minimapa
        setupMiniMapEvents();
    }
}

function moveViewportFromMinimap(e) {
    if (!canvases || !canvases[selectedTab] || !miniMapCanvas) return;
    
    const main = canvases[selectedTab];
    const pointer = miniMapCanvas.getPointer(e.e);

    const mainWidth = main.width;
    const mainHeight = main.height;
    const miniWidth = miniMapCanvas.width;
    const miniHeight = miniMapCanvas.height;

    const scaleX = miniWidth / mainWidth;
    const scaleY = miniHeight / mainHeight;
    const scale = Math.min(scaleX, scaleY);

    const offsetX = (miniWidth - mainWidth * scale) / 2;
    const offsetY = (miniHeight - mainHeight * scale) / 2;

    const mainX = (pointer.x - offsetX) / scale;
    const mainY = (pointer.y - offsetY) / scale;

    const zoom = main.getZoom();

    const vpt = main.viewportTransform;
    vpt[4] = -mainX * zoom + main.width / 2;
    vpt[5] = -mainY * zoom + main.height / 2;

    main.setViewportTransform(vpt);
    main.renderAll();

    updateMiniMap();
}

function setupMiniMapEvents() {
    if (!miniMapCanvas) return;
    
    miniMapCanvas.on("mouse:down", function (e) {
        isDraggingMiniMap = true;
        moveViewportFromMinimap(e); // ← ESTA FUNCIÓN DEBE ESTAR DEFINIDA
    });

    miniMapCanvas.on("mouse:move", function (e) {
        if (isDraggingMiniMap) {
            moveViewportFromMinimap(e); // ← ESTA FUNCIÓN DEBE ESTAR DEFINIDA
        }
    });

    miniMapCanvas.on("mouse:up", function () {
        isDraggingMiniMap = false;
    });
}

function setupFabricControls() {
    // Configurar controles de eliminación
    fabric.Object.prototype.controls.deleteControl = new fabric.Control({
        x: 0.5,
        y: -0.5,
        offsetY: -10,
        offsetX: 10,
        cursorStyle: 'pointer',
        sizeX: 25,
        sizeY: 25,
        mouseUpHandler: function(eventData, transform) {
            const target = transform.target;
            const canvas = target.canvas || transform.canvas;
            if (canvas) {
                canvas.remove(target);
                canvas.requestRenderAll();
            }
            if (target._listId) {
                const li = document.getElementById(target._listId);
                if (li) li.remove();
                showNotification(`Elemento eliminado en ${selectedTab} correctamente`, "warning");
            }
            return true;
        },
        render: function(ctx, left, top, styleOverride, fabricObject) {
            const size = 24;
            ctx.font = `${size}px sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("x", left, top);
        }
    });
}

// ========== FUNCIONES PRINCIPALES DE LA APLICACIÓN ==========

function startDesignProcess() {
    document.getElementById("hero").classList.add("hidden");
    document.getElementById("hero2").classList.remove("hidden");
    document.getElementById('features').style.display = 'block';
    document.getElementById('steps-container').style.display = 'block';
    document.getElementById('navigation-buttons').style.display = 'flex';
    document.getElementById('progress-summary').classList.add('active');
    
    // Configurar eventos del slider de zoom
    if (zoomSlider) {
        zoomSlider.addEventListener("input", function () {
            if (!canvases || !canvases[selectedTab]) return;
            
            const canvas = canvases[selectedTab];
            const newZoom = parseFloat(this.value);

            canvas.zoomToPoint(
                { x: canvas.width / 2, y: canvas.height / 2 },
                newZoom
            );

            canvas.requestRenderAll();
            updateMiniMap();
        });
    }
    
    document.getElementById('steps-container').scrollIntoView({ behavior: 'smooth' });
}

function updateURLStepSimple() {
    const newURL = `${window.location.pathname}?step=${currentStep}`;
    window.history.replaceState({}, '', newURL);
    showNotification(`Paso ${currentStep} de ${totalSteps}`, "info", 1500);
}

function nextStep() {
    if (!validateCurrentStep()) return;
  
    saveCurrentStepData();
    
    document.getElementById(`step${currentStep}-content`).classList.remove('active');
    document.getElementById(`step-${currentStep}`).classList.remove('active');
    document.getElementById(`step-${currentStep}`).classList.add('completed');
    
    currentStep++;
    
    document.getElementById(`step${currentStep}-content`).classList.add('active');
    document.getElementById(`step-${currentStep}`).classList.add('active');
    
    updateNavigationButtons();
    
    if (currentStep === 5) {
        updateFinalSummary();
    }
    
    document.getElementById(`step${currentStep}-content`).scrollIntoView({ behavior: 'smooth' });
    updateURLStepSimple();
}

function prevStep() {
    document.getElementById(`step${currentStep}-content`).classList.remove('active');
    document.getElementById(`step-${currentStep}`).classList.remove('active');
    document.getElementById(`step-${currentStep}`).classList.remove('completed');
    
    currentStep--;
    
    document.getElementById(`step${currentStep}-content`).classList.add('active');
    document.getElementById(`step-${currentStep}`).classList.add('active');
    
    updateNavigationButtons();
    
    document.getElementById(`step${currentStep}-content`).scrollIntoView({ behavior: 'smooth' });
    updateURLStepSimple();
}

function updateNavigationButtons() {
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const btnFinish = document.getElementById('btn-finish');
    
    if (currentStep === 1) {
        if (btnPrev) btnPrev.style.display = 'none';
    } else {
        if (btnPrev) btnPrev.style.display = 'flex';
    }
    
    if (currentStep === totalSteps) {
        if (btnNext) btnNext.style.display = 'none';
        if (btnFinish) btnFinish.style.display = 'flex';
    } else {
        if (btnNext) btnNext.style.display = 'flex';
        if (btnFinish) btnFinish.style.display = 'none';
    }
}

function validateCurrentStep() {
    const validationMsg = document.getElementById(`step${currentStep}-validation`);
    if (!validationMsg) return true;
  
    switch(currentStep) {
        case 1:
            if (!selectedMaterial) {
                validationMsg.style.display = 'block';
                return false;
            }
            break;
        case 2:
            if (!selectedColor) {
                validationMsg.style.display = 'block';
                return false;
            }
            break;
        case 3:
            const hasSizes = Object.values(designData.sizes).some(qty => qty > 0);
            if (!hasSizes) {
                validationMsg.style.display = 'block';
                return false;
            }
            break;
        case 4:
        case 5:
            // Siempre válidos
            break;
    }
    
    validationMsg.style.display = 'none';
    return true;
}

function saveCurrentStepData() {
    switch(currentStep) {
        case 1:
            designData.material = selectedMaterial;
            updateProgressSummary();
            break;
        case 2:
            designData.color = selectedColor;
            updateProgressSummary();
            break;
        case 3:
            designData.sizes = getSizesData();
            updateProgressSummary();
            break;
        case 4:
            saveDesignData();
            updateProgressSummary();
            break;
    }
}

// ========== PASO 1: SELECCIÓN DE TEXTIL ==========

function selectType(dataType, nombre, element) {
    // Actualizar UI
    document.querySelectorAll(".type-button").forEach(btn => {
        btn.classList.remove("active");
    });
    
    if (element) {
        selectedMaterial = dataType;
        selectedMaterialText = nombre;
        element.classList.add("active");
    }

    // Ocultar mensaje de validación
    const step1Validation = document.getElementById('step1-validation');
    if (step1Validation) step1Validation.style.display = 'none';
    
    // Cargar colores con loading
    const colorsContainer = document.querySelector("#step2-content .color-buttons");
    if (colorsContainer) {
        showLoadingState(
            colorsContainer,
            "Cargando colores disponibles",
            "Buscando combinaciones para el material seleccionado...",
            "colors"
        );
        
        fetch("get_data.php?type=colors&material=" + selectedMaterial)
            .then(res => {
                if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
                return res.json();
            })
            .then(data => {
                // Función para renderizar cada color
                const renderColor = (color) => {
                    const btn = document.createElement("div");
                    btn.classList.add("color-button");
                    btn.style.background = `#${color.code_back}`;
                    btn.dataset.id = color.code_back;
                    btn.setAttribute("onclick", `selectColor("${color.id}", "${color.nombre}", this)`);
                    btn.id = color.nombre;
                    btn.setAttribute("title", color.nombre);
                    return btn;
                };
                
                showSuccessState(
                    colorsContainer,
                    data.colors,
                    renderColor,
                    `${data.colors.length} colores disponibles`
                );
            })
            .catch(error => {
                showErrorState(colorsContainer, error, () => {
                    selectType(dataType, nombre, element);
                }, "Error al cargar colores");
            });
    }
    
    selectedColor = null;
    selectedColorText = null;
    
    // Actualizar resumen
    updateProgressSummary();
    showNotification("¡Material seleccionado correctamente!", "success");
}

// ========== PASO 2: SELECCIÓN DE COLOR ==========
function selectColor(color, nombre, element) {
    selectedColor = `${color}`;
    selectedColorText = nombre;
    // Actualizar UI
    document.querySelectorAll(".color-button").forEach(btn => {
        btn.classList.remove("active");
    });
    if (element) {
        // Después cargar tallas (si es necesario)
        const sizesContainer = document.querySelector("#step3-content .size-buttons");
        if (sizesContainer) {
            showLoadingState(
                sizesContainer,
                "Cargando tallas disponibles",
                "Consultando disponibilidad para el color seleccionado...",
                "sizes"
            );
            
            fetch("get_data.php?type=sizes&material=" + selectedMaterial + "&color=" + selectedColor)
                .then(res => {
                    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
                    return res.json();
                })
                .then(data => {
                    // Función para renderizar cada talla
                    const renderSize = (size) => {
                        const div = document.createElement("div");
                        div.classList.add("size-button");
                        div.innerHTML = `
                            <div class="size-title">${size.nombre}</div>
                            <span class="quantity" id="quantity-${size.nombre}" contenteditable="true">0</span>
                            <div>
                                <button class="qty-btn minus" data-size="${size.nombre}">–</button>
                                <button class="qty-btn plus" data-size="${size.nombre}">+</button>
                            </div>
                            <div class="size">${size.x}x${size.y}cm</div>
                        `;
                        return div;
                    };
                    
                    showSuccessState(
                        sizesContainer,
                        data.sizes,
                        renderSize,
                        `${data.sizes.length} tallas disponibles`
                    );
                    
                    // Activar eventos después de renderizar
                    setTimeout(() => setupSizeQuantityEvents(), data.sizes.length * 30 + 100);
                })
                .catch(error => {
                    showErrorState(sizesContainer, error, () => {
                        selectColor(color, nombre, element);
                    }, "Error al cargar tallas");
                });
        }
        selectedColorcode=element.dataset.id;
        loadDesignAssets();
        element.classList.add("active");
    }

    // Ocultar mensaje de validación
    const step2Validation = document.getElementById('step1-validation');
    if (step2Validation) step2Validation.style.display = 'none';

    // Actualizar resumen
    updateProgressSummary();
    showNotification("¡Color seleccionado correctamente!", "success");
}

function loadDesignAssets() {
    // Mostrar loading en el contenedor de diseño
    const designContainer = document.querySelector("#step4-content");
    
    // Deshabilitar navegación mientras cargamos
    disableNavigation(true);
    
    fetch(`get_data.php?type=design_assets&material=${selectedMaterial}`)
        .then(res => {
            if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
            return res.json();
        })
        .then(data => {
            if (!data.success || !data.assets || data.assets.length === 0) {
                throw new Error("No se encontraron assets de diseño");
            }
            
            // Guardar assets globalmente
            designAssets = data.assets;
            
            // Obtener el zoom desde la base de datos (si viene en la respuesta)
            if (data.zoom !== undefined && data.zoom !== null) {
                zoomFromDatabase = parseFloat(data.zoom);
                console.log(`Zoom obtenido de BD: ${zoomFromDatabase}`);
            } else {
                console.log(`Usando zoom por defecto: ${zoomFromDatabase}`);
            }
            // Crear tabs y canvases dinámicamente
            createDynamicTabsAndCanvases(data.assets);
            
            // Inicializar el primer tab
            if (data.assets.length > 0) {
                selectedTab = data.assets[0].side;
                switchTab(selectedTab);
            }
            
            disableNavigation(false);
            showNotification("Área de diseño lista", "success");
        })
        .catch(error => {
            console.error('Error cargando assets:', error);
            showErrorState(
                document.querySelector("step4-validation"),
                error,
                loadDesignAssets,
                "Error al cargar el área de diseño"
            );
            disableNavigation(false);
        });
}
function createDynamicTabsAndCanvases(assets) {
    // Contenedores principales con IDs correctos
    const tabsContainer = document.getElementById("tabs-container");
    const canvasesContainer = document.getElementById("canvases-container");
    const elementsListsContainer = document.getElementById("elements-lists");
    const previewContainer = document.getElementById("preview-container");
    
    if (!tabsContainer || !canvasesContainer || !elementsListsContainer) {
        console.error("Contenedores necesarios no encontrados");
        console.log("tabsContainer:", tabsContainer);
        console.log("canvasesContainer:", canvasesContainer);
        console.log("elementsListsContainer:", elementsListsContainer);
        return;
    }
    
    // Limpiar contenedores existentes
    tabsContainer.innerHTML = '';
    canvasesContainer.innerHTML = '';
    elementsListsContainer.innerHTML = '';
    if (previewContainer) previewContainer.innerHTML = '';
    
    // Reiniciar variables globales
    canvases = {};
    sectionsState = {};
    designData.design = {};
    previews = {};
    canvasLists = {};
    canvasListsTitle = {};
    highlightedElements = {};
    
    // Ordenar assets por priority
    const sortedAssets = [...assets].sort((a, b) => a.priority - b.priority);
    
    sortedAssets.forEach((asset, index) => {
        const side = asset.side;
        console.log(selectedColorcode);
        // Inicializar estado para esta sección
        sectionsState[side] = { 
            json: null, 
            bgSrc: `${asset.image_url}?stFondo=${selectedColorcode}`,
            assetData: asset
        };
        
        designData.design[side] = { objects: [] };
        highlightedElements[side] = null;
        
        // ===== CREAR TAB =====
        const tab = document.createElement("div");
        tab.className = "tab";
        tab.dataset.tab = side;
        tab.innerHTML = `
            <i class="material-icons">${getTabIcon(side)}</i>
            <span>${asset.name}</span>
        `;
        tab.onclick = () => switchTab(side);
        
        if (index === 0) tab.classList.add("active");
        tabsContainer.appendChild(tab);
        
        // ===== CREAR CONTENEDOR DE CANVAS =====
        const canvasWrapper = document.createElement("div");
        canvasWrapper.id = `${side}-canvas-container`;
        canvasWrapper.className = "canvas-container tshit_container";
        canvasWrapper.style.display = index === 0 ? "flex" : "none";
        
        canvasWrapper.innerHTML = `
            <canvas id="${side}-canvas" width="620" height="800"></canvas>
        `;
        
        canvasesContainer.appendChild(canvasWrapper);
        
        // ===== CREAR LISTA DE ELEMENTOS =====
        const listContainer = document.createElement("div");
        listContainer.id = `list-${side}`;
        listContainer.className = "elements-list-container";
        listContainer.style.display = index === 0 ? "block" : "none";
        
        listContainer.innerHTML = `
            <div class="elements-list-header">
                <h3 id="title-${side}">Elementos en ${asset.name}</h3>
                <div class="list-actions">
                    <button onclick="addText()" class="btn-text">
                        <i class="material-icons">title</i> Texto
                    </button>
                    <button onclick="addImage()" class="btn-image">
                        <i class="material-icons">image</i> Imagen
                    </button>
                    <button onclick="addEmoji()" class="btn-emoji">
                        <i class="material-icons">mood</i> Emoji
                    </button>
                </div>
            </div>
            <ul id="elements-${side}" class="elements-list"></ul>
        `;
        
        elementsListsContainer.appendChild(listContainer);
        
        // ===== CREAR CANVAS DE PREVIEW =====
        if (previewContainer) {
            const previewItem = document.createElement("div");
            previewItem.innerHTML = `
                <div>
                    <h4>${asset.name}</h4>
                    <canvas id="preview-${side}" width="180" height="220" class="border" onclick="switchTab('${side}')"></canvas>
                </div>
            `;
            previewContainer.appendChild(previewItem);
            
            previews[side] = document.getElementById(`preview-${side}`);
        }
        
        // Inicializar canvas
        canvases[side] = new fabric.Canvas(`${side}-canvas`, {
            preserveObjectStacking: true,
            height: 800,
            width: 620
        });
        canvases[side]._canvasName = side;
        // Configurar eventos del canvas
        setupCanvasEvents(canvases[side], side);
        
        // Configurar área de diseño basada en asset
        designAreas[side] = {
            x: parseFloat(asset.area_x) || 125,
            y: parseFloat(asset.area_y) || 100,
            width: parseFloat(asset.area_width) || 370,
            height: parseFloat(asset.area_height) || 600,
            unit: asset.area_unit || 'px'
        };
        
        // Referencias a listas
        canvasLists[side] = document.getElementById(`elements-${side}`);
        canvasListsTitle[side] = document.getElementById(`title-${side}`);
    });
    
    // Actualizar controles de zoom
    zoomSlider = document.getElementById("zoom-slider");
    if (zoomSlider) {
        zoomSlider.addEventListener("input", function () {
            if (!canvases || !canvases[selectedTab]) return;
            
            const canvas = canvases[selectedTab];
            const newZoom = parseFloat(this.value);

            canvas.zoomToPoint(
                { x: canvas.width / 2, y: canvas.height / 2 },
                newZoom
            );

            canvas.requestRenderAll();
            updateMiniMap();
        });
    }
    
    // Configurar sincronización canvas-lista
    setupCanvasSelectionSync();
    
    // Configurar eventos optimizados
    setupOptimizedCanvasEvents();
}

function getTabIcon(side) {
    const icons = {
        front: "front_hand",
        back: "back_hand",
        leftsleeve: "pan_tool",
        rightsleeve: "pan_tool"
    };
    return icons[side] || "crop";
}

function disableNavigation(disabled) {
    const prevBtn = document.querySelector(".btn-prev");
    const nextBtn = document.querySelector(".btn-next");
    
    if (prevBtn) {
        prevBtn.disabled = disabled;
        prevBtn.style.opacity = disabled ? "0.5" : "1";
        prevBtn.style.cursor = disabled ? "not-allowed" : "pointer";
    }
    
    if (nextBtn) {
        nextBtn.disabled = disabled;
        nextBtn.style.opacity = disabled ? "0.5" : "1";
        nextBtn.style.cursor = disabled ? "not-allowed" : "pointer";
    }
}

// ========== PASO 3: SELECCIÓN DE TALLAS ==========

function getSizesData() {
    const sizes = {};

    document.querySelectorAll(".quantity").forEach(qtyEl => {
        const size = qtyEl.id.replace("quantity-", "");
        const quantity = parseInt(qtyEl.textContent) || 0;

        if (quantity > 0) {
            sizes[size] = quantity;
        }
    });

    return sizes;
}

function updateSizeUI(size, value) {
    const qtyEl = document.getElementById(`quantity-${size}`);
    if (!qtyEl) return;
    
    const button = qtyEl.closest(".size-button");
    if (!button) return;

    qtyEl.textContent = value;

    if (value >= 1) {
        qtyEl.style.color = "white";
        button.classList.add("active");
        showNotification("¡Progreso guardado automáticamente!", "success");
    } else {
        qtyEl.style.color = "black";
        button.classList.remove("active");
    }

    // Guardado y resumen
    designData.sizes = getSizesData();
    updateProgressSummary();
}

function setupSizeQuantityEvents() {
    // (1) INPUT MANUAL
    document.querySelectorAll(".quantity").forEach(span => {
        span.addEventListener("click", () => {
            if (span.textContent.trim() === "0") span.textContent = "";
        });

        span.addEventListener("input", () => {
            span.textContent = span.textContent.replace(/\D/g, "");

            const size = span.id.replace("quantity-", "");
            const value = parseInt(span.textContent) || 0;

            updateSizeUI(size, value);
        });

        span.addEventListener("blur", () => {
            if (span.textContent.trim() === "") {
                updateSizeUI(span.id.replace("quantity-", ""), 0);
            }
        });
    });

    // (2) BOTONES + y -
    document.querySelectorAll(".qty-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const size = btn.getAttribute("data-size");
            const qtyEl = document.getElementById(`quantity-${size}`);
            if (!qtyEl) return;
            
            let value = parseInt(qtyEl.textContent) || 0;

            if (btn.classList.contains("plus")) value++;
            if (btn.classList.contains("minus")) value = Math.max(0, value - 1);

            updateSizeUI(size, value);
        });
    });
}

// ========== FUNCIONES DE DISEÑO ==========

function saveDesignData() {
    if (!canvases) return;

    designData.design = {};
    
    Object.keys(canvases).forEach(section => {
        designData.design[section] = canvases[section].toJSON();
    });
}

// ========== RESUMEN Y PROGRESO ==========

function updateProgressSummary() {
    // Actualizar material
    const materialText = document.getElementById('summary-material-text');
    if (materialText) materialText.textContent = selectedMaterialText || "No seleccionado";

    const colorText = document.getElementById('summary-color-text');
    if (colorText) colorText.textContent = selectedColorText || "No seleccionado";

    // Actualizar tallas
    const sizesText = document.getElementById('summary-sizes-text');
    if (sizesText) {
        const sizes = Object.entries(designData.sizes)
            .filter(([size, qty]) => qty > 0)
            .map(([size, qty]) => `${size}: ${qty}`)
            .join(', ');
        
        sizesText.textContent = sizes || "No seleccionadas";
    }

    // Actualizar diseño
    const designText = document.getElementById('summary-design-text');
    if (designText) {
        let designCount = 0;
        if (designData.design) {
            Object.values(designData.design).forEach(section => {
                if (section.objects && section.objects.length > 0) {
                    designCount += section.objects.length;
                }
            });
        }
        designText.textContent = designCount > 0 ? `${designCount} elementos personalizados` : "No personalizado";
    }
}

function updateFinalSummary() {
    const finalMaterial = document.getElementById('final-Material');
    if (finalMaterial) finalMaterial.textContent = selectedMaterialText || "No seleccionado";
    
    const finalColor = document.getElementById('final-color');
    if (finalColor) finalColor.textContent = selectedColorText || "No seleccionado";

    // Actualizar tallas finales
    const finalSizesList = document.getElementById('final-sizes');
    if (finalSizesList) {
        finalSizesList.innerHTML = '';
        
        Object.entries(designData.sizes).forEach(([size, qty]) => {
            if (qty > 0) {
                const li = document.createElement('li');
                li.textContent = `${size}: ${qty} unidad(es)`;
                finalSizesList.appendChild(li);
            }
        });
    }

    // Actualizar contador de diseño
    const finalDesignCount = document.getElementById('final-design-count');
    if (finalDesignCount) {
        let designCount = 0;
        if (designData.design) {
            Object.values(designData.design).forEach(section => {
                if (section.objects && section.objects.length > 0) {
                    designCount += section.objects.length;
                }
            });
        }
        finalDesignCount.textContent = designCount;
    }

    // Actualizar previews
    updatePreviews();
}

// ========== NOTIFICACIONES ==========

function showNotification(message, type = "info", element = null, duration = 3000) {
    const notification = document.getElementById("save-notification");
    if (!notification) return;

    // Limpiar clases anteriores
    notification.className = "save-notification";

    // Agregar tipo
    notification.classList.add(`notify-${type}`);

    // Cambiar mensaje
    notification.innerHTML = message;

    // Mostrar
    notification.style.display = "block";
    setTimeout(() => notification.style.opacity = "1", 10);
    
    if (element && element instanceof HTMLElement) {
        // Agregar clase de resaltado al li
        element.classList.add(`notify-${type}`);
        
        // Quitar la clase después de un tiempo
        setTimeout(() => {
            element.classList.remove(`notify-${type}`);
        }, duration + 300);
    }
    
    // Ocultar automáticamente
    setTimeout(() => {
        notification.style.opacity = "0";
        setTimeout(() => {
            notification.style.display = "none";
        }, 300);
    }, duration);
}

// ========== FUNCIÓN FINALIZAR ==========

function finishDesign() {
    // Guardar diseño final
    saveDesignData();

    // Exportar todas las vistas
    exportAllDesigns();

    // Mostrar mensaje de éxito
    alert('¡Diseño completado! Todas las imágenes han sido descargadas. Revisa tu carpeta de descargas.');
}

function exportAllDesigns() {
    if (!canvases) {
        console.error("No hay canvases para exportar");
        return;
    }
    
    // Exportar cada vista del canvas
    const sections = ['front', 'back', 'leftsleeve', 'rightsleeve'];
  
    sections.forEach(section => {
        if (canvases[section]) {
            const dataURL = canvases[section].toDataURL({ format: 'png', quality: 1 });
            const link = document.createElement('a');
            link.href = dataURL;
            link.download = `camiseta-${section}-${selectedColor}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    });
  
    // Exportar resumen como JSON
    const summaryData = {
        ...designData,
        exportDate: new Date().toISOString()
    };
  
    const dataStr = JSON.stringify(summaryData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const link = document.createElement('a');
    link.href = dataUri;
    link.download = `resumen-pedido-camiseta.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ========== FUNCIONES DE CANVAS ==========

function initializeCanvases() {
    if (canvases) {
        console.log("Los canvases ya están inicializados");
        return canvases;
    }
    
    console.log("Inicializando canvases por primera vez");
    canvases = {
        front: new fabric.Canvas('front-canvas'),
        back: new fabric.Canvas('back-canvas'),
        leftsleeve: new fabric.Canvas('leftsleeve-canvas'),
        rightsleeve: new fabric.Canvas('rightsleeve-canvas')
    };
    
    // Configurar propiedades comunes para todos los canvases
    Object.keys(canvases).forEach((key) => {
        const canvas = canvases[key];
        
        // Configurar propiedades comunes
        canvas.setHeight(800);
        canvas.setWidth(620);
        canvas.selection = true;
        canvas.preserveObjectStacking = true;
        
        // Configurar eventos básicos
        setupCanvasEvents(canvas, key);
    });
    
    return canvases;
}
function updateTextSizeSlider(textObj, newSize) {
    if (!textObj || !textObj._listId) return;
    
    const li = document.getElementById(textObj._listId);
    if (!li) return;
    
    // Buscar el slider y el texto de tamaño
    const sizeSlider = li.querySelector('.text-size');
    const sizeText = li.querySelector('.text-size-value');
    
    if (sizeSlider && sizeText) {
        // Actualizar valores
        const roundedSize = Math.round(newSize);
        
        // Asegurarse de que esté dentro de los límites (10-200)
        const clampedSize = Math.max(10, Math.min(200, roundedSize));
        
        sizeSlider.value = clampedSize;
        sizeText.textContent = clampedSize + "px";
        
        // Si el tamaño se ajustó, actualizar el objeto
        if (clampedSize !== newSize) {
            textObj.set('fontSize', clampedSize);
        }
        
        // Agregar clase de animación
        li.classList.add('size-updated');
        setTimeout(() => {
            li.classList.remove('size-updated');
        }, 500);
        
        // Mostrar notificación si el cambio es significativo
        if (Math.abs(textObj._lastFontSize - newSize) > 5) {
            showNotification(`Tamaño ajustado a ${clampedSize}px`, "info", li, 1500);
        }
    }
    
    // Guardar el último tamaño para comparar
    textObj._lastFontSize = newSize;
}
function updateEmojiSizeSlider(emojiObj, newSize) {
    if (!emojiObj || !emojiObj._listId) return;
    
    const li = document.getElementById(emojiObj._listId);
    if (!li) return;
    
    // Buscar el slider y el texto de tamaño específico para emojis
    const sizeSlider = li.querySelector('.text-sizeEmo');
    const sizeText = li.querySelector('.text-sizeEmo-value');
    
    if (sizeSlider && sizeText) {
        // Actualizar valores
        const roundedSize = Math.round(newSize);
        
        // Asegurarse de que esté dentro de los límites (10-500)
        const clampedSize = Math.max(10, Math.min(500, roundedSize));
        
        sizeSlider.value = clampedSize;
        sizeText.textContent = clampedSize + "px";
        
        // Si el tamaño se ajustó, actualizar el objeto
        if (clampedSize !== newSize) {
            emojiObj.set('fontSize', clampedSize);
        }
        
        // Agregar clase de animación
        li.classList.add('size-updated');
        setTimeout(() => {
            li.classList.remove('size-updated');
        }, 500);
        
        // Mostrar notificación si el cambio es significativo
        if (Math.abs(emojiObj._lastFontSize - newSize) > 5) {
            showNotification(`Emoji ajustado a ${clampedSize}px`, "info", li, 1500);
        }
    }
    
    // Guardar el último tamaño para comparar
    emojiObj._lastFontSize = newSize;
}
function updateImageSizeSlider(imgObj, percentage) {
    if (!imgObj || !imgObj._listId) return;
    
    const li = document.getElementById(imgObj._listId);
    if (!li) return;
    
    // Buscar el slider y la etiqueta de tamaño
    const sizeSlider = li.querySelector('.img-size-slider');
    const sizeLabel = li.querySelector('.img-size-value');
    
    if (sizeSlider && sizeLabel) {
        // Asegurarse de que esté dentro de los límites (1-200%)
        const clampedPercentage = Math.max(1, Math.min(200, percentage));
        
        // Actualizar valores
        sizeSlider.value = clampedPercentage;
        sizeLabel.textContent = clampedPercentage + "%";
        
        // Si el porcentaje se ajustó, actualizar el objeto
        if (clampedPercentage !== percentage) {
            const originalScale = imgObj._originalScale || 1;
            const newScale = originalScale * (clampedPercentage / 100);
            imgObj.scale(newScale);
            imgObj.setCoords();
        }
        
        // Agregar clase de animación
        li.classList.add('size-updated');
        setTimeout(() => {
            li.classList.remove('size-updated');
        }, 500);
        
        // Mostrar notificación si el cambio es significativo
        if (Math.abs(imgObj._lastPercentage - percentage) > 5) {
            showNotification(`Imagen ajustada a ${clampedPercentage}%`, "info", li, 1500);
        }
    }
    
    // Guardar el último porcentaje para comparar
    imgObj._lastPercentage = percentage;
}
function setupCanvasEvents(canvas, canvasName) {
    // Asignar nombre al canvas
    canvas._canvasName = canvasName;
    
    canvas.on('text:editing:entered', (e) => {
        const obj = e.target;
        // Si es un emoji, cancelar la edición
        if (obj && obj.type === 'i-text' && (obj._isEmoji || isEmojiObject(obj))) {
            canvas.discardActiveObject();
            canvas.requestRenderAll();
            showNotification("Los emojis no se pueden editar", "warning");
        }
    });
    
    // Cuando se agrega un objeto
    canvas.on('object:added', (e) => {
        const obj = e.target;
        
        // Si el objeto no tiene ID, asignarle uno
        if (!obj.id) {
            obj.id = generateObjectId();
        }
        
        // Asignar el nombre del canvas al objeto
        obj._canvasName = canvasName;
        
        console.log(`Objeto ${obj.id} agregado a ${canvasName} (tipo: ${obj.type})`);
    });
    
    // Cuando se remueve un objeto
    canvas.on('object:removed', (e) => {
        const obj = e.target;
        
        // Limpiar del DOM si existe
        if (obj._listId) {
            const li = document.getElementById(obj._listId);
            if (li) {
                li.classList.add('removing');
                setTimeout(() => li.remove(), 300);
            }
        }
        
        // Limpiar resaltado si este objeto estaba seleccionado
        if (highlightedElements[canvasName] === obj._listId) {
            clearHighlight(canvasName);
        }
    });
    
    // Eventos de selección
    canvas.on('selection:created', (e) => {
        if (canvasName !== selectedTab) return;
        const active = e.selected[0];
        if (active && active._listId) {
            highlightListItem(active._listId, canvasName);
        }
    });

    canvas.on('selection:updated', (e) => {
        if (canvasName !== selectedTab) return;
        const active = e.selected[0];
        if (active && active._listId) {
            highlightListItem(active._listId, canvasName);
        } else if (e.selected.length === 0) {
            clearHighlight(canvasName);
        }
    });

    canvas.on('selection:cleared', () => {
        if (canvasName !== selectedTab) return;
        clearHighlight(canvasName);
    });
    
    // Evento de escalado para texto
    canvas.on('object:scaling', function (e) {
        const obj = e.target;
        if (obj && obj.type === 'i-text') {
            const originalFont = obj.fontSize; 
            const newFont = originalFont * obj.scaleX; 

            obj.fontSize = newFont;
            obj.scaleX = 1;
            obj.scaleY = 1;

            canvas.requestRenderAll();
             // Determinar si es texto normal o emoji
            if (obj._isEmoji || isEmojiObject(obj)) {
                // Es un emoji - usar función específica para emojis
                if (obj._listId) {
                    updateEmojiSizeSlider(obj, newFont);
                }
            } else {
                // Es texto normal - usar función para textos
                if (obj._listId) {
                    updateTextSizeSlider(obj, newFont);
                }
            }
        }else if (obj && obj.type === 'image') {
            // Calcular el porcentaje basado en el escalado
            const originalScale = obj._originalScale || 1;
            const currentPercentage = Math.round((obj.scaleX / originalScale) * 100);
            
            // Actualizar el slider en la lista
            if (obj._listId) {
                updateImageSizeSlider(obj, currentPercentage);
            }
            
            // Mantener proporción
            if (obj.scaleX !== obj.scaleY && e.transform) {
                if (e.transform.corner.includes('left') || e.transform.corner.includes('right')) {
                    obj.scaleY = obj.scaleX;
                } else if (e.transform.corner.includes('top') || e.transform.corner.includes('bottom')) {
                    obj.scaleX = obj.scaleY;
                }
            }
        }
    });
    
    // Actualizar minimapa cuando se modifica un objeto
    canvas.on('object:modified', () => {
        if (canvasName === selectedTab) {
            updateMiniMap();
        }
    });
    canvas.on('text:editing:exited', (e) => {
        const obj = e.target;
        if (obj && obj.type === 'i-text' && obj._listId) {
            // Actualizar el textarea en la lista
            const li = document.getElementById(obj._listId);
            if (li) {
                const textarea = li.querySelector('.text-content');
                if (textarea && textarea.value !== obj.text) {
                    textarea.value = obj.text;
                    showNotification("Texto actualizado en la lista", "info", li);
                }
            }
        }
    });
    canvas.on('mouse:up', (e) => {
        const activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.type === 'i-text' && 
            activeObject.isEditing && activeObject._listId) {
            
            // Cuando el usuario hace clic fuera mientras edita
            setTimeout(() => {
                if (!activeObject.isEditing) {
                    const li = document.getElementById(activeObject._listId);
                    if (li) {
                        const textarea = li.querySelector('.text-content');
                        if (textarea && textarea.value !== activeObject.text) {
                            textarea.value = activeObject.text;
                        }
                    }
                }
            }, 100);
        }
    });
}

function drawDesignArea(section, assetData = null) {
    if (!canvases || !canvases[section]) {
        console.error(`Canvas ${section} no disponible para dibujar área de diseño`);
        return;
    }
    
    const canvas = canvases[section];
    
    // Si ya existe un rectángulo, removerlo primero
    if (canvas._designAreaRect) canvas.remove(canvas._designAreaRect);
    if (canvas._designAreaLabel) canvas.remove(canvas._designAreaLabel);
    
    // Usar datos del asset o valores por defecto
    let area;
    let labelText = '';
    
    if (assetData) {
        area = {
            x: parseFloat(assetData.area_x) || 125,
            y: parseFloat(assetData.area_y) || 100,
            width: parseFloat(assetData.area_width) || 370,
            height: parseFloat(assetData.area_height) || 600
        };
        labelText = `${assetData.name} (${assetData.area_width}${assetData.area_unit || 'px'} × ${assetData.area_height}${assetData.area_unit || 'px'})`;
    } else {
        area = designAreas[section] || { x: 125, y: 100, width: 370, height: 600 };
        labelText = 'Área de diseño';
    }
    
    // Crear rectángulo del área de diseño
    const rect = new fabric.Rect({
        left: area.x,
        top: area.y,
        width: area.width,
        height: area.height,
        fill: 'rgba(255, 255, 255, 0)',
        //fill: 'rgba(0, 149, 255, 0)',
        stroke: '#FF9800',
        strokeWidth: 2,
        strokeDashArray: [10, 5],
        selectable: false,
        evented: false,
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        hoverCursor: 'default',
        name: 'designArea'
    });
    
    // Crear etiqueta
    const label = new fabric.Text(labelText, {
        left: area.x + area.width / 2,
        top: area.y - 16,
        originX: 'center',
        originY: 'bottom',
        fontSize: 14,
        fontWeight: 'bold',
        fill: '#FF9800',
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 4,
        selectable: false,
        evented: false,
        name: 'designAreaLabel'
    });

    canvas.add(rect);
    canvas.add(label);
    
    // Guardar referencia al rectángulo en el canvas
    canvas._designAreaRect = rect;
    
    // Enviar al frente (pero detrás de los objetos de usuario)
    canvas.sendToBack(rect);
    canvas.bringToFront(label);
    
    // Renderizar el canvas
    canvas.renderAll();
    
    return rect;
}
function saveSection(section) {
    if (!canvases || !canvases[section]) {
        console.error(`Canvas ${section} no está disponible para guardar`);
        return;
    }
    
    const canvas = canvases[section];
    
    // Guardar objetos actuales, EXCLUYENDO el fondo y el área de diseño
    const objects = canvas.getObjects().filter(obj => {
        // Excluir el fondo, área de diseño y sus etiquetas
        return !(obj === canvas.backgroundImage || 
                obj === canvas._designAreaRect || 
                obj === canvas._designAreaLabel ||
                (obj.name && (obj.name === 'designArea' || obj.name === 'designAreaLabel' || obj.name === 'tshirt-bg')));
    });
    
    sectionsState[section].json = {
        objects: objects.map(obj => {
            const objData = obj.toObject();
            
            // Añadir metadatos adicionales para diferenciar tipos
            if (obj.type === 'i-text') {
                // Añadir información sobre si es emoji
                objData.isEmoji = isEmojiObject(obj);
            }
            
            return objData;
        })
    };
    
    console.log(`Sección ${section} guardada con ${objects.length} objetos de usuario`);
}

function restoreSection(section) {
    if (!canvases || !canvases[section]) {
        console.error(`Canvas ${section} no está disponible para restaurar`);
        return;
    }
    
    const canvas = canvases[section];
    const json = sectionsState[section].json || { objects: [] };
    
    // Limpiar SOLO los objetos de usuario, NO el fondo
    const userObjects = canvas.getObjects().filter(obj => {
        return !(obj === canvas.backgroundImage || 
                obj === canvas._designAreaRect || 
                obj === canvas._designAreaLabel ||
                (obj.name && (obj.name === 'designArea' || obj.name === 'designAreaLabel' || obj.name === 'tshirt-bg')));
    });
    
    // Remover objetos de usuario existentes
    userObjects.forEach(obj => {
        canvas.remove(obj);
        
        // También limpiar del DOM si existe
        if (obj._listId) {
            const li = document.getElementById(obj._listId);
            if (li) li.remove();
        }
    });
    
    // Limpiar referencias de listas
    if (canvasLists[section]) {
        canvasLists[section].innerHTML = '';
    }
    
    // Restaurar el fondo si no existe
    if (!canvas.backgroundImage) {
        loadBackground(section, false);
    }
    
    // Cargar objetos desde JSON
    if (json.objects && json.objects.length > 0) {
        fabric.util.enlivenObjects(json.objects, (enlivenedObjects) => {
            enlivenedObjects.forEach((obj, index) => {
                // Restaurar propiedades importantes
                obj.set({
                    selectable: true,
                    evented: true,
                    _canvasName: section
                });
                
                // Restaurar ID si existe
                if (json.objects[index].id) {
                    obj.id = json.objects[index].id;
                } else {
                    obj.id = generateObjectId();
                }
                
                // FUNCIÓN PARA DETECTAR SI ES EMOJI
                const isEmoji = (textObject) => {
                    if (textObject.type !== 'i-text') return false;
                    
                    const text = textObject.text;
                    if (!text) return false;
                    
                    // Detectar emojis por longitud y contenido
                    const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
                    
                    // Si es un solo carácter y es emoji
                    if (text.length === 1 || (text.length <= 2 && emojiRegex.test(text))) {
                        return true;
                    }
                    
                    // También verificar por el nombre de fuente (usado para emojis)
                    if (textObject.fontFamily && (
                        textObject.fontFamily.includes('emoji') || 
                        textObject.fontFamily.includes('Emoji') ||
                        textObject.fontFamily === 'Noto Color Emoji' ||
                        textObject.fontFamily === 'EmojiOne'
                    )) {
                        return true;
                    }
                    
                    return false;
                };
                
                // Inicializar propiedades según el tipo
                if (obj.type === 'i-text') {
                    // Determinar si es texto normal o emoji
                    if (isEmoji(obj)) {
                        // Es un emoji
                        console.log(`Restaurando emoji: ${obj.text}`);
                        
                        // Si no tiene ID de lista, crear uno
                        if (!obj._listId) {
                            obj._listId = "item-" + obj.id;
                        }
                        
                        // Agregar al canvas
                        canvas.add(obj);
                        
                        // Añadir a la lista como emoji
                        addObjectToList(obj, false, section); // false = emoji
                    } else {
                        // Es texto normal
                        obj._lastFontSize = obj.fontSize;
                        canvas.add(obj);
                        addObjectToList(obj, true, section); // true = texto
                    }
                } 
                else if (obj.type === 'image') {
                    // Es una imagen
                    console.log(`Restaurando imagen`);
                    
                    // Establecer escala original si no existe
                    if (!obj._originalScale) {
                        obj._originalScale = obj.scaleX;
                        obj._lastPercentage = Math.round((obj.scaleX / obj._originalScale) * 100);
                    }
                    
                    canvas.add(obj);
                    addObjectToList(obj, false, section); // false = no es texto
                }
            });
            
            canvas.renderAll();
            updateMiniMap();
            updatePreviews();
            
            console.log(`Sección ${section} restaurada con ${enlivenedObjects.length} objetos`);
        });
    } else {
        // Si no hay objetos, solo renderizar
        canvas.renderAll();
        updateMiniMap();
        updatePreviews();
    }
}
function isEmojiObject(textObject) {
    if (!textObject || textObject.type !== 'i-text') return false;
    
    const text = textObject.text;
    if (!text) return false;
    
    // Detectar emojis por diferentes métodos
    
    // Método 1: Expresión regular para emojis Unicode
    const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E0}-\u{1F1FF}]/u;
    
    // Método 2: Longitud y caracteres especiales
    const isSingleEmoji = text.length <= 2 && emojiRegex.test(text);
    
    // Método 3: Verificar fuente específica para emojis
    const isEmojiFont = textObject.fontFamily && (
        textObject.fontFamily.includes('emoji') || 
        textObject.fontFamily.includes('Emoji') ||
        textObject.fontFamily === 'Noto Color Emoji' ||
        textObject.fontFamily === 'EmojiOne' ||
        textObject.fontFamily === 'Apple Color Emoji' ||
        textObject.fontFamily === 'Segoe UI Emoji'
    );
    
    // Método 4: Tamaño de fuente grande (los emojis suelen ser más grandes)
    const isLargeFont = textObject.fontSize > 50;
    
    // Es un emoji si cumple alguna de estas condiciones
    return isSingleEmoji || isEmojiFont || (isSingleEmoji && isLargeFont);
}

function switchTab(tab) {
    if (!tab) {
        console.error('Pestaña no especificada');
        return;
    }
    
    // Verificar si el tab existe
    if (!canvases || !canvases[tab]) {
        console.error('Canvas para pestaña no existe:', tab);
        return;
    }

    console.log(`Cambiando de ${selectedTab} a ${tab}`);

    // Guardar el estado de la pestaña actual
    if (selectedTab && canvases[selectedTab]) {
        console.log(`Guardando estado de ${selectedTab}`);
        saveSection(selectedTab);
        
        // Limpiar selección en el canvas anterior
        canvases[selectedTab].discardActiveObject();
        canvases[selectedTab].renderAll();
        
        // Limpiar resaltado en la lista anterior
        clearHighlight(selectedTab);
    }

    // Actualizar pestaña seleccionada
    selectedTab = tab;

    // Restaurar estado de la nueva pestaña
    console.log(`Restaurando estado de ${selectedTab}`);
    restoreSection(selectedTab);

    // Actualizar UI de pestañas
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    const activeTabEl = document.querySelector(`.tab[data-tab="${tab}"]`);
    if (activeTabEl) activeTabEl.classList.add('active');

    // Mostrar solo el contenedor activo
    Object.keys(canvases).forEach(section => {
        const container = document.getElementById(`${section}-canvas-container`);
        if (container) container.style.display = (section === tab) ? 'flex' : 'none';
        
        const listContainer = document.getElementById(`list-${section}`);
        if (listContainer) listContainer.style.display = (section === tab) ? 'block' : 'none';
    });
    
    // Actualizar el minimapa
    if (miniMapCanvas) {
        updateMiniMap();
    }

    // Actualizar slider de zoom
    if (canvases[selectedTab] && zoomSlider) {
        zoomSlider.value = canvases[selectedTab].getZoom();
    }
    
    // Si estamos en el paso 5, retroceder
    if (currentStep === 5) {
        prevStep();
    }
    
    console.log(`Cambio a pestaña ${tab} completado`);
}
function loadBackground(section, renderNow = true) {
    if (!canvases || !canvases[section]) {
        console.error(`Canvas ${section} no está inicializado`);
        return;
    }
    
    const canvas = canvases[section];
    const state = sectionsState[section];
    const url = state.bgSrc;
    const assetData = state.assetData;

    // Verificar si es un SVG dinámico de PHP
    const isDynamicSVG = url.toLowerCase().includes('.php') ||
                        url.toLowerCase().includes('.svg') || 
                        url.toLowerCase().includes('svg.php') ||
                        (url.toLowerCase().includes('.php?') && url.toLowerCase().includes('svg'));

    // Para SVG (incluyendo dinámico de PHP)
    if (isDynamicSVG || url.toLowerCase().endsWith('.svg')) {
        // Para SVG dinámico de PHP, agregar parámetros si no los tiene
        let finalUrl = url;
        if (isDynamicSVG) {
            // Agregar el color como parámetro si no está presente
            const urlObj = new URL(url, window.location.origin);
            if (!urlObj.searchParams.has('stFondo') && selectedColor) {
                // Si el color está en formato completo "#RRGGBB", extraer solo el código
                const colorCode = selectedColor.startsWith('#') ? 
                                 selectedColor.substring(1) : selectedColor;
                urlObj.searchParams.set('stFondo', colorCode);
                finalUrl = urlObj.toString();
            }
        }
        
        loadSVGBackground(finalUrl, canvas, assetData, renderNow);
    } else {
        // Para imágenes raster (PNG, JPG)
        loadRasterBackground(url, canvas, assetData, renderNow);
    }
}

function loadSVGBackground(url, canvas, assetData, renderNow = true) {
    const section = canvas._canvasName;
    const cacheBusterUrl = url.includes('?') ? 
                          `${url}&t=${Date.now()}` : 
                          `${url}?t=${Date.now()}`;
    fabric.loadSVGFromURL(
        url,
        (objects, options) => {
            if (!objects || !objects.length) {
                console.error('SVG vacío o inválido');
                loadFallbackBackground(section);
                return;
            }

            try {
                const svgGroup = fabric.util.groupSVGElements(objects, options);

                svgGroup.set({
                    selectable: false,
                    evented: false,
                    name: 'tshirt-bg'
                });

                const svgWidth  = options.width  || svgGroup.width;
                const svgHeight = options.height || svgGroup.height;

                // =============================
                // MISMA LÓGICA QUE EL LOADER ORIGINAL
                // =============================
                if (assetData?.scale_x && assetData?.scale_y) {

                    const scaleX  = parseFloat(assetData.scale_x);
                    const scaleY  = parseFloat(assetData.scale_y);
                    const offsetX = parseFloat(assetData.offset_x) || 0;
                    const offsetY = parseFloat(assetData.offset_y) || 0;

                    svgGroup.scaleX = scaleX;
                    svgGroup.scaleY = scaleY;
                    svgGroup.left   = offsetX;
                    svgGroup.top    = offsetY;

                } else {
                    // Escalar por alto y centrar horizontalmente
                    const scale = canvas.height / svgHeight;

                    svgGroup.scaleX = scale;
                    svgGroup.scaleY = scale;
                    svgGroup.left   = (canvas.width - svgWidth * scale) / 2;
                    svgGroup.top    = 0;
                }

                canvas.setBackgroundImage(svgGroup, () => {
                    drawDesignArea(section, assetData);

                    if (renderNow) canvas.renderAll();
                    updateMiniMap();
                    updatePreviews();

                    // Guardar referencia si la necesitas luego
                    canvas._svgBackground = svgGroup;

                }, { crossOrigin: 'anonymous' });

            } catch (error) {
                console.error('Error procesando SVG:', error);
                loadFallbackBackground(section);
            }
        },
        null,
        { crossOrigin: 'anonymous' }
    );
}

function loadRasterBackground(url, canvas, assetData, renderNow = true) {
    const section = canvas._canvasName;

    fabric.Image.fromURL(
        url,
        (img) => {
            if (!img) {
                console.error(`No se pudo cargar la imagen: ${url}`);
                loadFallbackBackground(section);
                return;
            }

            img.set({
                selectable: false,
                evented: false,
                name: 'tshirt-bg'
            });

            // =============================
            // MISMA LÓGICA QUE EL LOADER ORIGINAL
            // =============================
            if (assetData?.scale_x && assetData?.scale_y) {

                const scaleX  = parseFloat(assetData.scale_x);
                const scaleY  = parseFloat(assetData.scale_y);
                const offsetX = parseFloat(assetData.offset_x) || 0;
                const offsetY = parseFloat(assetData.offset_y) || 0;

                img.scaleX = scaleX;
                img.scaleY = scaleY;
                img.left   = offsetX;
                img.top    = offsetY;

            } else {
                // Escalar por alto y centrar horizontalmente
                img.scaleToHeight(canvas.height);
                img.left = (canvas.width - img.getScaledWidth()) / 2;
                img.top  = 0;
            }

            canvas.setBackgroundImage(img, () => {
                drawDesignArea(section, assetData);

                if (renderNow) canvas.renderAll();
                updateMiniMap();
                updatePreviews();

            }, { crossOrigin: 'anonymous' });
        },
        { crossOrigin: 'anonymous' }
    );
}

function loadFallbackBackground(section) {
    if (!canvases || !canvases[section]) return;
    
    const canvas = canvases[section];
    
    // Crear un fondo de respaldo simple
    const fallbackColor = '#F0F0F0'; // Gris muy claro
    const fallbackText = 'Fondo SVG no disponible';
    
    // Limpiar fondo anterior
    canvas.setBackgroundColor(fallbackColor, () => {
        // Agregar texto informativo
        const text = new fabric.Text(fallbackText, {
            left: canvas.width / 2,
            top: canvas.height / 2,
            originX: 'center',
            originY: 'center',
            fontSize: 18,
            fill: '#888888',
            fontFamily: 'Arial',
            selectable: false,
            evented: false
        });
        
        // Agregar un rectángulo de fondo para el texto
        const textBg = new fabric.Rect({
            left: canvas.width / 2,
            top: canvas.height / 2,
            width: 250,
            height: 60,
            originX: 'center',
            originY: 'center',
            fill: 'rgba(255, 255, 255, 0.8)',
            stroke: '#CCCCCC',
            strokeWidth: 1,
            rx: 5,
            ry: 5,
            selectable: false,
            evented: false
        });
        
        canvas.add(textBg);
        canvas.add(text);
        canvas.sendToBack(textBg);
        canvas.sendToBack(text);
        
        // Dibujar área de diseño
        drawDesignArea(section);
        
        canvas.renderAll();
        updateMiniMap();
        updatePreviews();
    });
}
// ========== FUNCIONES DE DISEÑO DE TEXTO E IMÁGENES ==========

function generateObjectId() {
    objectCounter++;
    return "obj-" + objectCounter;
}

function addText() {
    if (!canvases || !canvases[selectedTab]) {
        console.error("Canvas no disponible para agregar texto");
        return;
    }
    
    const canvas = canvases[selectedTab];
    const text = new fabric.IText('Texto', {
        fontFamily: 'Arial',
        left: 350,
        top: 200,
        fontSize: 24,
        fill: '#FF0000',
        borderColor: 'black',
        cornerColor: 'blue',
        cornerSize: 8,
        transparentCorners: false,
    });
    text.id = generateObjectId();
    canvas.add(text);
    canvas.setActiveObject(text);
    addObjectToList(text, true, selectedTab);
}

function updateTextFont() {
    if (!canvases || !canvases[selectedTab]) return;
    
    const font = document.getElementById('text-font')?.value;
    const active = canvases[selectedTab].getActiveObject();
    if (active && active.type === 'i-text' && font) {
        active.set('fontFamily', font);
        canvases[selectedTab].renderAll();
    }
}

function updateTextColor() {
    if (!canvases || !canvases[selectedTab]) return;
    
    const active = canvases[selectedTab].getActiveObject();
    if (active && active.type === 'i-text') {
        active.set('fill', document.getElementById('text-color').value);
        canvases[selectedTab].renderAll();
    }
}

function updateTextSize() {
    if (!canvases || !canvases[selectedTab]) return;
    
    const active = canvases[selectedTab].getActiveObject();
    if (active && active.type === 'i-text') {
        active.set('fontSize', parseInt(document.getElementById('text-size').value, 10));
        canvases[selectedTab].renderAll();
    }
}

function updateTextBorder() {
    if (!canvases || !canvases[selectedTab]) return;
    
    const active = canvases[selectedTab].getActiveObject();
    if (active && active.type === 'i-text') {
        active.set('stroke', document.getElementById('text-border').value);
        canvases[selectedTab].renderAll();
    }
}

function addImageToCanvas(imgElement, options = {}) {
    if (!canvases || !canvases[selectedTab]) {
        console.error("Canvas no disponible para agregar imagen");
        return;
    }
    
    const canvas = canvases[selectedTab];

    const imgW = imgElement.width;
    const imgH = imgElement.height;

    const scaleX = (canvas.width * 0.5) / imgW;
    const scaleY = (canvas.height * 0.5) / imgH;
    const scale = Math.min(scaleX, scaleY);

    const img = new fabric.Image(imgElement, {
        scaleX: scale,
        scaleY: scale,
        originX: 'center',
        originY: 'center',
        ...options
    });

    // Centrar
    img.left = canvas.width / 2;
    img.top  = canvas.height / 2;
    img.id   = generateObjectId();

    canvas.add(img);
    canvas.setActiveObject(img);
    canvas.renderAll();

    addObjectToList(img, false, selectedTab);

    return img;
}

function addImageFile() {
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

            imgElement.onload = () => {
                addImageToCanvas(imgElement);
                uploadImageToServer(file);
                showNotification("Imagen agregada!", "success");
            };
        };
        reader.readAsDataURL(file);
    };

    input.click();
}

function loadImageFromURL() {
    const urlInput = document.getElementById('image-url');
    const url = urlInput.value.trim();

    if (!url) {
        showNotification("Por favor ingresa una URL válida", "warning");
        return;
    }

    const imgElement = new Image();
    imgElement.crossOrigin = "anonymous";

    imgElement.onload = () => {
        addImageToCanvas(imgElement);
        closeImageModal();
        showNotification("Imagen cargada desde URL", "success");
    };

    imgElement.onerror = () => {
        showNotification("Error al cargar la imagen desde la URL", "error");
    };

    imgElement.src = url;
}

function addImage() {
    // Mostrar diálogo con opciones antes de subir
    const imageModal = document.createElement('div');
    imageModal.className = 'image-modal';
    imageModal.innerHTML = `
        <div class="image-modal-content">
            <h3>Agregar Imagen</h3>
            <p>Selecciona cómo quieres agregar la imagen:</p>
            <div class="image-options">
                <button class="image-option" id="upload-option">
                    <i class="material-icons">upload</i>
                    <span>Subir desde mi computadora</span>
                </button>
                <button class="image-option" id="url-option">
                    <i class="material-icons">link</i>
                    <span>Usar URL de imagen</span>
                </button>
            </div>
            <div id="url-input-container" style="display: none; margin-top: 15px;">
                <input type="text" id="image-url" placeholder="https://ejemplo.com/imagen.jpg" 
                       style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                <button onclick="loadImageFromURL()" style="margin-top: 10px; width: 100%; padding: 10px;">
                    Cargar Imagen
                </button>
            </div>
            <button onclick="closeImageModal()" style="margin-top: 15px; width: 100%; padding: 8px;">
                Cancelar
            </button>
        </div>
    `;
    
    document.body.appendChild(imageModal);
    document.body.style.overflow = "hidden";
    
    // Event listeners para las opciones
    document.getElementById('upload-option').addEventListener('click', function() {
        addImageFile();
        closeImageModal();
    });
    
    document.getElementById('url-option').addEventListener('click', function() {
        document.getElementById('url-input-container').style.display = 'block';
    });
}

function closeImageModal() {
    const modal = document.querySelector('.image-modal');
    if (modal) modal.remove();
    document.body.style.overflow = "auto";
}

function updateImageBorder() {
    if (!canvases || !canvases[selectedTab]) return;
    
    const canvas = canvases[selectedTab];
    const active = canvas.getActiveObject();

    if (active && active.type === 'image') {
        const borderColor = document.getElementById('image-border').value;
        active.set({
            stroke: borderColor,
            strokeWidth: 5,
            objectCaching: false,
            dirty: true
        });
        canvas.requestRenderAll();
    }
}

function uploadImageToServer(file) {
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

// ========== MINI MAPA ==========

function updateMiniMap(force = false) {
    const now = Date.now();

    // Throttle + lock
    if (isMiniMapUpdating && !force) return;

    if (now - lastMiniMapUpdate < 16 && !force) {
        if (!miniMapUpdateTimeout) {
            miniMapUpdateTimeout = setTimeout(() => {
                updateMiniMap();
                miniMapUpdateTimeout = null;
            }, 16);
        }
        return;
    }

    isMiniMapUpdating = true;
    lastMiniMapUpdate = now;

    const mainCanvas = canvases[selectedTab];
    if (!mainCanvas || !miniMapCanvas) {
        isMiniMapUpdating = false;
        return;
    }

    requestAnimationFrame(() => {
        try {
            miniMapCanvas.clear();

            const miniWidth  = miniMapCanvas.width;
            const miniHeight = miniMapCanvas.height;

            const bgImage = mainCanvas.backgroundImage;

            // Helper: procesar objetos
            const processMiniMapObjects = (bgLeft, bgTop, scale, offsetX, offsetY) => {
                const objects = mainCanvas.getObjects();
                const promises = [];

                objects.forEach(obj => {
                    if (
                        obj._isDesignArea ||
                        obj.isViewportIndicator ||
                        obj === bgImage ||
                        (mainCanvas._designAreaRect && obj === mainCanvas._designAreaRect)
                    ) return;

                    // CALCULAR POSICIÓN CORRECTA
                    // 1. Obtener posición absoluta del objeto (considerando su origen/centro)
                    let objLeft = obj.left || 0;
                    let objTop = obj.top || 0;
                    
                    // 2. Si el objeto tiene originX/originY que no es 'left'/'top', ajustar
                    const originX = obj.originX || 'left';
                    const originY = obj.originY || 'top';
                    
                    // Ajustar por el origen del objeto
                    const objWidth = (obj.width || 0) * (obj.scaleX || 1);
                    const objHeight = (obj.height || 0) * (obj.scaleY || 1);
                    
                    if (originX === 'center') {
                        objLeft -= objWidth / 2;
                    } else if (originX === 'right') {
                        objLeft -= objWidth;
                    }
                    
                    if (originY === 'center') {
                        objTop -= objHeight / 2;
                    } else if (originY === 'bottom') {
                        objTop -= objHeight;
                    }
                    
                    // 3. Posición relativa al fondo
                    const relLeft = objLeft - bgLeft;
                    const relTop  = objTop - bgTop;

                    // 4. Posición en el minimapa
                    const miniLeft = offsetX + relLeft * scale;
                    const miniTop  = offsetY + relTop * scale;

                    if (obj.type === 'i-text') {
                        promises.push(new Promise(resolve => {
                            obj.clone(clone => {
                                // Para texto, mantener el origen igual
                                clone.set({
                                    left: miniLeft,
                                    top: miniTop,
                                    scaleX: obj.scaleX * scale,
                                    scaleY: obj.scaleY * scale,
                                    angle: obj.angle || 0,
                                    opacity: obj.opacity ?? 1,
                                    selectable: false,
                                    evented: false,
                                    hasControls: false,
                                    hasBorders: false,
                                    originX: 'left',
                                    originY: 'top' // Forzar origen top-left para consistencia
                                });
                                miniMapCanvas.add(clone);
                                resolve();
                            }, false);
                        }));
                    }

                    if (obj.type === 'image') {
                        promises.push(new Promise(resolve => {
                            const src = obj._element?.src || obj.getElement?.()?.src;
                            if (!src) return resolve();

                            fabric.Image.fromURL(src, miniImg => {
                                // IMPORTANTE: Para imágenes, forzar origen top-left
                                // y ajustar según el escalado del objeto original
                                const imgScaleX = (obj.scaleX || 1) * scale;
                                const imgScaleY = (obj.scaleY || 1) * scale;
                                
                                miniImg.set({
                                    left: miniLeft,
                                    top: miniTop,
                                    scaleX: imgScaleX,
                                    scaleY: imgScaleY,
                                    angle: obj.angle || 0,
                                    opacity: obj.opacity ?? 1,
                                    selectable: false,
                                    evented: false,
                                    hasControls: false,
                                    hasBorders: false,
                                    originX: 'left',
                                    originY: 'top' // Forzar origen top-left
                                });
                                
                                miniMapCanvas.add(miniImg);
                                resolve();
                            }, { 
                                crossOrigin: 'anonymous',
                                // Pasar las dimensiones originales si es necesario
                                width: obj.width,
                                height: obj.height
                            });
                        }));
                    }
                });

                Promise.all(promises).then(() => {
                    drawViewportIndicator(
                        mainCanvas,
                        miniMapCanvas,
                        scale,
                        offsetX,
                        offsetY,
                        bgLeft,
                        bgTop
                    );
                    miniMapCanvas.renderAll();
                    isMiniMapUpdating = false;
                });
            };

            // =========================
            // Sin fondo
            // =========================
            if (!bgImage) {
                // Sin fondo, usar todo el canvas como referencia
                const mainWidth = mainCanvas.width;
                const mainHeight = mainCanvas.height;
                
                const scaleX = miniWidth / mainWidth;
                const scaleY = miniHeight / mainHeight;
                const scale = Math.min(scaleX, scaleY);
                
                const offsetX = (miniWidth - mainWidth * scale) / 2;
                const offsetY = (miniHeight - mainHeight * scale) / 2;
                
                processMiniMapObjects(0, 0, scale, offsetX, offsetY);
                return;
            }

            // =========================
            // TAMAÑO REAL DEL FONDO
            // =========================
            const bgLeft = bgImage.left || 0;
            const bgTop = bgImage.top || 0;

            // Ajustar por el origen del fondo
            const bgOriginX = bgImage.originX || 'left';
            const bgOriginY = bgImage.originY || 'top';
            const bgWidth = bgImage.width * (bgImage.scaleX || 1);
            const bgHeight = bgImage.height * (bgImage.scaleY || 1);
            
            let adjustedBgLeft = bgLeft;
            let adjustedBgTop = bgTop;
            
            if (bgOriginX === 'center') {
                adjustedBgLeft -= bgWidth / 2;
            } else if (bgOriginX === 'right') {
                adjustedBgLeft -= bgWidth;
            }
            
            if (bgOriginY === 'center') {
                adjustedBgTop -= bgHeight / 2;
            } else if (bgOriginY === 'bottom') {
                adjustedBgTop -= bgHeight;
            }

            const scaleX = miniWidth / bgWidth;
            const scaleY = miniHeight / bgHeight;
            const scale = Math.min(scaleX, scaleY);

            const offsetX = (miniWidth - bgWidth * scale) / 2;
            const offsetY = (miniHeight - bgHeight * scale) / 2;

            // =========================
            // Clonar fondo
            // =========================
            bgImage.clone(miniBg => {
                miniBg.set({
                    left: offsetX,
                    top: offsetY,
                    scaleX: bgImage.scaleX * scale,
                    scaleY: bgImage.scaleY * scale,
                    selectable: false,
                    evented: false,
                    hasControls: false,
                    hasBorders: false,
                    opacity: 0.85,
                    originX: 'left',
                    originY: 'top'
                });

                miniMapCanvas.setBackgroundImage(miniBg, () => {
                    processMiniMapObjects(
                        adjustedBgLeft, // Usar posición ajustada
                        adjustedBgTop,
                        scale,
                        offsetX,
                        offsetY
                    );
                });
            });

        } catch (err) {
            console.error('Error updateMiniMap:', err);
            isMiniMapUpdating = false;
        }
    });
}

function drawViewportIndicator(mainCanvas, miniCanvas, scale, offsetX, offsetY, bgLeft, bgTop) {
    try {
        const zoom = mainCanvas.getZoom();
        const vpt = mainCanvas.viewportTransform;
        
        if (!vpt) return;
        
        // Calcular el área visible RELATIVA AL FONDO
        const visibleLeft = (-vpt[4] / zoom) - bgLeft;
        const visibleTop = (-vpt[5] / zoom) - bgTop;
        const visibleWidth = mainCanvas.width / zoom;
        const visibleHeight = mainCanvas.height / zoom;
        
        // Eliminar indicador anterior
        miniCanvas.getObjects()
            .filter(o => o.isViewportIndicator)
            .forEach(o => miniCanvas.remove(o));
        
        // Calcular posición y tamaño del indicador
        const indicatorLeft = offsetX + visibleLeft * scale;
        const indicatorTop = offsetY + visibleTop * scale;
        const indicatorWidth = visibleWidth * scale;
        const indicatorHeight = visibleHeight * scale;
        
        // Solo mostrar si está dentro de los límites del minimapa
        if (indicatorLeft < offsetX - indicatorWidth || 
            indicatorLeft > offsetX + miniCanvas.width ||
            indicatorTop < offsetY - indicatorHeight || 
            indicatorTop > offsetY + miniCanvas.height) {
            return;
        }
        
        // Crear nuevo indicador
        const indicator = new fabric.Rect({
            left: indicatorLeft,
            top: indicatorTop,
            width: indicatorWidth,
            height: indicatorHeight,
            fill: zoom > 1 ? 'rgba(33, 150, 243, 0.15)' : 'rgba(255, 255, 255, 0.1)',
            stroke: zoom > 1 ? '#2196F3' : '#4CAF50',
            strokeWidth: zoom > 1 ? 2 : 1,
            strokeDashArray: zoom > 1 ? [5, 3] : [4, 5],
            selectable: false,
            evented: false,
            hasControls: false,
            hasBorders: false,
            isViewportIndicator: true,
            zoomLevel: zoom
        });
        
        // Agregar texto con el nivel de zoom
        if (zoom !== 1) {
            const zoomText = new fabric.Text(`${zoom.toFixed(1)}x`, {
                left: indicatorLeft + 5,
                top: indicatorTop + 5,
                fontSize: 10,
                fill: '#FFFFFF',
                backgroundColor: zoom > 1 ? '#2196F3' : '#4CAF50',
                padding: 2,
                selectable: false,
                evented: false,
                isViewportIndicator: true 
            });
            miniCanvas.add(zoomText);
            miniCanvas.bringToFront(zoomText);
        }
        
        miniCanvas.add(indicator);
        miniCanvas.bringToFront(indicator);
        
        // Actualizar slider de zoom
        updateZoomSliderValue(zoom);

    } catch (error) {
        console.error('Error dibujando indicador:', error);
    }
}

function updateZoomSliderValue(zoom) {
    if (!zoomSlider) return;
    
    zoomSlider.value = zoom;
    
    const zoomValueDisplay = document.getElementById("zoom-value-display");
    if (zoomValueDisplay) {
        zoomValueDisplay.textContent = `${zoom.toFixed(1)}x`;
    }
}
function setupOptimizedCanvasEvents() {
    if (!canvases) {
        console.error("No se pueden configurar eventos: los canvases no están inicializados");
        return;
    }
    
    Object.keys(canvases).forEach((key) => {
        const canvas = canvases[key];
        
        // Variables para throttling
        let pendingMiniMapUpdate = false;
        let miniMapUpdateScheduled = false;
        
        // Función para programar actualización del minimapa
        const scheduleMiniMapUpdate = () => {
            if (!miniMapUpdateScheduled) {
                miniMapUpdateScheduled = true;
                requestAnimationFrame(() => {
                    if (key === selectedTab) {
                        updateMiniMap();
                    }
                    miniMapUpdateScheduled = false;
                });
            }
        };
        
        // Eventos que actualizan el minimapa (con throttling)
        const updateEvents = ['object:modified', 'object:moving', 'object:scaling', 'object:rotating'];
        updateEvents.forEach(eventName => {
            canvas.on(eventName, () => {
                if (key === selectedTab && !pendingMiniMapUpdate) {
                    pendingMiniMapUpdate = true;
                    setTimeout(() => {
                        scheduleMiniMapUpdate();
                        pendingMiniMapUpdate = false;
                    }, 50);
                }
            });
        });
        
        // Eventos que actualizan inmediatamente
        canvas.on('object:added', () => {
            if (key === selectedTab) {
                setTimeout(() => updateMiniMap(), 100);
            }
        });
        
        canvas.on('object:removed', () => {
            if (key === selectedTab) {
                setTimeout(() => updateMiniMap(), 100);
            }
        });
        
        // Evento after:render con throttling pesado
        let lastRenderTime = 0;
        canvas.on('after:render', () => {
            if (key === selectedTab) {
                const now = Date.now();
                if (now - lastRenderTime > 200) {
                    scheduleMiniMapUpdate();
                    lastRenderTime = now;
                }
            }
        });
        
        // Eventos de zoom
        canvas.on('mouse:wheel', (opt) => {
            if (key === selectedTab) {
                const delta = opt.e.deltaY;
                let zoom = canvas.getZoom();
                zoom *= 0.999 ** delta;
                
                if (zoom > MAX_ZOOM) zoom = MAX_ZOOM;
                if (zoom < MIN_ZOOM) zoom = MIN_ZOOM;
                
                canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
                updateZoomSliderValue(zoom);
                
                // Actualizar minimapa con el nuevo viewport
                setTimeout(() => updateMiniMap(true), 50);
                
                opt.e.preventDefault();
                opt.e.stopPropagation();
            }
        });
    });
}

// ========== ZOOM FUNCTIONS ==========

function syncZoomSlider() {
    if (!canvases || !canvases[selectedTab] || !zoomSlider) return;
    
    const canvas = canvases[selectedTab];
    zoomSlider.value = canvas.getZoom();
}

function zoomIn() {
    if (!canvases || !canvases[selectedTab]) return;
    
    const canvas = canvases[selectedTab];
    let zoom = canvas.getZoom() * 1.2;
    if (zoom > MAX_ZOOM) zoom = MAX_ZOOM;
    canvas.zoomToPoint({ x: canvas.width / 2, y: canvas.height / 2 }, zoom);
    syncZoomSlider();
}

function zoomOut() {
    if (!canvases || !canvases[selectedTab]) return;
    
    const canvas = canvases[selectedTab];
    let zoom = canvas.getZoom() / 1.2;
    if (zoom < MIN_ZOOM) zoom = MIN_ZOOM;
    canvas.zoomToPoint({ x: canvas.width / 2, y: canvas.height / 2 }, zoom);
    syncZoomSlider();
}

function resetZoom() {
    if (!canvases || !canvases[selectedTab]) return;
    
    const canvas = canvases[selectedTab];
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    syncZoomSlider();
    canvas.requestRenderAll();
    updateMiniMap();
    showNotification(`Zoom restablecido`, "info");
}

// ========== PREVIEW FUNCTIONS ==========

function updatePreviews() {
    if (!canvases || !previews) return;
    
    Object.keys(canvases).forEach((key) => {
        const mainCanvas = canvases[key];
        const previewCanvas = previews[key];
        
        if (!mainCanvas || !previewCanvas) return;

        const ctx = previewCanvas.getContext("2d");
        if (!ctx) return;

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

// ========== LIST MANAGEMENT ==========

function addObjectToList(obj, istext, canvasName) {
    if (!canvasLists || !canvasLists[canvasName]) return;

    // Verificar si ya existe en la lista
    const existingLi = document.getElementById("item-" + obj.id);
    if (existingLi) {
        console.warn(`El objeto ${obj.id} ya existe en la lista de ${canvasName}`);
        highlightListItem("item-" + obj.id, canvasName, true);
        return;
    }

    const list = canvasLists[canvasName];
    obj._canvasName = canvasName;

    const li = document.createElement("li");
    obj._listId = "item-" + obj.id;
    li.id = obj._listId;

    li.innerHTML = `<div class="tools"></div>`;
    list.appendChild(li);

    const toolsContainer = li.querySelector(".tools");

    li.addEventListener("click", (e) => {
        // Evitar que el clic en botones dentro del li active la selección
        if (e.target.closest('button') || e.target.closest('input') || e.target.closest('textarea') || e.target.closest('select')) {
            return;
        }
        
        // Seleccionar el objeto en el canvas
        const canvas = canvases[canvasName];
        if (canvas) {
            canvas.setActiveObject(obj);
            canvas.renderAll();
        }
        
        // Resaltar este li
        highlightListItem(obj._listId, canvasName);
        
        showNotification(`${obj.type === "i-text" ? (istext ? "Texto" : "Emoji") : "Imagen"} seleccionado`, "info");
    });

    // === SOLO PARA TEXTOS ===
    if (obj.type === "i-text" && istext === true) {
        const currentTextAlign = obj.textAlign || 'left';
        const currentFontWeight = obj.fontWeight || 'normal';
        const currentFontStyle = obj.fontStyle || 'normal';
        
        toolsContainer.innerHTML = `
            <div class="tool-group">
                <div class="tool-label"><i class="material-icons">text_snippet</i> Texto - ${objectCounter}</div>
                <textarea class="text-content" rows="10" cols="18">${obj.text}</textarea>
            </div>
            <div class="tool-group">
                <div class="tool-label"><i class="material-icons">format_color_text</i> Color</div>
                <input type="color" value="${obj.fill}" class="text-color">
            </div>
            <div class="tool-group">
                <div class="tool-label"><i class="material-icons">border_color</i> Borde</div>
                <input type="color" value="${obj.stroke || "#000000"}" class="text-border">
            </div>
            <div class="tool-group">
                <div class="tool-label"><i class="material-icons">format_align_left</i> Alineación</div>
                <div class="alignment-buttons">
                    <button class="align-btn ${currentTextAlign === 'left' ? 'active' : ''}" data-align="left" title="Alinear izquierda">
                        <i class="material-icons">format_align_left</i>
                    </button>
                    <button class="align-btn ${currentTextAlign === 'center' ? 'active' : ''}" data-align="center" title="Alinear centro">
                        <i class="material-icons">format_align_center</i>
                    </button>
                    <button class="align-btn ${currentTextAlign === 'right' ? 'active' : ''}" data-align="right" title="Alinear derecha">
                        <i class="material-icons">format_align_right</i>
                    </button>
                    <button class="align-btn ${currentTextAlign === 'justify' ? 'active' : ''}" data-align="justify" title="Justificar">
                        <i class="material-icons">format_align_justify</i>
                    </button>
                </div>
            </div>
            <div class="tool-group">
                <div class="tool-label"><i class="material-icons">font_download</i> Fuente</div>
                <select class="text-font">
                    ${(() => {
                        const fontList = [
                            'Arial', 'VT323', 'Pacifico', 'Lato', 
                            'Playwrite AU SA', 'Tomorrow', 'Roboto', 
                            'Montserrat', 'Open Sans', 'Oswald', 
                            'Raleway', 'Merriweather', 'Dancing Script', 
                            'Bebas Neue'
                        ];
                        let optionsHTML = '';
                        
                        fontList.forEach(font => {
                            const isSelected = obj.fontFamily === font ? 'selected' : '';
                            optionsHTML += `<option value="${font}" ${isSelected} style="font-family: '${font}';">${font}</option>`;
                        });
                        return optionsHTML;
                    })()}
                </select>
            </div>
            <div class="tool-group">
                <div class="tool-label"><i class="material-icons">format_bold</i> Estilo</div>
                <div class="style-buttons">
                    <button class="style-btn ${currentFontWeight === 'bold' ? 'active' : ''}" data-style="bold" title="Negrita">
                        <i class="material-icons">format_bold</i>
                    </button>
                    <button class="style-btn ${currentFontStyle === 'italic' ? 'active' : ''}" data-style="italic" title="Cursiva">
                        <i class="material-icons">format_italic</i>
                    </button>
                    <button class="style-btn ${obj.underline ? 'active' : ''}" data-style="underline" title="Subrayado">
                        <i class="material-icons">format_underlined</i>
                    </button>
                    <button class="style-btn ${obj.linethrough ? 'active' : ''}" data-style="linethrough" title="Tachado">
                        <i class="material-icons">strikethrough_s</i>
                    </button>
                </div>
            </div>
            <div class="tool-group">
                <div class="tool-label"><i class="material-icons">text_fields</i> Tamaño <span id="text-sizeEl" class="text-size-value">${obj.fontSize}px</span></div>
                <input type="range" value="${obj.fontSize}" min="10" max="200" class="text-size" id="text-sizeEl">
            </div>
            <div class="tool-buttons">
                <button class="select-dlt"><i class="material-icons">delete_forever</i></button>
            </div>
        `;
        
        // Configurar eventos para controles de texto
        setupTextControlEvents(obj, toolsContainer, canvasName);
        
        showNotification("¡Texto agregado!", "success", li);
    } else if (obj.type === "i-text" && istext === false) {
        // Para emojis
        toolsContainer.innerHTML = `
            <div class="tool-group">
                <div class="tool-label"><i class="material-icons">add_reaction</i> Emoji - ${objectCounter}</div>
                <span class="thumbnail-img">${obj.text}</span>
            </div>
            <div class="tool-group">
                <div class="tool-label"><i class="material-icons">text_fields</i> Tamaño <span id="text-sizeEl" class="text-sizeEmo-value">${obj.fontSize}px</span></div>
                <input type="range" value="${obj.fontSize}" min="10" max="500" class="text-sizeEmo" id="text-sizeEl">
            </div>
            <button class="select-dlt"><i class="material-icons">delete_forever</i></button>
        `;

        toolsContainer.querySelector(".select-dlt").addEventListener("click", () => {
            if (canvases && canvases[canvasName]) {
                canvases[canvasName].remove(obj);
                canvases[canvasName].renderAll();
            }
            li.remove();
            showNotification(`Elemento eliminado en ${selectedTab} correctamente`, "warning");
        });
        
        const sizeSlider = toolsContainer.querySelector(".text-sizeEmo");
        const sizeText = toolsContainer.querySelector(".text-sizeEmo-value");

        sizeSlider.addEventListener("input", (e) => {
            const newSize = parseInt(e.target.value);
            obj.set("fontSize", newSize);
            obj.initDimensions();
            sizeText.textContent = newSize + "px";
            if (canvases && canvases[canvasName]) {
                canvases[canvasName].renderAll();
            }
        });
    } else if (obj.type === "image") {
        // Para imágenes
        const thumbnail = obj._element ? obj._element.src : '';
        const initialScale = obj.scaleX * 100;
        const initialRotation = obj.angle || 0;
        
        toolsContainer.innerHTML = `
        <div class="tool-group">
            <div class="tool-label"><i class="material-icons">image</i> Imagen - ${objectCounter}</div>
            <img src="${thumbnail}" class="thumbnail-img">
        </div>
        <div class="tool-group">
            <div class="tool-label"><i class="material-icons">photo_size_select_large</i> Tamaño 
                <span class="img-size-value">${Math.round(initialScale)}%</span>
            </div>
            <div class="size-controls">
                <button class="size-btn size-minus">−</button>
                <input type="range" class="img-size-slider" min="1" max="200" value="${Math.round(initialScale)}">
                <button class="size-btn size-plus">+</button>
            </div>
        </div>
        <div class="tool-group">
            <div class="tool-label"><i class="material-icons">rotate_right</i> Rotación
                <span class="rotation-value">${Math.round(initialRotation)}°</span>
            </div>
            <input type="range" class="rotation-slider" min="0" max="360" value="${Math.round(initialRotation)}">
            <div class="rotation-buttons">
                <button class="rotate-btn rotate-left" title="Rotar 90° izquierda">↶</button>
                <button class="rotate-btn rotate-right" title="Rotar 90° derecha">↷</button>
                <button class="rotate-btn rotate-reset" title="Restablecer">⟲</button>
            </div>
        </div>
        <div class="tool-buttons">
            <button class="select-dlt">Eliminar</button>
        </div>
        `;

        // Configurar eventos para controles de imagen
        setupImageControlEvents(obj, toolsContainer, canvasName);
    }
    
    setTimeout(() => {
        highlightListItem(obj._listId, canvasName, true);
    }, 100);
}

function setupTextControlEvents(obj, toolsContainer, canvasName) {
    // Contenido del texto
    toolsContainer.querySelector(".text-content").addEventListener("input", (e) => {
        obj.set("text", e.target.value);
        if (canvases && canvases[canvasName]) {
            canvases[canvasName].renderAll();
        }
    });
    
    // Alineación
    const alignButtons = toolsContainer.querySelectorAll(".align-btn");
    alignButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            const alignment = e.currentTarget.dataset.align;
            alignButtons.forEach(btn => btn.classList.remove("active"));
            e.currentTarget.classList.add("active");
            obj.set("textAlign", alignment);
            if (canvases && canvases[canvasName]) {
                canvases[canvasName].setActiveObject(obj);
                canvases[canvasName].renderAll();
            }
            showNotification(`Texto alineado a la ${alignment === 'left' ? 'izquierda' : alignment === 'center' ? 'centro' : alignment === 'right' ? 'derecha' : 'justificado'}`, "info");
        });
    });
    
    // Estilos
    const styleButtons = toolsContainer.querySelectorAll(".style-btn");
    styleButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            const style = e.currentTarget.dataset.style;
            e.currentTarget.classList.toggle("active");
            
            switch(style) {
                case 'bold':
                    obj.set("fontWeight", obj.fontWeight === 'bold' ? 'normal' : 'bold');
                    break;
                case 'italic':
                    obj.set("fontStyle", obj.fontStyle === 'italic' ? 'normal' : 'italic');
                    break;
                case 'underline':
                    obj.set("underline", !obj.underline);
                    break;
                case 'linethrough':
                    obj.set("linethrough", !obj.linethrough);
                    break;
            }
            if (canvases && canvases[canvasName]) {
                canvases[canvasName].setActiveObject(obj);
                canvases[canvasName].renderAll();
            }
            showNotification(`Estilo ${style} ${e.currentTarget.classList.contains('active') ? 'activado' : 'desactivado'}`, "info");
        });
    });
    
    // Color
    toolsContainer.querySelector(".text-color").addEventListener("input", (e) => {
        obj.set("fill", e.target.value);
        if (canvases && canvases[canvasName]) {
            canvases[canvasName].setActiveObject(obj);
            canvases[canvasName].renderAll();
        }
    });
    
    // Tamaño
    const sizeSlider = toolsContainer.querySelector(".text-size");
    const sizeText = toolsContainer.querySelector(".text-size-value");
    sizeSlider.addEventListener("input", (e) => {
        const newSize = parseInt(e.target.value);
        obj.set("fontSize", newSize);
        obj.initDimensions();
        sizeText.textContent = newSize + "px";
        if (canvases && canvases[canvasName]) {
            canvases[canvasName].setActiveObject(obj);
            canvases[canvasName].renderAll();
        }
    });
    
    // Fuente
    toolsContainer.querySelector(".text-font").addEventListener("change", async (e) => {
        const newFont = e.target.value;
        try {
            await document.fonts.load(`16px "${newFont}"`);  
            obj.set("fontFamily", newFont);
            obj.initDimensions();
            if (canvases && canvases[canvasName]) {
                canvases[canvasName].setActiveObject(obj);
                canvases[canvasName].renderAll();
            }
        } catch (err) {
            console.error("Error aplicando fuente:", newFont, err);
        }
    });
    
    // Borde
    toolsContainer.querySelector(".text-border").addEventListener("input", (e) => {
        obj.set({
            stroke: e.target.value,
            strokeWidth: 2
        });
        if (canvases && canvases[canvasName]) {
            canvases[canvasName].setActiveObject(obj);
            canvases[canvasName].renderAll();
        }
    });
    
    // Botón eliminar
    toolsContainer.querySelector(".select-dlt").addEventListener("click", () => {
        if (canvases && canvases[obj._canvasName]) {
            const realCanvas = canvases[obj._canvasName];
            realCanvas.remove(obj);
            realCanvas.renderAll();
        }
        const li = document.getElementById(obj._listId);
        if (li) li.remove();
        showNotification(`Elemento eliminado en ${selectedTab} correctamente`, "warning");
    });
}

function setupImageControlEvents(obj, toolsContainer, canvasName) {
    // Botón eliminar
    toolsContainer.querySelector(".select-dlt").addEventListener("click", () => {
        if (canvases && canvases[canvasName]) {
            canvases[canvasName].remove(obj);
            canvases[canvasName].renderAll();
        }
        const li = document.getElementById(obj._listId);
        if (li) li.remove();
        showNotification(`Elemento eliminado en ${selectedTab} correctamente`, "warning");
    });
    
    // Tamaño de imagen
    const slider = toolsContainer.querySelector(".img-size-slider");
    const sizeLabel = toolsContainer.querySelector(".img-size-value");
    const btnPlus = toolsContainer.querySelector(".size-plus");
    const btnMinus = toolsContainer.querySelector(".size-minus");
    const MIN = 1;
    const MAX = 200;
    const STEP = 5;
    
    function applySize(percentage) {
        percentage = Math.max(MIN, Math.min(MAX, percentage));
        const originalScale = obj._originalScale || 1;
        const newScale = originalScale * (percentage / 100);
        obj.scale(newScale);
        obj._currentPercentage = percentage;
        slider.value = percentage;
        sizeLabel.textContent = percentage + "%";
        if (canvases && canvases[canvasName]) {
            canvases[canvasName].setActiveObject(obj);
            canvases[canvasName].renderAll();
        }
    }

    slider.addEventListener("input", (e) => {
        applySize(parseInt(e.target.value));
    });
    btnPlus.addEventListener("click", () => {
        applySize(parseInt(slider.value) + STEP);
    });
    btnMinus.addEventListener("click", () => {
        applySize(parseInt(slider.value) - STEP);
    });
    
    // Rotación
    const rotationSlider = toolsContainer.querySelector(".rotation-slider");
    const rotationLabel = toolsContainer.querySelector(".rotation-value");
    rotationSlider.addEventListener("input", (e) => {
        const angle = parseInt(e.target.value);
        obj.set({ angle: angle });
        rotationLabel.textContent = angle + "°";
        if (canvases && canvases[canvasName]) {
            canvases[canvasName].setActiveObject(obj);
            obj.setCoords();
            canvases[canvasName].renderAll();
        }
    });
    
    // Botones de rotación rápida
    const rotateLeftBtn = toolsContainer.querySelector(".rotate-left");
    const rotateRightBtn = toolsContainer.querySelector(".rotate-right");
    const rotateResetBtn = toolsContainer.querySelector(".rotate-reset");
    
    rotateLeftBtn.addEventListener("click", () => {
        const currentAngle = obj.angle || 0;
        const newAngle = (currentAngle - 90) % 360;
        obj.set({ angle: newAngle });
        rotationSlider.value = newAngle;
        rotationLabel.textContent = Math.round(newAngle) + "°";
        obj.setCoords();
        if (canvases && canvases[canvasName]) {
            canvases[canvasName].renderAll();
        }
        showNotification("Rotado 90° a la izquierda", "info");
    });
    
    rotateRightBtn.addEventListener("click", () => {
        const currentAngle = obj.angle || 0;
        const newAngle = (currentAngle + 90) % 360;
        obj.set({ angle: newAngle });
        rotationSlider.value = newAngle;
        rotationLabel.textContent = Math.round(newAngle) + "°";
        obj.setCoords();
        if (canvases && canvases[canvasName]) {
            canvases[canvasName].renderAll();
        }
        showNotification("Rotado 90° a la derecha", "info");
    });
    
    rotateResetBtn.addEventListener("click", () => {
        obj.set('angle', 0);
        rotationSlider.value = 0;
        rotationLabel.textContent = "0°";
        obj.setCoords();
        if (canvases && canvases[canvasName]) {
            canvases[canvasName].renderAll();
        }
        showNotification("Rotación restablecida", "info");
    });
}

function highlightListItem(listId, canvasName, temporary = false) {
    // Limpiar resaltado anterior en este canvas
    clearHighlight(canvasName);
    
    // Encontrar y resaltar el nuevo elemento
    const li = document.getElementById(listId);
    if (!li) return;
    
    // Agregar clase de resaltado
    li.classList.add("highlighted");
    
    if (temporary) {
        li.classList.add("highlighted-temporary");
        // Remover después de 2 segundos
        setTimeout(() => {
            li.classList.remove("highlighted-temporary");
        }, 2000);
    }
    
    // Guardar referencia
    highlightedElements[canvasName] = listId;
    
    // Scroll al elemento si está fuera de vista
    li.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function clearHighlight(canvasName) {
    if (highlightedElements[canvasName]) {
        const previousLi = document.getElementById(highlightedElements[canvasName]);
        if (previousLi) {
            previousLi.classList.remove("highlighted", "highlighted-temporary");
        }
        highlightedElements[canvasName] = null;
    }
}

function clearAllHighlights() {
    Object.keys(highlightedElements).forEach(canvasName => {
        clearHighlight(canvasName);
    });
}

function findListItemByObject(obj) {
    if (!obj._listId) return null;
    return document.getElementById(obj._listId);
}

function setupCanvasSelectionSync() {
    if (!canvases) return;
    
    const canvasNames = ['front', 'back', 'leftsleeve', 'rightsleeve'];
    
    canvasNames.forEach(name => {
        const canvas = canvases[name];
        if (!canvas) return;
        
        // Cuando se selecciona un objeto en el canvas
        canvas.on('selection:created', (e) => {
            if (e.target && e.target._listId) {
                highlightListItem(e.target._listId, name);
            }
        });
        
        canvas.on('selection:updated', (e) => {
            if (e.selected && e.selected.length === 1 && e.selected[0]._listId) {
                highlightListItem(e.selected[0]._listId, name);
            } else if (e.selected && e.selected.length === 0) {
                clearHighlight(name);
            }
        });
        
        canvas.on('selection:cleared', () => {
            clearHighlight(name);
        });
        
        // Cuando se mueve o modifica un objeto
        canvas.on('object:modified', (e) => {
            if (e.target && e.target._listId) {
                const li = findListItemByObject(e.target);
                if (li) {
                    li.classList.add('recently-modified');
                    setTimeout(() => {
                        li.classList.remove('recently-modified');
                    }, 1000);
                }
            }
        });
        
        // Cuando se elimina un objeto
        canvas.on('object:removed', (e) => {
            if (e.target && e.target._listId) {
                const li = findListItemByObject(e.target);
                if (li) {
                    li.classList.add('removing');
                    setTimeout(() => {
                        if (li.parentNode) {
                            li.remove();
                        }
                        clearHighlight(name);
                    }, 300);
                }
            }
        });
    });
}

// ========== EMOJI FUNCTIONS ==========

function addEmoji() {
    if (!window.emojiCategories) {
        fetch('emojis.json')
            .then(res => res.json())
            .then(data => {
                window.emojiCategories = data;
                loadEmojiGrid("faces");
            })
            .catch(err => {
                console.error('Error cargando emojis:', err);
                showNotification("Error al cargar emojis", "error");
            });
    } else {
        loadEmojiGrid("faces");
    }
    document.getElementById("emojiModal").style.display = "block";
    document.body.style.overflow = "hidden";
}

function closeEmojiModal() {
    document.getElementById("emojiModal").style.display = "none";
    document.body.style.overflow = "auto";
}

function loadEmojiGrid(category) {
    const grid = document.getElementById("emojiGrid");
    if (!grid || !window.emojiCategories || !window.emojiCategories[category]) return;
    
    grid.innerHTML = "";

    window.emojiCategories[category].forEach(emoji => {
        const span = document.createElement("span");
        span.textContent = emoji;
        span.onclick = function() {
            addEmojiToCanvas(emoji);
            closeEmojiModal();
        };
        grid.appendChild(span);
    });

    // Activar clase en pestañas
    document.querySelectorAll(".emoji-tab").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.cat === category);
    });
}

function addEmojiToCanvas(emoji) {
    if (!canvases || !canvases[selectedTab]) {
        console.error("Canvas no disponible para agregar emoji");
        return;
    }
    
    const canvas = canvases[selectedTab];
    const emojiObj = new fabric.IText(emoji, {
        left: canvas.width / 2,
        top: canvas.height / 2,
        fontSize: 80,
        fontFamily: "Noto Color Emoji, EmojiOne, sans-serif",
        editable: false,
        selectable: true,
        evented: true,
        lockScalingFlip: true,
        hasControls: true,                  // ← MANTENER CONTROLES
        hasBorders: true,                   // ← MANTENER BORDES
        lockMovementX: false,               // ← PERMITIR MOVIMIENTO
        lockMovementY: false,
        lockRotation: false,                // ← PERMITIR ROTACIÓN
        lockScalingX: false,                // ← PERMITIR ESCALADO
        lockScalingY: false,
        _isEmoji: true  
    });

    canvas.add(emojiObj);
    canvas.setActiveObject(emojiObj);
    emojiObj.id = generateObjectId();
    addObjectToList(emojiObj, false, selectedTab);
    showNotification(`Emoji agregado en ${selectedTab}!`, "success");
    canvas.renderAll();
}

// ========== LOADING STATES ==========
let isLoadingMaterials = false;

function loadMaterials() {
    // Evitar múltiples ejecuciones simultáneas
    if (isLoadingMaterials) return;
    
    const container = document.querySelector("#step1-content .type-buttons");
    if (!container) return;
    
    isLoadingMaterials = true;
    
    showLoadingState(
        container, 
        "Buscando materiales", 
        "Estamos cargando las mejores opciones para ti...",
        "materials"
    );
    
    disableNavigation(true);
    
    const timeout = 10000;
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Tiempo de espera agotado")), timeout);
    });
    
    Promise.race([
        fetch("get_data.php?type=step1"),
        timeoutPromise
    ])
    .then(res => {
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        return res.json();
    })
    .then(data => {
        const renderMaterial = (item) => {
            const div = document.createElement("div");
            div.classList.add("type-button");
            div.setAttribute("onclick", `selectType("${item.id}", "${item.nombre}", this)`);
            div.innerHTML = `
                <img src="img/icon/${item.imgIcon}" alt="${item.nombre}">
                <span>${item.nombre}</span>
            `;
            return div;
        };
        
        showSuccessState(
            container, 
            data.materials, 
            renderMaterial,
            `${data.materials.length} materiales disponibles`
        );
        
        disableNavigation(false);
        isLoadingMaterials = false;
    })
    .catch(error => {
        showErrorState(container, error, loadMaterials, "Error al cargar materiales");
        disableNavigation(false);
        isLoadingMaterials = false;
    });
}
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
    
    if (container.dataset.loadingInterval) {
        clearInterval(parseInt(container.dataset.loadingInterval));
        delete container.dataset.loadingInterval;
    }
    
    container.innerHTML = "";
    
    if (!items || items.length === 0) {
        showEmptyState(container, "No hay elementos disponibles");
        return;
    }
    
    items.forEach((item, index) => {
        setTimeout(() => {
            const element = renderItem(item);
            element.classList.add("fade-in");
            element.style.animationDelay = `${index * 30}ms`;
            container.appendChild(element);
        }, index * 30);
    });
    
    if (successMessage) {
        setTimeout(() => {
            showNotification(`✓ ${successMessage}`, "success", 2000);
        }, items.length * 30 + 200);
    }
}

function showErrorState(container, error, retryFunction, customMessage = null) {
    if (!container) return;
    
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
    if (!container) return;
    
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

Object.assign(window, {
    switchTab,
    addText,
    updateTextFont,
    updateTextColor,
    updateTextSize,
    updateTextBorder,
    addImage,
    uploadImage,
    updateImageBorder,
    zoomIn,
    zoomOut,
    resetZoom,
    startDesignProcess,
    nextStep,
    prevStep,
    selectType,
    selectColor,
    addEmoji,
    closeEmojiModal,
    loadEmojiGrid,
    addEmojiToCanvas,
    finishDesign,
    loadMaterials,
    disableNavigation,
    showLoadingState,
    showSuccessState,
    showErrorState,
    showEmptyState
});