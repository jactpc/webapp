let currentStep = 1;
const totalSteps = 5;
let selectedColor = null;
let selectedColorText = null;
let selectedMaterial = null;
let selectedMaterialText = null;
let designData = {
    color: null,
    sizes: {},
    design: {
        front: { objects: [] },
        back: { objects: [] },
        leftsleeve: { objects: [] },
        rightsleeve: { objects: [] }
    }
};

function startDesignProcess() {
    document.getElementById("hero").classList.add("hidden");
    document.getElementById("hero2").classList.remove("hidden");
    document.getElementById('features').style.display = 'block';
    document.getElementById('steps-container').style.display = 'block';
    document.getElementById('navigation-buttons').style.display = 'flex';
    document.getElementById('progress-summary').classList.add('active');
    
    // Scroll suave a la sección de pasos
    document.getElementById('steps-container').scrollIntoView({ behavior: 'smooth' });
}

// Navegación entre pasos
function nextStep() {
    if (!validateCurrentStep()) return;
  
    // Guardar datos del paso actual
    saveCurrentStepData();
    
    // Ocultar paso actual
    document.getElementById(`step${currentStep}-content`).classList.remove('active');
    document.getElementById(`step-${currentStep}`).classList.remove('active');
    document.getElementById(`step-${currentStep}`).classList.add('completed');
    
    // Incrementar paso
    currentStep++;
    
    // Mostrar siguiente paso
    document.getElementById(`step${currentStep}-content`).classList.add('active');
    document.getElementById(`step-${currentStep}`).classList.add('active');
    
    // Actualizar botones de navegación
    updateNavigationButtons();
    
    // Si estamos en el paso 4, actualizar resumen
    if (currentStep === 5) {
        updateFinalSummary();
    }
    
    // Scroll al inicio del paso
    document.getElementById(`step${currentStep}-content`).scrollIntoView({ behavior: 'smooth' });
}

function prevStep() {
    // Ocultar paso actual
    document.getElementById(`step${currentStep}-content`).classList.remove('active');
    document.getElementById(`step-${currentStep}`).classList.remove('active');
    document.getElementById(`step-${currentStep}`).classList.remove('completed');
    
    // Decrementar paso
    currentStep--;
    
    // Mostrar paso anterior
    document.getElementById(`step${currentStep}-content`).classList.add('active');
    document.getElementById(`step-${currentStep}`).classList.add('active');
    
    // Actualizar botones de navegación
    updateNavigationButtons();
    
    // Scroll al inicio del paso
    document.getElementById(`step${currentStep}-content`).scrollIntoView({ behavior: 'smooth' });
}

function updateNavigationButtons() {
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const btnFinish = document.getElementById('btn-finish');
    
    // Mostrar/ocultar botón anterior
    if (currentStep === 1) {
        btnPrev.style.display = 'none';
    } else {
        btnPrev.style.display = 'flex';
    }
    
    // Mostrar/ocultar botones siguiente/finalizar
    if (currentStep === totalSteps) {
        btnNext.style.display = 'none';
        btnFinish.style.display = 'flex';
    } else {
        btnNext.style.display = 'flex';
        btnFinish.style.display = 'none';
    }
}

// Validación de pasos
function validateCurrentStep() {
    const validationMsg = document.getElementById(`step${currentStep}-validation`);
  
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
        // El paso 3 siempre es válido (pueden no agregar diseño)
        break;

        case 5:
        // El paso 3 siempre es válido (pueden no agregar diseño)
        break;
    }
    
    validationMsg.style.display = 'none';
    return true;
}

