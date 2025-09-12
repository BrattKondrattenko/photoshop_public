import {useRef, CSSProperties, useState, useEffect} from 'react';
import UploadControl from '../../molecules/UploadControl/UploadControl';
import useGrayBitParser from '../../hooks/useGrayBitParser';
import CanvasDisplay from './CanvasDisplay';
import ImageInfo from '../../molecules/ImageInfo/ImageInfo';
import { Box } from '@mui/material';
import ScaleSettingsDialog from '../ScaleSettingsDialog.tsx'
import Button from "../../atoms/Button/Button.tsx";

const imageUploaderButtonStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
}

type InterpolationMethod = 'nearest' | 'bilinear';
type ScaleMode = 'percentage' | 'pixels';

export default function ImageUploader() {
  const fileRef = useRef<HTMLInputElement>(null!);
  const [{ width, height, depth }, data, handleFile] = useGrayBitParser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [scaleMode, setScaleMode] = useState<ScaleMode>('percentage');
  const [widthValue, setWidthValue] = useState(0);
  const [heightValue, setHeightValue] = useState(0);
  const [interpolationMethod, setInterpolationMethod] = useState<InterpolationMethod>('bilinear');

  useEffect(() => {
    if (width > 0 && height > 0) {
      setScaleMode('percentage');
      setWidthValue(0);
      setHeightValue(0);
      setInterpolationMethod('bilinear');
    }
  }, [width, height]);

  const handleScaleConfirm = (mode: ScaleMode, wValue: number, hValue: number, method: string) => {
        setScaleMode(mode);
        setWidthValue(wValue);
        setHeightValue(hValue);
        setInterpolationMethod(method as InterpolationMethod);
        setIsDialogOpen(false);
  };

  return (
    <Box>
      <Box style={imageUploaderButtonStyle}>
        <UploadControl fileRef={fileRef} onFile={() => handleFile(fileRef.current!)}/>
          {data && <Button onClick={() => setIsDialogOpen(true)}>Настройки масштаба</Button>}
      </Box>
       <Box sx={{ maxWidth: '80vw', maxHeight: '70vh', overflow: 'auto', margin: '16px auto' }}>
            {data && <CanvasDisplay 
                data={data} 
                width={width} 
                height={height} 
                scaleMode={scaleMode}
                widthValue={widthValue}
                heightValue={heightValue}
                interpolationMethod={interpolationMethod}
            />}
        </Box>
      {data && (
        <ImageInfo 
          width={width} 
          height={height} 
          depth={depth} 
          scaleMode={scaleMode} 
          widthValue={widthValue} 
          heightValue={heightValue} 
        />
      )}
      <ScaleSettingsDialog
          key={`${width}-${height}`}
          isOpen={isDialogOpen}
          onCancel={() => setIsDialogOpen(false)}
          onApply={handleScaleConfirm}
          initialAlgorithm={interpolationMethod}
          width={width}
          height={height}
      />
    </Box>
  );
}