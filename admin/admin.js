function login() {
  fetch("api/login.php", {
    method: "POST",
    body: JSON.stringify({
      user: user.value,
      pass: pass.value
    })
  })
  .then(r => r.json())
  .then(res => {
    if (res.success) {
      loginView.classList.add("hidden");
      panelView.classList.remove("hidden");
      loadPedidos();
    } else {
      alert("Credenciales incorrectas");
    }
  });
}
function loadPedidos() {
  fetch("api/pedidos.php")
    .then(r => r.json())
    .then(data => {
      let html = `
      <h2>Pedidos</h2>
      <table>
        <tr>
          <th>ID</th>
          <th>Cliente</th>
          <th>Modelo</th>
          <th>Estado</th>
          <th>Fecha</th>
        </tr>`;
      
      data.forEach(p => {
        html += `
        <tr>
          <td>${p.id}</td>
          <td>${p.cliente}</td>
          <td>${p.modelo}</td>
          <td>${p.estado}</td>
          <td>${p.fecha}</td>
        </tr>`;
      });

      html += "</table>";
      content.innerHTML = html;
    });
}

function loadMaterial() {
  fetch("api/materiales.php")
    .then(r => r.json())
    .then(data => {
      let html = `<h2>Material Textil</h2><div class="grid">`;

      data.forEach(m => {
        html += `
          <div class="card tshirt-card" data-material="${m.id}" data-material-name="${m.nombre}">
            <img src="../img/icon/${m.imgIcon}">
            <p>${m.nombre}</p>
          </div>`;
      });

      html += "</div>";
      content.innerHTML = html;
    });
}

function logout() {
  fetch("api/logout.php")
    .then(() => {
      location.reload(); // vuelve al login (PHP decide qué mostrar)
    });
}
const canvases = {};
let canvasesInitialized = false;
let selectedTab = 'front';
let currentColor = '1';
let designRect = null;
let designRectEnabled = true;
const rectX = document.getElementById('rect-x');
const rectY = document.getElementById('rect-y');
const rectWidth = document.getElementById('rect-width');
const rectHeight = document.getElementById('rect-height');
const designAreas = {};     // ← datos desde BD
const designRects = {};     // ← fabric.Rect por lado



// Estado por sección: JSON de objetos + src de fondo actual
const sectionsState = {
    front: { bgSrc: '' },
    back: { bgSrc: '' },
    leftsleeve: { bgSrc: '' },
    rightsleeve: { bgSrc: '' }
};

function updateRectFromInputs() {
    const rect = designRects[selectedTab];
    if (!rect) return;

    rect.set({
        left: parseInt(rectX.value),
        top: parseInt(rectY.value),
        width: parseInt(rectWidth.value),
        height: parseInt(rectHeight.value),
        scaleX: 1,
        scaleY: 1
    });

    rect.setCoords();
    canvases[selectedTab].renderAll();
}

['rect-x','rect-y','rect-width','rect-height'].forEach(id => {
    document.getElementById(id).addEventListener('input', updateRectFromInputs);
});
function isSVG(src) {
    if (!src) return false;
    
    // Verificar extensión .svg
    if (src.toLowerCase().endsWith('.svg')) {
        return true;
    }
    
    // También verificar si contiene "svg" en la URL (por si acaso)
    return src.toLowerCase().includes('.svg');
}
function showNoBackgroundMessage(canvas, section) {
    if (!canvas) return;
    
    // Primero remover cualquier mensaje existente
    removeNoBackgroundMessage(canvas);
    
    // Verificar si ya hay un fondo cargado
    const hasBackground = canvas.getObjects().some(o => o.name === 'tshirt-bg');
    
    // Solo mostrar mensaje si NO hay fondo
    if (!hasBackground) {
        const msg = new fabric.Text(`Sin fondo (${section})`, {
            left: canvas.width / 2,
            top: canvas.height / 2,
            originX: 'center',
            originY: 'center',
            fontSize: 22,
            fill: '#999',
            selectable: false,
            evented: false,
            name: 'no-bg-msg'
        });

        canvas.add(msg);
        canvas.renderAll();
        console.log(`Mostrando mensaje "Sin fondo" para ${section}`);
    } else {
        console.log(`No se muestra mensaje para ${section} porque ya hay fondo`);
    }
}

