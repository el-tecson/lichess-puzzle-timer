import '@/styles/components/Templates/Checkbox.css';
import { Switch as CustomSwitch } from '@/components/Forms';
import type { SwitchProps } from '@/types/templates';

export default function Switch({ className = '', children, ...props }: SwitchProps) {
    return (
        <div className={`switch-container noselect ${className}`}>
            <CustomSwitch {...props} />
            {children}
        </div>
    );
}
