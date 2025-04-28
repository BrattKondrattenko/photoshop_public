import { useState, useCallback } from 'react';
import { parsePngHeader } from '../utils/parsePngHeader';
import parseGrayBit from '../utils/parseGrayBit';

interface Meta {
  width: number;
  height: number;
  depth: number;
}

type ParserResult = [
  Meta,
  Uint8ClampedArray | null,
  (file: HTMLInputElement) => Promise<void>
];


export default function useGrayBitParser(): ParserResult {
  const [meta, setMeta] = useState<Meta>({ width: 0, height: 0, depth: 0 });
  const [data, setData] = useState<Uint8ClampedArray | null>(null);

  const loadImageData = useCallback(
    (file: File, depth: number, overrideWidth?: number, overrideHeight?: number) => {
      const img = new Image();
      img.onload = () => {
        const width = overrideWidth ?? img.width;
        const height = overrideHeight ?? img.height;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        const pixelData = ctx.getImageData(0, 0, width, height).data;

        setMeta({ width, height, depth });
        setData(new Uint8ClampedArray(pixelData));
      };
      img.src = URL.createObjectURL(file);
    },
    []
  );

  const handleFile = useCallback(async (fileInput: HTMLInputElement) => {
    const file = fileInput.files?.[0];
    if (!file) return;
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension === 'gb7') {
      const buf = new Uint8Array(await file.arrayBuffer());
      const { width, height, depth, imageData } = parseGrayBit(buf);
      setMeta({ width, height, depth });
      setData(imageData);
    } else if (extension === 'png') {
      const { width, height, bitDepth, colorType } = await parsePngHeader(file);
      const hasAlpha = colorType === 6 || colorType === 4;
      const depth = bitDepth * (hasAlpha ? 4 : 3);
      loadImageData(file, depth, width, height);
    }
    else {
      loadImageData(file, 24);
    }
  }, [loadImageData]);

  return [meta, data, handleFile];
}
