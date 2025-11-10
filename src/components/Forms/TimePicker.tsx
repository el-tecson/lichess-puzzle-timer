import '@/styles/components/Forms/TimePicker.css';
import { useState } from "react";
import {
    Dialog,
    DialogPanel,
    DialogBackdrop,
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
} from "@headlessui/react";
import type { TimePickerProps } from '@/types/components';

export default function TimePicker({
    initialState,
    configName,
    label,
    storageFunction,
    ...props
}: TimePickerProps) {
    const [open, setOpen] = useState(false);

    const [hInit = "00", mInit = "00", sInit = "00"]: string[] =
        initialState.split(":");

    const [hour, setHour] = useState(hInit);
    const [minute, setMinute] = useState(mInit);
    const [second, setSecond] = useState(sInit);

    const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
    const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
    const seconds = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

    const handleChange = async ({
        hour,
        minute,
        second,
    }: {
        hour: string;
        minute: string;
        second: string;
    }) => {
        setHour(hour);
        setMinute(minute);
        setSecond(second);
        await storageFunction(configName, `${hour}:${minute}:${second}`);
    };

    return (
        <div className="time-picker-root number" {...props}>
            <button
                className="time-picker-trigger"
                onClick={() => setOpen(true)}
            >
                {hour}:{minute}:{second}
            </button>

            <Dialog open={open} onClose={() => setOpen(false)} className="duration-dialog">
                <DialogBackdrop className="duration-backdrop" />

                <DialogPanel className="duration-panel noselect">
                    <p className="duration-panel-name">
                        {label}
                    </p>
                    <div className="time-picker-dialog-inner number">

                        {/* HOURS */}
                        <div className="listbox-wrapper">
                            <Listbox
                                value={hour}
                                onChange={(hour) =>
                                    handleChange({ hour, minute, second })
                                }
                            >
                                <ListboxButton className="listbox-button">{hour}</ListboxButton>
                                <ListboxOptions className="listbox-options">
                                    {hours.map((h) => (
                                        <ListboxOption className="listbox-option" key={h} value={h}>
                                            {h}
                                        </ListboxOption>
                                    ))}
                                </ListboxOptions>
                            </Listbox>
                        </div>

                        <span className="separator">:</span>

                        {/* MINUTES */}
                        <div className="listbox-wrapper">
                            <Listbox
                                value={minute}
                                onChange={(minute) =>
                                    handleChange({ hour, minute, second })
                                }
                            >
                                <ListboxButton className="listbox-button">{minute}</ListboxButton>
                                <ListboxOptions className="listbox-options">
                                    {minutes.map((m) => (
                                        <ListboxOption className="listbox-option" key={m} value={m}>
                                            {m}
                                        </ListboxOption>
                                    ))}
                                </ListboxOptions>
                            </Listbox>
                        </div>

                        <span className="separator">:</span>

                        {/* SECONDS */}
                        <div className="listbox-wrapper">
                            <Listbox
                                value={second}
                                onChange={(second) =>
                                    handleChange({ hour, minute, second })
                                }
                            >
                                <ListboxButton className="listbox-button">{second}</ListboxButton>
                                <ListboxOptions className="listbox-options">
                                    {seconds.map((s) => (
                                        <ListboxOption className="listbox-option" key={s} value={s}>
                                            {s}
                                        </ListboxOption>
                                    ))}
                                </ListboxOptions>
                            </Listbox>
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </div>
    );
}
