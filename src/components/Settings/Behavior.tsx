import { Tab, TabPanel } from "@headlessui/react";
import ComputerIcon from '@/assets/computer.svg?react';

export function BehaviorTab() {
    return (
        <Tab className="tab">
            <ComputerIcon />
            <p className="tab-name">Behavior</p>
        </Tab>
    )
}

export function BehaviorPanel() {
    return (
        <TabPanel className="tab-panel">
            <p className="panel-name">Behavior</p>
            <div className="part">

            </div>
        </TabPanel>
    )
}