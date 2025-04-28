import { ChangeEvent, RefObject, CSSProperties} from 'react';

interface InputFileProps {
  accept: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  innerRef: RefObject<HTMLInputElement>;
}

const InputFileStyle: CSSProperties = {
  display: 'none'
}

export default function InputFile({ accept, onChange, innerRef }: InputFileProps) {
  return (
    <input
      type="file"
      style={InputFileStyle}
      hidden
      accept={accept}
      ref={innerRef}
      onChange={onChange}
    />
  );
}
