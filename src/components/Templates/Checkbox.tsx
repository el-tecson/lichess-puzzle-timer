import { Checkbox as CustomCheckbox } from "@/components/Forms";

export default function Checkbox({
    className = '',
    text,
    configName,
    initialState,
    ...props
}: {
    className?: string;
    text: string;
    configName: string;
    initialState: boolean;
    [key: string]: any;
}) {
    return (
        <div
            className={`checkbox-container noselect ${className}`}
            {...props}
        >
            <CustomCheckbox
                initialState={initialState}
                configName={configName}
                text={text}
            />
        </div>
    )
}