import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fabric } from "fabric";

export default function TshirtDesigner() {
  const [activeTab, setActiveTab] = useState("front");
  const [currentColor, setCurrentColor] = useState("black");
  const canvasRefs = {
    front: useRef(null),
    back: useRef(null),
    leftsleeve: useRef(null),
    rightsleeve: useRef(null),
  };
  const canvasInstances = useRef({ front: null, back: null, leftsleeve: null, rightsleeve: null });
  const miniMapRef = useRef(null);

  const contextMenuRef = useRef(null);
  const textColorRef = useRef(null);
  const textSizeRef = useRef(null);
  const textFontRef = useRef(null);
  const textBorderRef = useRef(null);
  const imageBorderRef = useRef(null);

  // Inicializar canvases
  useEffect(() => {
    Object.keys(canvasRefs).forEach(tab => {
      if (!canvasInstances.current[tab] && canvasRefs[tab].current) {
        const canvas = new fabric.Canvas(canvasRefs[tab].current, { preserveObjectStacking: true });
        canvasInstances.current[tab] = canvas;

        // Cargar fondo inicial
        fabric.Image.fromURL(`img/1.${tab}.${currentColor}.jpg`, (img) => {
          img.selectable = false;
          img.evented = false;
          img.scaleToWidth(canvas.width);
          img.scaleToHeight(canvas.height);
          canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
        }, { crossOrigin: 'anonymous' });

        // Eventos para menú contextual
        canvas.on("mouse:down", (e) => {
          const active = canvas.getActiveObject();
          if (active) showContextMenu(active, canvas);
          else hideContextMenu();
          updateMiniMap();
        });
        canvas.on("selection:created", (e) => { showContextMenu(e.target, canvas); updateMiniMap(); });
        canvas.on("selection:updated", (e) => { showContextMenu(e.target, canvas); updateMiniMap(); });
        canvas.on("selection:cleared", () => { hideContextMenu(); updateMiniMap(); });
        canvas.on("object:modified", updateMiniMap);
        canvas.on("object:added", updateMiniMap);
        canvas.on("object:removed", updateMiniMap);
      }
    });
  }, []);

  // Cambio de pestaña
  const switchTab = (tab) => {
    setActiveTab(tab);
    setTimeout(updateMiniMap, 50);
  };

  // Cambio de color
  const changeTshirtColor = (color) => {
    setCurrentColor(color);
    Object.keys(canvasInstances.current).forEach(tab => {
      const canvas = canvasInstances.current[tab];
      if (!canvas) return;
      fabric.Image.fromURL(`img/1.${tab}.${color}.jpg`, (img) => {
        img.selectable = false;
        img.evented = false;
        img.scaleToWidth(canvas.width);
        img.scaleToHeight(canvas.height);
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
      }, { crossOrigin: 'anonymous' });
    });
  };

  // Agregar texto
  const addText = () => {
    const canvas = canvasInstances.current[activeTab];
    if (!canvas) return;
    const text = new fabric.IText("Texto", { left: 50, top: 50, fontSize: 24, fill: "#FF0000" });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    updateMiniMap();
  };

  // Agregar imagen
  const addImage = () => {
    const url = prompt("URL de la imagen:");
    if (!url) return;
    const canvas = canvasInstances.current[activeTab];
    fabric.Image.fromURL(url, (img) => {
      img.set({ left: 50, top: 50, scaleX: 0.5, scaleY: 0.5 });
      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();
      updateMiniMap();
    });
  };

  // Menú contextual
  const showContextMenu = (obj, canvas) => {
    if (!contextMenuRef.current) return;
    contextMenuRef.current.style.display = "block";
    if (obj.type === "i-text") {
      textColorRef.current.value = obj.fill || "#000000";
      textSizeRef.current.value = obj.fontSize || 24;
      textFontRef.current.value = obj.fontFamily || "Arial";
      textBorderRef.current.value = obj.stroke || "#000000";
    }
    if (obj.type === "image") {
      imageBorderRef.current.value = obj.stroke || "#000000";
    }
  };
  const hideContextMenu = () => { if (contextMenuRef.current) contextMenuRef.current.style.display = "none"; };
  const deleteSelectedObject = () => {
    const canvas = canvasInstances.current[activeTab];
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (active) { canvas.remove(active); canvas.renderAll(); hideContextMenu(); updateMiniMap(); }
  };

  // Propiedades de texto e imagen
  const updateTextColor = () => { const canvas = canvasInstances.current[activeTab]; const active = canvas.getActiveObject(); if (active && active.type === "i-text") { active.set("fill", textColorRef.current.value); canvas.renderAll(); updateMiniMap(); } };
  const updateTextSize = () => { const canvas = canvasInstances.current[activeTab]; const active = canvas.getActiveObject(); if (active && active.type === "i-text") { active.set("fontSize", parseInt(textSizeRef.current.value)); canvas.renderAll(); updateMiniMap(); } };
  const updateTextFont = () => { const canvas = canvasInstances.current[activeTab]; const active = canvas.getActiveObject(); if (active && active.type === "i-text") { active.set("fontFamily", textFontRef.current.value); canvas.renderAll(); updateMiniMap(); } };
  const updateTextBorder = () => { const canvas = canvasInstances.current[activeTab]; const active = canvas.getActiveObject(); if (active && active.type === "i-text") { active.set("stroke", textBorderRef.current.value); canvas.renderAll(); updateMiniMap(); } };
  const updateImageBorder = () => { const canvas = canvasInstances.current[activeTab]; const active = canvas.getActiveObject(); if (active && active.type === "image") { active.set("stroke", imageBorderRef.current.value); canvas.renderAll(); updateMiniMap(); } };

  // Zoom
  const zoomIn = () => { const canvas = canvasInstances.current[activeTab]; canvas.zoomToPoint({x: canvas.width/2, y: canvas.height/2}, canvas.getZoom()*1.2); updateMiniMap(); };
  const zoomOut = () => { const canvas = canvasInstances.current[activeTab]; canvas.zoomToPoint({x: canvas.width/2, y: canvas.height/2}, canvas.getZoom()/1.2); updateMiniMap(); };
  const resetZoom = () => { const canvas = canvasInstances.current[activeTab]; canvas.setViewportTransform([1,0,0,1,0,0]); canvas.setZoom(1); updateMiniMap(); };

  // Exportar
  const exportDesign = (tab) => {
    const canvas = canvasInstances.current[tab];
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `${tab}-design.png`;
    link.href = canvas.toDataURL({ format: "png", quality: 1 });
    link.click();
  };

  // Mini-map
  const updateMiniMap = () => {
    const canvas = canvasInstances.current[activeTab];
    const mini = miniMapRef.current;
    if (!canvas || !mini) return;
    const ctx = mini.getContext("2d");
    const scale = mini.width / canvas.width;
    ctx.clearRect(0,0,mini.width, mini.height);
    const objects = canvas.getObjects();
    objects.forEach(obj => {
      ctx.save();
      ctx.translate(obj.left*scale, obj.top*scale);
      ctx.rotate((obj.angle || 0) * Math.PI/180);
      if (obj.type === "rect" || obj.type === "i-text" || obj.type === "circle") {
        ctx.fillStyle = obj.fill || "black";
        ctx.fillRect(0,0,obj.width*scale*obj.scaleX, obj.height*scale*obj.scaleY);
      }
      if (obj.type === "image") {
        if(obj._element) ctx.drawImage(obj._element, 0, 0, obj.width*scale*obj.scaleX, obj.height*scale*obj.scaleY);
      }
      ctx.restore();
    });
  };

  const handleMiniMapClick = (e) => {
    const canvas = canvasInstances.current[activeTab];
    const rect = miniMapRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / (miniMapRef.current.width / canvas.width);
    const y = (e.clientY - rect.top) / (miniMapRef.current.height / canvas.height);
    canvas.absolutePan({ x: -x + canvas.width/2, y: -y + canvas.height/2 });
    canvas.renderAll();
  };

  return (
    <div className="p-4 grid gap-4">
      <div className="flex gap-2">
        {["front","back","leftsleeve","rightsleeve"].map(tab => (
          <Button key={tab} onClick={() => switchTab(tab)}>{tab}</Button>
        ))}
        <Button onClick={addText}>Agregar texto</Button>
        <Button onClick={addImage}>Agregar imagen</Button>
        <Button onClick={zoomIn}>+</Button>
        <Button onClick={zoomOut}>-</Button>
        <Button onClick={resetZoom}>⟳</Button>
        <Button onClick={() => changeTshirtColor(prompt("Color: black, white, red, blue, gray"))}>Cambiar color</Button>
      </div>

      <Card>
        <CardContent className="flex gap-4">
          <div>
            {Object.keys(canvasRefs).map(tab => (
              <canvas
                key={tab}
                ref={canvasRefs[tab]}
                width={620}
                height={800}
                style={{ display: activeTab===tab?'block':'none', border:'1px solid black' }}
              />
            ))}
          </div>
          <div>
            <canvas
              ref={miniMapRef}
              width={200}
              height={260}
              style={{ border: '1px solid #333', cursor:'pointer' }}
              onClick={handleMiniMapClick}
            />
          </div>
        </CardContent>
      </Card>

      <div ref={contextMenuRef} style={{position:"absolute",display:"none",background:"#fff",border:"1px solid #ccc",padding:"8px"}}>
        <div>
          <label>Color: <input ref={textColorRef} type="color" onChange={updateTextColor} /></label>
          <label>Tamaño: <input ref={textSizeRef} type="number" min="10" max="100" onChange={updateTextSize} /></label>
          <label>Fuente: <input ref={textFontRef} type="text" onChange={updateTextFont} /></label>
          <label>Borde: <input ref={textBorderRef} type="color" onChange={updateTextBorder} /></label>
          <label>Borde Img: <input ref={imageBorderRef} type="color" onChange={updateImageBorder} /></label>
          <Button onClick={deleteSelectedObject}>Eliminar</Button>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        {["front","back","leftsleeve","rightsleeve"].map(tab => (
          <Button key={tab} onClick={() => exportDesign(tab)}>Exportar {tab}</Button>
        ))}
      </div>
    </div>
  );
}
