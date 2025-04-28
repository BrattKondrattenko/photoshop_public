import { useRef, CSSProperties } from 'react';
import UploadControl from '../../molecules/UploadControl/UploadControl';
import useGrayBitParser from '../../hooks/useGrayBitParser';
import CanvasDisplay from './CanvasDisplay';
import ImageInfo from '../../molecules/ImageInfo/ImageInfo';
import { Box } from '@mui/material';

const imageUploaderButtonStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}

export default function ImageUploader() {
  const fileRef = useRef<HTMLInputElement>(null!);
  const [{ width, height, depth }, data, handleFile] = useGrayBitParser();

  return (
    <Box>
      <Box style={imageUploaderButtonStyle}>
        <UploadControl fileRef={fileRef} onFile={() => handleFile(fileRef.current!)} />      
      </Box>
      {data && <CanvasDisplay data={data} width={width} height={height} />}
      {data && <ImageInfo width={width} height={height} depth={depth} />}
    </Box>
  );
}