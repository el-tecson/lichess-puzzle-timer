import '@/styles/components/Templates/slider.css';
import { Slider as CustomSlider } from '@/components/Forms';
import type { SliderProps } from '@/types/templates';

export default function Slider({ 
    className = '', 
    children, 
    label = '',
    ...props 
}: SliderProps) {
    return (
        <div className={`slider-container noselect ${className}`}>
            <p className="slider-label input-text">{label}</p>
            <CustomSlider {...props} />
            {children}
        </div>
    );
}