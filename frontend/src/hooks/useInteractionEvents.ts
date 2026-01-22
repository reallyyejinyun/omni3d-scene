import { useCallback } from 'react';
import { type SceneObject, type ObjectEvent } from '@/types';

/**
 * 物体交互事件管理 Hook
 * 提供在属性面板中增、删、改物体点击事件（OnClick）的便捷方法
 * 
 * @param {SceneObject} object - 当前操作的物体对象
 * @param {Function} onUpdate - 物体属性更新回调函数
 * @param {string | null | undefined} selectedMeshId - 当前选中的 GLTF 子网格 ID（用于标记触发源）
 * @returns {Object} - 包含 addEvent, removeEvent, updateEvent 操作函数
 */
export const useInteractionEvents = (
    object: SceneObject,
    onUpdate: (updates: Partial<SceneObject>) => void,
    selectedMeshId: string | null | undefined
) => {
    /**
     * 为物体新增一个点击交互动作
     */
    const addEvent = useCallback(() => {
        const newEvent: ObjectEvent = {
            id: Math.random().toString(36).substr(2, 9),
            action: 'PLAY_ANIMATION',
            targetId: object.id,
            sourceMeshId: selectedMeshId,
            value: ''
        };
        onUpdate({
            events: {
                ...object.events,
                onClick: [...(object.events?.onClick || []), newEvent]
            }
        });
    }, [object.id, object.events, selectedMeshId, onUpdate]);

    /**
     * 根据 ID 移除指定的交互动作
     * @param {string} id - 动作 ID
     */
    const removeEvent = useCallback((id: string) => {
        onUpdate({
            events: {
                ...object.events,
                onClick: (object.events?.onClick || []).filter(e => e.id !== id)
            }
        });
    }, [object.events, onUpdate]);

    /**
     * 更新指定交互动作的具体参数
     * @param {string} id - 动作 ID
     * @param {Partial<ObjectEvent>} updates - 变更的参数集
     */
    const updateEvent = useCallback((id: string, updates: Partial<ObjectEvent>) => {
        onUpdate({
            events: {
                ...object.events,
                onClick: (object.events?.onClick || []).map(e => e.id === id ? { ...e, ...updates } : e)
            }
        });
    }, [object.events, onUpdate]);

    return { addEvent, removeEvent, updateEvent };
};