// Guardar datos del paso actual
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
    if (element){
        selectedMaterial = dataType;
        selectedMaterialText = nombre;
        element.classList.add("active");
    }

    // Ocultar mensaje de validación
    document.getElementById('step1-validation').style.display = 'none';
    fetch("get_data.php?type=colors&material=" + selectedMaterial)
        .then(res => res.json())
        .then(data => {
            loadStep2Colors(data.colors);
            selectedColor = null;
            selectedColorText = null;
        });
    // Actualizar resumen
    updateProgressSummary();
    showNotification("¡Progreso guardado automáticamente!", "success");
}
// ========== PASO 2: SELECCIÓN DE COLOR ==========
function selectColor(color, nombre, element) {
    selectedColor = `${color}`;
    selectedColorText=nombre;
    // Actualizar UI
    document.querySelectorAll(".color-button").forEach(btn => {
        btn.classList.remove("active");
    });
    if (element){
        fetch("get_data.php?type=sizes&material=" + selectedMaterial + "&color=" + selectedColor)
        .then(res => res.json())
        .then(data => {
            loadStep3Sizes(data.sizes);
        });
        element.classList.add("active");
        changeTshirtColor(color, element);
    }

    // Ocultar mensaje de validación
    document.getElementById('step1-validation').style.display = 'none';

    // Actualizar resumen
    updateProgressSummary();
    showNotification("¡Progreso guardado automáticamente!", "success");
}

// ========== PASO 2: SELECCIÓN DE TALLAS ==========
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
    const button = qtyEl.closest(".size-button");

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

// --- Configurar todo en un solo lugar ---
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
            let value = parseInt(qtyEl.textContent) || 0;

            if (btn.classList.contains("plus")) value++;
            if (btn.classList.contains("minus")) value = Math.max(0, value - 1);

            updateSizeUI(size, value);
        });
    });
}

function saveDesignData() {
    if (!window.canvases) return;

    designData.design = {
        front: canvases.front.toJSON(),
        back: canvases.back.toJSON(),
        leftsleeve: canvases.leftsleeve.toJSON(),
        rightsleeve: canvases.rightsleeve.toJSON()
    };
}


// ========== RESUMEN Y PROGRESO ==========
function updateProgressSummary() {
    // Actualizar color
    const materialText = document.getElementById('summary-material-text');
    materialText.textContent = selectedMaterialText;

    const colorText = document.getElementById('summary-color-text');
    if (selectedColor) {
        colorText.textContent = selectedColorText;
    }

    // Actualizar tallas
    const sizesText = document.getElementById('summary-sizes-text');
    const sizes = Object.entries(designData.sizes)
    .filter(([size, qty]) => qty > 0)
    .map(([size, qty]) => `${size}: ${qty}`)
    .join(', ');

    if (sizes) {
        sizesText.textContent = sizes;
    }

    // Actualizar diseño
    const designText = document.getElementById('summary-design-text');
    let designCount = 0;
    if (designData.design) {
        Object.values(designData.design).forEach(section => {
            if (section.objects && section.objects.length > 0) {
                designCount += section.objects.length;
            }
        });
    }

    if (designCount > 0) {
        designText.textContent = `${designCount} elementos personalizados`;
    }
}

function updateFinalSummary() {
    document.getElementById('final-Material').textContent = selectedMaterialText;
    document.getElementById('final-color').textContent = selectedColorText;

    // Actualizar tallas finales
    const finalSizesList = document.getElementById('final-sizes');
    finalSizesList.innerHTML = '';
  
    Object.entries(designData.sizes).forEach(([size, qty]) => {
        if (qty > 0) {
            const li = document.createElement('li');
            li.textContent = `${size}: ${qty} unidad(es)`;
            finalSizesList.appendChild(li);
        }
    });
  
    // Actualizar contador de diseño
    let designCount = 0;
    if (designData.design) {
        Object.values(designData.design).forEach(section => {
            if (section.objects && section.objects.length > 0) {
                designCount += section.objects.length;
            }
        });
    }
    document.getElementById('final-design-count').textContent = designCount;
  
    // Actualizar previews
    updatePreviews();
}

