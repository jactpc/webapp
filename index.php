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

        .tabs {
            display: flex;
            justify-content: center;
            margin: 10px 0;
        }

        .tab {
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

        .context-menu button {
            background-color: #007BFF;
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
            padding: 5px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }

        .context-menu label {
            font-size: 14px;
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

    <div id="context-menu" class="context-menu" style="display:none;">
        <div class="toolbar" id="text-toolbar">
            <label for="text-color">Color de Texto:</label>
            <input type="color" id="text-color" onchange="updateTextColor()">

            <label for="text-size">Tamaño:</label>
            <input type="number" id="text-size" value="20" min="10" max="100" onchange="updateTextSize()">

            <label for="text-border">Borde:</label>
            <input type="color" id="text-border" onchange="updateTextBorder()">

            <button onclick="deleteSelectedObject()">Eliminar</button>
        </div>

        <div class="toolbar" id="image-toolbar">
            <label for="image-border">Borde:</label>
            <input type="color" id="image-border" onchange="updateImageBorder()">

            <button onclick="deleteSelectedObject()">Eliminar</button>
        </div>
    </div>

    <div class="controls">
        <button class="button" onclick="addText()">Agregar Texto</button>
        <button class="button" onclick="addImage()">Agregar Imagen</button>
    </div>

    <input type="file" id="image-input" style="display: none;" accept="image/*" onchange="uploadImage()">

    <script src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/4.5.0/fabric.min.js"></script>
    <script>
        const contextMenu = document.getElementById('context-menu');
        let canvases = {
            front: new fabric.Canvas('front-canvas'),
            back: new fabric.Canvas('back-canvas'),
            leftSleeve: new fabric.Canvas('leftsleeve-canvas'),
            rightSleeve: new fabric.Canvas('rightsleeve-canvas')
        };
        let selectedTab = 'front';
        let sections = {
            front: null,
            back: null,
            leftSleeve: null,
            rightSleeve: null
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
        loadImageForCanvas('leftSleeve', 'img/1.leftsleeve.black.jpg');
        loadImageForCanvas('rightSleeve', 'img/1.rightsleeve.black.jpg');

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
                    container.style.display = (section === tab) ? 'block' : 'none';
                }
            });
        }


        function addText() {
            const text = new fabric.Text('Texto', { left: 50, top: 50, fontSize: 30 });
            canvases[selectedTab].add(text);
        }

        function addImage() {
            document.getElementById('image-input').click();
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

        canvases[selectedTab].on('mouse:down', function (e) {
            const pointer = canvases[selectedTab].getPointer(e.e);
            const activeObject = canvases[selectedTab].getActiveObject();

            if (activeObject) {
                if (activeObject.type === 'i-text' || activeObject.type === 'image') {
                    showContextMenu(pointer);
                }
            }
        });

        canvases[selectedTab].on('selection:cleared', function () {
            hideContextMenu();
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

    </script>
</body>
</html>
