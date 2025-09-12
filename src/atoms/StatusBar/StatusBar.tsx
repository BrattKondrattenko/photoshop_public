import { Box, Typography } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

interface StatusBarProps {
  originalWidth: number;
  originalHeight: number;
  scaledWidth: number;
  scaledHeight: number;
  depth: number;
}

const containerStyleSx: SxProps<Theme> = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px',
    backgroundColor: 'var(--status-bg)',
    borderTop: '1px solid var(--border-color)',
  }

  const item =  {
    fontSize: '0.875rem',
  }

export default function StatusBar({ originalWidth, originalHeight, scaledWidth, scaledHeight, depth }: StatusBarProps) {
  return (
    <Box sx={containerStyleSx}>
      <Typography sx={item}>Original: {originalWidth}×{originalHeight}px</Typography>
      <Typography sx={item}>Scaled: {scaledWidth}×{scaledHeight}px</Typography>
      <Typography sx={item}>Depth: {depth}-bit</Typography>
    </Box>
  );
}