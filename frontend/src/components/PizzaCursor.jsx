import { useEffect, useState } from 'react';
import pizzaCursor from '../assets/pizza-cursor.png';
import React from 'react';

const PizzaCursor = () => {
  const [pos, setPos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [mouseDown, setMouseDown] = useState(false);

  useEffect(() => {
    const handleMove = (e) => setPos({ x: e.clientX, y: e.clientY });
    const handleDown = () => setMouseDown(true);
    const handleUp = () => setMouseDown(false);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mousedown', handleDown);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
    };
  }, []);

  return (
    <div
      style={{
        width: 28,
        height: 28,
        pointerEvents: 'none',
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        zIndex: 9999,
        transform: `translate(-50%, -50%) scale(${mouseDown ? 0.85 : 1})`,
        transition: 'transform 0.1s',
        willChange: 'transform',
      }}
    >
      <img
        src={pizzaCursor}
        alt="Pizza Cursor"
        style={{ width: 28, height: 28, userSelect: 'none', pointerEvents: 'none' }}
        draggable={false}
      />
    </div>
  );
};

export default React.memo(PizzaCursor); 