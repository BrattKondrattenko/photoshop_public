import { useState, useEffect } from 'react';
import { computeScaledDimensions } from '../utils/scale';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    Button,
    Box,
    InputLabel,
    FormControl,
    Typography,
    FormControlLabel,
    Checkbox,
    Tooltip,
} from '@mui/material';

type ScaleMode = 'percentage' | 'pixels';

const algorithmDescriptions = {
    bilinear: {
        title: 'Билинейная интерполяция',
        description: 'Создает плавные переходы между пикселями, используя взвешенное среднее четырех соседних пикселей. Идеально подходит для фотографий и изображений с плавными градиентами.',
        advantages: [
            'Плавные переходы без пикселизации',
            'Лучшее качество для фотографий',
            'Естественный вид при увеличении',
            'Хорошо подходит для изображений с градиентами'
        ]
    },
    nearest: {
        title: 'Метод ближайшего соседа',
        description: 'Копирует значение ближайшего пикселя без интерполяции. Сохраняет четкие границы и пиксельную структуру изображения.',
        advantages: [
            'Сохраняет четкие границы',
            'Быстрая обработка',
            'Идеально для пиксельной графики',
            'Подходит для изображений с резкими переходами'
        ]
    }
};

interface ScaleSettingsDialogProps {
    isOpen: boolean;
    onCancel: () => void;
    onApply: (scaleMode: ScaleMode, widthValue: number, heightValue: number, method: string) => void;
    initialAlgorithm: string;
    width: number;
    height: number;
}

