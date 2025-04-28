export interface ParserMeta {
    width: number;
    height: number;
    depth: number;
    imageData: Uint8ClampedArray;
  }

  export default function parseGrayBit(buffer: Uint8Array): ParserMeta {
    const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  
    if (
      view.getUint8(0) !== 0x47 ||
      view.getUint8(1) !== 0x42 ||
      view.getUint8(2) !== 0x37 ||
      view.getUint8(3) !== 0x1D
    ) {
      throw new Error('Invalid GrayBit-7 signature');
    }
  
    const flag   = view.getUint8(5);
    const hasMask= (flag & 1) === 1;
    const width  = (view.getUint8(6) << 8) | view.getUint8(7);
    const height = (view.getUint8(8) << 8) | view.getUint8(9);
    const offset = 12;
  
    const imageData = new Uint8ClampedArray(width * height * 4);
    for (let i = 0; i < width * height; i++) {
      const byte = view.getUint8(offset + i);
      const gray7 = byte & 0b01111111;
      const gray8 = Math.floor((gray7 / 127) * 255);
      const alpha = hasMask
        ? ((byte & 0b10000000) ? 255 : 0)
        : 255;
      const idx = i * 4;
      imageData[idx]     = gray8;
      imageData[idx + 1] = gray8;
      imageData[idx + 2] = gray8;
      imageData[idx + 3] = alpha;
    }
  
    const depth = hasMask ? 8 : 7;
    return { width, height, depth, imageData };
  }
  