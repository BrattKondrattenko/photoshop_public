import React, { ForwardedRef } from 'react';

interface CanvasElementProps extends React.CanvasHTMLAttributes<HTMLCanvasElement> {}

const CanvasElement = React.forwardRef(
  (props: CanvasElementProps, ref: ForwardedRef<HTMLCanvasElement>) => (
    <canvas ref={ref} className="canvas" {...props} />
  )
);
CanvasElement.displayName = 'CanvasElement';
export default CanvasElement;