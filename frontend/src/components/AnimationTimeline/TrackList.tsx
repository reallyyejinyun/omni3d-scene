import React, { useCallback } from 'react';
import { Layers, Trash2 } from 'lucide-react';
import { useStore } from '@/store';
import { findNodeInTree, findObjectRecursive } from '@/store/utils';

/**
 * 轨道列表组件
 */
const TrackList: React.FC = () => {
    // 分别订阅所需的属性，避免因返回新对象导致的无限重绘
    const objects = useStore(state => state.objects);
    const activeTimelineObjectId = useStore(state => state.activeTimelineObjectId);
    const activeTimelineAnimationId = useStore(state => state.activeTimelineAnimationId);
    const selectedMeshId = useStore(state => state.selectedMeshId);
    const updateObject = useStore(state => state.updateObject);

    const targetObject = objects.find(o => o.id === activeTimelineObjectId);
    const targetAnim = targetObject?.customAnimations?.find(a => a.id === activeTimelineAnimationId);

    const handleRemoveTrack = useCallback((trackId: string) => {
        if (!targetAnim || !targetObject) return;
        const newTracks = targetAnim.tracks.filter(t => t.id !== trackId);
        updateObject(targetObject.id, {
            customAnimations: targetObject.customAnimations?.map(a => a.id === targetAnim.id ? { ...a, tracks: newTracks } : a)
        });
    }, [targetAnim, targetObject, updateObject]);

    if (!targetAnim || !targetObject) return null;

    return (
        <div className="w-56 border-r border-white/5 bg-black/20 flex flex-col overflow-y-auto custom-scrollbar">
            <div className="h-8 flex items-center px-4 bg-white/[0.01] border-b border-white/5">
                <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">轨道列表</span>
            </div>
            {targetAnim.tracks?.map((track) => (
                <div
                    key={track.id}
                    className={`h-12 flex items-center px-4 gap-3 border-b border-white/5 ${selectedMeshId === track.targetId || (!selectedMeshId && !track.targetId)
                        ? 'bg-blue-500/10'
                        : ''
                        }`}
                >
                    <div className="p-1.5 bg-blue-500/10 rounded text-blue-400">
                        <Layers size={14} />
                    </div>
                    <div className="flex flex-col truncate">
                        <span className="text-[10px] font-bold text-white/90 truncate">
                            {track.targetId ? (
                                targetObject.structure ? findNodeInTree(targetObject.structure, track.targetId)?.name : '组件轨道'
                            ) : '整体轨道'}
                        </span>
                        <span className="text-[8px] text-gray-500 uppercase">{track.keyframes.length} 关键帧</span>
                    </div>
                    <button
                        onClick={() => handleRemoveTrack(track.id)}
                        className="ml-auto p-1 text-gray-600 hover:text-red-400 transition-colors"
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default React.memo(TrackList);
