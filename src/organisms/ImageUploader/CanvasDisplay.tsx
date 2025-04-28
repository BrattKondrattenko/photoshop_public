import { useEffect, useRef, CSSProperties } from 'react';

interface CanvasDisplayProps {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

const CanvasDisplaySx: CSSProperties = {
    maxWidth: '80vw',
    maxHeight: '70vh',
    width: 'auto',
    height: 'auto',
    display: 'block',
    margin: '16px auto',
    border: '1px solid #fff',
};

export default function CanvasDisplay({ data, width, height }: CanvasDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const expectedLen = width * height * 4;
    if (data.length !== expectedLen) {
      return;
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    canvasRef.current.width = width;
    canvasRef.current.height = height;
    const image = new ImageData(data, width, height);
    ctx.putImageData(image, 0, 0);
  }, [data, width, height]);

  return <canvas ref={canvasRef} style={CanvasDisplaySx} />;
}