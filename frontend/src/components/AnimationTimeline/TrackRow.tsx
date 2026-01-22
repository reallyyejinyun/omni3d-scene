import React from 'react';
import { type AnimationTrack } from '@/types';

interface TrackRowProps {
    track: AnimationTrack;
    trackIndex: number;
    onKeyframeClick: (trackIndex: number, keyIndex: number, rect: DOMRect) => void;
}
/**
 * 轨道行组件
 * @param param0 
 * @returns 
 */
const TrackRow: React.FC<TrackRowProps> = ({
    track,
    trackIndex,
    onKeyframeClick
}) => {
    return (
        <div className="h-12 relative w-full border-b border-white/5 group/track">
            {track.keyframes.map((key, kIdx) => (
                <div
                    key={kIdx}
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-blue-500 rotate-45 border border-white/30 shadow-lg cursor-pointer hover:scale-125 transition-all z-20"
                    style={{ left: `${key.time * 100}%` }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onKeyframeClick(trackIndex, kIdx, e.currentTarget.getBoundingClientRect());
                    }}
                />
            ))}
        </div>
    );
};

export default React.memo(TrackRow);