function loadBackground(section) {
    const canvas = canvases[section];
    const src = sectionsState[section].bgSrc;
    const asset = designAreas[section]; // Obtener datos del asset
    if (!canvas) {
        console.error(`Canvas no inicializado para ${section}`);
        return;
    }
    removeNoBackgroundMessage(canvas);

    // 🧹 eliminar fondo anterior
    const oldBg = canvas.getObjects().find(o => o.name === 'tshirt-bg');
    if (oldBg) canvas.remove(oldBg);

    if (!src) {
        console.log(`No hay URL de imagen para ${section}`);
        showNoBackgroundMessage(canvas, section);
        return;
    }
    
    console.log(`Cargando fondo para ${section}:`, src);

    // ================= SVG =================
    if (isSVG(src)) {
        fabric.loadSVGFromURL(src, (objects, options) => {
            if (!objects || !objects.length) {
                console.error(`SVG vacío o inválido para ${section}`);
                showNoBackgroundMessage(canvas, section);
                return;
            }
            try {
                const svgWidth  = options.width  || 497.2;
                const svgHeight = options.height || 630.1;
                // Aplicar escala desde BD si existe
                const scaleX = asset?.scale_x || canvas.width / svgWidth;
                const scaleY = asset?.scale_y || canvas.height / svgHeight;
                
                // Aplicar offset desde BD si existe
                const offsetX = asset?.offset_x || 0;
                const offsetY = asset?.offset_y || 0;

                const svg = fabric.util.groupSVGElements(objects, options);

                svg.set({
                    selectable: false,
                    evented: false,
                    left: offsetX,
                    top: offsetY,
                    scaleX: scaleX,
                    scaleY: scaleY,
                    name: 'tshirt-bg'
                });

                canvas.add(svg);
                canvas.sendToBack(svg);
                canvas.renderAll();
                console.log(`SVG cargado exitosamente para ${section}`);
                removeNoBackgroundMessage(canvas);
                } catch (svgError) {
                console.error(`Error al procesar SVG para ${section}:`, svgError);
                showNoBackgroundMessage(canvas, section);
            }
        });
        return;
    }
    fabric.Image.fromURL(src, img => {
        if (!img) {
            console.error(`Error al crear objeto imagen para ${section}`);
            showNoBackgroundMessage(canvas, section);
            return;
        }
        try {
            // Aplicar escala desde BD si existe
            const scaleX = asset?.scale_x || 1;
            const scaleY = asset?.scale_y || 1;
            
            // Aplicar offset desde BD si existe
            const offsetX = asset?.offset_x || 0;
            const offsetY = asset?.offset_y || 0;
            img.set({
                selectable: false,
                evented: false,
                name: 'tshirt-bg',
                scaleX: scaleX,
                scaleY: scaleY,
                left: offsetX,
                top: offsetY
            });

            if (!asset?.scale_x || !asset?.scale_y) {
                img.scaleToHeight(canvas.height);
                img.left = (canvas.width - img.getScaledWidth()) / 2;
                img.top = 0;
            }

            canvas.add(img);
            canvas.sendToBack(img);
            canvas.renderAll();
            console.log(`Imagen cargada exitosamente para ${section}`);
            // Asegurarse de que el mensaje no esté visible
            removeNoBackgroundMessage(canvas);
        } catch (imgError) {
            console.error(`Error al procesar imagen para ${section}:`, imgError);
            showNoBackgroundMessage(canvas, section);
        }

    }, { crossOrigin: 'anonymous'
    });
}
function removeNoBackgroundMessage(canvas) {
    if (!canvas) return;
    
    const oldMsg = canvas.getObjects().find(o => o.name === 'no-bg-msg');
    if (oldMsg) {
        canvas.remove(oldMsg);
        canvas.renderAll();
    }
}

function initTshirtCanvases() {
    if (canvasesInitialized) return;

    ['front','back','leftsleeve','rightsleeve'].forEach(section => {
        const el = document.getElementById(`canvas-${section}`);

        if (el && !canvases[section]) {
            canvases[section] = new fabric.Canvas(el, {
                preserveObjectStacking: true,
                selection: true,
                width: el.clientWidth,
                height: el.clientHeight
            });
            
            // Limpiar canvas inicialmente
            canvases[section].clear();
        }
    });

    canvasesInitialized = true;
}

