import Button from '../../atoms/Button/Button';
import InputFile from '../../atoms/InputFile/InputFile'
import {RefObject} from 'react';
 
interface UploadControlProps {
  fileRef: RefObject<HTMLInputElement>;
  onFile: () => void;
}

const acceptExtensions = '.png,.jpg,.jpeg,.gb7';

export default function UploadControl({ fileRef, onFile }: UploadControlProps) {
  return (
    <>
      <InputFile
        innerRef={fileRef}
        accept={acceptExtensions}
        onChange={() => onFile()}
      />
      <Button onClick={() => fileRef.current?.click()}>Загрузить изображение</Button>
    </>
  );
}