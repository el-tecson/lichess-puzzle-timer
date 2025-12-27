import "@/styles/components/Forms/slider.css";
import type { SliderProps } from "@/types/components";
import { useState } from "react";
import { Range } from "react-range";

export default function Slider({
    className = '',
    initialState,
    configName,
    step = 0.1,
    min = 0,
    max = 100,
    storageFunction,
    ...props
}: SliderProps) {
    const [value, setValue] = useState(initialState);

    const handleChange = async (values: number[]) => {
        const newValue = values[0]; // single-thumb slider
        if (newValue) {
            setValue(newValue);
            await storageFunction(configName, newValue);
        }
    };

    return (
        <Range
            step={step}
            min={min}
            max={max}
            values={[value]}
            onChange={handleChange}
            renderTrack={({ props, children }) => {
                const percent = ((value - 0) / (100 - 0)) * 100; // % filled
                
                return (
                    <div {...props} className={`track ${className}`}>
                        {/* Filled portion */}
                        <div
                            className="filled-track"
                            style={{
                                position: 'absolute',
                                height: '100%',
                                width: `${percent}%`,
                                left: 0,
                                top: 0,
                            }}
                        />
                        {children}
                    </div>
                );
            }}
            renderThumb={({ props }) => (
                <div {...props} key={props.key} className={`thumb ${className}`} />
            )}
        />
    )
}