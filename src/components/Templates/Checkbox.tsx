import '@/styles/components/Templates/Checkbox.css';
import { Checkbox as CustomCheckbox } from "@/components/Forms";
import type { CheckboxProps } from '@/types/templates';

export default function Checkbox({
    className = '',
    children,
    ...props
}: CheckboxProps) {
    return (
        <div
            className={`checkbox-container noselect ${className}`}
        >
            <CustomCheckbox
                {...props}
            />
            {children}
        </div>
    )
}