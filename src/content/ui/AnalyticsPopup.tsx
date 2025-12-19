import { useRef, useState, useEffect } from "react";
import Draggable from "react-draggable";
import getConfig from "@/utils/Settings/getConfig";
import { CONFIG, DEFAULT_POSITION } from "@/constants";
import getAnalytics from "@/utils/Analytics/getAnalytics";
import Section from "@/components/Section";
import type { AnalyticsData } from "@/types/analytics";
import SmallLogo from "@/assets/lptimer-logo.svg?react";

export default function AnalyticsPopup() {
    const nodeRef = useRef<HTMLDivElement>(null);

    // Track whether the mouse actually moved
    const clickRef = useRef(true);
    // const click = (fn: Function) => {
    //     if (clickRef.current) fn();
    // };

    const [settings, setSettings] = useState<Record<string, any> | null>(null);
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

    useEffect(() => {
        (async () => {
            const newAnalyticsData = await getAnalytics();
            setAnalyticsData(newAnalyticsData);
        })();

        const handleChange = async (msg: Record<string, any>) => {
            if (msg.action === "analyticsUpdated") {
                const newAnalyticsData = await getAnalytics();
                setAnalyticsData(newAnalyticsData);
            }
        }

        chrome.runtime.onMessage.addListener(handleChange);
        return () => chrome.runtime.onMessage.removeListener(handleChange);
    }, []);

    useEffect(() => {
        (async () => {
            const config = await getConfig();
            setSettings(config);
        })();

        const handleChange = (
            changes: Record<string, chrome.storage.StorageChange>,
            areaName: string,
        ) => {
            if (areaName === 'local' && changes[CONFIG]) {
                setSettings(changes[CONFIG]?.newValue);
            }
        };

        chrome.storage.onChanged.addListener(handleChange);
        return () => chrome.storage.onChanged.removeListener(handleChange);
    }, []);

    if (!settings || !analyticsData) return null;
    if (!settings.preferencesSettings.showAnalyticsPopup) return null;

    return (
        <Draggable
            defaultPosition={DEFAULT_POSITION}
            nodeRef={nodeRef}
            onStart={() => {
                clickRef.current = true; // assume a click initially
            }}
            onDrag={() => {
                clickRef.current = false; // dragging happened
            }}
        >
            <div ref={nodeRef} className="popup analytics-popup">
                <Section
                    svg={<SmallLogo height="24" width="24" className="analytics-logo" />}
                    sectionName="LPT Stats"
                    className="analytics"
                >
                    <p className="stats">
                        Total Puzzles: <span className="user-data">{analyticsData.totalPuzzles}</span>
                    </p>
                    <p className="stats">
                        Accuracy: <span className="user-data">
                            %{
                                analyticsData.solved === 0
                                    ? "0.00"
                                    : ((analyticsData.solved! / analyticsData.totalPuzzles!) * 100).toFixed(2)
                            }
                        </span>
                    </p>
                    <p className="stats">
                        Solved: <span className="user-data">{analyticsData.solved}</span>
                    </p>
                    <p className="stats">
                        Unsolved: <span className="user-data">{analyticsData.unsolved}</span>
                    </p>
                </Section>
            </div>
        </Draggable>
    );
}