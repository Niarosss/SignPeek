import { useRef } from 'react';

export default function DropOverlay({ onLeave, onDrop }) {
  const eyeRef = useRef(null);
  const pupilRef = useRef(null);
  const rafId = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!eyeRef.current || !pupilRef.current) return;

    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }

    const clientX = e.clientX;
    const clientY = e.clientY;

    rafId.current = requestAnimationFrame(() => {
      if (!eyeRef.current || !pupilRef.current) return;

      const rect = eyeRef.current.getBoundingClientRect();
      const eyeCenterX = rect.left + rect.width / 2;
      const eyeCenterY = rect.top + rect.height / 2;

      const deltaX = clientX - eyeCenterX;
      const deltaY = clientY - eyeCenterY;

      const maxDistanceX = 6;
      const maxDistanceY = 3.5;

      const angle = Math.atan2(deltaY, deltaX);
      const distance = Math.hypot(deltaX, deltaY);
      const intensity = Math.min(distance / 100, 1);

      const moveX = Math.cos(angle) * maxDistanceX * intensity;
      const moveY = Math.sin(angle) * maxDistanceY * intensity;

      pupilRef.current.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
    });
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      onLeave();
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    onLeave();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await onDrop(e.dataTransfer.files);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-500/30 backdrop-blur-sm p-4 animate-in fade-in duration-200 "
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className=" bg-slate-50/70 border-2 border-slate-700 border-dashed rounded-3xl w-full h-full flex items-center justify-center relative">
      <div className="flex flex-col items-center gap-6 pointer-events-none transform scale-100 transition-all duration-300">
        
        <div ref={eyeRef} className="flex items-center justify-center">
          <svg width="64" height="64" viewBox="0 0 32 32" fill="none">
            <path 
              d="M3 16C6 9.5 10.5 7 16 7C21.5 7 26 9.5 29 16C26 22.5 21.5 25 16 25C10.5 25 6 22.5 3 16Z" 
              fill="#cbd5e1"
              opacity="0.5"
            />
            <path 
              d="M3 16C6 9.5 10.5 7 16 7C21.5 7 26 9.5 29 16C26 22.5 21.5 25 16 25C10.5 25 6 22.5 3 16Z" 
              stroke="#334155" 
              strokeWidth="2.4" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
            <g ref={pupilRef} className="will-change-transform">
              <circle cx="16" cy="16" r="5" fill="#ffffff" stroke="#334155" strokeWidth="2.4" />
            </g>
          </svg>
        </div>

        <div className="space-y-2 text-center">
          <p className="text-3xl font-bold text-slate-800 tracking-tight">
            Імпорт документів
          </p>
          <p className="text-md font-medium tracking-normal text-slate-600 ">
            Відпустіть для початку
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}