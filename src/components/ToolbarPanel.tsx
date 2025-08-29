"use client";

import { useStickerContext } from "@/contexts/StickerContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState, useRef } from "react";

export function ToolbarPanel() {
  const { state, dispatch, addElement } = useStickerContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [textInput, setTextInput] = useState("");

  const tools = [
    { id: "brush", name: "Pincel", icon: "🖌️" },
    { id: "text", name: "Texto", icon: "T" },
    { id: "image", name: "Imagem", icon: "🖼️" },
    { id: "rectangle", name: "Retângulo", icon: "▢" },
    { id: "circle", name: "Círculo", icon: "●" },
    { id: "eraser", name: "Borracha", icon: "🧹" },
  ];

  const colors = [
    "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF",
    "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500", "#800080",
    "#FFC0CB", "#A52A2A", "#808080", "#90EE90", "#FFB6C1"
  ];

  const handleToolSelect = (toolId: string) => {
    dispatch({ type: "SET_TOOL", tool: toolId });
  };

  const handleBrushSizeChange = (value: number[]) => {
    dispatch({ type: "SET_BRUSH_SIZE", size: value[0] });
  };

  const handleColorChange = (color: string) => {
    if (state.tool === "text") {
      dispatch({ type: "SET_TEXT_COLOR", color });
    } else {
      dispatch({ type: "SET_BRUSH_COLOR", color });
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        addElement({
          type: "image",
          x: 100,
          y: 100,
          width: 200,
          height: 200,
          rotation: 0,
          opacity: 1,
          visible: true,
          locked: false,
          data: { imageData }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddText = () => {
    if (textInput.trim()) {
      addElement({
        type: "text",
        x: 150,
        y: 200,
        width: 200,
        height: 50,
        rotation: 0,
        opacity: 1,
        visible: true,
        locked: false,
        data: {
          text: textInput,
          fontSize: state.fontSize,
          fontFamily: state.fontFamily,
          color: state.textColor,
          align: "left"
        }
      });
      setTextInput("");
    }
  };

  const handleAddShape = (shapeType: string) => {
    addElement({
      type: "shape",
      x: 200,
      y: 200,
      width: 100,
      height: 100,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      data: {
        shapeType,
        fillColor: state.brushColor,
        strokeColor: "#000000",
        strokeWidth: 2
      }
    });
  };

  return (
    <div className="h-full overflow-y-auto bg-white">
      {/* Mobile Header */}
      <div className="lg:hidden p-3 border-b border-gray-200">
        <h2 className="font-semibold text-gray-900">Ferramentas</h2>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Ferramentas</CardTitle>
        </CardHeader>
      </div>

      <div className="p-3 lg:p-4 space-y-4 lg:space-y-6">
        {/* Tools Grid */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Selecionar Ferramenta</Label>
          <div className="grid grid-cols-4 lg:grid-cols-2 gap-2">
            {tools.map((tool) => (
              <Button
                key={tool.id}
                variant={state.tool === tool.id ? "default" : "outline"}
                size="sm"
                onClick={() => handleToolSelect(tool.id)}
                className="h-12 lg:h-16 flex flex-col items-center justify-center p-2"
              >
                <span className="text-lg lg:text-xl mb-1">{tool.icon}</span>
                <span className="text-xs hidden lg:block">{tool.name}</span>
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Brush Settings */}
        {state.tool === "brush" && (
          <div className="space-y-4">
            <Label className="text-sm font-medium">Configurações do Pincel</Label>
            
            <div>
              <Label className="text-xs text-gray-600 mb-2 block">
                Tamanho: {state.brushSize}px
              </Label>
              <Slider
                value={[state.brushSize]}
                onValueChange={handleBrushSizeChange}
                max={50}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        )}

        {/* Text Settings */}
        {state.tool === "text" && (
          <div className="space-y-4">
            <Label className="text-sm font-medium">Adicionar Texto</Label>
            
            <div>
              <Input
                placeholder="Digite o texto..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddText()}
              />
              <Button 
                onClick={handleAddText} 
                className="w-full mt-2" 
                size="sm"
                disabled={!textInput.trim()}
              >
                Adicionar Texto
              </Button>
            </div>

            <div>
              <Label className="text-xs text-gray-600 mb-2 block">
                Tamanho da Fonte: {state.fontSize}px
              </Label>
              <Slider
                value={[state.fontSize]}
                onValueChange={(value) => dispatch({ type: "SET_FONT_SIZE", size: value[0] })}
                max={120}
                min={12}
                step={2}
                className="w-full"
              />
            </div>
          </div>
        )}

        {/* Image Upload */}
        {state.tool === "image" && (
          <div className="space-y-4">
            <Label className="text-sm font-medium">Adicionar Imagem</Label>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
              size="sm"
            >
              📁 Escolher Imagem
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        )}

        {/* Shape Tools */}
        {(state.tool === "rectangle" || state.tool === "circle") && (
          <div className="space-y-4">
            <Label className="text-sm font-medium">Adicionar Forma</Label>
            <Button
              onClick={() => handleAddShape(state.tool)}
              className="w-full"
              size="sm"
            >
              ➕ Adicionar {state.tool === "rectangle" ? "Retângulo" : "Círculo"}
            </Button>
          </div>
        )}

        <Separator />

        {/* Color Palette */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            {state.tool === "text" ? "Cor do Texto" : "Cor do Pincel"}
          </Label>
          <div className="grid grid-cols-5 gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => handleColorChange(color)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  (state.tool === "text" ? state.textColor : state.brushColor) === color
                    ? "border-blue-500 scale-110"
                    : "border-gray-300"
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
          
          {/* Custom Color Picker */}
          <div className="mt-3">
            <Input
              type="color"
              value={state.tool === "text" ? state.textColor : state.brushColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-full h-10"
            />
          </div>
        </div>

        <Separator />

        {/* Background Settings */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Fundo do Sticker</Label>
          <div className="space-y-2">
            <Button
              variant={state.backgroundColor === "transparent" ? "default" : "outline"}
              size="sm"
              onClick={() => dispatch({ type: "SET_BACKGROUND_COLOR", color: "transparent" })}
              className="w-full text-xs"
            >
              🚫 Transparente (Recomendado)
            </Button>
            <Button
              variant={state.backgroundColor === "#FFFFFF" ? "default" : "outline"}
              size="sm"
              onClick={() => dispatch({ type: "SET_BACKGROUND_COLOR", color: "#FFFFFF" })}
              className="w-full text-xs"
            >
              ⚪ Branco
            </Button>
          </div>
        </div>

        {/* Quick Templates */}
        <div className="hidden lg:block">
          <Label className="text-sm font-medium mb-3 block">Templates Rápidos</Label>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full text-xs">
              😂 Emoji Engraçado
            </Button>
            <Button variant="outline" size="sm" className="w-full text-xs">
              ❤️ Romântico
            </Button>
            <Button variant="outline" size="sm" className="w-full text-xs">
              💼 Profissional
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}