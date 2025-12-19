import '@/styles/components/Section.css';
import type { ReactNode } from 'react';

export default function Section({
    children,
    className = '',
    sectionName,
    ...props
}: {
    children?: ReactNode;
    className?: string;
    sectionName: string;
    [key: string]: any;
}) {
    return (
        <div className={`section ${className}`} {...props}>
            <p className="section-name">{sectionName}</p>
            <div className="section-parts">{children}</div>
        </div>
    );
}
