export async function parsePngHeader(file: File): Promise<{
    width: number;
    height: number;
    bitDepth: number;
    colorType: number;
  }> {
    const buffer = await file.arrayBuffer();
    const view = new DataView(buffer);
  
    // Проверяем сигнатуру PNG (8 байт)
    for (let i = 0; i < 8; i++) {
      if (view.getUint8(i) !== [0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A][i]) {
        throw new Error('Не PNG-файл');
      }
    }
  
    const ihdrOffset = 8 /*sig*/ + 4 /*len*/ + 4 /*"IHDR"*/;
    const width  = view.getUint32(ihdrOffset + 0);
    const height = view.getUint32(ihdrOffset + 4);
    const bitDepth  = view.getUint8(ihdrOffset + 8);
    const colorType = view.getUint8(ihdrOffset + 9);
  
    return { width, height, bitDepth, colorType };
  }