export default function ScaleSettingsDialog({
                                                isOpen,
                                                onCancel,
                                                onApply,
                                                initialAlgorithm,
                                                width,
                                                height,
                                            }: ScaleSettingsDialogProps) {
    const [scaleMode, setScaleMode] = useState<ScaleMode>('percentage');
    const [widthValue, setWidthValue] = useState(0);
    const [heightValue, setHeightValue] = useState(0);
    const [algorithm, setAlgorithm] = useState(initialAlgorithm);
    const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);

    useEffect(() => {
        setScaleMode('percentage');
        setWidthValue(0);
        setHeightValue(0);
        setAlgorithm(initialAlgorithm);
        setMaintainAspectRatio(true);
    }, [width, height, initialAlgorithm]);

    const originalPixels = width * height;
    const aspectRatio = width / height;
    
    const { scaledWidth, scaledHeight } = computeScaledDimensions(
        width,
        height,
        scaleMode,
        widthValue,
        heightValue
    );
    
    const scaledPixels = scaledWidth * scaledHeight;
    
    const originalMegapixels = (originalPixels / 1000000).toFixed(2);
    const scaledMegapixels = (scaledPixels / 1000000).toFixed(2);

    useEffect(() => {
        if (scaleMode === 'percentage') {
            setWidthValue(prev => prev === 0 ? 0 : Math.round((prev / width) * 100));
            setHeightValue(prev => prev === 0 ? 0 : Math.round((prev / height) * 100));
        } else {
            setWidthValue(prev => prev === 0 ? 0 : Math.round((width * prev) / 100));
            setHeightValue(prev => prev === 0 ? 0 : Math.round((height * prev) / 100));
        }
    }, [scaleMode, width, height]);

    const validatePercentage = (value: number) => {
        if (value === 0) return 0;
        return Math.max(12, Math.min(300, value));
    };

    const validatePixels = (value: number) => {
        if (value === 0) return 0;
        return Math.max(1, Math.min(10000, value));
    };

    const handleWidthChange = (value: string) => {
        const numValue = parseFloat(value) || 0;
        setWidthValue(numValue);
        
        if (maintainAspectRatio && numValue > 0) {
            if (scaleMode === 'percentage') {
                setHeightValue(numValue);
            } else {
                const calculatedHeight = numValue / aspectRatio;
                setHeightValue(calculatedHeight);
            }
        }
    };

    const handleHeightChange = (value: string) => {
        const numValue = parseFloat(value) || 0;
        setHeightValue(numValue);
        
        if (maintainAspectRatio && numValue > 0) {
            if (scaleMode === 'percentage') {
                setWidthValue(numValue);
            } else {
                const calculatedWidth = numValue * aspectRatio;
                setWidthValue(calculatedWidth);
            }
        }
    };

    const handleWidthBlur = () => {
        let validatedWidth: number;
        if (scaleMode === 'percentage') {
            validatedWidth = validatePercentage(widthValue);
        } else {
            validatedWidth = validatePixels(widthValue);
        }
        setWidthValue(validatedWidth);
        
        if (maintainAspectRatio && validatedWidth > 0) {
            if (scaleMode === 'percentage') {
                setHeightValue(validatedWidth);
            } else {
                const calculatedHeight = validatedWidth / aspectRatio;
                setHeightValue(calculatedHeight);
            }
        }
    };

    const handleHeightBlur = () => {
        let validatedHeight: number;
        if (scaleMode === 'percentage') {
            validatedHeight = validatePercentage(heightValue);
        } else {
            validatedHeight = validatePixels(heightValue);
        }
        setHeightValue(validatedHeight);
        
        if (maintainAspectRatio && validatedHeight > 0) {
            if (scaleMode === 'percentage') {
                setWidthValue(validatedHeight);
            } else {
                const calculatedWidth = validatedHeight * aspectRatio;
                setWidthValue(calculatedWidth);
            }
        }
    };

    const handleApply = () => {
        onApply(scaleMode, widthValue, heightValue, algorithm);
        onCancel();
    };

    return (
        <Dialog open={isOpen} onClose={onCancel} maxWidth="xs" fullWidth disableScrollLock>
            <DialogTitle>Параметры изображения</DialogTitle>

            <DialogContent>
                <Box display="flex" flexDirection="column" gap={3} mt={1}>
                    <FormControl fullWidth>
                        <InputLabel id="scale-mode-label">Режим масштабирования</InputLabel>
                        <Select
                            labelId="scale-mode-label"
                            value={scaleMode}
                            label="Режим масштабирования"
                            onChange={(e) => setScaleMode(e.target.value as ScaleMode)}
                        >
                            <MenuItem value="percentage">Проценты</MenuItem>
                            <MenuItem value="pixels">Пиксели</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={maintainAspectRatio}
                                onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                            />
                        }
                        label="Сохранить пропорции изображения"
                    />

                    <Box display="flex" gap={2}>
                        <TextField
                            label={`Ширина (${scaleMode === 'percentage' ? '%' : 'px'})`}
                            type="number"
                            inputProps={{ 
                                min: scaleMode === 'percentage' ? 12 : 1, 
                                max: scaleMode === 'percentage' ? 300 : 10000, 
                                step: 1 
                            }}
                            value={widthValue}
                            onChange={(e) => handleWidthChange(e.target.value)}
                            onBlur={handleWidthBlur}
                            fullWidth
                        />
                        <TextField
                            label={`Высота (${scaleMode === 'percentage' ? '%' : 'px'})`}
                            type="number"
                            inputProps={{ 
                                min: scaleMode === 'percentage' ? 12 : 1, 
                                max: scaleMode === 'percentage' ? 300 : 10000, 
                                step: 1 
                            }}
                            value={heightValue}
                            onChange={(e) => handleHeightChange(e.target.value)}
                            onBlur={handleHeightBlur}
                            disabled={maintainAspectRatio}
                            fullWidth
                        />
                    </Box>

                    <FormControl fullWidth>
                        <InputLabel id="algorithm-label">Алгоритм</InputLabel>
                        <Tooltip
                            title={
                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        {algorithmDescriptions[algorithm as keyof typeof algorithmDescriptions].title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        {algorithmDescriptions[algorithm as keyof typeof algorithmDescriptions].description}
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                        Преимущества:
                                    </Typography>
                                    {algorithmDescriptions[algorithm as keyof typeof algorithmDescriptions].advantages.map((advantage, index) => (
                                        <Typography key={index} variant="body2" sx={{ ml: 1 }}>
                                            • {advantage}
                                        </Typography>
                                    ))}
                                </Box>
                            }
                            placement="top"
                            arrow
                            enterDelay={500}
                            leaveDelay={200}
                        >
                            <Select
                                labelId="algorithm-label"
                                value={algorithm}
                                label="Алгоритм"
                                onChange={(e) => setAlgorithm(e.target.value)}
                            >
                                <MenuItem value="bilinear">Билинейная интерполяция</MenuItem>
                                <MenuItem value="nearest">Метод ближайшего соседа</MenuItem>
                            </Select>
                        </Tooltip>
                    </FormControl>

                    <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Информация о пикселях:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Исходное изображение: {originalMegapixels} МП ({width} × {height})
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            После масштабирования: {scaledMegapixels} МП ({scaledWidth} × {scaledHeight})
                        </Typography>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={onCancel} color="inherit">
                    Отмена
                </Button>
                <Button onClick={handleApply} variant="contained" color="primary">
                    Применить
                </Button>
            </DialogActions>
        </Dialog>
    );
}
