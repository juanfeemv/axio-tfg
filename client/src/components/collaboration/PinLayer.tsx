import React, { useState, useRef } from 'react';
import { MapPin, Send, X } from 'lucide-react';

// Capa transparente sobre la imagen del proyecto que permite colocar pines colaborativos.
// El componente captura clics del ratón, calcula coordenadas relativas en porcentaje
// (para que el pin no se descuadre al redimensionar) y muestra los pines existentes.
interface PinLayerProps {
  pins: any[];
  onSavePin: (x: number, y: number, comment: string) => void;
}

export default function PinLayer({ pins, onSavePin }: PinLayerProps) {
  const [tempPin, setTempPin] = useState<{ x: number; y: number } | null>(null);
  const [comment, setComment] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const handleImageClick = (e: React.MouseEvent) => {
    if (tempPin) return; // Ya hay un formulario de pin abierto
    if (!containerRef.current) return;

    // Calcular coordenadas RELATIVAS (0-100%) respecto al tamaño del contenedor
    // Así el pin se mantiene en su sitio aunque la ventana cambie de tamaño
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setTempPin({ x, y });
  };

  const handleSave = () => {
    if (!tempPin || !comment.trim()) return;
    onSavePin(tempPin.x, tempPin.y, comment);
    setTempPin(null);
    setComment('');
  };

  return (
    <div 
      ref={containerRef} 
      onClick={handleImageClick}
      className="absolute inset-0 z-30 cursor-crosshair"
    >
      {/* Pines Guardados */}
      {pins.map((pin, idx) => (
        <div 
          key={pin._id || idx}
          className="absolute group"
          style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform cursor-pointer">
            <MapPin className="drop-shadow-md text-red-500 fill-red-500" size={32} />
            <div className="absolute -top-2 -right-2 bg-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold border border-slate-200 shadow-sm text-slate-800">
                {pin.author?.username?.charAt(0).toUpperCase()}
            </div>
          </div>
          {/* Tooltip hover */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white p-3 rounded-xl shadow-xl w-48 hidden group-hover:block z-50 animate-fade-in border border-slate-100">
            <p className="font-bold text-xs text-blue-600 mb-1">@{pin.author?.username}</p>
            <p className="text-slate-700 text-sm leading-snug">{pin.content}</p>
          </div>
        </div>
      ))}

      {/* Nuevo Pin (Formulario) */}
      {tempPin && (
        <div 
          className="absolute z-50 transform -translate-x-1/2 mt-4"
          style={{ left: `${tempPin.x}%`, top: `${tempPin.y}%` }}
          onClick={(e) => e.stopPropagation()}
        >
            <MapPin className="absolute -top-10 left-1/2 -translate-x-1/2 text-blue-500 fill-blue-500 animate-bounce" size={32} />
            <div className="bg-white p-3 rounded-2xl shadow-2xl w-64 border border-slate-200">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">Nuevo Comentario</span>
                    <button onClick={() => setTempPin(null)} className="text-slate-400 hover:text-red-500"><X size={14}/></button>
                </div>
                <textarea 
                    autoFocus
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm mb-3 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none text-slate-800"
                    rows={2}
                    placeholder="Escribe aquí..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSave(); }}}
                />
                <button onClick={handleSave} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2">
                    <Send size={14} /> Publicar
                </button>
            </div>
        </div>
      )}
    </div>
  );
}