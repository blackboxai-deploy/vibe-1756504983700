"use client";

import { useStickerContext } from "@/contexts/StickerContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export function PropertiesPanel() {
  const { state, updateElement, deleteElement } = useStickerContext();
  
  const selectedElement = state.elements.find(el => el.id === state.selectedElementId);

  if (!selectedElement) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">Propriedades</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-gray-500">
          <p className="text-sm">Selecione um elemento para editar suas propriedades</p>
        </CardContent>
      </Card>
    );
  }

  const handlePositionChange = (axis: 'x' | 'y', value: number) => {
    updateElement(selectedElement.id, { [axis]: value });
  };

  const handleSizeChange = (dimension: 'width' | 'height', value: number) => {
    updateElement(selectedElement.id, { [dimension]: Math.max(1, value) });
  };

  const handleOpacityChange = (value: number[]) => {
    updateElement(selectedElement.id, { opacity: value[0] / 100 });
  };

  const handleRotationChange = (value: number[]) => {
    updateElement(selectedElement.id, { rotation: value[0] });
  };

  const handleVisibilityToggle = () => {
    updateElement(selectedElement.id, { visible: !selectedElement.visible });
  };

  const handleLockToggle = () => {
    updateElement(selectedElement.id, { locked: !selectedElement.locked });
  };

  const handleDelete = () => {
    deleteElement(selectedElement.id);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Propriedades</CardTitle>
        <p className="text-sm text-gray-600">
          {selectedElement.type === "text" && "📝 Elemento de Texto"}
          {selectedElement.type === "image" && "🖼️ Imagem"}
          {selectedElement.type === "shape" && "⚪ Forma"}
          {selectedElement.type === "drawing" && "🎨 Desenho"}
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Position */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Posição</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-gray-600">X</Label>
              <Input
                type="number"
                value={Math.round(selectedElement.x)}
                onChange={(e) => handlePositionChange('x', parseInt(e.target.value) || 0)}
                className="text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-600">Y</Label>
              <Input
                type="number"
                value={Math.round(selectedElement.y)}
                onChange={(e) => handlePositionChange('y', parseInt(e.target.value) || 0)}
                className="text-sm"
              />
            </div>
          </div>
        </div>

        {/* Size */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Tamanho</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-gray-600">Largura</Label>
              <Input
                type="number"
                value={Math.round(selectedElement.width)}
                onChange={(e) => handleSizeChange('width', parseInt(e.target.value) || 1)}
                className="text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-600">Altura</Label>
              <Input
                type="number"
                value={Math.round(selectedElement.height)}
                onChange={(e) => handleSizeChange('height', parseInt(e.target.value) || 1)}
                className="text-sm"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Transform */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Transformações</Label>
          
          {/* Opacity */}
          <div className="mb-4">
            <Label className="text-xs text-gray-600 mb-2 block">
              Opacidade: {Math.round(selectedElement.opacity * 100)}%
            </Label>
            <Slider
              value={[selectedElement.opacity * 100]}
              onValueChange={handleOpacityChange}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
          </div>

          {/* Rotation */}
          <div className="mb-4">
            <Label className="text-xs text-gray-600 mb-2 block">
              Rotação: {selectedElement.rotation}°
            </Label>
            <Slider
              value={[selectedElement.rotation]}
              onValueChange={handleRotationChange}
              max={360}
              min={0}
              step={15}
              className="w-full"
            />
          </div>
        </div>

        <Separator />

        {/* Element-specific properties */}
        {selectedElement.type === "text" && (
          <div>
            <Label className="text-sm font-medium mb-3 block">Propriedades do Texto</Label>
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-gray-600">Texto</Label>
                <Input
                  value={selectedElement.data.text || ""}
                  onChange={(e) => updateElement(selectedElement.id, {
                    data: { ...selectedElement.data, text: e.target.value }
                  })}
                  className="text-sm"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600">Tamanho da Fonte</Label>
                <Input
                  type="number"
                  value={selectedElement.data.fontSize || 16}
                  onChange={(e) => updateElement(selectedElement.id, {
                    data: { ...selectedElement.data, fontSize: parseInt(e.target.value) || 16 }
                  })}
                  className="text-sm"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600">Cor</Label>
                <Input
                  type="color"
                  value={selectedElement.data.color || "#000000"}
                  onChange={(e) => updateElement(selectedElement.id, {
                    data: { ...selectedElement.data, color: e.target.value }
                  })}
                  className="h-10"
                />
              </div>
            </div>
          </div>
        )}

        {selectedElement.type === "shape" && (
          <div>
            <Label className="text-sm font-medium mb-3 block">Propriedades da Forma</Label>
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-gray-600">Cor de Preenchimento</Label>
                <Input
                  type="color"
                  value={selectedElement.data.fillColor || "#000000"}
                  onChange={(e) => updateElement(selectedElement.id, {
                    data: { ...selectedElement.data, fillColor: e.target.value }
                  })}
                  className="h-10"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600">Cor da Borda</Label>
                <Input
                  type="color"
                  value={selectedElement.data.strokeColor || "#000000"}
                  onChange={(e) => updateElement(selectedElement.id, {
                    data: { ...selectedElement.data, strokeColor: e.target.value }
                  })}
                  className="h-10"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600">Espessura da Borda</Label>
                <Slider
                  value={[selectedElement.data.strokeWidth || 1]}
                  onValueChange={(value) => updateElement(selectedElement.id, {
                    data: { ...selectedElement.data, strokeWidth: value[0] }
                  })}
                  max={20}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}

        <Separator />

        {/* Controls */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Controles</Label>
          <div className="space-y-3">
            {/* Visibility Toggle */}
            <div className="flex items-center justify-between">
              <Label className="text-sm">Visível</Label>
              <Switch
                checked={selectedElement.visible}
                onCheckedChange={handleVisibilityToggle}
              />
            </div>

            {/* Lock Toggle */}
            <div className="flex items-center justify-between">
              <Label className="text-sm">Bloqueado</Label>
              <Switch
                checked={selectedElement.locked}
                onCheckedChange={handleLockToggle}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Layer Controls */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Camadas</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs"
            >
              ⬆️ Para Frente
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs"
            >
              ⬇️ Para Trás
            </Button>
          </div>
        </div>

        <Separator />

        {/* Delete */}
        <div>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleDelete}
            className="w-full"
          >
            🗑️ Excluir Elemento
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}