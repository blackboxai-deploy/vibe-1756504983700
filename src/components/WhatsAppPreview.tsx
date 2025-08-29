"use client";

import { useRef, useEffect } from "react";
import { useStickerContext } from "@/contexts/StickerContext";

export function WhatsAppPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { state } = useStickerContext();

  // Create a preview of the current sticker in WhatsApp chat context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set small preview size
    canvas.width = 120;
    canvas.height = 120;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background if not transparent
    if (state.backgroundColor !== "transparent") {
      ctx.fillStyle = state.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Scale factor for preview
    const scale = 120 / 512;

    // Draw all elements scaled down
    state.elements.forEach((element) => {
      if (!element.visible) return;

      ctx.save();
      ctx.globalAlpha = element.opacity;

      const x = element.x * scale;
      const y = element.y * scale;
      const width = element.width * scale;
      const height = element.height * scale;

      // Apply transformations
      ctx.translate(x + width / 2, y + height / 2);
      ctx.rotate((element.rotation * Math.PI) / 180);
      ctx.translate(-width / 2, -height / 2);

      switch (element.type) {
        case "text":
          drawTextElementPreview(ctx, element, scale);
          break;
        case "image":
          drawImageElementPreview(ctx, element, scale);
          break;
        case "shape":
          drawShapeElementPreview(ctx, element, scale);
          break;
        case "drawing":
          drawDrawingElementPreview(ctx, element, scale);
          break;
      }

      ctx.restore();
    });

  }, [state.elements, state.backgroundColor]);

  const drawTextElementPreview = (ctx: CanvasRenderingContext2D, element: any, scale: number) => {
    const { text, fontSize, fontFamily, color, align = "left" } = element.data;
    
    ctx.font = `${(fontSize * scale)}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.textBaseline = "top";
    
    // Simple text rendering for preview
    const lines = text.split('\n');
    lines.forEach((line: string, index: number) => {
      ctx.fillText(line, 0, index * (fontSize * scale * 1.2));
    });
  };

  const drawImageElementPreview = (ctx: CanvasRenderingContext2D, element: any, scale: number) => {
    const { imageData } = element.data;
    if (imageData) {
      const img = new Image();
      img.onload = () => {
        const width = element.width * scale;
        const height = element.height * scale;
        ctx.drawImage(img, 0, 0, width, height);
      };
      img.src = imageData;
    }
  };

  const drawShapeElementPreview = (ctx: CanvasRenderingContext2D, element: any, scale: number) => {
    const { shapeType, fillColor, strokeColor, strokeWidth } = element.data;
    const width = element.width * scale;
    const height = element.height * scale;
    
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth * scale;

    switch (shapeType) {
      case "rectangle":
        ctx.fillRect(0, 0, width, height);
        if (strokeWidth > 0) {
          ctx.strokeRect(0, 0, width, height);
        }
        break;
      case "circle":
        const radius = Math.min(width, height) / 2;
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, radius, 0, 2 * Math.PI);
        ctx.fill();
        if (strokeWidth > 0) {
          ctx.stroke();
        }
        break;
    }
  };

  const drawDrawingElementPreview = (ctx: CanvasRenderingContext2D, element: any, scale: number) => {
    const { paths } = element.data;
    if (paths && paths.length > 0) {
      paths.forEach((path: any) => {
        if (path.points && path.points.length > 1) {
          ctx.strokeStyle = path.color;
          ctx.lineWidth = path.size * scale;
          ctx.beginPath();
          ctx.moveTo(path.points[0].x * scale, path.points[0].y * scale);
          for (let i = 1; i < path.points.length; i++) {
            ctx.lineTo(path.points[i].x * scale, path.points[i].y * scale);
          }
          ctx.stroke();
        }
      });
    }
  };

  return (
    <div className="bg-green-50 rounded-lg p-4">
      {/* WhatsApp Chat Mockup */}
      <div className="bg-white rounded-lg shadow-sm p-3 max-w-sm">
        {/* Chat Header */}
        <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-gray-100">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">A</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">Amigo</div>
            <div className="text-xs text-gray-500">online</div>
          </div>
        </div>

        {/* Messages */}
        <div className="space-y-2">
          {/* Regular message */}
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-3 py-2 max-w-xs">
              <p className="text-sm text-gray-800">Oi! Como está?</p>
              <p className="text-xs text-gray-500 mt-1">14:30</p>
            </div>
          </div>

          {/* Sticker message */}
          <div className="flex justify-end">
            <div className="bg-green-500 rounded-lg p-2 max-w-xs">
              {/* Sticker Preview Canvas */}
              <div className="bg-white rounded-md p-1 mb-2">
                <canvas
                  ref={canvasRef}
                  width="120"
                  height="120"
                  className="w-full h-auto rounded border border-gray-200"
                />
              </div>
              <p className="text-xs text-white text-right">14:31 ✓✓</p>
            </div>
          </div>

          {/* Response */}
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-3 py-2 max-w-xs">
              <p className="text-sm text-gray-800">😂 Adorei esse sticker!</p>
              <p className="text-xs text-gray-500 mt-1">14:32</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-3 text-center">
        <p className="text-xs text-gray-600">
          Prévia de como seu sticker aparecerá no WhatsApp
        </p>
        {state.elements.length === 0 && (
          <p className="text-xs text-gray-500 mt-1">
            Adicione elementos para ver o preview
          </p>
        )}
      </div>
    </div>
  );
}