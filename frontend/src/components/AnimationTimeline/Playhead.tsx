import React from 'react';
import { useStore } from '@/store';
import { calculateVisualProgress } from '@/utils';

interface PlayheadProps {
    duration: number;
    loopType?: string;
}
/**
 * 播放头组件
 * @param param0 
 * @returns 
 */
const Playhead: React.FC<PlayheadProps> = ({ duration, loopType }) => {
    const currentTime = useStore(state => state.timelineCurrentTime);
    const progress = React.useMemo(() => calculateVisualProgress(currentTime, duration, loopType), [currentTime, duration, loopType]);

    return (
        <div
            className="absolute top-0 bottom-0 w-[1px] bg-red-500 z-10 pointer-events-none transition-none"
            style={{ left: `${progress * 100}%` }}
        >
            <div className="absolute -top-1 -left-1.5 w-3 h-3 bg-red-500 rotate-45 rounded-sm border border-white/20" />
        </div>
    );
};

export default React.memo(Playhead);
