import React, { useState, useRef, useCallback } from 'react';
import { useStore } from '@/store';

import TimelineToolbar from './TimelineToolbar';
import TrackList from './TrackList';
import Ruler from './Ruler';
import TrackRow from './TrackRow';
import KeyframeEditPortal from './KeyframeEditPortal';

import Playhead from './Playhead';
import { useTimelinePlayback } from '@/hooks/useTimelinePlayback';
import { useTimelineRecorder } from '@/hooks/useTimelineRecorder';

/**
 * 动画时间轴组件
 * @returns 
 */
const AnimationTimeline: React.FC = () => {
    const objects = useStore(state => state.objects);
    const activeTimelineObjectId = useStore(state => state.activeTimelineObjectId);
    const activeTimelineAnimationId = useStore(state => state.activeTimelineAnimationId);
    const setState = useStore(state => state.setState);
    const updateObject = useStore(state => state.updateObject);

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [editingKey, setEditingKey] = useState<{ trackIndex: number; keyIndex: number; rect: DOMRect; } | null>(null);
    const rulerRef = useRef<HTMLDivElement>(null);

    const targetObject = objects.find(o => o.id === activeTimelineObjectId);
    const targetAnim = targetObject?.customAnimations?.find(a => a.id === activeTimelineAnimationId);
    const duration = targetAnim?.duration || 5;

    useTimelinePlayback(targetAnim);
    const { recordCurrentState } = useTimelineRecorder(targetObject, targetAnim);

    const handleScrub = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        const rect = rulerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
        setState({ timelineCurrentTime: (x / rect.width) * duration });
    }, [duration, setState]);

    if (!activeTimelineAnimationId || !targetAnim || !targetObject) {
        return (
            <div className="h-10 bg-[#1a1a1a] border-t border-white/10 flex items-center justify-center text-[10px] text-gray-500 italic">
                选中对象并在右侧开启时间轴编辑
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-transparent overflow-hidden">
            <TimelineToolbar
                isCollapsed={isCollapsed}
                onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
                onRecord={recordCurrentState}
            />

            {!isCollapsed && (
                <div className="flex-1 flex overflow-hidden">
                    <TrackList />

                    <div className="flex-1 flex flex-col overflow-hidden relative">
                        <Ruler
                            ref={rulerRef}
                            duration={duration}
                            onClick={handleScrub}
                            onMouseMove={(e) => e.buttons === 1 && handleScrub(e)}
                        />

                        <div className="flex-1 overflow-y-auto custom-scrollbar relative bg-white/[0.005]">
                            {targetAnim.tracks?.map((track, tIdx) => (
                                <TrackRow
                                    key={track.id}
                                    track={track}
                                    trackIndex={tIdx}
                                    onKeyframeClick={(trackIndex, keyIndex, rect) => setEditingKey({ trackIndex, keyIndex, rect })}
                                />
                            ))}

                            <Playhead duration={duration} loopType={targetAnim.loopType} />
                        </div>
                    </div>
                </div>
            )}

            {editingKey !== null && targetAnim.tracks[editingKey.trackIndex]?.keyframes[editingKey.keyIndex] && (
                <KeyframeEditPortal
                    keyframe={targetAnim.tracks[editingKey.trackIndex].keyframes[editingKey.keyIndex]}
                    rect={editingKey.rect}
                    onClose={() => setEditingKey(null)}
                    onRemove={() => {
                        const tracks = [...targetAnim.tracks];
                        const track = { ...tracks[editingKey.trackIndex] };
                        track.keyframes = track.keyframes.filter((_, i) => i !== editingKey.keyIndex);
                        tracks[editingKey.trackIndex] = track;
                        updateObject(targetObject.id, {
                            customAnimations: targetObject.customAnimations?.map(a => a.id === targetAnim.id ? { ...a, tracks } : a)
                        });
                        setEditingKey(null);
                    }}
                    onUpdate={(updates) => {
                        const tracks = [...targetAnim.tracks];
                        const track = { ...tracks[editingKey.trackIndex] };
                        const keyframes = [...track.keyframes];
                        keyframes[editingKey.keyIndex] = { ...keyframes[editingKey.keyIndex], ...updates };
                        track.keyframes = keyframes;
                        tracks[editingKey.trackIndex] = track;
                        updateObject(targetObject.id, {
                            customAnimations: targetObject.customAnimations?.map(a => a.id === targetAnim.id ? { ...a, tracks } : a)
                        });
                    }}
                />
            )}
        </div>
    );
};

export default AnimationTimeline;