document.addEventListener('click', async e => {
    const card = e.target.closest('.tshirt-card');
    if (!card) return;

    const materialId = card.dataset.material;
    const materialName = card.dataset.materialName;
    const colorName = card.dataset.colorName || 'Sin color'; // Valor por defecto
    
    // Guardar para uso posterior
    currentMaterial = materialId;
    
    // Inicializar canvases si no están inicializados
    initTshirtCanvases();
    
    try {
        // 1. Limpiar estados anteriores
        ['front','back','leftsleeve','rightsleeve'].forEach(section => {
            sectionsState[section].bgSrc = '';
            delete designAreas[section];
            
            // Limpiar canvas
            if (canvases[section]) {
                // Remover todos los objetos
                canvases[section].clear();
                canvases[section].renderAll();
                
                // Ocultar contenedor
                const container = document.getElementById(`${section}-canvas-container`);
                if (container) {
                    container.classList.add('hidden');
                }
            }
        });
        
        // 2. Cargar assets de diseño desde la API
        const response = await fetch(`api/get-design-assets.php?material_id=${materialId}&color_id=${currentColor}`);
        const data = await response.json();
        
        if (!data.success || !data.assets) {
            throw new Error('No se pudieron cargar los assets de diseño');
        }
        
        console.log('Assets cargados:', data.assets);
        
        // 3. Procesar cada lado disponible
        const availableSides = [];
        
        Object.keys(data.assets).forEach(side => {
            if (['front', 'back', 'leftsleeve', 'rightsleeve'].includes(side)) {
                const asset = data.assets[side];
                const canvas = canvases[side];
                const container = document.getElementById(`${side}-canvas-container`);
                
                if (canvas && container) {
                    // Mostrar contenedor
                    container.classList.remove('hidden');
                    availableSides.push(side);
                    
                    // Guardar datos del asset
                    designAreas[side] = asset;
                    
                    // Guardar URL de fondo si existe
                    if (asset.image_url) {
                        sectionsState[side].bgSrc = asset.image_url;
                    }
                    
                    // Cargar fondo (si hay URL)
                    if (asset.image_url) {
                        loadBackground(side);
                    } else {
                        // Mostrar mensaje si no hay imagen
                        showNoBackgroundMessage(canvas, side);
                    }
                    
                    // Crear área de diseño si hay datos
                    if (asset.area_x !== null && asset.area_y !== null && 
                        asset.area_width !== null && asset.area_height !== null) {
                        createDesignRect(side, asset);
                    }
                }
            }
        });
        
        // 4. Actualizar UI
        if (availableSides.length > 0) {
            // Actualizar visibilidad de tabs
            updateTabVisibility(availableSides);
            
            // Activar primer tab disponible
            switchOpt(availableSides[0]);
            
            // Actualizar título
            updateTitle(materialName, colorName);
        } else {
            console.log('No se encontraron vistas disponibles para este material');
        }
        
    } catch (error) {
        console.error('Error loading design assets:', error);
        alert('Error al cargar el material seleccionado: ' + error.message);
    }
});
// Agrega esta función
function updateTitle(materialName, colorName) {
    const titleElement = document.querySelector('#material-title') || 
                         document.querySelector('h2:first-child') ||
                         document.createElement('h2');
    
    if (!titleElement.id) titleElement.id = 'material-title';
    
    titleElement.textContent = `${materialName} - ${colorName || 'Sin color'}`;
    
    // Si no existe en el DOM, lo agregamos
    if (!titleElement.parentNode) {
        const contentDiv = document.querySelector('.content') || 
                          document.querySelector('#content') ||
                          document.body;
        contentDiv.insertBefore(titleElement, contentDiv.firstChild);
    }
}
// Función para actualizar visibilidad de tabs
function updateTabVisibility(availableSides) {
    const tabContainer = document.querySelector('.tabs');
    if (!tabContainer) return;
    
    const tabs = tabContainer.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        const side = tab.dataset.tab;
        if (availableSides.includes(side)) {
            tab.style.display = 'inline-block';
        } else {
            tab.style.display = 'none';
        }
    });
}

function createDesignRect(section, areaData) {
    const canvas = canvases[section];
    if (!canvas) return;

    // Eliminar rectángulo existente si hay
    if (designRects[section]) {
        canvas.remove(designRects[section]);
    }

    // Crear nuevo rectángulo con datos de la base de datos
    const rect = new fabric.Rect({
        left: areaData.area_x || 0,
        top: areaData.area_y || 0,
        width: areaData.area_width || 100,
        height: areaData.area_height || 100,

        fill: 'rgba(0,150,255,0.1)',
        stroke: '#FF9800',
        strokeWidth: 2,
        strokeDashArray: [10, 5],

        hasRotatingPoint: false,
        lockRotation: true,
        lockSkewingX: true,
        lockSkewingY: true,

        selectable: true,
        evented: true,
        objectCaching: false,

        name: 'designArea'
    });

    canvas.add(rect);
    canvas.bringToFront(rect);

    designRects[section] = rect;
    designAreas[section] = areaData; // Guardar datos del área

    bindRectEvents(section, rect);
    syncRectInputs(section);
}

