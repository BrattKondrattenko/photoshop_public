import StatusBar from '../../atoms/StatusBar/StatusBar';
import { computeScaledDimensions } from '../../utils/scale';

type ScaleMode = 'percentage' | 'pixels';

interface ImageInfoProps {
  width: number;
  height: number;
  depth: number;
  scaleMode: ScaleMode;
  widthValue: number;
  heightValue: number;
}
export default function ImageInfo({ width, height, depth, scaleMode, widthValue, heightValue }: ImageInfoProps) {
  const { scaledWidth, scaledHeight } = computeScaledDimensions(
    width,
    height,
    scaleMode,
    widthValue,
    heightValue
  );

  return (
    <StatusBar 
      originalWidth={width} 
      originalHeight={height} 
      scaledWidth={scaledWidth} 
      scaledHeight={scaledHeight} 
      depth={depth} 
    />
  );
}