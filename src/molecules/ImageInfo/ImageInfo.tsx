import StatusBar from '../../atoms/StatusBar/StatusBar';

interface ImageInfoProps {
  width: number;
  height: number;
  depth: number;
}
export default function ImageInfo({ width, height, depth }: ImageInfoProps) {
  return <StatusBar width={width} height={height} depth={depth} />;
}