// Modificar bindRectEvents para actualizar también la base de datos si es necesario
function bindRectEvents(section, rect) {
    const canvas = canvases[section];

    rect.on('moving', () => {
        syncRectInputs(section);
        showUnsavedChangesWarning(section);
    });
    
    rect.on('scaling', () => {
        syncRectInputs(section);
        showUnsavedChangesWarning(section);
    });
    
    rect.on('modified', () => {
        syncRectInputs(section);
        showUnsavedChangesWarning(section);
    });
}
function switchOpt(section) {
    // Verificar que el canvas exista
    if (!canvases[section]) {
        console.error(`Canvas no disponible para ${section}`);
        return;
    }
    
    selectedTab = section;

    // Actualizar tabs
    document.querySelectorAll('.tab').forEach(tab => {
        const isActive = tab.dataset.tab === section;
        tab.classList.toggle('active', isActive);
        tab.style.display = tab.style.display === 'none' ? 'none' : 'inline-block';
    });

    // Mostrar/ocultar contenedores
    ['front','back','leftsleeve','rightsleeve'].forEach(sec => {
        const el = document.getElementById(`${sec}-canvas-container`);
        if (el) {
            const isActive = sec === section;
            el.classList.toggle('active', isActive);
            el.classList.toggle('hidden', !isActive);
        }
    });

    // Sincronizar inputs
    syncRectInputs(section);
    
    // Renderizar canvas activo
    if (canvases[section]) {
        canvases[section].renderAll();
    }
}

