import { useState, useEffect } from 'react';
import bunLogo from './bun.png';
import denoLogo from './deno.png';

export default function BunDenoCompare() {
  const [rows, setRows] = useState([
    { id: 1, criteria: '', bunPoints: 0, denoPoints: 0 }
  ]);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setAnimate(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [animate]);

  const addRow = () => {
    setRows([...rows, { 
      id: Date.now(), 
      criteria: '', 
      bunPoints: 0, 
      denoPoints: 0 
    }]);
  };

  const updateCriteria = (id: number, value: string) => {
    setRows(rows.map(row => 
      row.id === id ? { ...row, criteria: value } : row
    ));
  };

  const togglePoint = (id: number, column: string) => {
    setRows(rows.map(row => {
      if (row.id === id) {
        const currentValue = column === 'bun' ? row.bunPoints : row.denoPoints;
        const newValue = currentValue === 1 ? 0 : 1;
        if (newValue === 1) setAnimate(true);
        return column === 'bun' 
          ? { ...row, bunPoints: newValue }
          : { ...row, denoPoints: newValue };
      }
      return row;
    }));
  };

  const totalBun = rows.reduce((sum, row) => sum + row.bunPoints, 0);
  const totalDeno = rows.reduce((sum, row) => sum + row.denoPoints, 0);

  const circles = Array.from({ length: 40 }, (_, i) => i);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#3a3731' }}>
      {/* Animated border circles */}
      <div className="absolute inset-0 pointer-events-none">
        {circles.map((i) => {
          const isTop = i < 10;
          const isRight = i >= 10 && i < 20;
          const isBottom = i >= 20 && i < 30;
          
          let style = {};
          if (isTop) {
            style = { top: '10px', left: `${(i % 10) * 10 + 5}%` };
          } else if (isRight) {
            style = { right: '10px', top: `${((i - 10) % 10) * 10 + 5}%` };
          } else if (isBottom) {
            style = { bottom: '10px', left: `${(29 - i) * 10 + 5}%` };
          } else {
            style = { left: '10px', top: `${(39 - i) * 10 + 5}%` };
          }

          const shouldBlink = animate && i % 2 === 0;
          const shouldBlinkAlt = animate && i % 2 === 1;

          return (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                ...style,
                backgroundColor: 'white',
                opacity: shouldBlink ? 1 : shouldBlinkAlt ? 0.3 : 0.1,
                transition: 'opacity 0.15s ease-in-out',
                animation: animate ? (i % 2 === 0 ? 'blink1 0.3s infinite' : 'blink2 0.3s infinite') : 'none'
              }}
            />
          );
        })}
      </div>

      <style>{`
        @keyframes blink1 {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.1; }
        }
        @keyframes blink2 {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 1; }
        }
      `}</style>

      <div className="max-w-4xl mx-auto p-8 relative z-10">
        <div className="mb-6" style={{ backgroundColor: '#3a3731' }}>
          {/* Header row with logos */}
          <div className="grid gap-0 mb-0" style={{ gridTemplateColumns: '1fr auto auto' }}>
            <div className="p-6"></div>
            <div className="px-3 py-6 flex items-center justify-center" style={{ width: '100px', minWidth: '100px' }}>
              <img 
                src={bunLogo}
                alt="Bun"
                className="w-16 h-16 object-contain"
              />
            </div>
            <div className="px-3 py-6 flex items-center justify-center" style={{ width: '100px', minWidth: '100px' }}>
              <img 
                src={denoLogo} 
                alt="Deno"
                className="w-16 h-16 object-contain"
              />
            </div>
          </div>

          {/* Criteria rows */}
          {rows.map((row, index) => (
            <div 
              key={row.id} 
              className="grid gap-0"
              style={{ 
                gridTemplateColumns: '1fr auto auto',
                borderTop: '1px solid white',
                borderBottom: index === rows.length - 1 ? '1px solid white' : '0'
              }}
            >
              <div className="p-6 flex items-center" style={{ borderRight: '1px solid white' }}>
                <input
                  type="text"
                  value={row.criteria}
                  onChange={(e) => updateCriteria(row.id, e.target.value)}
                  placeholder=""
                  className="w-full bg-transparent text-white text-2xl outline-none font-bold"
                  style={{ fontFamily: '"Helvetica Neue", Helvetica, system-ui, sans-serif' }}
                />
              </div>
              <div 
                className="px-8 py-6 flex items-center justify-center cursor-pointer hover:bg-white hover:bg-opacity-5"
                style={{ borderRight: '1px solid white', width: '100px', minWidth: '100px' }}
                onClick={() => togglePoint(row.id, 'bun')}
              >
                <span className="text-4xl leading-none flex items-center justify-center h-10">
                  {row.bunPoints === 1 ? '🥟' : ''}
                </span>
              </div>
              <div 
                className="px-8 py-6 flex items-center justify-center cursor-pointer hover:bg-white hover:bg-opacity-5"
                style={{ width: '100px', minWidth: '100px' }}
                onClick={() => togglePoint(row.id, 'deno')}
              >
                <span className="text-4xl leading-none flex items-center justify-center h-10">
                  {row.denoPoints === 1 ? '🦕' : ''}
                </span>
              </div>
            </div>
          ))}

          {/* Total row */}
          <div 
            className="grid gap-0 mt-0 cursor-pointer hover:bg-white hover:bg-opacity-5"
            style={{ gridTemplateColumns: '1fr auto auto' }}
            onClick={addRow}
          >
            <div className="p-6"></div>
            <div className="px-8 py-6 flex items-center justify-center text-white text-3xl font-bold" style={{ fontFamily: '"Helvetica Neue", Helvetica, system-ui, sans-serif', width: '100px', minWidth: '100px' }}>
              {totalBun}
            </div>
            <div className="px-8 py-6 flex items-center justify-center text-white text-3xl font-bold" style={{ fontFamily: '"Helvetica Neue", Helvetica, system-ui, sans-serif', width: '100px', minWidth: '100px' }}>
              {totalDeno}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}