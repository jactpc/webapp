<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Diseñador de Camisetas</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .color-buttons, .size-buttons {
            display: flex;
            gap: 10px;
            margin: 10px 0;
        }

        .color-button, .size-button {
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease;
            font-size: 14px;
        }

        .color-button {
            width: 20px;
            height: 20px;
        }

        .color-black { background-color: black; }
        .color-white { background-color: white; border: 1px solid #ccc; }
        .color-gray { background-color: gray; }
        .color-red { background-color: red; }
        .color-blue { background-color: blue; }

        .size-button { background-color: #fff; }

        .tabs{
            display: flex;
            justify-content: center;
            margin: 10px 0;
        }
        .controls{
            position: fixed;
            bottom: 0px;
            padding: 10px 20px;
            cursor: pointer;
            border: 1px solid #ddd;
            border-radius: 5px;
            background-color: #fff;
            margin: 0 5px;
            transition: background-color 0.3s ease;
        }
        .tab, .controlsbtn{
            padding: 10px 20px;
            cursor: pointer;
            border: 1px solid #ddd;
            border-radius: 5px;
            background-color: #fff;
            margin: 0 5px;
            transition: background-color 0.3s ease;
        }

        .tab.active {
            background-color: #007BFF;
            color: white;
        }

        .canvas-container {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 10px;
            width: 100%;
            max-width: 500px;
            height: 600px;
            margin-bottom: 20px;
        }

        canvas {
            max-width: 100%;
            max-height: 100%;
        }

        .toolbar {
            justify-content: center;
            flex-wrap: wrap;
            gap: 10px;
            margin: 10px 0;
        }
        .context-menu button.dlt{
            background-color:rgb(255, 0, 0);
        }
        .context-menu button {
            
            border: none;
            border-radius: 5px;
            padding: 10px;
            color: white;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.3s ease;
        }

        .context-menu button:hover {
            background-color: #0056b3;
        }

        .context-menu input, .context-menu select {
            border: 1px solid #ddd;
            border-radius: 5px;
        }

        .context-menu label {
            font-size: 14px;
        }

        .mini-map-container {
    position: absolute;
    bottom: 10px;
    right: 10px;
    border: 2px solid #ddd;
    background-color: rgba(255, 255, 255, 0.8);
    width: 150px;
    height: 200px;
    overflow: hidden;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.mini-map-container canvas {
    display: block;
    max-width: 100%;
    max-height: 100%;
}
.zoom-controls {
    position: absolute;
    bottom: 10px;
    left: 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.zoom-controls button {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    cursor: pointer;
    background-color: #fff;
}
    </style>
</head>
<body>
    <div class="color-buttons">
        <div class="color-button color-black" onclick="changeTshirtColor('black')"></div>
        <div class="color-button color-white" onclick="changeTshirtColor('white')"></div>
        <div class="color-button color-gray" onclick="changeTshirtColor('gray')"></div>
        <div class="color-button color-red" onclick="changeTshirtColor('red')"></div>
        <div class="color-button color-blue" onclick="changeTshirtColor('blue')"></div>
    </div>

    <div class="size-buttons">
        <div class="size-button" onclick="addSize('XXS')">XXS</div>
        <div class="size-button" onclick="addSize('XS')">XS</div>
        <div class="size-button" onclick="addSize('S')">S</div>
        <div class="size-button" onclick="addSize('M')">M</div>
        <div class="size-button" onclick="addSize('L')">L</div>
        <div class="size-button" onclick="addSize('XL')">XL</div>
        <div class="size-button" onclick="addSize('XXL')">2XL</div>
    </div>

    <div class="tabs">
        <div class="tab active" data-tab="front" onclick="switchTab('front')">Pecho</div>
        <div class="tab" data-tab="back" onclick="switchTab('back')">Espalda</div>
        <div class="tab" data-tab="leftsleeve" onclick="switchTab('leftsleeve')">Manga Izquierda</div>
        <div class="tab" data-tab="rightsleeve" onclick="switchTab('rightsleeve')">Manga Derecha</div>
    </div>

    <div class="canvas-container" id="front-canvas-container">
        <canvas id="front-canvas" width="400" height="500"></canvas>
    </div>
    <div class="canvas-container" id="back-canvas-container" style="display:none;">
        <canvas id="back-canvas" width="400" height="500"></canvas>
    </div>
    <div class="canvas-container" id="leftsleeve-canvas-container" style="display:none;">
        <canvas id="leftsleeve-canvas" width="400" height="500"></canvas>
    </div>
    <div class="canvas-container" id="rightsleeve-canvas-container" style="display:none;">
        <canvas id="rightsleeve-canvas" width="400" height="500"></canvas>
    </div>
    <div class="zoom-controls">
        <button id="zoom-in" onclick="zoomIn()">+</button>
        <button id="zoom-out" onclick="zoomOut()">-</button>
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

                <button class="dlt"onclick="deleteSelectedObject()">Eliminar</button>
            </div>

            <div class="toolbar" id="image-toolbar">
                <label for="image-border">Borde:</label>
                <input type="color" id="image-border" oninput="updateImageBorder()">

                <button onclick="deleteSelectedObject()">Eliminar</button>
            </div>
        </div>
        <button class="button controlsbtn" onclick="addText()">Agregar Texto</button>
        <button class="button controlsbtn" onclick="addImage()">Agregar Imagen</button>
    </div>

    <input type="file" id="image-input" style="display: none;" accept="image/*" onchange="uploadImage()">

    <script src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/4.5.0/fabric.min.js"></script>
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
                left: 50,
                top: 50,
                fontSize: 24,
                fill: '#000',
                borderColor: 'black',
                cornerColor: 'blue',
                cornerSize: 8,
                transparentCorners: false,
            });
            canvases[selectedTab].add(text);
        }

        function addImage() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';

            input.onchange = function (event) {
                const file = event.target.files[0];
                const reader = new FileReader();

                reader.onload = function (e) {
                    fabric.Image.fromURL(e.target.result, function (img) {
                        img.set({
                            left: 100,
                            top: 100,
                        });
                        canvases[selectedTab].add(img);
                    });
                };
                reader.readAsDataURL(file);
            };

            input.click();
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
    </script>
</body>
</html>
