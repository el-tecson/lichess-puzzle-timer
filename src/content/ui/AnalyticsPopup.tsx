import { useRef, useState, useEffect } from 'react';
import getConfig from '@/utils/Settings/getConfig';
import { ANALYTICS_CONFIG, BASE_ANALYTICS, BASE_TIMER, CONFIG, DEFAULT_POSITION } from '@/constants';
import getAnalytics from '@/utils/Analytics/getAnalytics';
import Section from '@/components/Section';
import type { AnalyticsData } from '@/types/analytics';
import SmallLogo from '@/assets/lptimer-logo.svg?react';
import { Rnd } from 'react-rnd';

export default function AnalyticsPopup() {
    // Track whether the mouse actually moved
    const clickRef = useRef(true);
    // const click = (fn: Function) => {
    //     if (clickRef.current) fn();
    // };

    const [size, setSize] = useState(BASE_ANALYTICS);
    const [position, setPosition] = useState({
        x: DEFAULT_POSITION.x,
        y: DEFAULT_POSITION.y + BASE_TIMER.height + 20,
    });
    const [scale, setScale] = useState(1);

    const [settings, setSettings] = useState<Record<string, any> | null>(null);
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

    useEffect(() => {
        (async () => {
            const analyticsConfig = await getAnalytics();
            setAnalyticsData(analyticsConfig);
        })();

        const handleChange = (
            changes: Record<string, chrome.storage.StorageChange>,
            areaName: string,
        ) => {
            if (areaName === 'local' && changes[ANALYTICS_CONFIG]) {
                setAnalyticsData(changes[ANALYTICS_CONFIG]?.newValue);
            }
        };

        chrome.storage.onChanged.addListener(handleChange);
        return () => chrome.storage.onChanged.removeListener(handleChange);
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
        <Rnd
            size={size}
            position={position}
            lockAspectRatio
            enableResizing={{
                bottomRight: true,
                topLeft: true,
                bottomLeft: true,
                topRight: true,
            }}
            onDragStop={(_, d) => {
                setPosition({ x: d.x, y: d.y });
                setTimeout(() => clickRef.current = true, 1);
            }}
            onResize={(_, __, ref, ___, pos) => {
                setSize({
                    width: ref.offsetWidth,
                    height: ref.offsetHeight,
                });
                setPosition(pos);
                const newScale = ref.offsetWidth / BASE_ANALYTICS.width;
                setScale(newScale);
                clickRef.current = true;
            }}
            onStart={() => { clickRef.current = true; }}
            onDrag={() => { clickRef.current = false; }}
            style={{
                background: 'var(--background-color)',
                borderRadius: '8px',
                boxShadow: 'var(--popup-shadow)',
                overflow: 'hidden',
                cursor: 'default',
            }}
        >
            <div 
                className="popup analytics-popup"
                style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
            >
                <Section
                    svg={
                        <SmallLogo height="24" width="24" className="analytics-logo" />
                    }
                    sectionName="LPT Stats"
                    className="analytics"
                >
                    <p className="stats">
                        Total Puzzles: <span className="user-data">
                            {analyticsData.totalPuzzles}
                        </span>
                    </p>
                    <p className="stats">
                        Accuracy: <span className="user-data">
                            %{
                                analyticsData.solved === 0
                                    ? '0.00'
                                    : (
                                        (analyticsData.solved! / analyticsData.totalPuzzles!)
                                        * 100)
                                        .toFixed(2)
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
        </Rnd>
    );
}
