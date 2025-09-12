import {CSSProperties, ReactNode} from 'react';
import MUIButton from '@mui/material/Button';
import { SxProps, Theme } from '@mui/material/styles';

interface ButtonProps {
  onClick: () => void;
  styles?: CSSProperties;
  children: ReactNode;
}


export default function Button({ onClick, styles, children }: ButtonProps) {
  return (
    <MUIButton 
    variant="contained"
    style={styles}
    onClick={onClick}>
      {children}
    </MUIButton>
  );
}