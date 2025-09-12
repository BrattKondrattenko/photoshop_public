import {useState, useCallback} from 'react';
import {parsePngHeader} from '../utils/parsePngHeader';
import parseGrayBit from '../utils/parseGrayBit';
import {nearestNeighbor, bilinearInterpolation} from '../utils/resizeAlgorithms';

interface Meta {
    width: number;
    height: number;
    depth: number;
}

type InterpolationMethod = 'nearest' | 'bilinear';

type ParserResult = [
    Meta,
        Uint8ClampedArray | null,
    (fileInput: HTMLInputElement) => Promise<void>,
    (method: InterpolationMethod) => void
];

export default function useGrayBitParser(): ParserResult {
    const [meta, setMeta] = useState<Meta>({width: 0, height: 0, depth: 0});
    const [data, setData] = useState<Uint8ClampedArray | null>(null);
    const [interpolationMethod, setInterpolationMethod] =
        useState<InterpolationMethod>('bilinear');

    const resizeImage = useCallback(
        (
            original: Uint8ClampedArray,
            srcWidth: number,
            srcHeight: number,
            dstWidth: number,
            dstHeight: number
        ): Uint8ClampedArray => {
            if (dstWidth === srcWidth && dstHeight === srcHeight) return original;
            return interpolationMethod === 'nearest'
                ? nearestNeighbor(original, srcWidth, srcHeight, dstWidth, dstHeight)
                : bilinearInterpolation(original, srcWidth, srcHeight, dstWidth, dstHeight);
        },
        [interpolationMethod]
    );

    const loadImageData = useCallback(
        (file: File, depth: number, overrideWidth?: number, overrideHeight?: number) => {
            const url = URL.createObjectURL(file);
            const img = new Image();

            img.onload = () => {
                try {
                    const srcWidth = overrideWidth ?? img.width;
                    const srcHeight = overrideHeight ?? img.height;

                    const canvas = document.createElement('canvas');
                    canvas.width = srcWidth;
                    canvas.height = srcHeight;
                    const ctx = canvas.getContext('2d')!;
                    ctx.drawImage(img, 0, 0);

                    const original = ctx.getImageData(0, 0, srcWidth, srcHeight).data;

                    setMeta({width: srcWidth, height: srcHeight, depth});
                    setData(new Uint8ClampedArray(original));
                } finally {
                    URL.revokeObjectURL(url);
                }
            };

            img.onerror = () => {
                URL.revokeObjectURL(url);
            };

            img.src = url;
        },
        [resizeImage]
    );

    const handleFile = useCallback(
        async (fileInput: HTMLInputElement) => {
            const file = fileInput.files?.[0];
            if (!file) return;

            const extension = file.name.split('.').pop()?.toLowerCase();

            if (extension === 'gb7') {
                const buf = new Uint8Array(await file.arrayBuffer());
                const {width, height, depth, imageData} = parseGrayBit(buf);

                setMeta({width, height, depth});
                setData(imageData);
            } else if (extension === 'png') {
                const {width, height, bitDepth, colorType} = await parsePngHeader(file);
                const hasAlpha = colorType === 6 || colorType === 4;
                const depth = bitDepth * (hasAlpha ? 4 : 3);

                loadImageData(file, depth, width, height);
            } else {
                loadImageData(file, 24);
            }
        },
        [loadImageData]
    );

    const setInterpolation = useCallback(
        (method: InterpolationMethod) => {
            setInterpolationMethod(method);
        },
        []
    );

    return [meta, data, handleFile, setInterpolation];
}
