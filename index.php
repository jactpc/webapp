<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Canvas Edito</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f9;
        }

        .tabs {
            display: flex;
            justify-content: center;
            background-color: #333;
            padding: 10px 0;
        }

        .tab {
            color: white;
            padding: 10px 20px;
            cursor: pointer;
            border: none;
            background-color: inherit;
            font-size: 16px;
            transition: background-color 0.3s ease;
        }

        .tab:hover {
            background-color: #444;
        }

        .tab.active {
            background-color: #007BFF;
            font-weight: bold;
        }

        .tab-content {
            display: none;
            padding: 20px;
            margin-top: 20px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .tab-content.active {
            display: block;
        }

        .container {
            display: flex;
            justify-content: center;
            gap: 40px;
            padding: 20px;
        }

        .canvas-container {
            width: 60%;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        #movie-canvas {
            border: 1px solid #ccc;
            margin-top: 10px;
            background-color: #fff;
        }

        .controls {
            width: 35%;
            display: flex;
            flex-direction: column;
        }

        .color-palette {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }

        .color-button {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
        }

        .text-controls,
        .image-controls {
            margin-bottom: 20px;
        }

        button {
            padding: 10px 20px;
            margin-top: 10px;
            cursor: pointer;
            background-color: #007BFF;
            color: white;
            border: none;
            border-radius: 5px;
            transition: background-color 0.3s ease;
        }

        button:hover {
            background-color: #0056b3;
        }

        input[type="color"],
        input[type="number"],
        select {
            padding: 5px;
            margin-top: 5px;
            margin-bottom: 10px;
        }

        #dimensions {
            margin-top: 10px;
            font-size: 14px;
            color: #555;
        }
    </style>
</head>
<body>
    <!-- Pestañas -->
    <div class="tabs">
        <div class="tab active" onclick="changeTab(0)">Principal</div>
        <div class="tab" onclick="changeTab(1)">Pestaña 1</div>
        <div class="tab" onclick="changeTab(2)">Pestaña 2</div>
        <div class="tab" onclick="changeTab(3)">Pestaña 3</div>
    </div>

    <!-- Contenido de las pestañas -->
    <div class="tab-content active" id="tab-0">
        <div class="container">
            <div class="canvas-container">
                <canvas id="movie-canvas" width="550" height="600"></canvas>
                <div id="dimensions"></div>
            </div>
            <div class="controls">
                <h3>Opciones</h3>
                <div class="color-palette">
                    <div class="color-button" style="background-color: red;" onclick="changeBackground('red')"></div>
                    <div class="color-button" style="background-color: blue;" onclick="changeBackground('blue')"></div>
                    <div class="color-button" style="background-color: green;" onclick="changeBackground('green')"></div>
                </div>
                <div class="text-controls">
                    <button onclick="addText()">Agregar Texto</button>
                    <label for="text-color">Color:</label>
                    <input type="color" id="text-color" onchange="updateTextColor()">

                    <label for="text-size">Tamaño:</label>
                    <input type="number" id="text-size" min="10" max="100" value="20" onchange="updateTextSize()">

                    <label for="text-font">Fuente:</label>
                    <select id="text-font" onchange="updateTextFont()">
                        <option value="Arial">Arial</option>
                        <option value="Verdana">Verdana</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Georgia">Georgia</option>
                    </select>
                </div>
                <div class="image-controls">
                    <button onclick="openImageUploader()">Subir Imagen</button>
                    <button onclick="deleteSelectedElement()">Eliminar Selección</button>
                    <button onclick="downloadCanvas()">Descargar Canvas</button>
                </div>
                <input type="file" id="image-input" style="display: none;" accept="image/*" onchange="uploadImage()">
            </div>
        </div>
    </div>

    <div class="tab-content" id="tab-1">
        <!-- Aquí va el contenido similar al anterior -->
        <!-- Puedes duplicar el contenido de la pestaña principal para la pestaña 1 -->
    </div>

    <div class="tab-content" id="tab-2">
        <!-- Similar a las anteriores -->
    </div>

    <div class="tab-content" id="tab-3">
        <!-- Similar a las anteriores -->
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/4.5.0/fabric.min.js"></script>
    <script>
        var canvas = new fabric.Canvas('movie-canvas', { selection: true });
        var selectedElement = null;

        // Map of colors to background images
        var colorImages = {
            'red': 'ruta/imagen/roja.jpg',
            'blue': 'ruta/imagen/azul.jpg',
            'green': 'ruta/imagen/verde.jpg'
        };

        function changeTab(tabIndex) {
            var tabs = document.querySelectorAll('.tab');
            var tabContents = document.querySelectorAll('.tab-content');
            
            tabs.forEach((tab, index) => {
                tab.classList.remove('active');
                tabContents[index].classList.remove('active');
            });
            
            tabs[tabIndex].classList.add('active');
            tabContents[tabIndex].classList.add('active');
        }

        function changeBackground(color) {
            var imageUrl = colorImages[color];
            if (imageUrl) {
                fabric.Image.fromURL(imageUrl, function(img) {
                    img.scaleToWidth(canvas.width);
                    img.scaleToHeight(canvas.height);
                    canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
                });
            }
        }

        function addText() {
            var text = new fabric.IText('Texto de ejemplo', {
                left: 50,
                top: 50,
                fontSize: 20,
                fill: '#000',
                fontFamily: 'Arial'
            });
            canvas.add(text);
        }

        function updateTextColor() {
            if (selectedElement && selectedElement.type === 'i-text') {
                selectedElement.set('fill', document.getElementById('text-color').value);
                canvas.renderAll();
            }
        }

        function updateTextSize() {
            if (selectedElement && selectedElement.type === 'i-text') {
                selectedElement.set('fontSize', parseInt(document.getElementById('text-size').value));
                canvas.renderAll();
            }
        }

        function updateTextFont() {
            if (selectedElement && selectedElement.type === 'i-text') {
                selectedElement.set('fontFamily', document.getElementById('text-font').value);
                canvas.renderAll();
            }
        }

        function openImageUploader() {
            document.getElementById('image-input').click();
        }

        function uploadImage() {
            var input = document.getElementById('image-input');
            var file = input.files[0];
            var reader = new FileReader();

            reader.onload = function(e) {
                var img = new Image();
                img.onload = function() {
                    var fabricImg = new fabric.Image(img);
                    fabricImg.scaleToWidth(canvas.width * 0.7);
                    canvas.add(fabricImg);
                };
                img.src = e.target.result;
            };

            reader.readAsDataURL(file);
        }

        function deleteSelectedElement() {
            if (selectedElement) {
                canvas.remove(selectedElement);
                selectedElement = null;
            }
        }

        function downloadCanvas() {
            var link = document.createElement('a');
            link.href = canvas.toDataURL({ format: 'png' });
            link.download = 'canvas_image.png';
            link.click();
        }

        canvas.on('selection:created', function(event) {
            selectedElement = event.target;
        });

        canvas.on('selection:cleared', function() {
            selectedElement = null;
        });

        canvas.on('object:modified', function(event) {
            showDimensions(event.target);
        });

        function showDimensions(obj) {
            var ppi = 96; // PPI de referencia
            var widthCm = obj.getScaledWidth() / ppi * 2.54;
            var heightCm = obj.getScaledHeight() / ppi * 2.54;
            document.getElementById('dimensions').innerText = `Dimensiones: ${widthCm.toFixed(2)} cm x ${heightCm.toFixed(2)} cm`;
        }
    </script>
</body>
</html>