function syncRectInputs(section) {
    const rect = designRects[section];
    if (!rect) return;

    rectX.value = Math.round(rect.left);
    rectY.value = Math.round(rect.top);
    rectWidth.value = Math.round(rect.width * rect.scaleX);
    rectHeight.value = Math.round(rect.height * rect.scaleY);
}
async function saveCurrentDesignArea() {
    if (!currentMaterial || !currentColor) {
        alert('Por favor, selecciona un material y color primero');
        return;
    }

    const currentSide = selectedTab;
    const rect = designRects[currentSide];
    const canvas = canvases[currentSide];

    if (!rect || !canvas) {
        alert(`No hay área de diseño para guardar en ${currentSide}`);
        return;
    }

    // Calcular dimensiones finales (considerando escala)
    const finalWidth = Math.round(rect.width * rect.scaleX);
    const finalHeight = Math.round(rect.height * rect.scaleY);
    
    const currentX = Math.round(rect.left);
    const currentY = Math.round(rect.top);
    
    console.log(`Área ${currentSide} a guardar:`, {
        x: currentX,
        y: currentY,
        width: finalWidth,
        height: finalHeight
    });

    // Verificar si hay cambios desde la última carga
    const originalArea = designAreas[currentSide];
    let hasChanges = true;
    
    if (originalArea) {
        const originalX = originalArea.area_x || 0;
        const originalY = originalArea.area_y || 0;
        const originalWidth = originalArea.area_width || 0;
        const originalHeight = originalArea.area_height || 0;
        
        hasChanges = (currentX !== originalX) || 
                    (currentY !== originalY) || 
                    (finalWidth !== originalWidth) || 
                    (finalHeight !== originalHeight);
        
        if (!hasChanges) {
            alert(`No hay cambios en el área de ${currentSide} para guardar`);
            return;
        }
    }

    // Confirmar antes de guardar
    if (!confirm(`¿Guardar área de diseño para ${currentSide}?\n\nPosición: (${currentX}, ${currentY})\nTamaño: ${finalWidth} × ${finalHeight}`)) {
        return;
    }

    // Cambiar texto del botón mientras guarda
    const saveButton = document.getElementById('toggle-rect');
    const originalText = saveButton.textContent;
    saveButton.textContent = 'Guardando...';
    saveButton.disabled = true;

    try {
        // Llamar a la API para guardar
        const response = await fetch('api/save-design-area.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                material_id: currentMaterial,
                color_id: currentColor,
                side: currentSide,
                area_x: currentX,
                area_y: currentY,
                area_width: finalWidth,
                area_height: finalHeight
            })
        });

        const result = await response.json();
        
        if (result.success) {
            // Mostrar mensaje de éxito
            showSaveStatus(`Área de ${currentSide} guardada exitosamente`, 'success');
            
            // Actualizar datos locales con los nuevos valores
            if (designAreas[currentSide]) {
                designAreas[currentSide].area_x = currentX;
                designAreas[currentSide].area_y = currentY;
                designAreas[currentSide].area_width = finalWidth;
                designAreas[currentSide].area_height = finalHeight;
            }
            
            console.log('Resultado del guardado:', result);
            
            // Eliminar advertencia de cambios no guardados
            removeUnsavedChangesWarning(currentSide);
            
        } else {
            alert('Error al guardar: ' + (result.message || 'Error desconocido'));
            console.error('Error del servidor:', result);
        }
    } catch (error) {
        console.error('Error al guardar:', error);
        alert('Error de conexión al guardar');
    } finally {
        // Restaurar botón
        saveButton.textContent = originalText;
        saveButton.disabled = false;
    }
}
function showSaveStatus(message, type = 'info') {
    // Crear o actualizar elemento de estado
    let statusElement = document.getElementById('save-status');
    
    if (!statusElement) {
        statusElement = document.createElement('div');
        statusElement.id = 'save-status';
        statusElement.className = 'save-status';
        
        // Agregar estilos
        statusElement.style.cssText = `
            padding: 10px;
            margin: 10px 0;
            border-radius: 4px;
            font-size: 14px;
            display: block;
        `;
        
        // Insertar después del botón de guardar
        const saveButton = document.getElementById('toggle-rect');
        if (saveButton && saveButton.parentNode) {
            saveButton.parentNode.insertBefore(statusElement, saveButton.nextSibling);
        } else {
            document.body.appendChild(statusElement);
        }
    }
    
    // Configurar colores según tipo
    let bgColor, textColor, borderColor;
    switch (type) {
        case 'success':
            bgColor = '#d4edda';
            textColor = '#155724';
            borderColor = '#c3e6cb';
            break;
        case 'error':
            bgColor = '#f8d7da';
            textColor = '#721c24';
            borderColor = '#f5c6cb';
            break;
        default:
            bgColor = '#d1ecf1';
            textColor = '#0c5460';
            borderColor = '#bee5eb';
    }
    
    statusElement.style.backgroundColor = bgColor;
    statusElement.style.color = textColor;
    statusElement.style.border = `1px solid ${borderColor}`;
    statusElement.textContent = message;
    
    // Ocultar después de 5 segundos
    setTimeout(() => {
        statusElement.style.display = 'none';
    }, 5000);
}
function removeUnsavedChangesWarning(section) {
    const warningId = `unsaved-warning-${section}`;
    const warning = document.getElementById(warningId);
    if (warning && warning.parentNode) {
        warning.parentNode.removeChild(warning);
    }
}
document.addEventListener('DOMContentLoaded', function() {
    const saveButton = document.getElementById('toggle-rect');
    
    if (saveButton) {
        // Cambiar texto a algo más descriptivo
        saveButton.textContent = 'Guardar Área Actual';
        saveButton.title = 'Guardar el área de diseño del lado actual';
        
        saveButton.addEventListener('click', saveCurrentDesignArea);
        
        console.log('Botón de guardar configurado para área actual');
        
        // Agregar estilos al botón
        saveButton.style.cssText = `
            padding: 10px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            margin: 10px 0;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
        `;
        
        saveButton.addEventListener('mouseover', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)';
        });
        
        saveButton.addEventListener('mouseout', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)';
        });
        
        saveButton.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(1px)';
        });
    }
});

// Función para mostrar advertencia de cambios no guardados
function showUnsavedChangesWarning(section) {
    // Solo mostrar para el lado activo
    if (section !== selectedTab) return;
    
    const warningId = `unsaved-warning-${section}`;
    let warning = document.getElementById(warningId);
    
    if (!warning) {
        warning = document.createElement('div');
        warning.id = warningId;
        warning.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 18px;">⚠️</span>
                <span>Cambios en <strong>${section}</strong> no guardados</span>
            </div>
        `;
        warning.style.cssText = `
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 8px 12px;
            border-radius: 6px;
            margin: 10px 0;
            font-size: 14px;
            display: flex;
            align-items: center;
            animation: fadeIn 0.3s ease;
        `;
        
        // Insertar cerca del botón de guardar
        const saveButton = document.getElementById('toggle-rect');
        if (saveButton && saveButton.parentNode) {
            saveButton.parentNode.insertBefore(warning, saveButton);
        }
        
        // Agregar animación CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }
}