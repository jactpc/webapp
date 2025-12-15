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
function updateURLStepSimple() {
    // Crear nueva URL con el parámetro step
    const newURL = `${window.location.pathname}?step=${currentStep}`;
    
    // Reemplazar la URL actual (sin recargar la página)
    window.history.replaceState({}, '', newURL);
    
    // Mostrar notificación del paso actual
    showNotification(`Paso ${currentStep} de ${totalSteps}`, "info", 1500);
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
    updateURLStepSimple();
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
    updateURLStepSimple();
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
    
    if (element) {
        selectedMaterial = dataType;
        selectedMaterialText = nombre;
        element.classList.add("active");
    }

    // Ocultar mensaje de validación
    document.getElementById('step1-validation').style.display = 'none';
    
    // Cargar colores con loading
    const colorsContainer = document.querySelector("#step2-content .color-buttons");
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
        // Cargar tallas con loading
        const sizesContainer = document.querySelector("#step3-content .size-buttons");
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
                        <button class="qty-btn minus" data-size="${size.nombre}">–</button>
                        <span class="quantity" id="quantity-${size.nombre}" contenteditable="true">0</span>
                        <button class="qty-btn plus" data-size="${size.nombre}">+</button>
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
        
        element.classList.add("active");
        changeTshirtColor(color, element);
    }

    // Ocultar mensaje de validación
    document.getElementById('step1-validation').style.display = 'none';

    // Actualizar resumen
    updateProgressSummary();
    showNotification("¡Color seleccionado correctamente!", "success");
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

