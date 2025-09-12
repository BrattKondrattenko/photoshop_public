export function computeScaledDimensions(
  width: number,
  height: number,
  scaleMode: 'percentage' | 'pixels',
  widthValue: number,
  heightValue: number
): { scaledWidth: number; scaledHeight: number } {
  let scaledWidth: number;
  let scaledHeight: number;

  if (widthValue === 0 || heightValue === 0) {
    scaledWidth = width;
    scaledHeight = height;
  } else if (scaleMode === 'percentage') {
    scaledWidth = Math.max(1, Math.round(width * (widthValue / 100)));
    scaledHeight = Math.max(1, Math.round(height * (heightValue / 100)));
  } else {
    scaledWidth = Math.max(1, Math.round(widthValue));
    scaledHeight = Math.max(1, Math.round(heightValue));
  }

  return { scaledWidth, scaledHeight };
}


