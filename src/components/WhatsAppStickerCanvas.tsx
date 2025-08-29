"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useStickerContext } from "@/contexts/StickerContext";

export function WhatsAppStickerCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { state, dispatch, addElement, updateElement } = useStickerContext();
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState<{ x: number; y: number } | null>(null);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size for WhatsApp stickers (512x512)
    canvas.width = 512;
    canvas.height = 512;

    // Set canvas style size
    canvas.style.width = "512px";
    canvas.style.height = "512px";

    // Configure drawing settings
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.imageSmoothingEnabled = true;

    // Clear canvas with transparent background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set transparent background for WhatsApp stickers
    if (state.backgroundColor !== "transparent") {
      ctx.fillStyle = state.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

  }, [state.backgroundColor]);

  // Redraw all elements
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set background
    if (state.backgroundColor !== "transparent") {
      ctx.fillStyle = state.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw all elements
    state.elements.forEach((element) => {
      if (!element.visible) return;

      ctx.save();
      ctx.globalAlpha = element.opacity;

      // Apply transformations
      ctx.translate(element.x + element.width / 2, element.y + element.height / 2);
      ctx.rotate((element.rotation * Math.PI) / 180);
      ctx.translate(-element.width / 2, -element.height / 2);

      switch (element.type) {
        case "text":
          drawTextElement(ctx, element);
          break;
        case "image":
          drawImageElement(ctx, element);
          break;
        case "shape":
          drawShapeElement(ctx, element);
          break;
        case "drawing":
          drawDrawingElement(ctx, element);
          break;
      }

      ctx.restore();

      // Draw selection outline
      if (element.id === state.selectedElementId) {
        drawSelectionOutline(ctx, element);
      }
    });
  }, [state.elements, state.selectedElementId, state.backgroundColor]);

  // Drawing functions for different element types
  const drawTextElement = (ctx: CanvasRenderingContext2D, element: any) => {
    const { text, fontSize, fontFamily, color, align = "left" } = element.data;
    
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.textBaseline = "top";
    
    // Draw text with word wrapping if needed
    const words = text.split(" ");
    let line = "";
    let y = 0;
    const lineHeight = fontSize * 1.2;
    
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      
      if (testWidth > element.width && n > 0) {
        ctx.fillText(line, 0, y);
        line = words[n] + " ";
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 0, y);
  };

  const drawImageElement = (ctx: CanvasRenderingContext2D, element: any) => {
    const { imageData } = element.data;
    if (imageData) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, element.width, element.height);
      };
      img.src = imageData;
    }
  };

  const drawShapeElement = (ctx: CanvasRenderingContext2D, element: any) => {
    const { shapeType, fillColor, strokeColor, strokeWidth } = element.data;
    
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;

    switch (shapeType) {
      case "rectangle":
        ctx.fillRect(0, 0, element.width, element.height);
        if (strokeWidth > 0) {
          ctx.strokeRect(0, 0, element.width, element.height);
        }
        break;
      case "circle":
        const radius = Math.min(element.width, element.height) / 2;
        ctx.beginPath();
        ctx.arc(element.width / 2, element.height / 2, radius, 0, 2 * Math.PI);
        ctx.fill();
        if (strokeWidth > 0) {
          ctx.stroke();
        }
        break;
    }
  };

  const drawDrawingElement = (ctx: CanvasRenderingContext2D, element: any) => {
    const { paths } = element.data;
    if (paths && paths.length > 0) {
      paths.forEach((path: any) => {
        if (path.points && path.points.length > 1) {
          ctx.strokeStyle = path.color;
          ctx.lineWidth = path.size;
          ctx.beginPath();
          ctx.moveTo(path.points[0].x, path.points[0].y);
          for (let i = 1; i < path.points.length; i++) {
            ctx.lineTo(path.points[i].x, path.points[i].y);
          }
          ctx.stroke();
        }
      });
    }
  };

  const drawSelectionOutline = (ctx: CanvasRenderingContext2D, element: any) => {
    ctx.strokeStyle = "#007bff";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(element.x - 2, element.y - 2, element.width + 4, element.height + 4);
    ctx.setLineDash([]);
  };

  // Redraw canvas when elements change
  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  // Mouse/Touch event handlers
  const getCanvasPosition = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;
    if ('touches' in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const pos = getCanvasPosition(e);

    if (state.tool === "brush") {
      setIsDrawing(true);
      setLastPosition(pos);
      dispatch({ type: "SET_IS_DRAWING", isDrawing: true });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isDrawing || state.tool !== "brush" || !lastPosition) return;

    const pos = getCanvasPosition(e);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    
    if (ctx) {
      ctx.strokeStyle = state.brushColor;
      ctx.lineWidth = state.brushSize;
      ctx.beginPath();
      ctx.moveTo(lastPosition.x, lastPosition.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }

    setLastPosition(pos);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isDrawing && state.tool === "brush") {
      setIsDrawing(false);
      setLastPosition(null);
      dispatch({ type: "SET_IS_DRAWING", isDrawing: false });
      
      // Save the current canvas state as an image element
      const canvas = canvasRef.current;
      if (canvas) {
        const dataUrl = canvas.toDataURL();
        // In a real implementation, you would save the drawing strokes
        // For now, we'll trigger a state save
        dispatch({ type: "SAVE_STATE" });
      }
    }
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const pos = getCanvasPosition(e);
    
    if (state.tool === "brush") {
      setIsDrawing(true);
      setLastPosition(pos);
      dispatch({ type: "SET_IS_DRAWING", isDrawing: true });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing || state.tool !== "brush" || !lastPosition) return;

    const pos = getCanvasPosition(e);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    
    if (ctx) {
      ctx.strokeStyle = state.brushColor;
      ctx.lineWidth = state.brushSize;
      ctx.beginPath();
      ctx.moveTo(lastPosition.x, lastPosition.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }

    setLastPosition(pos);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    if (isDrawing && state.tool === "brush") {
      setIsDrawing(false);
      setLastPosition(null);
      dispatch({ type: "SET_IS_DRAWING", isDrawing: false });
      dispatch({ type: "SAVE_STATE" });
    }
  };

  return (
    <div className="relative bg-white rounded-lg shadow-inner">
      {/* Checkerboard background to show transparency */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='%23000'%3e%3cpath d='M0 0h10v10H0V0zm10 10h10v10H10V10z'/%3e%3c/g%3e%3c/svg%3e")`,
          backgroundSize: '20px 20px'
        }}
      />
      
      <canvas
        ref={canvasRef}
        id="sticker-canvas"
        className="relative z-10 cursor-crosshair border border-gray-200 rounded-lg"
        style={{ 
          width: "512px", 
          height: "512px",
          maxWidth: "100%",
          maxHeight: "calc(100vh - 200px)"
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
      
      {/* Canvas Info */}
      <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
        512×512px
      </div>
    </div>
  );
}