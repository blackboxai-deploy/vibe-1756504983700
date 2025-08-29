"use client";

import { createContext, useContext, useReducer, ReactNode } from "react";

// Types
export interface StickerElement {
  id: string;
  type: "text" | "image" | "shape" | "drawing";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  visible: boolean;
  locked: boolean;
  data: any; // Specific data for each element type
}

export interface StickerState {
  elements: StickerElement[];
  selectedElementId: string | null;
  canvasSize: { width: number; height: number };
  backgroundColor: string;
  history: StickerElement[][];
  historyIndex: number;
  tool: string;
  isDrawing: boolean;
  brushSize: number;
  brushColor: string;
  textColor: string;
  fontSize: number;
  fontFamily: string;
}

type StickerAction =
  | { type: "ADD_ELEMENT"; element: StickerElement }
  | { type: "UPDATE_ELEMENT"; id: string; updates: Partial<StickerElement> }
  | { type: "DELETE_ELEMENT"; id: string }
  | { type: "SELECT_ELEMENT"; id: string | null }
  | { type: "SET_TOOL"; tool: string }
  | { type: "SET_BRUSH_SIZE"; size: number }
  | { type: "SET_BRUSH_COLOR"; color: string }
  | { type: "SET_TEXT_COLOR"; color: string }
  | { type: "SET_FONT_SIZE"; size: number }
  | { type: "SET_FONT_FAMILY"; family: string }
  | { type: "SET_BACKGROUND_COLOR"; color: string }
  | { type: "SET_IS_DRAWING"; isDrawing: boolean }
  | { type: "CLEAR_CANVAS" }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "SAVE_STATE" };

const initialState: StickerState = {
  elements: [],
  selectedElementId: null,
  canvasSize: { width: 512, height: 512 }, // WhatsApp sticker size
  backgroundColor: "transparent",
  history: [[]],
  historyIndex: 0,
  tool: "brush",
  isDrawing: false,
  brushSize: 5,
  brushColor: "#000000",
  textColor: "#000000",
  fontSize: 32,
  fontFamily: "Arial",
};

function stickerReducer(state: StickerState, action: StickerAction): StickerState {
  switch (action.type) {
    case "ADD_ELEMENT":
      const newElements = [...state.elements, action.element];
      return {
        ...state,
        elements: newElements,
        selectedElementId: action.element.id,
      };

    case "UPDATE_ELEMENT":
      return {
        ...state,
        elements: state.elements.map((element) =>
          element.id === action.id ? { ...element, ...action.updates } : element
        ),
      };

    case "DELETE_ELEMENT":
      return {
        ...state,
        elements: state.elements.filter((element) => element.id !== action.id),
        selectedElementId: state.selectedElementId === action.id ? null : state.selectedElementId,
      };

    case "SELECT_ELEMENT":
      return {
        ...state,
        selectedElementId: action.id,
      };

    case "SET_TOOL":
      return {
        ...state,
        tool: action.tool,
        selectedElementId: null,
      };

    case "SET_BRUSH_SIZE":
      return { ...state, brushSize: action.size };

    case "SET_BRUSH_COLOR":
      return { ...state, brushColor: action.color };

    case "SET_TEXT_COLOR":
      return { ...state, textColor: action.color };

    case "SET_FONT_SIZE":
      return { ...state, fontSize: action.size };

    case "SET_FONT_FAMILY":
      return { ...state, fontFamily: action.family };

    case "SET_BACKGROUND_COLOR":
      return { ...state, backgroundColor: action.color };

    case "SET_IS_DRAWING":
      return { ...state, isDrawing: action.isDrawing };

    case "CLEAR_CANVAS":
      return {
        ...state,
        elements: [],
        selectedElementId: null,
      };

    case "SAVE_STATE":
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push([...state.elements]);
      return {
        ...state,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };

    case "UNDO":
      if (state.historyIndex > 0) {
        const prevIndex = state.historyIndex - 1;
        return {
          ...state,
          elements: [...state.history[prevIndex]],
          historyIndex: prevIndex,
          selectedElementId: null,
        };
      }
      return state;

    case "REDO":
      if (state.historyIndex < state.history.length - 1) {
        const nextIndex = state.historyIndex + 1;
        return {
          ...state,
          elements: [...state.history[nextIndex]],
          historyIndex: nextIndex,
          selectedElementId: null,
        };
      }
      return state;

    default:
      return state;
  }
}

interface StickerContextType {
  state: StickerState;
  dispatch: React.Dispatch<StickerAction>;
  // Helper functions
  addElement: (element: Omit<StickerElement, "id">) => void;
  updateElement: (id: string, updates: Partial<StickerElement>) => void;
  deleteElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  setTool: (tool: string) => void;
  clearCanvas: () => void;
  undo: () => void;
  redo: () => void;
  saveState: () => void;
}

const StickerContext = createContext<StickerContextType | undefined>(undefined);

export function StickerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(stickerReducer, initialState);

  const addElement = (elementData: Omit<StickerElement, "id">) => {
    const element: StickerElement = {
      ...elementData,
      id: `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    dispatch({ type: "ADD_ELEMENT", element });
    dispatch({ type: "SAVE_STATE" });
  };

  const updateElement = (id: string, updates: Partial<StickerElement>) => {
    dispatch({ type: "UPDATE_ELEMENT", id, updates });
  };

  const deleteElement = (id: string) => {
    dispatch({ type: "DELETE_ELEMENT", id });
    dispatch({ type: "SAVE_STATE" });
  };

  const selectElement = (id: string | null) => {
    dispatch({ type: "SELECT_ELEMENT", id });
  };

  const setTool = (tool: string) => {
    dispatch({ type: "SET_TOOL", tool });
  };

  const clearCanvas = () => {
    dispatch({ type: "CLEAR_CANVAS" });
    dispatch({ type: "SAVE_STATE" });
  };

  const undo = () => {
    dispatch({ type: "UNDO" });
  };

  const redo = () => {
    dispatch({ type: "REDO" });
  };

  const saveState = () => {
    dispatch({ type: "SAVE_STATE" });
  };

  return (
    <StickerContext.Provider
      value={{
        state,
        dispatch,
        addElement,
        updateElement,
        deleteElement,
        selectElement,
        setTool,
        clearCanvas,
        undo,
        redo,
        saveState,
      }}
    >
      {children}
    </StickerContext.Provider>
  );
}

export function useStickerContext() {
  const context = useContext(StickerContext);
  if (context === undefined) {
    throw new Error("useStickerContext must be used within a StickerProvider");
  }
  return context;
}