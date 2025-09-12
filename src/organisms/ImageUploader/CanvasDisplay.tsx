import {useEffect, useRef, CSSProperties} from 'react';
import { computeScaledDimensions } from '../../utils/scale';

type InterpolationMethod = 'bilinear' | 'nearest';
type ScaleMode = 'percentage' | 'pixels';

interface CanvasDisplayProps {
    data: Uint8ClampedArray;
    width: number;
    height: number;
    scaleMode: ScaleMode;
    widthValue: number;
    heightValue: number;
    interpolationMethod?: InterpolationMethod;
}

const CanvasDisplaySx: CSSProperties = {
    width: 'auto',
    height: 'auto',
    display: 'block',
    margin: '16px auto',
    border: '1px solid #fff',
    backgroundColor: '#f0f0f0',
};

export default function CanvasDisplay({
                                          data,
                                          width,
                                          height,
                                          scaleMode,
                                          widthValue,
                                          heightValue,
                                          interpolationMethod = 'bilinear',
                                      }: CanvasDisplayProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const tempCanvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));

    useEffect(() => {
        if (!canvasRef.current) return;

        const expectedLen = width * height * 4;
        if (data.length !== expectedLen) {
            return;
        }

        const ctx = canvasRef.current.getContext('2d');
        const tempCtx = tempCanvasRef.current.getContext('2d');
        if (!ctx || !tempCtx) return;

        tempCanvasRef.current.width = width;
        tempCanvasRef.current.height = height;

        const image = new ImageData(data, width, height);
        tempCtx.putImageData(image, 0, 0);

        const { scaledWidth, scaledHeight } = computeScaledDimensions(
            width,
            height,
            scaleMode,
            widthValue,
            heightValue
        );
        
        canvasRef.current.width = scaledWidth;
        canvasRef.current.height = scaledHeight;

        ctx.imageSmoothingEnabled = interpolationMethod === 'bilinear';
        ctx.imageSmoothingQuality = 'high';

        ctx.clearRect(0, 0, scaledWidth, scaledHeight);
        ctx.drawImage(
            tempCanvasRef.current,
            0, 0, width, height,
            0, 0, scaledWidth, scaledHeight
        );
    }, [data, width, height, scaleMode, widthValue, heightValue, interpolationMethod]);

    return <canvas ref={canvasRef} style={CanvasDisplaySx} aria-label="Просмотр изображения"/>;
}
