import { ReactNode } from 'react';
import MUIButton from '@mui/material/Button';
import { SxProps, Theme } from '@mui/material/styles';

interface ButtonProps {
  onClick: () => void;
  children: ReactNode;
}

const buttonSx: SxProps<Theme> = {
  backgroundColor: 'red',
  color: '#fff',
  borderRadius: '50px',
  textTransform: 'none',
  fontWeight: 500,
};

export default function Button({ onClick, children }: ButtonProps) {
  return (
    <MUIButton 
    variant="contained"  
    sx={buttonSx}
    onClick={onClick}>
      {children}
    </MUIButton>
  );
}