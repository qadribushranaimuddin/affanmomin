import { useState, useRef, useMemo, useEffect } from "react";
import { 
  Sparkles, 
  Trash2, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  ChevronUp, 
  ChevronDown, 
  Download, 
  Type, 
  Shapes, 
  PenTool, 
  FileCheck, 
  Plus, 
  Maximize2,
  Minimize2,
  RefreshCw,
  Undo
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CanvasElement {
  id: string;
  type: 'text' | 'icon' | 'shape' | 'path';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  content: string; // text string, or shape name ('helix', 'star', 'divider')
  color: string;
  strokeColor: string;
  strokeWidth: number;
  fontSize: number;
  letterSpacing: number;
  fontFamily: string;
  isLocked: boolean;
  isHidden: boolean;
  curveRadius?: number;
  activeFilter?: 'none' | 'duotone' | 'neon' | 'halftone' | 'engraved';
  strokeStyle?: 'solid' | 'dashed' | 'dotted';
  longShadowX?: number;
  longShadowY?: number;
  longShadowColor?: string;
}

interface PathNode {
  x: number;
  y: number;
  h1x: number; // control handle 1
  h1y: number;
  h2x: number; // control handle 2
  h2y: number;
}

export default function InteractiveSandbox() {
  // Preset brand assets
  const colorPresets = [
    { name: "Orange Volt", hex: "#FF3E00" },
    { name: "Oceanic Cyan", hex: "#06b6d4" },
    { name: "Amber Ochre", hex: "#f59e0b" },
    { name: "Cyber Fuchsia", hex: "#ec4899" },
    { name: "Emerald Mint", hex: "#10b981" },
  ];

  const fontPresets = [
    { name: "Plus Jakarta", value: "'Plus Jakarta Sans', sans-serif" },
    { name: "JetBrains Mono", value: "'JetBrains Mono', monospace" },
    { name: "Georgia Serif", value: "Georgia, serif" },
    { name: "System Brutalist", value: "system-ui, sans-serif" }
  ];

  // Default Canvas Elements
  const [elements, setElements] = useState<CanvasElement[]>([
    {
      id: "bg-frame",
      type: "shape",
      content: "border-frame",
      x: 10,
      y: 10,
      width: 380,
      height: 230,
      rotation: 0,
      color: "transparent",
      strokeColor: "#FF3E00",
      strokeWidth: 2,
      fontSize: 12,
      letterSpacing: 0,
      fontFamily: "'JetBrains Mono', monospace",
      isLocked: true,
      isHidden: false
    },
    {
      id: "brand-logo",
      type: "icon",
      content: "helix",
      x: 175,
      y: 40,
      width: 50,
      height: 50,
      rotation: 0,
      color: "#FF3E00",
      strokeColor: "transparent",
      strokeWidth: 0,
      fontSize: 12,
      letterSpacing: 0,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      isLocked: false,
      isHidden: false
    },
    {
      id: "brand-title",
      type: "text",
      content: "VIBE-LAB",
      x: 120,
      y: 110,
      width: 160,
      height: 40,
      rotation: 0,
      color: "#FFFFFF",
      strokeColor: "transparent",
      strokeWidth: 0,
      fontSize: 26,
      letterSpacing: 4,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      isLocked: false,
      isHidden: false
    },
    {
      id: "brand-subtitle",
      type: "text",
      content: "ESTD 2026 // PACKAGING UNIT",
      x: 90,
      y: 165,
      width: 220,
      height: 20,
      rotation: 0,
      color: "#A3A3A3",
      strokeColor: "transparent",
      strokeWidth: 0,
      fontSize: 9,
      letterSpacing: 2,
      fontFamily: "'JetBrains Mono', monospace",
      isLocked: false,
      isHidden: false
    }
  ]);

  // Vector drawn nodes state (Pen Tool)
  const [penNodes, setPenNodes] = useState<PathNode[]>([]);
  const [activeTool, setActiveTool] = useState<'select' | 'pen'>('select');
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  
  // Dragging states
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeMode, setResizeMode] = useState<string | null>(null);
  const [draggedNode, setDraggedNode] = useState<{ nodeIndex: number; handleType: 'anchor' | 'h1' | 'h2' } | null>(null);

  // Alignment Smart Snapping Lines
  const [snapLines, setSnapLines] = useState<{ x?: number; y?: number } | null>(null);

  const canvasRef = useRef<SVGSVGElement>(null);
  const [canvasWidth, setCanvasWidth] = useState(400);
  const [canvasHeight, setCanvasHeight] = useState(250);
  const [activeBoardPreset, setActiveBoardPreset] = useState<'card' | 'hangtag' | 'poster'>('card');
  const [snapGridSize, setSnapGridSize] = useState<number>(0);
  const [hoverCoords, setHoverCoords] = useState<{ x: number; y: number } | null>(null);
  const [selectedPenNodeIdx, setSelectedPenNodeIdx] = useState<number | null>(null);
  const safeMargin = 20;

  // Pre-flight inspector safety checks
  const preFlightReport = useMemo(() => {
    const alerts: string[] = [];
    elements.forEach(el => {
      if (el.isHidden) return;
      // Bleed safety check: Elements close to outer canvas bounds
      const leftBound = el.x;
      const rightBound = el.x + el.width;
      const topBound = el.y;
      const bottomBound = el.y + el.height;

      if (
        leftBound < safeMargin || 
        rightBound > canvasWidth - safeMargin || 
        topBound < safeMargin || 
        bottomBound > canvasHeight - safeMargin
      ) {
        if (el.id !== "bg-frame") {
          alerts.push(`⚠️ ${el.id.toUpperCase()} is in the bleed cutoff zone.`);
        }
      }
    });

    if (penNodes.length > 0) {
      penNodes.forEach((node, idx) => {
        if (
          node.x < safeMargin || node.x > canvasWidth - safeMargin ||
          node.y < safeMargin || node.y > canvasHeight - safeMargin
        ) {
          alerts.push(`⚠️ Pen Point Node ${idx + 1} is in the bleed zone.`);
        }
      });
    }

    return {
      safetyScore: Math.max(0, 100 - alerts.length * 15),
      alerts,
      readyForPrint: alerts.length === 0
    };
  }, [elements, penNodes]);

  // SVG uploads parser
  const handleSVGUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const newElement: CanvasElement = {
        id: `uploaded-${Date.now()}`,
        type: 'shape',
        content: `custom-svg:${btoa(text)}`, // Encode source SVG to base64
        x: 100,
        y: 100,
        width: 80,
        height: 80,
        rotation: 0,
        color: "#FF3E00",
        strokeColor: "transparent",
        strokeWidth: 0,
        fontSize: 12,
        letterSpacing: 0,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        isLocked: false,
        isHidden: false
      };
      setElements(prev => [...prev, newElement]);
      setSelectedElementId(newElement.id);
    };
    reader.readAsText(file);
  };

  // Helper to add standard design assets
  const addAsset = (type: 'badge' | 'divider' | 'crest-frame' | 'star' | 'title-tag') => {
    const newAsset: CanvasElement = {
      id: `asset-${type}-${Date.now()}`,
      type: 'shape',
      content: type,
      x: 150,
      y: 90,
      width: type === 'divider' ? 150 : 60,
      height: type === 'divider' ? 10 : 60,
      rotation: 0,
      color: "transparent",
      strokeColor: "#FF3E00",
      strokeWidth: 1.5,
      fontSize: 12,
      letterSpacing: 0,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      isLocked: false,
      isHidden: false
    };
    setElements(prev => [...prev, newAsset]);
    setSelectedElementId(newAsset.id);
  };

  // Add custom text layer
  const addTextElement = () => {
    const newText: CanvasElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      content: "EDITABLE LAYOUT TEXT",
      x: 100,
      y: 120,
      width: 200,
      height: 30,
      rotation: 0,
      color: "#FFFFFF",
      strokeColor: "transparent",
      strokeWidth: 0,
      fontSize: 12,
      letterSpacing: 1,
      fontFamily: "'JetBrains Mono', monospace",
      isLocked: false,
      isHidden: false
    };
    setElements(prev => [...prev, newText]);
    setSelectedElementId(newText.id);
  };

  const handleBoardPresetChange = (type: 'card' | 'hangtag' | 'poster') => {
    setActiveBoardPreset(type);
    let newW = 400;
    let newH = 250;
    let frameW = 380;
    let frameH = 230;

    if (type === 'hangtag') {
      newW = 240;
      newH = 400;
      frameW = 220;
      frameH = 380;
    } else if (type === 'poster') {
      newW = 400;
      newH = 400;
      frameW = 380;
      frameH = 380;
    }

    setCanvasWidth(newW);
    setCanvasHeight(newH);

    setElements(prev => prev.map(el => 
      el.id === "bg-frame" 
        ? { ...el, width: frameW, height: frameH }
        : el
    ));
  };

  // Object manager arrangement functions
  const deleteElement = (id: string) => {
    setElements(prev => prev.filter(el => el.id !== id));
    if (selectedElementId === id) setSelectedElementId(null);
  };

  const toggleLock = (id: string) => {
    setElements(prev => prev.map(el => el.id === id ? { ...el, isLocked: !el.isLocked } : el));
  };

  const toggleHide = (id: string) => {
    setElements(prev => prev.map(el => el.id === id ? { ...el, isHidden: !el.isHidden } : el));
  };

  const arrangeLayer = (id: string, direction: 'front' | 'back') => {
    const idx = elements.findIndex(el => el.id === id);
    if (idx === -1) return;
    const newElements = [...elements];
    const item = newElements.splice(idx, 1)[0];
    if (direction === 'front') {
      newElements.push(item);
    } else {
      newElements.unshift(item);
    }
    setElements(newElements);
  };

  // Canvas interactive mouse coordinates parser
  const getCoordinates = (e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    // Map bounding rect to native 400x250 SVG viewport coordinates
    return {
      x: Math.round(((clientX - rect.left) / rect.width) * canvasWidth),
      y: Math.round(((clientY - rect.top) / rect.height) * canvasHeight)
    };
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>, elId: string, handleType?: string) => {
    const target = elements.find(el => el.id === elId);
    if (!target || target.isLocked) return;
    
    e.stopPropagation();
    setSelectedElementId(elId);

    const coords = getCoordinates(e);

    if (handleType) {
      // Resize handle action
      setResizeMode(handleType);
      setDragStart({ x: coords.x, y: coords.y });
    } else {
      // Direct drag move action
      setIsDragging(true);
      setDragOffset({
        x: coords.x - target.x,
        y: coords.y - target.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const coords = getCoordinates(e);
    setHoverCoords({ x: coords.x, y: coords.y });

    if (isDragging && selectedElementId) {
      let newX = coords.x - dragOffset.x;
      let newY = coords.y - dragOffset.y;

      if (snapGridSize > 0) {
        newX = Math.round(newX / snapGridSize) * snapGridSize;
        newY = Math.round(newY / snapGridSize) * snapGridSize;
      }

      // Smart alignment guidelines & snapping (Canva/Corel style)
      let snapX: number | undefined = undefined;
      let snapY: number | undefined = undefined;

      const targetCenterX = canvasWidth / 2;
      const targetCenterY = canvasHeight / 2;

      // Center snap check
      if (Math.abs((newX + elements.find(el => el.id === selectedElementId)!.width / 2) - targetCenterX) < 6) {
        newX = targetCenterX - elements.find(el => el.id === selectedElementId)!.width / 2;
        snapX = targetCenterX;
      }
      if (Math.abs((newY + elements.find(el => el.id === selectedElementId)!.height / 2) - targetCenterY) < 6) {
        newY = targetCenterY - elements.find(el => el.id === selectedElementId)!.height / 2;
        snapY = targetCenterY;
      }

      setSnapLines(snapX || snapY ? { x: snapX, y: snapY } : null);

      setElements(prev => prev.map(el => 
        el.id === selectedElementId 
          ? { ...el, x: newX, y: newY }
          : el
      ));
    } else if (resizeMode && selectedElementId) {
      const deltaX = coords.x - dragStart.x;
      const deltaY = coords.y - dragStart.y;
      
      setElements(prev => prev.map(el => {
        if (el.id !== selectedElementId) return el;
        
        if (resizeMode === "bottom-right") {
          return {
            ...el,
            width: Math.max(10, el.width + deltaX),
            height: Math.max(10, el.height + deltaY)
          };
        }
        return el;
      }));
      setDragStart({ x: coords.x, y: coords.y });
    } else if (activeTool === 'pen' && draggedNode) {
      let targetX = coords.x;
      let targetY = coords.y;
      if (snapGridSize > 0) {
        targetX = Math.round(coords.x / snapGridSize) * snapGridSize;
        targetY = Math.round(coords.y / snapGridSize) * snapGridSize;
      }

      setPenNodes(prev => prev.map((node, idx) => {
        if (idx !== draggedNode.nodeIndex) return node;
        
        if (draggedNode.handleType === 'anchor') {
          const deltaX = targetX - node.x;
          const deltaY = targetY - node.y;
          return {
            x: targetX,
            y: targetY,
            h1x: node.h1x + deltaX,
            h1y: node.h1y + deltaY,
            h2x: node.h2x + deltaX,
            h2y: node.h2y + deltaY
          };
        } else if (draggedNode.handleType === 'h1') {
          return {
            ...node,
            h1x: targetX,
            h1y: targetY
          };
        } else if (draggedNode.handleType === 'h2') {
          return {
            ...node,
            h2x: targetX,
            h2y: targetY
          };
        }
        return node;
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setResizeMode(null);
    setSnapLines(null);
    setDraggedNode(null);
  };

  // Pen tool anchor placements
  const handlePenCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (activeTool !== 'pen') return;
    const coords = getCoordinates(e);
    
    // Add point with control handles centered on point by default
    const newNode: PathNode = {
      x: coords.x,
      y: coords.y,
      h1x: coords.x - 20,
      h1y: coords.y,
      h2x: coords.x + 20,
      h2y: coords.y
    };
    setPenNodes(prev => [...prev, newNode]);
  };

  const resetPenDrawing = () => {
    setPenNodes([]);
  };

  // Build Pen path data
  const penPathD = useMemo(() => {
    if (penNodes.length === 0) return "";
    let d = `M ${penNodes[0].x} ${penNodes[0].y}`;
    for (let i = 1; i < penNodes.length; i++) {
      const prev = penNodes[i - 1];
      const curr = penNodes[i];
      d += ` C ${prev.h2x} ${prev.h2y}, ${curr.h1x} ${curr.h1y}, ${curr.x} ${curr.y}`;
    }
    return d;
  }, [penNodes]);

  // Export Scalable Vector Graphics File
  const handleExportSVG = () => {
    if (!canvasRef.current) return;
    
    // Clone node to export cleanly
    const svgClone = canvasRef.current.cloneNode(true) as SVGSVGElement;
    
    // Remove active select handles
    const selectionFrame = svgClone.querySelector(".selection-frame");
    if (selectionFrame) selectionFrame.remove();

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgClone);
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = "momin_affan_design_layout.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export mock high-resolution print PDF with crop marks
  const handleExportPDF = () => {
    // Generate a file download for a vector SVG with crop marks and metadata formatted for print pre-flight
    if (!canvasRef.current) return;
    
    const cropMarkSVG = `
      <svg width="500" height="350" viewBox="0 0 500 350" xmlns="http://www.w3.org/2000/svg">
        <!-- Crop Marks -->
        <line x1="50" y1="20" x2="50" y2="40" stroke="#FF3E00" stroke-width="1.5" />
        <line x1="20" y1="50" x2="40" y2="50" stroke="#FF3E00" stroke-width="1.5" />
        <line x1="450" y1="20" x2="450" y2="40" stroke="#FF3E00" stroke-width="1.5" />
        <line x1="460" y1="50" x2="480" y2="50" stroke="#FF3E00" stroke-width="1.5" />
        
        <!-- Nested Canvas design at offset 50,50 -->
        <g transform="translate(50, 50)">
          ${canvasRef.current.innerHTML}
        </g>
        
        <!-- Registration marks -->
        <circle cx="250" cy="25" r="10" fill="none" stroke="#FF3E00" stroke-width="1.5" />
        <line x1="250" y1="10" x2="250" y2="40" stroke="#FF3E00" stroke-width="1" />
        <line x1="235" y1="25" x2="265" y2="25" stroke="#FF3E00" stroke-width="1" />
        
        <text x="250" y="340" font-family="monospace" font-size="8" fill="#888888" text-anchor="middle">
          MOMIN_AFFAN_VECTOR_PRINT_PLATE // CMYK COLOR BOUNDARIES // OK
        </text>
      </svg>
    `;
    const blob = new Blob([cropMarkSVG], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = "momin_affan_print_layout_proof.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectedElement = elements.find(el => el.id === selectedElementId);

  // Render SVG element inside sandbox
  const renderSVGElement = (el: CanvasElement) => {
    if (el.isHidden) return null;

    const filterId = el.activeFilter && el.activeFilter !== 'none' ? `url(#filter-${el.activeFilter})` : undefined;

    if (el.type === 'text') {
      const isCurved = el.curveRadius && el.curveRadius > 0;
      const r = el.curveRadius || 120;
      const pathD = `M 0,${r} A ${r},${r} 0 0,1 ${el.width},${r}`;
      const hasShadow = el.longShadowX || el.longShadowY;

      const getTextNode = (isShadow: boolean = false) => {
        const fillColor = isShadow ? (el.longShadowColor || '#000000') : el.color;
        const handleDown = isShadow ? undefined : (e: any) => handleMouseDown(e, el.id);

        return isCurved ? (
          <>
            <path id={`path-${el.id}`} d={pathD} fill="none" stroke="none" />
            <text
              fill={fillColor}
              fontSize={el.fontSize}
              fontFamily={el.fontFamily}
              letterSpacing={el.letterSpacing}
              className="select-none font-bold text-center"
              onMouseDown={handleDown}
            >
              <textPath href={`#path-${el.id}`} startOffset="50%" textAnchor="middle">
                {el.content}
              </textPath>
            </text>
          </>
        ) : (
          <text
            x={0}
            y={el.height - 10}
            fill={fillColor}
            fontSize={el.fontSize}
            fontFamily={el.fontFamily}
            letterSpacing={el.letterSpacing}
            className="select-none font-bold"
            onMouseDown={handleDown}
          >
            {el.content}
          </text>
        );
      };

      return (
        <g key={el.id} transform={`translate(${el.x}, ${el.y}) rotate(${el.rotation})`} filter={filterId}>
          {hasShadow && (
            <g transform={`translate(${el.longShadowX || 0}, ${el.longShadowY || 0})`} opacity="0.4" style={{ filter: 'blur(2px)' }}>
              {getTextNode(true)}
            </g>
          )}
          {getTextNode(false)}
        </g>
      );
    }

    if (el.type === 'icon') {
      return (
        <g 
          key={el.id} 
          transform={`translate(${el.x}, ${el.y}) rotate(${el.rotation})`}
          filter={filterId}
          onMouseDown={(e) => handleMouseDown(e, el.id)}
        >
          {/* Custom vector preset helix logo */}
          <path d="M10 20 C10 8, 30 8, 30 20 S50 32, 50 20" fill="none" stroke={el.color} strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="20" cy="15" r="3" fill="#ffffff" />
          <circle cx="40" cy="25" r="3" fill="#ffffff" />
        </g>
      );
    }

    if (el.type === 'shape') {
      const getStrokeDashArray = (style?: 'solid' | 'dashed' | 'dotted') => {
        if (style === 'dashed') return '4 4';
        if (style === 'dotted') return '1 3';
        return undefined;
      };

      const getShapeElement = (isShadow: boolean = false) => {
        const fillColor = isShadow ? (el.color === 'none' ? 'none' : (el.longShadowColor || '#000000')) : el.color;
        const strokeColor = isShadow ? (el.strokeColor === 'none' ? 'none' : (el.longShadowColor || '#000000')) : el.strokeColor;
        const dashArray = getStrokeDashArray(el.strokeStyle);
        const handleDown = isShadow ? undefined : (e: any) => handleMouseDown(e, el.id);

        // Decode uploaded SVG, or draw library shapes
        if (el.content.startsWith("custom-svg:")) {
          const decoded = atob(el.content.split(":")[1]);
          return (
            <g 
              transform={`translate(${el.x}, ${el.y}) rotate(${el.rotation})`}
              onMouseDown={handleDown}
              dangerouslySetInnerHTML={{ __html: decoded }}
              style={isShadow ? { fill: fillColor, stroke: strokeColor } : undefined}
            />
          );
        }

        if (el.content === "border-frame") {
          return (
            <rect
              x={el.x}
              y={el.y}
              width={el.width}
              height={el.height}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={el.strokeWidth}
              strokeDasharray={dashArray}
              onMouseDown={handleDown}
            />
          );
        }

        if (el.content === "badge") {
          return (
            <polygon
              points={`${el.x},${el.y + el.height / 2} ${el.x + el.width / 4},${el.y} ${el.x + (el.width * 3) / 4},${el.y} ${el.x + el.width},${el.y + el.height / 2} ${el.x + (el.width * 3) / 4},${el.y + el.height} ${el.x + el.width / 4},${el.y + el.height}`}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={el.strokeWidth}
              strokeDasharray={dashArray}
              onMouseDown={handleDown}
            />
          );
        }

        if (el.content === "star") {
          return (
            <polygon
              points={`${el.x + el.width/2},${el.y} ${el.x + el.width*0.65},${el.y + el.height*0.35} ${el.x + el.width},${el.y + el.height*0.35} ${el.x + el.width*0.75},${el.y + el.height*0.6} ${el.x + el.width*0.85},${el.y + el.height} ${el.x + el.width/2},${el.y + el.height*0.75} ${el.x + el.width*0.15},${el.y + el.height} ${el.x + el.width*0.25},${el.y + el.height*0.6} ${el.x},${el.y + el.height*0.35} ${el.x + el.width*0.35},${el.y + el.height*0.35}`}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={el.strokeWidth}
              strokeDasharray={dashArray}
              onMouseDown={handleDown}
            />
          );
        }

        if (el.content === "divider") {
          return (
            <line
              x1={el.x}
              y1={el.y + el.height / 2}
              x2={el.x + el.width}
              y2={el.y + el.height / 2}
              stroke={strokeColor}
              strokeWidth={el.strokeWidth}
              strokeDasharray={dashArray}
              onMouseDown={handleDown}
            />
          );
        }

        return null;
      };

      const hasShadow = el.longShadowX || el.longShadowY;

      return (
        <g key={el.id} filter={filterId}>
          {hasShadow && (
            <g transform={`translate(${el.longShadowX || 0}, ${el.longShadowY || 0})`} opacity="0.45" style={{ filter: 'blur(2.5px)' }}>
              {getShapeElement(true)}
            </g>
          )}
          {getShapeElement(false)}
        </g>
      );
    }

    return null;
  };

  return (
    <div className="w-full relative select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Toolboxes & Object Manager */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          
          {/* Header metadata */}
          <div className="bg-[#111]/40 border border-white/5 p-4 rounded-xl">
            <span className="text-[9px] font-mono uppercase text-[#FF3E00] tracking-widest font-bold block mb-1">
              [SYSTEM: COREL_CANVA_DECK_V1]
            </span>
            <h3 className="text-xl font-black uppercase text-white tracking-tight">
              Vector Design Deck
            </h3>
            <p className="text-[10px] text-gray-500 font-mono mt-1">
              Drag, resize, add elements, draw Bézier paths, and pre-flight layouts.
            </p>

            {/* Board Switcher Presets */}
            <div className="mt-3 space-y-1.5 text-left">
              <label className="block text-[8px] font-mono uppercase text-gray-500 tracking-wider">
                // Board Layout Aspect Ratio
              </label>
              <div className="grid grid-cols-3 gap-1">
                {(['card', 'hangtag', 'poster'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => handleBoardPresetChange(type)}
                    className={`py-1 rounded-[2px] font-mono text-[8px] uppercase tracking-wider cursor-pointer border transition-colors ${
                      activeBoardPreset === type 
                        ? "bg-white text-black font-extrabold border-white" 
                        : "bg-[#161616] border-white/5 text-gray-400 hover:text-white"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid Snapping Settings */}
            <div className="mt-2 space-y-1.5 text-left">
              <label className="block text-[8px] font-mono uppercase text-gray-500 tracking-wider">
                // Grid Snapping bounds
              </label>
              <div className="grid grid-cols-4 gap-1">
                {([0, 5, 10, 20] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSnapGridSize(size)}
                    className={`py-1 rounded-[2px] font-mono text-[8px] uppercase tracking-wider cursor-pointer border transition-colors ${
                      snapGridSize === size 
                        ? "bg-white text-black font-extrabold border-white" 
                        : "bg-[#161616] border-white/5 text-gray-400 hover:text-white"
                    }`}
                  >
                    {size === 0 ? "Off" : `${size}px`}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Canvas Base Action Tools */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setActiveTool('select')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-sm font-mono text-[9px] uppercase tracking-wider cursor-pointer border transition-colors ${
                  activeTool === 'select' 
                    ? "bg-[#FF3E00] text-black font-extrabold border-[#FF3E00]" 
                    : "bg-[#161616] border-white/5 text-gray-400 hover:text-white"
                }`}
              >
                <Type className="w-3.5 h-3.5" />
                Select
              </button>
              <button
                onClick={() => setActiveTool('pen')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-sm font-mono text-[9px] uppercase tracking-wider cursor-pointer border transition-colors ${
                  activeTool === 'pen' 
                    ? "bg-[#FF3E00] text-black font-extrabold border-[#FF3E00]" 
                    : "bg-[#161616] border-white/5 text-gray-400 hover:text-white"
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                Pen Tool
              </button>
            </div>
          </div>

          {/* Style Editor Panel */}
          {selectedElement && (
            <div className="bg-[#111]/40 border border-white/5 p-4 rounded-xl flex flex-col gap-3">
              <span className="text-[9px] font-mono uppercase text-[#FF3E00] tracking-widest block border-b border-white/5 pb-1">
                // Element Customization
              </span>

              {/* Text-Specific inputs */}
              {selectedElement.type === "text" && (
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-mono text-gray-400 uppercase">Edit Content</label>
                  <input
                    type="text"
                    value={selectedElement.content}
                    onChange={(e) => setElements(prev => prev.map(el => el.id === selectedElement.id ? { ...el, content: e.target.value.toUpperCase() } : el))}
                    className="bg-[#161616] border border-white/5 text-xs text-white p-2 rounded-sm font-mono focus:border-[#FF3E00] focus:outline-none"
                  />

                  <label className="text-[9px] font-mono text-gray-400 uppercase mt-1">Font family</label>
                  <div className="grid grid-cols-2 gap-1">
                    {fontPresets.map((f, i) => (
                      <button
                        key={i}
                        onClick={() => setElements(prev => prev.map(el => el.id === selectedElement.id ? { ...el, fontFamily: f.value } : el))}
                        className={`text-[8px] font-mono py-1 rounded-sm border cursor-pointer ${
                          selectedElement.fontFamily === f.value ? "border-[#FF3E00] text-[#FF3E00]" : "border-white/5 text-gray-500"
                        }`}
                      >
                        {f.name}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <label className="text-[8px] font-mono text-gray-400 uppercase block">Size: {selectedElement.fontSize}px</label>
                      <input
                        type="range"
                        min="8"
                        max="48"
                        value={selectedElement.fontSize}
                        onChange={(e) => setElements(prev => prev.map(el => el.id === selectedElement.id ? { ...el, fontSize: Number(e.target.value) } : el))}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] font-mono text-gray-400 uppercase block">Letter spacing: {selectedElement.letterSpacing}px</label>
                      <input
                        type="range"
                        min="-2"
                        max="12"
                        value={selectedElement.letterSpacing}
                        onChange={(e) => setElements(prev => prev.map(el => el.id === selectedElement.id ? { ...el, letterSpacing: Number(e.target.value) } : el))}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer mt-1"
                      />
                    </div>
                  </div>

                  <div className="mt-2">
                    <label className="text-[8px] font-mono text-gray-400 uppercase block">Text Curvature Arc: {selectedElement.curveRadius ? `${selectedElement.curveRadius}px` : "Straight (Flat)"}</label>
                    <input
                      type="range"
                      min="0"
                      max="300"
                      step="10"
                      value={selectedElement.curveRadius || 0}
                      onChange={(e) => setElements(prev => prev.map(el => el.id === selectedElement.id ? { ...el, curveRadius: Number(e.target.value) } : el))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer mt-1"
                    />
                  </div>
                </div>
              )}

              {/* Vector Stroke styling */}
              {selectedElement.type === "shape" && (
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[8px] font-mono text-gray-400 uppercase block">Border thickness: {selectedElement.strokeWidth}px</label>
                      <input
                        type="range"
                        min="0"
                        max="8"
                        step="0.5"
                        value={selectedElement.strokeWidth}
                        onChange={(e) => setElements(prev => prev.map(el => el.id === selectedElement.id ? { ...el, strokeWidth: Number(e.target.value) } : el))}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] font-mono text-gray-400 uppercase block">Rotation: {selectedElement.rotation}°</label>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={selectedElement.rotation}
                        onChange={(e) => setElements(prev => prev.map(el => el.id === selectedElement.id ? { ...el, rotation: Number(e.target.value) } : el))}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div className="flex flex-col gap-1">
                      <label className="text-[8px] font-mono text-gray-400 uppercase">Stroke Hex</label>
                      <input
                        type="text"
                        value={selectedElement.strokeColor}
                        onChange={(e) => setElements(prev => prev.map(el => el.id === selectedElement.id ? { ...el, strokeColor: e.target.value } : el))}
                        className="bg-[#161616] border border-white/5 text-[9px] font-mono text-white p-1 rounded-sm focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[8px] font-mono text-gray-400 uppercase">Fill Hex</label>
                      <input
                        type="text"
                        value={selectedElement.color}
                        onChange={(e) => setElements(prev => prev.map(el => el.id === selectedElement.id ? { ...el, color: e.target.value } : el))}
                        className="bg-[#161616] border border-white/5 text-[9px] font-mono text-white p-1 rounded-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-2">
                    <label className="text-[8px] font-mono text-gray-400 uppercase block mb-1">Border Line Style</label>
                    <div className="grid grid-cols-3 gap-1">
                      {([
                        { id: 'solid', label: 'Solid' },
                        { id: 'dashed', label: 'Dashed' },
                        { id: 'dotted', label: 'Dotted' }
                      ] as const).map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setElements(prev => prev.map(el => el.id === selectedElement.id ? { ...el, strokeStyle: opt.id } : el))}
                          className={`text-[8px] font-mono py-1 rounded-sm border cursor-pointer transition-colors ${
                            (selectedElement.strokeStyle || 'solid') === opt.id ? "border-[#FF3E00] text-[#FF3E00] font-bold bg-[#FF3E00]/5" : "border-white/5 text-gray-500 hover:text-white"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Color Presets */}
              <div className="flex flex-col gap-1.5 mt-1">
                <label className="text-[8px] font-mono text-gray-400 uppercase">Vibrant Color Presets</label>
                <div className="flex gap-1.5">
                  {colorPresets.map((col, i) => (
                    <button
                      key={i}
                      onClick={() => setElements(prev => prev.map(el => el.id === selectedElement.id ? { ...el, color: el.type === 'text' ? col.hex : el.color, strokeColor: el.type === 'shape' ? col.hex : el.strokeColor } : el))}
                      className="w-5 h-5 rounded-full border border-white/20 transition-transform hover:scale-110 cursor-pointer"
                      style={{ backgroundColor: col.hex }}
                      title={col.name}
                    />
                  ))}
                </div>
              </div>

              {/* SVG Filter Effects gallery */}
              <div className="border-t border-white/5 pt-2 mt-1">
                <label className="text-[8px] font-mono text-gray-400 uppercase block mb-1">Vector Artwork Filters</label>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { id: 'none', label: 'None' },
                    { id: 'duotone', label: 'Duotone' },
                    { id: 'neon', label: 'Neon Glow' },
                    { id: 'halftone', label: 'Halftone' },
                    { id: 'engraved', label: 'Engraved' }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setElements(prev => prev.map(el => el.id === selectedElement.id ? { ...el, activeFilter: f.id as any } : el))}
                      className={`text-[8px] font-mono py-1 rounded-sm border cursor-pointer transition-colors ${
                        (selectedElement.activeFilter || 'none') === f.id ? "border-[#FF3E00] text-[#FF3E00] font-bold bg-[#FF3E00]/5" : "border-white/5 text-gray-500 hover:text-white"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
              </div>

              {/* 3D Long Shadow Effect controls */}
              <div className="border-t border-white/5 pt-2 mt-2 space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[8px] font-mono text-gray-400 uppercase block">3D Long Shadow Extrude</label>
                  <label className="flex items-center gap-1 font-mono text-[8px] text-gray-500 hover:text-white cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={!!(selectedElement.longShadowX !== undefined || selectedElement.longShadowY !== undefined)}
                      onChange={(e) => {
                        const active = e.target.checked;
                        setElements(prev => prev.map(el => el.id === selectedElement.id ? { 
                          ...el, 
                          longShadowX: active ? 6 : undefined, 
                          longShadowY: active ? 6 : undefined,
                          longShadowColor: active ? '#000000' : undefined 
                        } : el));
                      }}
                      className="accent-[#FF3E00] cursor-pointer"
                    />
                    <span>Enable</span>
                  </label>
                </div>

                {(selectedElement.longShadowX !== undefined || selectedElement.longShadowY !== undefined) && (
                  <div className="space-y-1.5 animate-fadeIn">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[7.5px] font-mono text-gray-500 block">Offset X: {selectedElement.longShadowX || 0}px</label>
                        <input
                          type="range"
                          min="-20"
                          max="20"
                          value={selectedElement.longShadowX || 0}
                          onChange={(e) => setElements(prev => prev.map(el => el.id === selectedElement.id ? { ...el, longShadowX: Number(e.target.value) } : el))}
                          className="w-full h-1 bg-white/10 rounded appearance-none cursor-pointer mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-[7.5px] font-mono text-gray-500 block">Offset Y: {selectedElement.longShadowY || 0}px</label>
                        <input
                          type="range"
                          min="-20"
                          max="20"
                          value={selectedElement.longShadowY || 0}
                          onChange={(e) => setElements(prev => prev.map(el => el.id === selectedElement.id ? { ...el, longShadowY: Number(e.target.value) } : el))}
                          className="w-full h-1 bg-white/10 rounded appearance-none cursor-pointer mt-1"
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1 mt-1">
                      <label className="text-[7.5px] font-mono text-gray-500">Shadow Color Hex</label>
                      <input
                        type="text"
                        value={selectedElement.longShadowColor || '#000000'}
                        onChange={(e) => setElements(prev => prev.map(el => el.id === selectedElement.id ? { ...el, longShadowColor: e.target.value } : el))}
                        className="bg-[#161616] border border-white/5 text-[9px] font-mono text-white p-1 rounded-sm focus:outline-none focus:border-[#FF3E00]"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Layer Panel / Object Manager */}
          <div className="bg-[#111]/40 border border-white/5 p-4 rounded-xl flex flex-col gap-2">
            <span className="text-[9px] font-mono uppercase text-[#FF3E00] tracking-widest block border-b border-white/5 pb-1 mb-1">
              // CorelDRAW Object Manager
            </span>

            <div className="flex flex-col gap-1.5 max-h-[160px] overflow-y-auto pr-1">
              {elements.map((el) => {
                const isSelected = selectedElementId === el.id;
                return (
                  <div
                    key={el.id}
                    className={`flex items-center justify-between p-2 rounded-sm border transition-all ${
                      isSelected 
                        ? "bg-[#FF3E00]/10 border-[#FF3E00]/40 text-white" 
                        : "bg-[#161616]/40 border-white/5 text-gray-400 hover:text-white"
                    }`}
                  >
                    <button
                      onClick={() => setSelectedElementId(el.id)}
                      className="flex-1 text-left font-mono text-[9px] truncate tracking-wide cursor-pointer"
                    >
                      {el.id.toUpperCase()}
                    </button>
                    
                    {/* Layer controls */}
                    <div className="flex items-center gap-1.5 ml-2">
                      <button
                        onClick={() => toggleLock(el.id)}
                        className="hover:text-white cursor-pointer"
                        title={el.isLocked ? "Unlock Object" : "Lock Object"}
                      >
                        {el.isLocked ? <Lock className="w-3 h-3 text-[#FF3E00]" /> : <Unlock className="w-3 h-3 text-gray-600" />}
                      </button>
                      <button
                        onClick={() => toggleHide(el.id)}
                        className="hover:text-white cursor-pointer"
                        title={el.isHidden ? "Show Object" : "Hide Object"}
                      >
                        {el.isHidden ? <EyeOff className="w-3 h-3 text-red-500" /> : <Eye className="w-3 h-3 text-gray-600" />}
                      </button>
                      <button
                        onClick={() => arrangeLayer(el.id, 'front')}
                        className="hover:text-white cursor-pointer"
                        title="Bring to Front"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => arrangeLayer(el.id, 'back')}
                        className="hover:text-white cursor-pointer"
                        title="Send to Back"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      {el.id !== "bg-frame" && (
                        <button
                          onClick={() => deleteElement(el.id)}
                          className="text-red-500 hover:text-red-400 cursor-pointer"
                          title="Delete Object"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* CENTER COLUMN: Interactive SVG Canvas Workspace */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          
          <div className="font-mono text-[9px] text-[#A3A3A3] uppercase tracking-[0.25em] mb-3 flex items-center justify-between w-full">
            <span>[Proofing Workspace: 1:1 V_PREVIEW]</span>
            {activeTool === 'pen' && (
              <span className="text-[#FF3E00] animate-pulse">Pen mode active // Click to place nodes</span>
            )}
          </div>

          <div className="relative w-full max-w-[400px] border border-white/10 rounded-xl overflow-hidden bg-[#070707] shadow-2xl p-4 flex flex-col items-center">
            
            {/* Safe boundaries grid guidelines */}
            <div className="absolute inset-0 border-[20px] border-dashed border-[#FF007F]/5 pointer-events-none z-10" />

            <svg
              ref={canvasRef}
              viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
              className="w-full aspect-[400/250] bg-black border border-white/5 relative z-20 cursor-crosshair overflow-hidden"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onClick={handlePenCanvasClick}
            >
              <defs>
                {snapGridSize > 0 && (
                  <pattern id="grid-pattern" width={snapGridSize} height={snapGridSize} patternUnits="userSpaceOnUse">
                    <path d={`M ${snapGridSize} 0 L 0 0 0 ${snapGridSize}`} fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.5" />
                  </pattern>
                )}

                {/* Duotone Filter */}
                <filter id="filter-duotone">
                  <feColorMatrix type="matrix" values="0.2126 0.7152 0.0722 0 0
                                                       0.2126 0.7152 0.0722 0 0
                                                       0.2126 0.7152 0.0722 0 0
                                                       0      0      0      1 0" />
                  <feComponentTransfer>
                    <feFuncR type="table" tableValues="0.05 0.95" />
                    <feFuncG type="table" tableValues="0.08 0.45" />
                    <feFuncB type="table" tableValues="0.38 0.9" />
                  </feComponentTransfer>
                </filter>

                {/* Neon Glow Filter */}
                <filter id="filter-neon" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Halftone Screen Filter */}
                <filter id="filter-halftone">
                  <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 35 -15" />
                </filter>

                {/* Laser Engraved Filter */}
                <filter id="filter-engraved">
                  <feConvolveMatrix order="3" kernelMatrix="1 -1 1 -1 8 -1 1 -1 1" />
                </filter>
              </defs>

              {snapGridSize > 0 && (
                <rect width="100%" height="100%" fill="url(#grid-pattern)" pointerEvents="none" />
              )}

              {hoverCoords && (
                <text x="12" y={canvasHeight - 12} fill="#A3A3A3" fontFamily="monospace" fontSize="8" opacity="0.75" pointerEvents="none">
                  X: {hoverCoords.x}, Y: {hoverCoords.y}
                </text>
              )}

              {/* Dynamic Snapping guidelines (Corel snap alignment) */}
              {snapLines?.x && (
                <line x1={snapLines.x} y1={0} x2={snapLines.x} y2={canvasHeight} stroke="#FF007F" strokeWidth="1" strokeDasharray="3,3" />
              )}
              {snapLines?.y && (
                <line x1={0} y1={snapLines.y} x2={canvasWidth} y2={snapLines.y} stroke="#FF007F" strokeWidth="1" strokeDasharray="3,3" />
              )}

              {/* Render vector nodes Bézier curve (Pen Tool) */}
              {penPathD && (
                <path d={penPathD} fill="none" stroke="#FF3E00" strokeWidth="2.5" strokeLinecap="round" />
              )}

              {/* Render Canvas Elements list */}
              {elements.map(renderSVGElement)}

              {/* Interactive Transform Bounds box selector for Canva scale */}
              {selectedElement && activeTool === 'select' && !selectedElement.isLocked && !selectedElement.isHidden && (
                <g className="selection-frame" transform={`translate(${selectedElement.x}, ${selectedElement.y}) rotate(${selectedElement.rotation})`}>
                  {/* Bounding box dashes */}
                  <rect
                    x={0}
                    y={0}
                    width={selectedElement.width}
                    height={selectedElement.height}
                    fill="none"
                    stroke="#FF3E00"
                    strokeWidth="1.2"
                    strokeDasharray="4,3"
                  />
                  
                  {/* Corner Resize Handles circles */}
                  <circle
                    cx={selectedElement.width}
                    cy={selectedElement.height}
                    r="4"
                    fill="#FF3E00"
                    className="cursor-se-resize"
                    onMouseDown={(e) => handleMouseDown(e, selectedElement.id, "bottom-right")}
                  />
                </g>
              )}

              {/* Render Pen Tool anchor points overlays */}
              {activeTool === 'pen' && penNodes.map((node, idx) => (
                <g key={idx}>
                  {/* Lines to handles */}
                  <line x1={node.x} y1={node.y} x2={node.h1x} y2={node.h1y} stroke="#9333ea" strokeWidth="0.8" />
                  <line x1={node.x} y1={node.y} x2={node.h2x} y2={node.h2y} stroke="#9333ea" strokeWidth="0.8" />
                  
                  {/* Anchor Point node */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="5"
                    fill={selectedPenNodeIdx === idx ? "#FFFF00" : "#FF3E00"}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    className="cursor-move"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setSelectedPenNodeIdx(idx);
                      setDraggedNode({ nodeIndex: idx, handleType: 'anchor' });
                    }}
                  />
                  {/* Handles */}
                  <circle
                    cx={node.h1x}
                    cy={node.h1y}
                    r="4"
                    fill="#9333ea"
                    className="cursor-move"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setDraggedNode({ nodeIndex: idx, handleType: 'h1' });
                    }}
                  />
                  <circle
                    cx={node.h2x}
                    cy={node.h2y}
                    r="4"
                    fill="#9333ea"
                    className="cursor-move"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setDraggedNode({ nodeIndex: idx, handleType: 'h2' });
                    }}
                  />
                </g>
              ))}
            </svg>

            {/* Canvas controls quick menu */}
            <div className="flex gap-3 mt-4 w-full">
              <button
                onClick={addTextElement}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-sm font-mono text-[9px] text-[#FF3E00] border border-[#FF3E00]/30 bg-[#FF3E00]/5 hover:bg-[#FF3E00]/10 transition-colors uppercase tracking-wider cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Text
              </button>
              <button
                onClick={handleExportSVG}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-sm font-mono text-[9px] text-[#06b6d4] border border-[#06b6d4]/30 bg-[#06b6d4]/5 hover:bg-[#06b6d4]/10 transition-colors uppercase tracking-wider cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export SVG
              </button>
              <button
                onClick={handleExportPDF}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-sm font-mono text-[9px] text-[#ec4899] border border-[#ec4899]/30 bg-[#ec4899]/5 hover:bg-[#ec4899]/10 transition-colors uppercase tracking-wider cursor-pointer"
              >
                <FileCheck className="w-3.5 h-3.5" />
                Print PDF
              </button>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: Custom Asset Library, SVGs, Pre-Flight Inspector */}
        <div className="lg:col-span-3 flex flex-col gap-5">
          
          {/* Custom Asset Library */}
          <div className="bg-[#111]/40 border border-white/5 p-4 rounded-xl flex flex-col gap-2">
            <span className="text-[9px] font-mono uppercase text-[#FF3E00] tracking-widest block border-b border-white/5 pb-1">
              // Custom Asset Library
            </span>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                onClick={() => addAsset('star')}
                className="py-1.5 text-center border border-white/5 hover:border-[#FF3E00]/50 rounded-sm font-mono text-[8px] uppercase text-gray-400 hover:text-white cursor-pointer bg-[#161616]/40"
              >
                + Add Star
              </button>
              <button
                onClick={() => addAsset('badge')}
                className="py-1.5 text-center border border-white/5 hover:border-[#FF3E00]/50 rounded-sm font-mono text-[8px] uppercase text-gray-400 hover:text-white cursor-pointer bg-[#161616]/40"
              >
                + Add Badge
              </button>
              <button
                onClick={() => addAsset('divider')}
                className="py-1.5 text-center border border-white/5 hover:border-[#FF3E00]/50 rounded-sm font-mono text-[8px] uppercase text-gray-400 hover:text-white cursor-pointer bg-[#161616]/40 col-span-2"
              >
                + Add Divider line
              </button>
            </div>

            {/* SVG Upload zone */}
            <div className="mt-2 pt-2 border-t border-white/5">
              <label className="text-[8px] font-mono text-gray-400 uppercase block mb-1">Upload SVG Logo Asset</label>
              <label className="block w-full border border-dashed border-white/10 hover:border-[#FF3E00]/40 rounded-sm p-3 text-center cursor-pointer bg-[#161616]/20 transition-colors">
                <span className="text-[9px] font-mono text-brand-muted hover:text-white block uppercase">Choose SVG file</span>
                <input
                  type="file"
                  accept=".svg"
                  onChange={handleSVGUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Pre-Flight inspector */}
          <div className="bg-[#111]/40 border border-white/5 p-4 rounded-xl flex flex-col gap-2">
            <span className="text-[9px] font-mono uppercase text-[#FF3E00] tracking-widest block border-b border-white/5 pb-1">
              // Pre-Flight Inspector
            </span>

            {/* Safety Rating Gauge bar */}
            <div className="mt-1 flex items-center justify-between">
              <span className="text-[9px] font-mono text-gray-400">PRINT SAFETY RATING:</span>
              <span className="text-xs font-mono font-bold" style={{ color: preFlightReport.safetyScore > 70 ? "#00ffcc" : "#FF3E00" }}>
                {preFlightReport.safetyScore}%
              </span>
            </div>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-0.5">
              <div 
                className="h-full transition-all duration-300"
                style={{ 
                  width: `${preFlightReport.safetyScore}%`,
                  backgroundColor: preFlightReport.safetyScore > 70 ? "#00ffcc" : "#FF3E00"
                }}
              />
            </div>

            {/* Alerts checklist */}
            <div className="flex flex-col gap-1.5 mt-2 max-h-[100px] overflow-y-auto pr-1">
              {preFlightReport.alerts.length === 0 ? (
                <div className="text-[8.5px] font-mono text-[#00ffcc] uppercase leading-relaxed">
                  ✓ NO BLEED ISSUES DETECTED. VECTOR DOCUMENT PRE-FLIGHT APPROVED FOR PRESS!
                </div>
              ) : (
                preFlightReport.alerts.map((alert, i) => (
                  <div key={i} className="text-[8.5px] font-mono text-[#FF3E00] leading-tight">
                    {alert}
                  </div>
                ))
              )}
            </div>

            {/* Bézier actions */}
            {penNodes.length > 0 && (
              <div className="border-t border-white/5 pt-2 mt-1.5 flex justify-between items-center">
                <span className="text-[8px] font-mono text-gray-500 uppercase">PEN PATH ACTIVE</span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => {
                      if (selectedPenNodeIdx !== null) {
                        setPenNodes(prev => prev.filter((_, idx) => idx !== selectedPenNodeIdx));
                        setSelectedPenNodeIdx(null);
                      }
                    }}
                    disabled={selectedPenNodeIdx === null}
                    className="flex items-center gap-1 py-1 px-2 border border-orange-500/20 hover:border-orange-500 disabled:opacity-30 disabled:pointer-events-none bg-orange-500/5 hover:bg-orange-500/10 text-orange-500 text-[8px] font-mono uppercase rounded-sm cursor-pointer transition-colors"
                  >
                    Delete Point
                  </button>
                  <button
                    onClick={resetPenDrawing}
                    className="flex items-center gap-1 py-1 px-2 border border-red-500/20 hover:border-red-500 bg-red-500/5 hover:bg-red-500/10 text-red-500 text-[8px] font-mono uppercase rounded-sm cursor-pointer transition-colors"
                  >
                    <Undo className="w-2.5 h-2.5" />
                    Clear Nodes
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
