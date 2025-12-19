import '@/styles/components/Section.css';
import type { ReactNode } from 'react';

export default function Section({
    children,
    className = '',
    sectionName,
    svg = null,
    ...props
}: {
    children?: ReactNode;
    className?: string;
    sectionName: string;
    svg?: ReactNode | null;
    [key: string]: any;
}) {
    return (
        <div className={`section ${className}`} {...props}>
            <p className="section-name">{svg && svg}{sectionName}</p>
            <div className="section-parts">{children}</div>
        </div>
    );
}
