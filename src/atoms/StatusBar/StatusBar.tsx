import { Box, Typography } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

interface StatusBarProps {
  width: number;
  height: number;
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
    fontSIze: '0.875rem',
  }

export default function StatusBar({ width, height, depth }: StatusBarProps) {
  return (
    <Box sx={containerStyleSx}>
      <Typography sx={item}>Width: {width}px</Typography>
      <Typography sx={item}>Height: {height}px</Typography>
      <Typography sx={item}>Depth: {depth}-bit</Typography>
    </Box>
  );
}