<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Diseñador de Camisetas</title>
    <link rel="stylesheet" href="styles.css">
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
                <div class="color-button color-black" onclick="changeTshirtColor('black')"></div>
                <div class="color-button color-white" onclick="changeTshirtColor('white')"></div>
                <div class="color-button color-gray" onclick="changeTshirtColor('gray')"></div>
                <div class="color-button color-red" onclick="changeTshirtColor('red')"></div>
                <div class="color-button color-blue" onclick="changeTshirtColor('blue')"></div>
            </div>
        </div>
        <div class="feature-card">
            <h3>Diversidad de Tamaños</h3>
            <p>Disponemos de tallas desde XXS hasta XXL para todos los gustos.</p>
            <div class="size-buttons">
        <div class="size-button" onclick="showInput('XXS')">
            XXS
            <input type="number" id="input-XXS" min="0" value="0" onchange="updateSizeAndColor('XXS')">
            <span class="quantity" id="quantity-XXS">0</span>
        </div>
        <div class="size-button" onclick="showInput('XS')">
            XS
            <input type="number" id="input-XS" min="0" value="0" onchange="updateSizeAndColor('XS')">
            <span class="quantity" id="quantity-XS">0</span>
        </div>
        <div class="size-button" onclick="showInput('S')">
            S
            <input type="number" id="input-S" min="0" value="0" onchange="updateSizeAndColor('S')">
            <span class="quantity" id="quantity-S">0</span>
        </div>
        <div class="size-button" onclick="showInput('M')">
            M
            <input type="number" id="input-M" min="0" value="0" onchange="updateSizeAndColor('M')">
            <span class="quantity" id="quantity-M">0</span>
        </div>
        <div class="size-button" onclick="showInput('L')">
            L
            <input type="number" id="input-L" min="0" value="0" onchange="updateSizeAndColor('L')">
            <span class="quantity" id="quantity-L">0</span>
        </div>
        <div class="size-button" onclick="showInput('XL')">
            XL
            <input type="number" id="input-XL" min="0" value="0" onchange="updateSizeAndColor('XL')">
            <span class="quantity" id="quantity-XL">0</span>
        </div>
        <div class="size-button" onclick="showInput('XXL')">
            2XL
            <input type="number" id="input-XXL" min="0" value="0" onchange="updateSizeAndColor('XXL')">
            <span class="quantity" id="quantity-XXL">0</span>
        </div>
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
                <canvas id="front-canvas" width="580" height="680"></canvas>
            </div>
            <div class="canvas-container" id="back-canvas-container" style="display:none;">
                <canvas id="back-canvas" width="580" height="680"></canvas>
            </div>
            <div class="canvas-container" id="leftsleeve-canvas-container" style="display:none;">
                <canvas id="leftsleeve-canvas" width="580" height="680"></canvas>
            </div>
            <div class="canvas-container" id="rightsleeve-canvas-container" style="display:none;">
                <canvas id="rightsleeve-canvas" width="580" height="680"></canvas>
            </div>
            <div class="zoom-controls">
                <button id="zoom-in" onclick="zoomIn()">+</button>
                <button id="zoom-out" onclick="zoomOut()">-</button>
                <button id="reset-zoom" onclick="resetZoom()">⟳</button>
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
                        <input type="number" id="text-size" value="20" min="10" max="100" onchange="updateTextSize()">

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
                <button class="button controlsbtn" onclick="addText()">Agregar Texto</button>
                <button class="button controlsbtn" onclick="addImage()">Agregar Imagen</button>
            </div>
        </div>
        <div class="feature-card">
            <h3>Previsualización</h3>
            <p>Visualiza el diseño antes de realizar tu pedido.</p>
        </div>
    </div>

    <input type="file" id="image-input" style="display: none;" accept="image/*" onchange="uploadImage()">

    <script src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/4.5.0/fabric.min.js"></script>
    <div class="footer">
        <p>© 2025 Diseñador de Camisetas. Todos los derechos reservados.</p>
    </div>
    <script>
        const contextMenu = document.getElementById('context-menu');
        let canvases = {
            front: new fabric.Canvas('front-canvas'),
            back: new fabric.Canvas('back-canvas'),
            leftsleeve: new fabric.Canvas('leftsleeve-canvas'),
            rightsleeve: new fabric.Canvas('rightsleeve-canvas')
        };
        let selectedTab = 'front';
        let sections = {
            front: null,
            back: null,
            leftsleeve: null,
            rightsleeve: null
        };

        function loadImageForCanvas(section, imageUrl) {
            fabric.Image.fromURL(imageUrl, function(img) {
                img.selectable = false;
                img.evented = false;
                img.scaleToWidth(canvases[section].width);
                img.scaleToHeight(canvases[section].height);
                canvases[section].setBackgroundImage(img, canvases[section].renderAll.bind(canvases[section]));
                sections[section] = canvases[section].toJSON();
            });
        }

        loadImageForCanvas('front', 'img/1.front.black.jpg');
        loadImageForCanvas('back', 'img/1.back.black.jpg');
        loadImageForCanvas('leftsleeve', 'img/1.leftsleeve.black.jpg');
        loadImageForCanvas('rightsleeve', 'img/1.rightsleeve.black.jpg');

        function switchTab(tab) {
            // Verifica que tab tenga un valor válido
            if (!tab || !Object.keys(canvases).includes(tab)) {
                console.error('Pestaña no válida:', tab);
                return;
            }

            // Guardar el estado del lienzo actual antes de cambiar
            if (canvases[selectedTab]) {
                sections[selectedTab] = canvases[selectedTab].toJSON();
                canvases[selectedTab].clear();
            }

            // Actualiza la pestaña seleccionada
            selectedTab = tab;
            
            // Restaura el estado del lienzo de la nueva pestaña seleccionada
            if (sections[selectedTab]) {
                canvases[selectedTab].loadFromJSON(sections[selectedTab], canvases[selectedTab].renderAll.bind(canvases[selectedTab]));
            }

            // Actualiza las pestañas en la interfaz
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelector(`.tab[data-tab="${tab}"]`).classList.add('active');

            // Muestra solo el contenedor correspondiente al lienzo activo
            Object.keys(canvases).forEach(section => {
                const container = document.getElementById(`${section}-canvas-container`);
                if (container) {
                    container.style.display = (section === tab) ? 'flex' : 'none';
                }
            });
            console.log(selectedTab);
        }

        function changeTshirtColor(color) {
            Object.keys(canvases).forEach(section => {
                const imageUrl = `img/1.${section}.${color}.jpg`;
                loadImageForCanvas(section, imageUrl);
                console.log(`Cargando imagen para ${section}: ${imageUrl}`);
            });
        }

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

            // Muestra el mensaje de que el texto ha sido agregado
            const message = document.getElementById('text-message');
            message.style.display = 'block';

            // Ocultar el mensaje después de 3 segundos
            setTimeout(() => {
                message.style.display = 'none';
            }, 3000);
        }

        function addImage() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';

            input.onchange = function (event) {
                const file = event.target.files[0];
                const reader = new FileReader();

                reader.onload = function (e) {
                    const imgElement = new Image();
                    imgElement.src = e.target.result;
                    imgElement.onload = function() {
                        // Obtiene las dimensiones originales de la imagen
                        const imgWidth = imgElement.width;
                        const imgHeight = imgElement.height;

                        // Obtiene el tamaño del lienzo
                        const canvasWidth = canvases[selectedTab].width;
                        const canvasHeight = canvases[selectedTab].height;

                        // Calcula el porcentaje de la imagen con respecto al tamaño del lienzo
                        const scaleX = canvasWidth * 0.6 / imgWidth;  // Escala basada en el ancho
                        const scaleY = canvasHeight * 0.6 / imgHeight; // Escala basada en la altura

                        // Selecciona el factor de escala más pequeño para que la imagen no exceda el 70% del tamaño del lienzo
                        const scaleFactor = Math.min(scaleX, scaleY);

                        // Aplica la escala y añade la imagen al lienzo
                        const img = new fabric.Image(imgElement);
                        img.set({
                            left: 50,
                            top: 50,
                            scaleX: scaleFactor,
                            scaleY: scaleFactor,
                        });
                        canvases[selectedTab].add(img);

                        // Sube la imagen al servidor
                        uploadImageToServer(file);
                    };
                };
                reader.readAsDataURL(file);
            };

            input.click();
        }

        function uploadImageToServer(file) {
            const formData = new FormData();
            formData.append('image', file);

            // Enviar la imagen al servidor
            fetch('upload_img.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('Imagen cargada con éxito:', data.filePath);
                } else {
                    console.error('Error al cargar la imagen:', data.error);
                }
            })
            .catch(error => {
                console.error('Error en la carga de la imagen:', error);
            });
        }

        function uploadImage() {
            const file = document.getElementById('image-input').files[0];
            const reader = new FileReader();
            reader.onload = function(e) {
                const imgElement = new Image();
                imgElement.src = e.target.result;
                imgElement.onload = function() {
                    const img = new fabric.Image(imgElement);
                    img.set({ left: 50, top: 50 });
                    canvases[selectedTab].add(img);
                };
            };
            reader.readAsDataURL(file);
        }

        // Registra el evento para todos los lienzos
        Object.keys(canvases).forEach((key) => {
            canvases[key].on('mouse:down', function (e) {
                if (key === selectedTab) { // Solo ejecutamos el código si el lienzo es el seleccionado
                    console.log('Evento registrado en:', selectedTab);
                    const pointer = canvases[key].getPointer(e.e);
                    const activeObject = canvases[key].getActiveObject();

                    if (activeObject) {
                        if (activeObject.type === 'i-text' || activeObject.type === 'image') {
                            showContextMenu(pointer);
                        }
                    }
                }
            });
        });

        // Registra el evento 'selection:cleared' en todos los lienzos
        Object.keys(canvases).forEach((key) => {
            canvases[key].on('selection:cleared', function () {
                if (key === selectedTab) { // Solo ocultamos el menú si la pestaña es la seleccionada
                    hideContextMenu();
                }
            });
        });

        function showContextMenu(pointer) {
            contextMenu.style.display = 'block';

            if (canvases[selectedTab].getActiveObject().type === 'i-text') {
                document.getElementById('text-toolbar').style.display = 'block';
                document.getElementById('image-toolbar').style.display = 'none';
            } else if (canvases[selectedTab].getActiveObject().type === 'image') {
                document.getElementById('text-toolbar').style.display = 'none';
                document.getElementById('image-toolbar').style.display = 'block';
            }
        }

        function hideContextMenu() {
            contextMenu.style.display = 'none';
        }

        function updateTextColor() {
            const activeObject = canvases[selectedTab].getActiveObject();
            if (activeObject && activeObject.type === 'i-text') {
                activeObject.set('fill', document.getElementById('text-color').value);
                canvases[selectedTab].renderAll();
            }
        }

        function updateTextSize() {
            const activeObject = canvases[selectedTab].getActiveObject();
            if (activeObject && activeObject.type === 'i-text') {
                activeObject.set('fontSize', parseInt(document.getElementById('text-size').value));
                canvases[selectedTab].renderAll();
            }
        }

        function updateTextBorder() {
            const activeObject = canvases[selectedTab].getActiveObject();
            if (activeObject && activeObject.type === 'i-text') {
                activeObject.set('stroke', document.getElementById('text-border').value);
                canvases[selectedTab].renderAll();
            }
        }

        function updateImageBorder() {
            const activeObject = canvases[selectedTab].getActiveObject();
            if (activeObject && activeObject.type === 'image') {
                activeObject.set('stroke', document.getElementById('image-border').value);
                canvases[selectedTab].renderAll();
            }
        }

        function deleteSelectedObject() {
            const activeObject = canvases[selectedTab].getActiveObject();
            if (activeObject) {
                canvases[selectedTab].remove(activeObject);
            }
        }
        function addSize(size) {
            console.log(`Se seleccionó la talla ${size}`);
        }

        const miniMapCanvas = new fabric.Canvas('mini-map');

        // Escala del mini mapa
        const miniMapScale = 0.25;

        function updateMiniMap() {
            const mainCanvas = canvases[selectedTab];

            // Limpiar el mini mapa
            miniMapCanvas.clear();

            mainCanvas.getObjects().forEach((obj) => {
                // Clonar el objeto usando el método `clone`
                obj.clone((clone) => {
                    // Ajustar escala solo para el mini mapa, pero mantener fuente para textos
                    if (clone.type === 'i-text') {
                        clone.set({
                            fontSize: obj.fontSize * miniMapScale, // Escalar el tamaño de la fuente
                            left: obj.left * miniMapScale,
                            top: obj.top * miniMapScale,
                        });
                    } else {
                        clone.set({
                            scaleX: obj.scaleX * miniMapScale,
                            scaleY: obj.scaleY * miniMapScale,
                            left: obj.left * miniMapScale,
                            top: obj.top * miniMapScale,
                        });
                    }

                    miniMapCanvas.add(clone);
                });
            });

            // Establecer el fondo del mini mapa (si corresponde)
            if (mainCanvas.backgroundImage) {
                mainCanvas.backgroundImage.clone((bg) => {
                    bg.scaleX = mainCanvas.backgroundImage.scaleX * miniMapScale;
                    bg.scaleY = mainCanvas.backgroundImage.scaleY * miniMapScale;
                    miniMapCanvas.setBackgroundImage(bg, miniMapCanvas.renderAll.bind(miniMapCanvas));
                });
            } else {
                miniMapCanvas.renderAll();
            }
        }

        // Actualizar el mini mapa cuando el lienzo principal cambie
        Object.keys(canvases).forEach((key) => {
            canvases[key].on('object:modified', updateMiniMap);
            canvases[key].on('object:added', updateMiniMap);
            canvases[key].on('object:removed', updateMiniMap);
            canvases[key].on('after:render', updateMiniMap); // Sincronización completa
        });

        miniMapCanvas.on('mouse:down', function (e) {
            const mainCanvas = canvases[selectedTab];
            const pointer = miniMapCanvas.getPointer(e.e);

            // Calcular la proporción entre el mini mapa y el lienzo principal
            const scale = 1 / miniMapScale;

            // Calcular la nueva posición del viewport en el lienzo principal
            const centerX = pointer.x * scale - mainCanvas.width / 2;
            const centerY = pointer.y * scale - mainCanvas.height / 2;

            // Ajustar el viewportTransform para que la vista principal se mueva al lugar correcto
            const transform = mainCanvas.viewportTransform;
            transform[4] = -centerX;
            transform[5] = -centerY;

            // Evitar que la escala de los objetos se vea afectada globalmente
            mainCanvas.setViewportTransform(transform);
            mainCanvas.renderAll(); // Volver a renderizar el lienzo principal
        });

        function zoomIn() {
            const canvas = canvases[selectedTab];
            canvas.setZoom(canvas.getZoom() * 1.2);
        }
        function zoomOut() {
            const canvas = canvases[selectedTab];
            canvas.setZoom(canvas.getZoom() / 1.2);
        }
        function resetZoom() {
            const canvas = canvases[selectedTab];
            canvas.setZoom(1); // Restaura el zoom al nivel inicial
        }
        // Muestra el campo de entrada cuando se hace clic en la talla
        function showInput(size) {
            const inputField = document.getElementById(`input-${size}`);
            const quantityLabel = document.getElementById(`quantity-${size}`);
            
            // Alterna la visibilidad del campo de entrada
            inputField.style.display = inputField.style.display === 'none' ? 'inline-block' : 'none';

            // Si el campo de entrada está visible, enfoque en él
            if (inputField.style.display === 'inline-block') {
                inputField.focus();
            }
        }

        function updateSizeAndColor(size) {
            const inputField = document.getElementById(`input-${size}`);
            const quantityLabel = document.getElementById(`quantity-${size}`);
            const quantity = inputField.value;

            // Muestra el valor actualizado en el span correspondiente
            quantityLabel.innerText = quantity;

            // Cambia el color si el número es mayor a 1
            if (parseInt(quantity) > 1) {
                quantityLabel.classList.add('edited');
            } else {
                quantityLabel.classList.remove('edited');
            }
            inputField.click();
        }
        function scrollToFeatures() {
            document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
        }
    </script>
</body>
</html>