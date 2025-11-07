import '@/styles/components/Section.css';
import type { ReactNode } from 'react';

export default function Section({
    children,
    sectionName,
    ...props
}: {
    children?: ReactNode;
    sectionName: string;
    [key: string]: any;
}) {
    return (
        <div className="section" {...props}>
            <p className="section-name">
                {sectionName}
            </p>
            <div className="section-parts">
                {children}
            </div>
        </div>
    )
}