function showNotification(message, type = "info", element = null, duration = 3000) {
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
    
    if (element && element instanceof HTMLElement) {
        // Agregar clase de resaltado al li
        element.classList.add(`notify-${type}`);
        
        // Quitar la clase después de un tiempo
        setTimeout(() => {
            element.classList.remove(`notify-${type}`);
        }, duration + 300); // Un poco más que la duración de la notificación
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
                if (!canvas._designAreaRect) {
                    drawDesignArea(section);
                }
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
        drawDesignArea(section);
        canvas.renderAll();
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

    if (currentStep === 5) {
        prevStep();
    }
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
loadFonts(fonts).then(() => { /*console.log("Fuentes cargadas correctamente");*/ });
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
    canvases[selectedTab].setActiveObject(text);
    addObjectToList(text, true, selectedTab);
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

function loadImageFromURL() {
    const urlInput = document.getElementById('image-url');
    const url = urlInput.value.trim();
    
    if (!url) {
        showNotification("Por favor ingresa una URL válida", "warning");
        return;
    }
    
    const imgElement = new Image();
    imgElement.crossOrigin = "anonymous"; // Para evitar problemas CORS
    
    imgElement.onload = function() {
        const canvas = canvases[selectedTab];
        
        // Calcular escala para que ocupe 30% del ancho del canvas
        const targetWidth = canvas.width * 0.3;
        const scale = targetWidth / imgElement.width;
        
        const img = new fabric.Image(imgElement, {
            left: canvas.width / 2,
            top: canvas.height / 2,
            scaleX: scale,
            scaleY: scale,
            originX: 'center',
            originY: 'center',
            _originalScale: scale,
            _currentPercentage: 100
        });
        
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
        
        addObjectToList(img, false, selectedTab);
        closeImageModal();
        
        showNotification("Imagen cargada desde URL", "success");
    };
    
    imgElement.onerror = function() {
        showNotification("Error al cargar la imagen desde la URL", "error");
    };
    
    imgElement.src = url;
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
const miniMapCanvas = new fabric.Canvas('mini-map', {
    preserveObjectStacking: true
});
let isMiniMapUpdating = false;
let miniMapUpdateTimeout = null;
let lastMiniMapUpdate = 0;

function updateMiniMap(force = false) {
    const now = Date.now();
    
    // 1. Evitar múltiples llamadas simultáneas
    if (isMiniMapUpdating && !force) {
        return;
    }
    
    // 2. Throttle: máximo 60 FPS (16ms entre actualizaciones)
    if (now - lastMiniMapUpdate < 16 && !force) { // ~60 FPS
        if (!miniMapUpdateTimeout) {
            miniMapUpdateTimeout = setTimeout(() => {
                updateMiniMap();
                miniMapUpdateTimeout = null;
            }, 16);
        }
        return;
    }
    
    // 3. Marcar como actualizando
    isMiniMapUpdating = true;
    lastMiniMapUpdate = now;
    
    const mainCanvas = canvases[selectedTab];
    if (!mainCanvas) {
        isMiniMapUpdating = false;
        return;
    }

    // 4. Usar requestAnimationFrame para sincronizar con el navegador
    requestAnimationFrame(() => {
        try {
            // Limpiar el minimapa completamente
            miniMapCanvas.clear();
            
            // Obtener dimensiones
            const mainWidth = mainCanvas.width;
            const mainHeight = mainCanvas.height;
            const miniWidth = miniMapCanvas.width;
            const miniHeight = miniMapCanvas.height;
            
            // Obtener el fondo actual
            const bgImage = mainCanvas.backgroundImage;
            if (!bgImage) {
                isMiniMapUpdating = false;
                return;
            }

            // Calcular escala para el fondo
            const bgElement = bgImage._element || bgImage.getElement();
            if (!bgElement) {
                isMiniMapUpdating = false;
                return;
            }
            
            const bgOriginalWidth = bgElement.width || 1;
            const bgOriginalHeight = bgElement.height || 1;
            const bgScaleX = bgImage.scaleX || 1;
            const bgScaleY = bgImage.scaleY || 1;
            const bgLeft = bgImage.left || 0;
            const bgTop = bgImage.top || 0;
            
            const bgDisplayWidth = bgOriginalWidth * bgScaleX;
            const bgDisplayHeight = bgOriginalHeight * bgScaleY;
            
            const scaleX = miniWidth / bgDisplayWidth;
            const scaleY = miniHeight / bgDisplayHeight;
            const scale = Math.min(scaleX, scaleY);
            
            const offsetX = (miniWidth - bgDisplayWidth * scale) / 2;
            const offsetY = (miniHeight - bgDisplayHeight * scale) / 2;

            // 5. Agregar fondo al minimapa
            fabric.Image.fromURL(bgElement.src, (miniBg) => {
                miniBg.set({
                    left: offsetX,
                    top: offsetY,
                    scaleX: bgScaleX * scale,
                    scaleY: bgScaleY * scale,
                    selectable: false,
                    evented: false,
                    hasControls: false,
                    hasBorders: false,
                    opacity: 0.8 // Hacer el fondo un poco transparente
                });
                
                miniMapCanvas.setBackgroundImage(miniBg, () => {
                    // 6. Procesar objetos del canvas principal
                    const objects = mainCanvas.getObjects();
                    const objectPromises = [];
                    
                    objects.forEach((obj) => {
                        // Saltar objetos especiales (indicador de área, etc.)
                        if (obj._isDesignArea || obj.isViewportIndicator || 
                            obj === bgImage || obj === mainCanvas._designAreaRect) {
                            return;
                        }
                        
                        // Calcular posición RELATIVA AL FONDO
                        const objLeftRelativeToBg = (obj.left || 0) - bgLeft;
                        const objTopRelativeToBg = (obj.top || 0) - bgTop;
                        
                        const miniLeft = offsetX + objLeftRelativeToBg * scale;
                        const miniTop = offsetY + objTopRelativeToBg * scale;
                        
                        // Manejar diferentes tipos de objetos
                        if ( obj.type === 'i-text') {
                            const clonePromise = new Promise((resolve) => {
                                obj.clone((clone) => {

                                    clone.set({
                                        left: miniLeft,
                                        top: miniTop,

                                        // ⚠️ SOLO ESCALA – NO TOCAR fontSize
                                        scaleX: obj.scaleX * scale,
                                        scaleY: obj.scaleY * scale,

                                        angle: obj.angle || 0,
                                        opacity: obj.opacity ?? 1,

                                        selectable: false,
                                        evented: false,
                                        hasControls: false,
                                        hasBorders: false
                                    });

                                    clone.setCoords();
                                    miniMapCanvas.add(clone);
                                    resolve();
                                }, false); // 🔥 FUNDAMENTAL
                            });

                            objectPromises.push(clonePromise);
                            return;
                        } else if (obj.type === 'image') {
                            // PARA IMÁGENES: Cargar desde la fuente original
                            const imgPromise = new Promise((resolve) => {
                                try {
                                    // Obtener la fuente de la imagen
                                    const imgSrc = obj._element ? obj._element.src : 
                                                  (obj.getElement ? obj.getElement().src : null);
                                    
                                    if (!imgSrc) {
                                        console.warn('No se encontró fuente para imagen en minimapa');
                                        resolve();
                                        return;
                                    }
                                    
                                    // Cargar la imagen directamente
                                    fabric.Image.fromURL(imgSrc, (miniImg) => {
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
                                        resolve();
                                    }, {
                                        crossOrigin: 'anonymous',
                                        // Forzar recarga si hay problemas de caché
                                        cacheBust: true
                                    });
                                } catch (error) {
                                    console.error('Error cargando imagen para minimapa:', error);
                                    resolve();
                                }
                            });
                            objectPromises.push(imgPromise);
                            
                        } else if (obj.type === 'rect' || obj.type === 'circle' || obj.type === 'triangle') {
                            // Para formas básicas
                            const clonePromise = new Promise((resolve) => {
                                obj.clone((clone) => {
                                    clone.set({
                                        left: miniLeft,
                                        top: miniTop,
                                        scaleX: (obj.scaleX || 1) * scale,
                                        scaleY: (obj.scaleY || 1) * scale,
                                        angle: obj.angle || 0,
                                        opacity: obj.opacity || 0.8,
                                        selectable: false,
                                        evented: false,
                                        hasControls: false,
                                        hasBorders: false
                                    });
                                    miniMapCanvas.add(clone);
                                    resolve();
                                });
                            });
                            objectPromises.push(clonePromise);
                            
                        } else {
                            // Para otros tipos de objetos
                            const clonePromise = new Promise((resolve) => {
                                obj.clone((clone) => {
                                    clone.set({
                                        left: miniLeft,
                                        top: miniTop,
                                        scaleX: (obj.scaleX || 1) * scale,
                                        scaleY: (obj.scaleY || 1) * scale,
                                        angle: obj.angle || 0,
                                        opacity: obj.opacity || 0.8,
                                        selectable: false,
                                        evented: false,
                                        hasControls: false,
                                        hasBorders: false
                                    });
                                    miniMapCanvas.add(clone);
                                    resolve();
                                });
                            });
                            objectPromises.push(clonePromise);
                        }
                    });
                    
                    // 7. Esperar a que todas las imágenes se carguen
                    Promise.all(objectPromises).then(() => {
                        // 8. Dibujar indicador del viewport
                        drawViewportIndicator(mainCanvas, miniMapCanvas, scale, offsetX, offsetY, bgLeft, bgTop);
                        
                        // 9. Renderizar una sola vez
                        miniMapCanvas.renderAll();
                        
                        isMiniMapUpdating = false;
                    }).catch(error => {
                        console.error('Error cargando objetos para minimapa:', error);
                        isMiniMapUpdating = false;
                    });
                }, { crossOrigin: 'anonymous' });
            }, { crossOrigin: 'anonymous' });
            
        } catch (error) {
            console.error('Error en updateMiniMap:', error);
            isMiniMapUpdating = false;
        }
    });
}

function drawViewportIndicator(mainCanvas, miniCanvas, scale, offsetX, offsetY, bgLeft, bgTop) {
    try {
        const zoom = mainCanvas.getZoom();
        const vpt = mainCanvas.viewportTransform;
        
        // SIEMPRE mostrar el indicador, incluso con zoom = 1
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
        
        // Crear nuevo indicador con estilo mejorado
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
            // Información del zoom para referencia
            zoomLevel: zoom
        });
        
        // Agregar texto con el nivel de zoom (opcional)
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
    const zoomSlider = document.getElementById("zoom-slider");
    if (zoomSlider) {
        zoomSlider.value = zoom;
        
        // Actualizar visualmente si hay un display del valor
        const zoomValueDisplay = document.getElementById("zoom-value-display");
        if (zoomValueDisplay) {
            zoomValueDisplay.textContent = `${zoom.toFixed(1)}x`;
        }
    }
}
// Reemplaza TODOS estos event listeners por una versión optimizada:

// Configura eventos optimizados para los canvases
function setupOptimizedCanvasEvents() {
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
                    }, 50); // 50ms de delay
                }
            });
        });
        
        // Eventos que actualizan inmediatamente
        canvas.on('object:added', () => {
            if (key === selectedTab) {
                setTimeout(() => updateMiniMap(), 100); // Pequeño delay
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
                if (now - lastRenderTime > 200) { // Máximo 5 FPS para after:render
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

// En lugar de tu código actual de event listeners, llama:
setupOptimizedCanvasEvents();
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
        ctx.fillText("x", left, top);  // <<<<<< AQUI VA TU EMOJI
    }
});

canvases[selectedTab].on('object:added', (e) => {
    const obj = e.target;
    
    // Ocultar controles específicos
    obj.setControlsVisibility({
        mt: false,  // top middle
        mb: false,  // bottom middle
        ml: false,  // left middle
        mr: false,  // right middle
        bl: false,  // bottom left
        br: false,  // bottom right
        tl: false,  // top left
        tr: false,  // top right
        mtr: true,  // rotate control
    });
    
    // Opcional: Cambiar color de los controles visibles
    obj.set({
        cornerColor: '#2196F3',
        cornerStrokeColor: '#ffffff',
        cornerStyle: 'circle',
        cornerSize: 10,
        transparentCorners: false,
        borderColor: '#2196F3',
        borderScaleFactor: 2,
        borderOpacityWhenMoving: 0.8,
        borderDashArray: [5, 5], // línea punteada
    });
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
    const canvasEl = canvas.upperCanvasEl;
let touchOnObject = false;
    let lastDistance = 0;
    let isPinching = false;
    let isPanning = false;

    let lastX = 0;
    let lastY = 0;

    canvasEl.addEventListener('touchstart', function(e) {
    if (e.touches.length === 2) {
        isPinching = true;
        isPanning = false;
        touchOnObject = false;
        lastDistance = 0;
        document.body.style.overflow = 'hidden';
    } 
    else if (e.touches.length === 1) {
        const target = canvas.findTarget(e);

        touchOnObject = !!target;

        isPinching = false;
        isPanning = !touchOnObject; // 👈 SOLO pan si NO hay objeto

        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;

        document.body.style.overflow = 'hidden';
    }
}, { passive: false });


    canvasEl.addEventListener('touchmove', function(e) {
        // ZOOM con 2 dedos
        if (e.touches.length === 2 && isPinching) {
            e.preventDefault();

            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (lastDistance) {
                const zoomFactor = distance / lastDistance;
                const rect = canvasEl.getBoundingClientRect();

                const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
                const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;

                canvas.zoomToPoint(
                    { x: centerX, y: centerY },
                    canvas.getZoom() * zoomFactor
                );
            }

            lastDistance = distance;
            canvas.requestRenderAll();
        }

        // PAN con 1 dedo  ✅
        else if (e.touches.length === 1 && isPanning) {
            e.preventDefault();

            const dx = e.touches[0].clientX - lastX;
            const dy = e.touches[0].clientY - lastY;

            const vpt = canvas.viewportTransform;
            vpt[4] += dx;
            vpt[5] += dy;

            lastX = e.touches[0].clientX;
            lastY = e.touches[0].clientY;

            canvas.requestRenderAll();
        }
    }, { passive: false });

    canvasEl.addEventListener('touchend', function() {
        isPinching = false;
        isPanning = false;
        lastDistance = 0;
        document.body.style.overflow = 'auto';
    });
});

// Función para bloquear interacción con el fondo
function lockBackgroundInteraction() {
    Object.values(canvases).forEach((canvas) => {
        // Configurar fondo como no interactivo
        if (canvas.backgroundImage) {
            canvas.backgroundImage.set({
                selectable: false,
                evented: false,
                hasControls: false,
                hasBorders: false,
                lockMovementX: true,
                lockMovementY: true,
                lockRotation: true,
                lockScalingX: true,
                lockScalingY: true,
                lockUniScaling: true,
                lockSkewingX: true,
                lockSkewingY: true
            });
        }
        
        // Evento al cargar nuevo fondo
        canvas.on('background:loaded', function() {
            if (canvas.backgroundImage) {
                canvas.backgroundImage.set({
                    selectable: false,
                    evented: false,
                    hasControls: false,
                    hasBorders: false,
                    lockMovementX: true,
                    lockMovementY: true,
                    lockRotation: true,
                    lockScalingX: true,
                    lockScalingY: true,
                    lockUniScaling: true,
                    lockSkewingX: true,
                    lockSkewingY: true
                });
                canvas.renderAll();
            }
        });
    });
}

const designAreas = {
    front: { x: 125, y: 100, width: 370, height: 600 },
    back: { x: 125, y: 55, width: 370, height: 650 },
    leftsleeve: { x: 290, y: 120, width: 170, height: 200 },
    rightsleeve: { x: 160, y: 120, width: 170, height: 200 }
};
function drawDesignArea(section) {
    const canvas = canvases[section];
    
    // Si ya existe un rectángulo, removerlo primero
    if (canvas._designAreaRect) {
        canvas.remove(canvas._designAreaRect);
    }
    
    const area = designAreas[section];

    const rect = new fabric.Rect({
        left: area.x,
        top: area.y,
        width: area.width,
        height: area.height,
        fill: 'rgba(0, 150, 255, 0.1)',  // Azul semitransparente para mejor visibilidad
        stroke: '#FF9800',                // Naranja para mayor contraste
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

    canvas.add(rect);
    
    // Guardar referencia al rectángulo en el canvas
    canvas._designAreaRect = rect;
    
    // Enviar al frente (pero detrás de los objetos de usuario)
    canvas.sendToBack(rect);
    
    canvas.renderAll();
    return rect;
}
// Reemplaza tu inicialización actual con esta versión optimizada
function initializeCanvasSystem() {
    // Inicializar canvases
    ['front','back','leftsleeve','rightsleeve'].forEach(sec => {
        loadBackground(sec, false);
    });
    
    // Configurar eventos optimizados
    setupOptimizedCanvasEvents();
    
    // Configurar sincronización canvas-lista
    setupCanvasSelectionSync();
    
    // Inicializar minimapa
    setTimeout(() => {
        updateMiniMap(true);
    }, 500);
    
    // Inicializar slider de zoom
    syncZoomSlider();
}

// Llama a esta función en lugar de tu código actual
initializeCanvasSystem();

function addObjectToList(obj, istext, canvasName) {
    const list = canvasLists[canvasName]; // ⬅️ lista correcta
    if (!list) return;

    obj._canvasName = canvasName;

    const li = document.createElement("li");
    obj._listId = "item-" + obj.id; // evita undefined y duplicados
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
        canvas.setActiveObject(obj);
        canvas.renderAll();
        
        // Resaltar este li
        highlightListItem(obj._listId, canvasName);
        
        showNotification(`${obj.type === "i-text" ? (istext ? "Texto" : "Emoji") : "Imagen"} seleccionado`, "info");
    });

    // === SOLO PARA TEXTOS ===
    if (obj.type === "i-text" && istext===true) {
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
            // 1. Define tu lista de fuentes
            const fontList = [
                'Arial', 'VT323', 'Pacifico', 'Lato', 
                'Playwrite AU SA', 'Tomorrow', 'Roboto', 
                'Montserrat', 'Open Sans', 'Oswald', 
                'Raleway', 'Merriweather', 'Dancing Script', 
                'Bebas Neue'
            ];
            let optionsHTML = '';
            
            // 2. Genera una opción <option> con estilo para cada fuente
            fontList.forEach(font => {
                const isSelected = obj.fontFamily === font ? 'selected' : '';
                // Aplica el estilo 'font-family' directamente a la opción
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
        li.querySelector(".text-content").addEventListener("input", (e) => {
            obj.set("text", e.target.value);
            canvases[canvasName].renderAll();
        });
            // --- CONTROL DE ALINEACIÓN ---
        const alignButtons = toolsContainer.querySelectorAll(".align-btn");
        alignButtons.forEach(button => {
            button.addEventListener("click", (e) => {
                const alignment = e.currentTarget.dataset.align;
                
                // Remover clase active de todos
                alignButtons.forEach(btn => btn.classList.remove("active"));
                // Agregar clase active al botón clickeado
                e.currentTarget.classList.add("active");
                
                obj.set("textAlign", alignment);
                canvases[canvasName].setActiveObject(obj);
                canvases[canvasName].renderAll();
                showNotification(`Texto alineado a la ${alignment === 'left' ? 'izquierda' : alignment === 'center' ? 'centro' : alignment === 'right' ? 'derecha' : 'justificado'}`, "info");
            });
        });
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
                canvases[canvasName].setActiveObject(obj);
                canvases[canvasName].renderAll();
                showNotification(`Estilo ${style} ${e.currentTarget.classList.contains('active') ? 'activado' : 'desactivado'}`, "info");
            });
        });
        // --- CONTROL DE COLOR ---
        toolsContainer.querySelector(".text-color").addEventListener("input", (e) => {
            obj.set("fill", e.target.value);
            canvases[canvasName].setActiveObject(obj);
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
            canvases[canvasName].setActiveObject(obj);
            canvases[canvasName].renderAll();
        });

        // --- CONTROL DE FUENTE ---
        toolsContainer.querySelector(".text-font").addEventListener("change", async (e) => {
            const newFont = e.target.value;

            try {
                await document.fonts.load(`16px "${newFont}"`);  
                obj.set("fontFamily", newFont);
                obj.initDimensions();
                canvases[canvasName].setActiveObject(obj);
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
            canvases[canvasName].setActiveObject(obj);
            canvases[canvasName].renderAll();
        });
        // --- BOTÓN ELIMINAR ---
        toolsContainer.querySelector(".select-dlt").addEventListener("click", () => {
            const realCanvas = canvases[obj._canvasName];
            realCanvas.remove(obj);
            realCanvas.renderAll();
            li.remove();
            showNotification(`Elemento eliminado en ${selectedTab} correctamente`, "warning");
        });
        showNotification("¡Texto agregado!", "success",li);
    } else if (obj.type === "i-text" && istext===false) {
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
            canvases[canvasName].remove(obj);
            canvases[canvasName].renderAll();
            li.remove();
            showNotification(`Elemento eliminado en ${selectedTab} correctamente`, "warning");
        });
        const sizeSlider = toolsContainer.querySelector(".text-sizeEmo");
        const sizeText = toolsContainer.querySelector(".text-sizeEmo-value");

        sizeSlider.addEventListener("input", (e) => {
            const newSize = parseInt(e.target.value);

            obj.set("fontSize", newSize);
            obj.initDimensions();

            sizeText.textContent = newSize + "px"; // ← actualiza el texto al lado del slider

            canvases[canvasName].renderAll();
        });
    }else if (obj.type === "image") {
        const thumbnail = obj._element.src;  // ★ AQUÍ ESTÁ EL BASE64 DE LA IMAGEN SUBIDA

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
            <input type="range" class="img-size-slider" min="10" max="300" value="${Math.round(initialScale)}">
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
            <button class="delete-btn">Eliminar</button>
        </div>
        `;

        toolsContainer.querySelector(".delete-btn").addEventListener("click", () => {
            canvases[canvasName].remove(obj);
            canvases[canvasName].renderAll();
            li.remove();
            showNotification(`Elemento eliminado en ${selectedTab} correctamente`, "warning");
        });
        // === SLIDER PARA EL TAMAÑO ===
        const slider = toolsContainer.querySelector(".img-size-slider");
        const sizeLabel = toolsContainer.querySelector(".img-size-value");

        slider.addEventListener("input", (e) => {
        const percentage = parseInt(e.target.value);
        const originalScale = obj._originalScale || 1;
        const newScale = originalScale * (percentage / 100);
        
        obj.scale(newScale);
        sizeLabel.textContent = percentage + "%";
        obj._currentPercentage = percentage;
        
        canvases[canvasName].setActiveObject(obj);
        canvases[canvasName].renderAll();
    });
    // === SLIDER PARA LA ROTACIÓN ===
        const rotationSlider = toolsContainer.querySelector(".rotation-slider");
        const rotationLabel = toolsContainer.querySelector(".rotation-value");

        rotationSlider.addEventListener("input", (e) => {
            const angle = parseInt(e.target.value);
            obj.set('angle', angle);  // Usar set() para cambiar el ángulo
            rotationLabel.textContent = angle + "°";
            canvases[canvasName].setActiveObject(obj);
            canvases[canvasName].renderAll();
        });

        // === BOTONES DE ROTACIÓN RÁPIDA ===
        const rotateLeftBtn = toolsContainer.querySelector(".rotate-left");
        const rotateRightBtn = toolsContainer.querySelector(".rotate-right");
        const rotateResetBtn = toolsContainer.querySelector(".rotate-reset");

        // Rotar 90° izquierda
        rotateLeftBtn.addEventListener("click", () => {
            const currentAngle = obj.angle || 0;
            const newAngle = (currentAngle - 90) % 360;
            obj.set('angle', newAngle);
            rotationSlider.value = newAngle;
            rotationLabel.textContent = Math.round(newAngle) + "°";
            canvases[canvasName].renderAll();
            showNotification("Rotado 90° a la izquierda", "info");
        });

        // Rotar 90° derecha
        rotateRightBtn.addEventListener("click", () => {
            const currentAngle = obj.angle || 0;
            const newAngle = (currentAngle + 90) % 360;
            obj.set('angle', newAngle);
            rotationSlider.value = newAngle;
            rotationLabel.textContent = Math.round(newAngle) + "°";
            canvases[canvasName].renderAll();
            showNotification("Rotado 90° a la derecha", "info");
        });

        // Restablecer rotación
        rotateResetBtn.addEventListener("click", () => {
            obj.set('angle', 0);
            rotationSlider.value = 0;
            rotationLabel.textContent = "0°";
            canvases[canvasName].renderAll();
            showNotification("Rotación restablecida", "info");
        });
    }
    setTimeout(() => {
        highlightListItem(obj._listId, canvasName, true); // true = efecto temporal
    }, 100);
}

const highlightedElements = {
    front: null,
    back: null,
    leftsleeve: null,
    rightsleeve: null
};

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
                    // Actualizar indicador visual de modificación
                    li.classList.add('recently-modified');
                    setTimeout(() => {
                        li.classList.remove('recently-modified');
                    }, 1000);
                }
            }
        });
        
        // Cuando se agrega un objeto (ya lo haces en addObjectToList)
        canvas.on('object:added', (e) => {
            // Tu lógica existente aquí
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
setupCanvasSelectionSync();

function addEmoji() {
    loadEmojiGrid("faces");
    document.getElementById("emojiModal").style.display = "block";
    document.body.style.overflow = "hidden";
}

function closeEmojiModal() {
    document.getElementById("emojiModal").style.display = "none";
    document.body.style.overflow = "auto";
}
// Lista de emojis (puedes agregar MUCHOS)
fetch('emojis.json')
    .then(res => res.json())
    .then(data => {
        window.emojiCategories = data;
});
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