function showNotification(message, type = "info", duration = 3000) {
    const notification = document.getElementById("save-notification");

    // Limpiar clases anteriores
    notification.className = "save-notification";

    // Agregar tipo
    notification.classList.add(`notify-${type}`);

    // Cambiar mensaje
    notification.innerHTML = message;

    // Mostrar
    notification.style.display = "block";
    setTimeout(() => notification.style.opacity = "1", 10);

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
    // Exportar cada vista del canvas
    const sections = ['front', 'back', 'leftsleeve', 'rightsleeve'];
  
    sections.forEach(section => {
        if (canvases && canvases[section]) {
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

// ========== INICIALIZACIÓN ==========
document.addEventListener('DOMContentLoaded', function() {
    // Configurar eventos de tallas
    setupSizeQuantityEvents();
    
    // Inicializar botones de navegación
    updateNavigationButtons();
});
// ——— Canvases (uno por sección) ———
const canvases = {
    front: new fabric.Canvas('front-canvas'),
    back: new fabric.Canvas('back-canvas'),
    leftsleeve: new fabric.Canvas('leftsleeve-canvas'),
    rightsleeve: new fabric.Canvas('rightsleeve-canvas')
};

let selectedTab = 'front';
let currentColor = '0001';

// Estado por sección: JSON de objetos + src de fondo actual
const sectionsState = {
    front: { json: null, bgSrc: `img/0001${currentColor}.front.jpg` },
    back: { json: null, bgSrc: `img/0001${currentColor}.back.jpg` },
    leftsleeve: { json: null, bgSrc: `img/0001${currentColor}.leftsleeve.jpg` },
    rightsleeve: { json: null, bgSrc: `img/0001${currentColor}.rightsleeve.jpg` }
};
  // ——— Utilidades de fondo ———
function loadBackground(section, renderNow = true) {
    const canvas = canvases[section];
    const url = sectionsState[section].bgSrc;

    fabric.Image.fromURL(
        url,
        (img) => {
            img.selectable = false;
            img.evented = false;

            // Ajustar SOLO por altura
            img.scaleToHeight(canvas.height);

            // Aplicar zoom adicional del 1.2
            img.scaleX *= 1.2;
            img.scaleY *= 1.2;

            // Calcular el ancho resultante con el zoom aplicado
            const scaledWidth = img.width * img.scaleX;

            // Centrar horizontalmente con el nuevo zoom
            img.left = (canvas.width - scaledWidth) / 2;
            img.top = (canvas.height - img.height * img.scaleY) / 2;

            // Aplicar como fondo
            canvas.setBackgroundImage(img, () => {
                if (renderNow) canvas.renderAll();
                updateMiniMap();
                updatePreviews();
            });
        },
        { crossOrigin: "anonymous" }
  );
}
function changeTshirtColor(color, element) {
    selectedColor = color;
    currentColor = color;

    Object.keys(canvases).forEach(section => {
        sectionsState[section].bgSrc = `img/${selectedMaterial}${currentColor}.${section}.jpg`;
        loadBackground(section);
    });

    document.querySelectorAll(".color-button").forEach(btn => {
        btn.classList.remove("active");
    });

    if (element) element.classList.add("active");
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
const canvasLists = {
    "front": document.getElementById("elements-front"),
    "back": document.getElementById("elements-back"),
    "leftsleeve": document.getElementById("elements-leftsleeve"),
    "rightsleeve": document.getElementById("elements-rightsleeve")
};
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
    // Mostrar SOLO la lista de elementos del canvas actual
    Object.keys(canvasLists).forEach(section => {
        if (canvasLists[section]) {
            canvasLists[section].style.display = (section === tab) ? "block" : "none";
        }
    });
    updateMiniMap();
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
loadFonts(fonts).then(() => { console.log("Fuentes cargadas correctamente"); });
// ——— Agregar Texto ———
let objectCounter = 0;

function generateObjectId() {
    objectCounter++;
    return "obj-" + objectCounter;
}
function addText() {
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
    canvases[selectedTab].add(text);
    addObjectToList(text, true, selectedTab);
    showNotification("¡Texto agregado!", "success");
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
                img.id = generateObjectId();
                canvas.add(img);
                canvas.setActiveObject(img); // opcional, selecciona la imagen
                canvas.renderAll();
                addObjectToList(img, false, selectedTab);

                uploadImageToServer(file); // opcional, requiere backend
                showNotification("Imagen agregada!", "success");
            };
        };
        reader.readAsDataURL(file);
    };
    input.click();
}

function updateImageBorder() {
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

  // ——— Eventos por lienzo ———
Object.keys(canvases).forEach((key) => {
    const canvas = canvases[key];
    const canvasEl = document.getElementById(`${key}-canvas`);

    canvas.on('mouse:down', function (e) {
        if (key !== selectedTab) return;
        const pointer = canvas.getPointer(e.e);
        const active = canvas.getActiveObject();
    });

    canvas.on('selection:created', () => {
        if (key !== selectedTab) return;
        const active = canvas.getActiveObject();
        if (!active) return;
        const pointer = { x: active.left || 0, y: active.top || 0 };
    });

    canvas.on('selection:updated', () => {
        if (key !== selectedTab) return;
        const active = canvas.getActiveObject();
        if (!active) return;
        const pointer = { x: active.left || 0, y: active.top || 0 };
    });

    canvas.on('selection:cleared', () => {
        if (key !== selectedTab) return;
        //hideContextMenu();
    });
    canvas.on('object:scaling', function (e) {
        const obj = e.target;

        if (obj && obj.type === 'i-text') {
            const originalFont = obj.fontSize; 
            const newFont = originalFont * obj.scaleX; 

            // Actualizar el input ID=text-size
            const ts = document.getElementById('text-sizeEl');
            if (ts) ts.value = Math.round(newFont);

            // Aplicar el nuevo fontSize al texto
            obj.fontSize = newFont;

            // Resetear escalado para evitar distorsión
            obj.scaleX = 1;
            obj.scaleY = 1;

            canvas.requestRenderAll();
        }
    });
    
});

  // ——— Mini-mapa ———
const miniMapCanvas = new fabric.Canvas('mini-map');

function updateMiniMap() {
    const mainCanvas = canvases[selectedTab];
    if (!mainCanvas) return;

    miniMapCanvas.clear();
    
    // Obtener dimensiones del canvas principal y minimapa
    const mainWidth = mainCanvas.width;
    const mainHeight = mainCanvas.height;
    const miniWidth = miniMapCanvas.width;
    const miniHeight = miniMapCanvas.height;
    
    // Obtener el fondo actual del canvas principal
    const bgImage = mainCanvas.backgroundImage;
    if (!bgImage) return;

    // Calcular cómo se muestra el fondo en el canvas principal
    const bgElement = bgImage._element || bgImage.getElement();
    if (!bgElement) return;
    
    const bgOriginalWidth = bgElement.width || 1;
    const bgOriginalHeight = bgElement.height || 1;
    const bgScaleX = bgImage.scaleX || 1;
    const bgScaleY = bgImage.scaleY || 1;
    const bgLeft = bgImage.left || 0;
    const bgTop = bgImage.top || 0;
    
    // Dimensiones finales del fondo en el canvas principal
    const bgDisplayWidth = bgOriginalWidth * bgScaleX;
    const bgDisplayHeight = bgOriginalHeight * bgScaleY;
    
    // Calcular escala para que el FONDO (no todo el canvas) quepa en el minimapa
    const scaleX = miniWidth / bgDisplayWidth;
    const scaleY = miniHeight / bgDisplayHeight;
    const scale = Math.min(scaleX, scaleY);
    
    // Calcular offset para centrar el FONDO en el minimapa
    const offsetX = (miniWidth - bgDisplayWidth * scale) / 2;
    const offsetY = (miniHeight - bgDisplayHeight * scale) / 2;

    // 1. Agregar el fondo al minimapa (ya escalado)
    bgImage.clone((miniBg) => {
        miniBg.set({
            left: offsetX,
            top: offsetY,
            scaleX: bgScaleX * scale,
            scaleY: bgScaleY * scale,
            selectable: false,
            evented: false,
            hasControls: false,
            hasBorders: false
        });
        
        miniMapCanvas.setBackgroundImage(miniBg, () => {
            // 2. Agregar objetos del canvas principal al minimapa
            const objects = mainCanvas.getObjects();
            objects.forEach((obj) => {
                // Calcular posición RELATIVA AL FONDO
                // Primero, ajustar posición considerando el desplazamiento del fondo
                const objLeftRelativeToBg = (obj.left || 0) - bgLeft;
                const objTopRelativeToBg = (obj.top || 0) - bgTop;
                
                // Convertir a coordenadas del minimapa
                const miniLeft = offsetX + objLeftRelativeToBg * scale;
                const miniTop = offsetY + objTopRelativeToBg * scale;
                
                if (obj.type === 'i-text') {
                  obj.clone((clone) => {
                      // Posición
                      clone.left = miniLeft;
                      clone.top = miniTop;

                      // Escala real proporcional al canvas
                      clone.scaleX = obj.scaleX * scale;
                      clone.scaleY = obj.scaleY * scale;

                      // No tocar fontSize ni métricas internas
                      clone.set({
                          selectable: false,
                          evented: false,
                          hasControls: false,
                          hasBorders: false
                      });

                      clone.setCoords();
                      miniMapCanvas.add(clone);
                      miniMapCanvas.renderAll();
                  }, true); // 👈 ESTE "true" mantiene estilos, padding, metrics y transformaciones
                } else if (obj.type === 'image') {
                    obj.clone((imgClone) => {
                        const imgElement = imgClone._element || imgClone.getElement();
                        if (imgElement) {
                            fabric.Image.fromURL(imgElement.src, (miniImg) => {
                                miniImg.set({
                                    left: miniLeft,
                                    top: miniTop,
                                    scaleX: (obj.scaleX || 1) * scale,
                                    scaleY: (obj.scaleY || 1) * scale,
                                    angle: obj.angle || 0,
                                    opacity: obj.opacity || 1,
                                    selectable: false,
                                    evented: false,
                                    hasControls: false,
                                    hasBorders: false
                                });
                                
                                miniMapCanvas.add(miniImg);
                                miniMapCanvas.renderAll();
                            });
                        }
                    });
                } else {
                    // Para otros objetos
                    obj.clone((clone) => {
                        clone.set({
                            left: miniLeft,
                            top: miniTop,
                            scaleX: (obj.scaleX || 1) * scale,
                            scaleY: (obj.scaleY || 1) * scale,
                            angle: obj.angle || 0,
                            opacity: obj.opacity || 1,
                            selectable: false,
                            evented: false,
                            hasControls: false,
                            hasBorders: false
                        });
                        
                        miniMapCanvas.add(clone);
                        miniMapCanvas.renderAll();
                    });
                }
            });
            
            // 3. Dibujar indicador del viewport
            drawViewportIndicator(mainCanvas, miniMapCanvas, scale, offsetX, offsetY, bgLeft, bgTop);
            
            miniMapCanvas.renderAll();
        });
    });
}

function drawViewportIndicator(mainCanvas, miniCanvas, scale, offsetX, offsetY, bgLeft, bgTop) {
    try {
        const zoom = mainCanvas.getZoom();
        const vpt = mainCanvas.viewportTransform;
        
        if (!vpt || !zoom) return;
        
        // Calcular el área visible RELATIVA AL FONDO
        const visibleLeft = (-vpt[4] / zoom) - bgLeft;
        const visibleTop = (-vpt[5] / zoom) - bgTop;
        const visibleWidth = mainCanvas.width / zoom;
        const visibleHeight = mainCanvas.height / zoom;
        
        // Eliminar indicador anterior
        const existingIndicator = miniCanvas.getObjects().find(obj => obj.isViewportIndicator);
        if (existingIndicator) {
            miniCanvas.remove(existingIndicator);
        }
        
        // Crear nuevo indicador
        const indicator = new fabric.Rect({
            left: offsetX + visibleLeft * scale,
            top: offsetY + visibleTop * scale,
            width: visibleWidth * scale,
            height: visibleHeight * scale,
            fill: 'rgba(255, 255, 255, 0.2)',
            stroke: '#2196F3',
            strokeWidth: 2,
            strokeDashArray: [5, 5],
            selectable: false,
            evented: false,
            hasControls: false,
            hasBorders: false,
            isViewportIndicator: true
        });
        
        miniCanvas.add(indicator);
        miniCanvas.bringToFront(indicator);

    } catch (error) {
        console.error('Error dibujando indicador:', error);
    }
}
let isDraggingMiniMap = false;
// Actualizar el evento de click en el minimapa para navegación
miniMapCanvas.on("mouse:down", function (e) {
    isDraggingMiniMap = true;
    moveViewportFromMinimap(e); // ya centra el viewport
});

miniMapCanvas.on("mouse:move", function (e) {
    if (isDraggingMiniMap) {
        moveViewportFromMinimap(e);
    }
});

miniMapCanvas.on("mouse:up", function () {
    isDraggingMiniMap = false;
});

function moveViewportFromMinimap(e) {
    const main = canvases[selectedTab];
    const pointer = miniMapCanvas.getPointer(e.e);

    const mainWidth = main.width;
    const mainHeight = main.height;
    const miniWidth = miniMapCanvas.width;
    const miniHeight = miniMapCanvas.height;

    // escalar como ya hacías
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

    updateMiniMap(); // redibujar el rectángulo del viewport
}

// Llamar a updateMiniMap cuando se modifique el canvas
Object.keys(canvases).forEach((key) => {
    const c = canvases[key];
    c.on('object:modified', updateMiniMap);
    c.on('object:added', updateMiniMap);
    c.on('object:removed', updateMiniMap);
    c.on('after:render', updateMiniMap);
    c.on('object:moving', updateMiniMap);
    c.on('object:scaling', updateMiniMap);
    c.on('object:rotating', updateMiniMap);
});

// Asegurarse de que el minimapa se actualice al cambiar de pestaña
const originalSwitchTab = switchTab;
switchTab = function(tab) {
    originalSwitchTab(tab);
    setTimeout(updateMiniMap, 100); // Pequeño delay para asegurar que todo se cargó
};


const zoomSlider = document.getElementById("zoom-slider");
const MIN_ZOOM = 0.2;
const MAX_ZOOM = 4;

function syncZoomSlider() {
    const canvas = canvases[selectedTab];
    zoomSlider.value = canvas.getZoom();
}
function zoomIn() {
    const canvas = canvases[selectedTab];
    let zoom = canvas.getZoom() * 1.2;
    if (zoom > MAX_ZOOM) zoom = MAX_ZOOM;
    canvas.zoomToPoint({ x: canvas.width / 2, y: canvas.height / 2 }, zoom);
    syncZoomSlider();
}

function zoomOut() {
    const canvas = canvases[selectedTab];
    let zoom = canvas.getZoom() / 1.2;
    if (zoom < MIN_ZOOM) zoom = MIN_ZOOM;
    canvas.zoomToPoint({ x: canvas.width / 2, y: canvas.height / 2 }, zoom);
    syncZoomSlider();
}
zoomSlider.addEventListener("input", function () {
    const canvas = canvases[selectedTab];
    const newZoom = parseFloat(this.value);

    canvas.zoomToPoint(
        { x: canvas.width / 2, y: canvas.height / 2 },
        newZoom
    );

    canvas.requestRenderAll();
    updateMiniMap();
});
function resetZoom() {
    const canvas = canvases[selectedTab];
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    canvas.setZoom(1);
    syncZoomSlider();
}

function addSize(size) { console.log(`Se seleccionó la talla ${size}`); }

// ——— Scroll ———
function scrollToFeatures() { document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }

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
    sizeX: 25,   // ancho
    sizeY: 25,   // alto
    mouseUpHandler: function(eventData, transform) {
        const target = transform.target;
        const canvas = target.canvas || transform.canvas; // asegurar acceso al canvas
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
        const size = 24; // tamaño del emoji
        ctx.font = `${size}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("❎", left, top);  // <<<<<< AQUI VA TU EMOJI
    }
});
fabric.Object.prototype.controls.br = new fabric.Control({
    x: 0.5,
    y: 0.5,
    offsetX: 10,
    offsetY: 18,
    cursorStyle: 'se-resize', // cursor de escala
    sizeX: 25,   // ancho
    sizeY: 25,   // alto

    render: function(ctx, left, top, styleOverride, fabricObject) {
        const size = 24; // tamaño del emoji
        ctx.font = `${size}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText("↘️", left, top);  // <<<<<< AQUI VA TU EMOJI
    },

    actionHandler: fabric.controlsUtils.scalingEqually,
});

fabric.Object.prototype.controls.rotateControl = new fabric.Control({
    x: 0.0,
    y: 0.5,
    offsetX: 10,
    offsetY: 18,
    cursorStyle: 'pointer',
    sizeX: 25,   // ancho
    sizeY: 25,   // alto
    render: function(ctx, left, top, styleOverride, fabricObject) {
        const size = 24; // tamaño del emoji
        ctx.font = `${size}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText("🔄", left, top);  // <<<<<< AQUI VA TU EMOJI
    },

    mouseUpHandler: function(eventData, transform) {
        const target = transform.target;

        // Rota 45 grados
        target.rotate((target.angle || 0) + 45);

        target.canvas.requestRenderAll();
        return true;
    }
});
canvases[selectedTab].on('object:added', (e) => {
    e.target.setControlsVisibility({ mt: true, mb: false, ml: false, mr: false, bl: false, br: true, tl: false, tr: false, mtr: true, deleteControl: true, rotateControl: true, });
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
});

const designAreas = {
    front: { x: 150, y: 100, width: 300, height: 400 },
    back: { x: 150, y: 100, width: 300, height: 400 },
    leftsleeve: { x: 200, y: 120, width: 200, height: 200 },
    rightsleeve: { x: 200, y: 120, width: 200, height: 200 }
};
function drawDesignArea(section) {
    const canvas = canvases[section];
    const area = designAreas[section];

    const rect = new fabric.Rect({
        left: area.x,
        top: area.y,
        width: area.width,
        height: area.height,
        fill: 'rgba(0,0,0,0)',          // transparente
        stroke: 'yellow',
        strokeDashArray: [10, 5],
        selectable: false,
        evented: false
    });

    canvas.add(rect);
    canvas.sendToBack(rect);
}
['front','back','leftsleeve','rightsleeve'].forEach(sec => {
    loadBackground(sec, false);
    drawDesignArea(sec);
});

function addObjectToList(obj, istext, canvasName) {
    const list = canvasLists[canvasName]; // ⬅️ lista correcta
    if (!list) return;

    obj._canvasName = canvasName;

    const li = document.createElement("li");
    obj._listId = "item-" + obj.id; // evita undefined y duplicados
    li.id = obj._listId;

    let labelHTML = "";
    if (obj.type === "i-text" && istext===true) {
        labelHTML = `<span><b>Texto - ${objectCounter}</b><textarea class="text-content" rows="10" cols="18">${obj.text}</textarea></span>`;
    } else if (obj.type === "image") {
        const thumbnail = obj._element.src;  // ★ AQUÍ ESTÁ EL BASE64 DE LA IMAGEN SUBIDA

        labelHTML = `
            <div class="li-image-item">
                <img src="${thumbnail}" class="thumbnail-img">
                <span><b>Imagen - ${objectCounter}</b></span>
            </div>
        `;
    }else{
        labelHTML = `
            <div class="li-image-item">
                <span class="thumbnail-img">${obj.text}</span>
                <span><b>Emoji - ${objectCounter}</b></span>
            </div>
        `;
    }

    li.innerHTML = `
        ${labelHTML}
        <div class="tools"></div>
    `;

    list.appendChild(li);

    const toolsContainer = li.querySelector(".tools");

    // === SOLO PARA TEXTOS ===
    if (obj.type === "i-text" && istext===true) {
        toolsContainer.innerHTML = `
            <div class="tool-group">
                <div class="tool-label"><i class="material-icons">format_color_text</i> Color</div>
                <input type="color" value="${obj.fill}" class="text-color">
            </div>

            <div class="tool-group">
                <div class="tool-label"><i class="material-icons">text_fields</i> Tamaño <span id="text-sizeEl" class="text-size-value">${obj.fontSize}px</span></div>
                <input type="range" value="${obj.fontSize}" min="10" max="200" class="text-size" id="text-sizeEl">
            </div>

            <div class="tool-group">
                <div class="tool-label"><i class="material-icons">font_download</i> Fuente</div>
                <select class="text-font">
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
                <div class="tool-label"><i class="material-icons">border_color</i> Borde</div>
                <input type="color" value="${obj.stroke || "#000000"}" class="text-border">
            </div>
            <div class="tool-group">
                <div class="tool-label"></div>
                <button class="dlt delete-text"><i class="material-icons">delete_forever</i> Eliminar</button>
            </div>
        `;
        li.querySelector(".text-content").addEventListener("input", (e) => {
            obj.set("text", e.target.value);
            canvases[canvasName].renderAll();
        });
        // --- CONTROL DE COLOR ---
        toolsContainer.querySelector(".text-color").addEventListener("input", (e) => {
            obj.set("fill", e.target.value);
            canvases[canvasName].renderAll();
        });

        // --- CONTROL DE TAMAÑO ---
        const sizeSlider = toolsContainer.querySelector(".text-size");
        const sizeText = toolsContainer.querySelector(".text-size-value");

        sizeSlider.addEventListener("input", (e) => {
            const newSize = parseInt(e.target.value);

            obj.set("fontSize", newSize);
            obj.initDimensions();

            sizeText.textContent = newSize + "px"; // ← actualiza el texto al lado del slider

            canvases[canvasName].renderAll();
        });

        // --- CONTROL DE FUENTE ---
        toolsContainer.querySelector(".text-font").addEventListener("change", async (e) => {
            const newFont = e.target.value;

            try {
                await document.fonts.load(`16px "${newFont}"`);  
                obj.set("fontFamily", newFont);
                obj.initDimensions();
                canvases[canvasName].renderAll();
            } catch (err) {
                console.error("Error aplicando fuente:", newFont, err);
            }
        });

        // --- CONTROL DE BORDE ---
        toolsContainer.querySelector(".text-border").addEventListener("input", (e) => {
            obj.set({
                stroke: e.target.value,
                strokeWidth: 2
            });
            canvases[canvasName].renderAll();
        });

        // --- BOTÓN ELIMINAR ---
        toolsContainer.querySelector(".delete-text").addEventListener("click", () => {
            const realCanvas = canvases[obj._canvasName];
            realCanvas.remove(obj);
            realCanvas.renderAll();
            li.remove();
            showNotification(`Elemento eliminado en ${selectedTab} correctamente`, "warning");
        });
    }

    // === PARA IMÁGENES (opciones básicas) ===
    else {
        toolsContainer.innerHTML = `
            <button class="select-btn">Seleccionar</button>
            <button class="delete-btn">Eliminar</button>
        `;

        toolsContainer.querySelector(".select-btn").addEventListener("click", () => {
            canvases[canvasName].setActiveObject(obj);
            canvases[canvasName].renderAll();
        });

        toolsContainer.querySelector(".delete-btn").addEventListener("click", () => {
            canvases[canvasName].remove(obj);
            canvases[canvasName].renderAll();
            li.remove();
            showNotification(`Elemento eliminado en ${selectedTab} correctamente`, "warning");
        });
    }
}

function addEmoji() {
    loadEmojiGrid("faces");
    document.getElementById("emojiModal").style.display = "block";
    document.body.style.overflow = "hidden";
}

function closeEmojiModal() {
    document.getElementById("emojiModal").style.display = "none";
    document.body.style.overflow = "auto";
}

// Cargar emojis por categoría
function loadEmojiGrid(category) {
    const grid = document.getElementById("emojiGrid");
    grid.innerHTML = "";

    emojiCategories[category].forEach(emoji => {
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

// Cambiar pestañas de categorías
document.addEventListener("click", function(e) {
    if (e.target.classList.contains("emoji-tab")) {
        loadEmojiGrid(e.target.dataset.cat);
    }
});

// Agregar emoji al canvas
function addEmojiToCanvas(emoji) {
    const canvas = canvases[selectedTab];

    const emojiObj = new fabric.IText(emoji, {
        left: canvas.width / 2,
        top: canvas.height / 2,
        fontSize: 80,
        fontFamily: "Noto Color Emoji, EmojiOne, sans-serif",
        editable: false,
    });

    canvas.add(emojiObj);
    canvas.setActiveObject(emojiObj);
    emojiObj.id = generateObjectId();
    addObjectToList(emojiObj, false, selectedTab);
    showNotification(`Emoji agregado en ${selectedTab}!`, "success");
    canvas.renderAll();
}
// Lista de emojis (puedes agregar MUCHOS)
fetch('emojis.json')
    .then(res => res.json())
    .then(data => {
        window.emojiCategories = data;
        console.log("Emojis cargados:", data);
});
