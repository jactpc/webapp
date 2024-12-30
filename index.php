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
            width: 40px;
            height: 40px;
            border-radius: 50%;
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
        <div class="size-button" onclick="addSize('XXL')">XXL</div>
    </div>

    <div class="tabs">
        <div class="tab active" onclick="switchTab('front')">Pecho</div>
        <div class="tab" onclick="switchTab('back')">Espalda</div>
        <div class="tab" onclick="switchTab('left-sleeve')">Manga Izquierda</div>
        <div class="tab" onclick="switchTab('right-sleeve')">Manga Derecha</div>
    </div>

    <div class="canvas-container">
        <canvas id="tshirt-canvas" width="400" height="500"></canvas>
    </div>

    <div id="context-menu" class="context-menu" style="display:none; position: absolute;">
        <div class="toolbar" id="text-toolbar">
            <label for="text-color">Color de Texto:</label>
            <input type="color" id="text-color" onchange="updateTextColor()">

            <label for="text-size">Tamaño:</label>
            <input type="number" id="text-size" value="20" min="10" max="100" onchange="updateTextSize()">

            <label for="text-border">Borde:</label>
            <input type="color" id="text-border" onchange="updateTextBorder()">
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
        let canvas = new fabric.Canvas('tshirt-canvas');
        let selectedTab = 'front';
        let sections = {
            front: null,
            back: null,
            leftSleeve: null,
            rightSleeve: null
        };

        fabric.Image.fromURL('https://via.placeholder.com/400x500?text=Camiseta+Negra', function(img) {
            img.selectable = false;
            img.evented = false;
            img.scaleToWidth(canvas.width);
            img.scaleToHeight(canvas.height);
            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
            sections.front = canvas.toJSON();
        });

        function switchTab(tab) {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelector(`.tab:contains(${tab})`).classList.add('active');

            sections[selectedTab] = canvas.toJSON();
            canvas.clear();

            selectedTab = tab;
            if (sections[selectedTab]) {
                canvas.loadFromJSON(sections[selectedTab], canvas.renderAll.bind(canvas));
            }
        }

        function changeTshirtColor(color) {
            canvas.setBackgroundColor(color, canvas.renderAll.bind(canvas));
        }

        function addText() {
            const text = new fabric.IText('Texto de ejemplo', {
                left: 50,
                top: 50,
                fontSize: 24,
                fill: '#000',
                borderColor: 'black',
                cornerColor: 'blue',
                cornerSize: 8,
                transparentCorners: false
            });
            canvas.add(text);
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
                        canvas.add(img);
                    });
                };
                reader.readAsDataURL(file);
            };

            input.click();
        }

        canvas.on('mouse:down', function (e) {
            const pointer = canvas.getPointer(e.e);
            const activeObject = canvas.getActiveObject();

            if (activeObject) {
                // Mostrar menú solo si el objeto es un texto o una imagen
                if (activeObject.type === 'i-text' || activeObject.type === 'image') {
                    showContextMenu(pointer);
                }
            }
        });

        canvas.on('selection:cleared', function () {
            hideContextMenu();
        });

        function showContextMenu(pointer) {
            contextMenu.style.display = 'block';

            if (canvas.getActiveObject().type === 'i-text') {
                document.getElementById('text-toolbar').style.display = 'block';
                document.getElementById('image-toolbar').style.display = 'none';
            } else if (canvas.getActiveObject().type === 'image') {
                document.getElementById('text-toolbar').style.display = 'none';
                document.getElementById('image-toolbar').style.display = 'block';
            }
        }

        function hideContextMenu() {
            contextMenu.style.display = 'none';
        }

        function updateTextColor() {
            const activeObject = canvas.getActiveObject();
            if (activeObject && activeObject.type === 'i-text') {
                activeObject.set('fill', document.getElementById('text-color').value);
                canvas.renderAll();
            }
        }

        function updateTextSize() {
            const activeObject = canvas.getActiveObject();
            if (activeObject && activeObject.type === 'i-text') {
                activeObject.set('fontSize', parseInt(document.getElementById('text-size').value));
                canvas.renderAll();
            }
        }

        function updateTextBorder() {
            const activeObject = canvas.getActiveObject();
            if (activeObject && activeObject.type === 'i-text') {
                activeObject.set('stroke', document.getElementById('text-border').value);
                canvas.renderAll();
            }
        }

        function updateImageBorder() {
            const activeObject = canvas.getActiveObject();
            if (activeObject && activeObject.type === 'image') {
                activeObject.set('stroke', document.getElementById('image-border').value);
                canvas.renderAll();
            }
        }

        function deleteSelectedObject() {
            const activeObject = canvas.getActiveObject();
            if (activeObject) {
                canvas.remove(activeObject);
            }
        }

        function addSize(size) {
            alert(`Se seleccionó la talla ${size}`);
        }
    </script>
</body>
</html>
