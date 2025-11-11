import '@/styles/components/Associated.css';
import type { ReactNode } from 'react';

export default function Associated({
    children,
    ...props
}: {
    children?: ReactNode;
    [key: string]: any;
}) {
    return (
        <div className="associated" {...props}>
            {children}
        </div>
    );
}
