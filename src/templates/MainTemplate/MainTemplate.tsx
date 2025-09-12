import { Container, Box, Typography } from '@mui/material';
import ImageUploader from '../../organisms/ImageUploader/ImageUploader';

export default function MainTemplate() {
  return (
    <Container maxWidth="md" className='wrapper'>
      <Box my={4}>
        <Typography textAlign={'center'} variant="h4" gutterBottom>
          Загрузка и просмотр изображения
        </Typography>
        <ImageUploader/>
      </Box>
    </Container>
  );
}


