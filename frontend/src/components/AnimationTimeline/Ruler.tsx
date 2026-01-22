import React, { forwardRef } from 'react';

interface RulerProps {
    duration: number;
    onClick: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;
}

/**
 * 刻度尺组件
 * @param param0 
 * @returns 
 */
const Ruler = forwardRef<HTMLDivElement, RulerProps>(({
    duration,
    onClick,
    onMouseMove
}, ref) => {
    return (
        <div
            ref={ref}
            className="h-8 border-b border-white/5 bg-white/[0.01] relative cursor-pointer"
            onClick={onClick}
            onMouseMove={onMouseMove}
        >
            {Array.from({ length: Math.ceil(duration) + 1 }).map((_, i) => (
                <div
                    key={i}
                    className="absolute h-4 border-l border-white/10 flex items-start pl-1"
                    style={{ left: `${(i / duration) * 100}%` }}
                >
                    <span className="text-[8px] text-gray-500">{i}s</span>
                </div>
            ))}
        </div>
    );
});

Ruler.displayName = 'Ruler';

export default React.memo(Ruler);
