let currentStep = 1;
const totalSteps = 4;
let selectedColor = null;
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
    if (currentStep === 4) {
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
        if (!selectedColor) {
            validationMsg.style.display = 'block';
            return false;
        }
        break;
        
        case 2:
        const hasSizes = Object.values(designData.sizes).some(qty => qty > 0);
        if (!hasSizes) {
            validationMsg.style.display = 'block';
            return false;
        }
        break;
        
        case 3:
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
        designData.color = selectedColor;
        updateProgressSummary();
        break;
        
        case 2:
        designData.sizes = getSizesData();
        updateProgressSummary();
        break;
        
        case 3:
        saveDesignData();
        updateProgressSummary();
        break;
    }
}

// ========== PASO 1: SELECCIÓN DE COLOR ==========
function selectColor(color, element) {
    selectedColor = color;

    // Actualizar UI
    document.querySelectorAll(".color-button").forEach(btn => {
        btn.classList.remove("active");
    });
    if (element) element.classList.add("active");

    // Actualizar color en tiempo real si ya estamos en paso 3
    if (currentStep >= 3) {
        changeTshirtColor(color, element);
    }

    // Ocultar mensaje de validación
    document.getElementById('step1-validation').style.display = 'none';

    // Actualizar resumen
    updateProgressSummary();
    showSaveNotification();
}

// ========== PASO 2: SELECCIÓN DE TALLAS ==========
function getSizesData() {
    const sizes = {};
    const sizeElements = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];

    sizeElements.forEach(size => {
    const qtyElement = document.getElementById(`quantity-${size}`);
    const quantity = parseInt(qtyElement.textContent) || 0;
    if (quantity > 0) {
        sizes[size] = quantity;
    }
    });

    return sizes;
}

// Configurar eventos para cantidades de tallas
function setupSizeQuantityEvents() {
    document.querySelectorAll(".quantity").forEach(span => {
        span.setAttribute("contenteditable", "true");
        
        span.addEventListener("click", () => {
            if (span.textContent.trim() === "0") {
                span.textContent = "";
            }
        });
        
        span.addEventListener("input", () => {
            span.textContent = span.textContent.replace(/\D/g, "");
            const value = parseInt(span.textContent, 10);
            const button = span.closest(".size-button");
        
            if (!isNaN(value) && value >= 1) {
                span.style.color = "white";
                button.classList.add("active");
                // Ocultar mensaje de validación
                document.getElementById('step2-validation').style.display = 'none';
                showSaveNotification();
            } else {
                span.style.color = "black";
                button.classList.remove("active");
            }
            
            // Guardar en tiempo real
            designData.sizes = getSizesData();
            updateProgressSummary();
        });
        
        span.addEventListener("blur", () => {
            if (span.textContent.trim() === "") {
                span.textContent = "0";
                span.style.color = "black";
                span.closest(".size-button").classList.remove("active");
            }
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
    const colorText = document.getElementById('summary-color-text');
    if (selectedColor) {
        const colorNames = {
            'black': 'Negro',
            'white': 'Blanco',
            'gray': 'Gris',
            'red': 'Rojo',
            'blue': 'Azul'
        };
        colorText.textContent = colorNames[selectedColor] || selectedColor;
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
    // Actualizar color final
    const colorNames = {
    'black': 'Negro',
    'white': 'Blanco',
    'gray': 'Gris',
    'red': 'Rojo',
    'blue': 'Azul'
    };
    document.getElementById('final-color').textContent = colorNames[selectedColor] || selectedColor;

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


function showSaveNotification() {
    const notification = document.getElementById('save-notification');
    notification.style.display = 'block';

    setTimeout(() => { notification.style.display = 'none'; }, 3000);
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

function changeTshirtColor(color, element) {
    selectedColor = color;
    currentColor = color;

    Object.keys(canvases).forEach(section => {
        sectionsState[section].bgSrc = `img/1.${section}.${currentColor}.jpg`;
        loadBackground(section);
    });

    document.querySelectorAll(".color-button").forEach(btn => {
        btn.classList.remove("active");
    });

    if (element) element.classList.add("active");
}


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

// ——— Menú contextual ———
function showContextMenu(pointer, canvasEl) {
    const canvas = canvases[selectedTab];
    const active = canvas.getActiveObject();
    if (!active) return;

    contextMenu.style.display = 'contents';

    // Muestra la barra correspondiente
    if (active.type === 'i-text') {
        textToolbar.style.display = 'flex';
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
        imageToolbar.style.display = 'flex';
    }
}

function hideContextMenu() { contextMenu.style.display = 'none'; }

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
    canvas.on('object:scaling', function (e) {
    const obj = e.target;

    if (obj && obj.type === 'i-text') {
        const originalFont = obj.fontSize; 
        const newFont = originalFont * obj.scaleX; 

        // Actualizar el input ID=text-size
        const ts = document.getElementById('text-size');
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
        const existingIndicator = miniCanvas.getObjects().find(obj => 
            obj.isViewportIndicator === true
        );
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
        
        miniCanvas.on("object:added", () => {
            const indicator = miniCanvas.getObjects().find(obj => obj.isViewportIndicator);
            if (indicator) {
                miniCanvas.bringToFront(indicator);
            }
        });

    } catch (error) {
        console.error('Error dibujando indicador:', error);
    }
}

// Actualizar el evento de click en el minimapa para navegación
miniMapCanvas.on("mouse:down", function (e) {
    const main = canvases[selectedTab];
    const pointer = miniMapCanvas.getPointer(e.e);
    
    // Dimensiones del canvas principal y minimapa
    const mainWidth = main.width;
    const mainHeight = main.height;
    const miniWidth = miniMapCanvas.width;
    const miniHeight = miniMapCanvas.height;
    
    // Calcular escala
    const scaleX = miniWidth / mainWidth;
    const scaleY = miniHeight / mainHeight;
    const scale = Math.min(scaleX, scaleY);
    
    // Calcular offset
    const offsetX = (miniWidth - mainWidth * scale) / 2;
    const offsetY = (miniHeight - mainHeight * scale) / 2;
    
    // Convertir coordenadas del minimapa al canvas principal
    const mainX = (pointer.x - offsetX) / scale;
    const mainY = (pointer.y - offsetY) / scale;
    
    // Obtener zoom actual
    const zoom = main.getZoom();
    
    // Centrar el viewport en el punto clickeado
    const vpt = main.viewportTransform;
    vpt[4] = -mainX * zoom + main.width / 2;
    vpt[5] = -mainY * zoom + main.height / 2;
    
    main.setViewportTransform(vpt);
    main.renderAll();
    updateMiniMap(); // Actualizar el indicador de viewport
});

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