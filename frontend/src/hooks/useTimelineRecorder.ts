import { useCallback } from 'react';
import * as THREE from 'three';
import { useStore } from '@/store';
import { type Keyframe, type CustomAnimation, type SceneObject } from '@/types';
import { calculateVisualProgress } from '@/utils';

/**
 * 助手函数：从实时的 Three.js 场景对象中提取状态快照并生成关键帧
 * 捕获位置、旋转、缩放、可见性以及材质不透明度
 * 
 * @param {THREE.Object3D} node - Three.js 对象节点
 * @param {number} time - 该帧在时间轴上的物理时间点
 * @returns {Keyframe} - 提取的标准关键帧数据对象
 */
const createKeyframeFromObject = (node: THREE.Object3D, time: number): Keyframe => {
    const key: Keyframe = {
        time,
        position: [node.position.x, node.position.y, node.position.z],
        rotation: [node.rotation.x, node.rotation.y, node.rotation.z],
        scale: [node.scale.x, node.scale.y, node.scale.z],
        opacity: 1,
        visible: node.visible !== false,
        easing: 'linear'
    };

    // 递归查找材质属性并记录不透明度
    node.traverse((c: any) => {
        if (c.material) {
            const mat = Array.isArray(c.material) ? c.material[0] : c.material;
            key.opacity = mat.opacity;
        }
    });

    return key;
};

/**
 * 动画关键帧录制器 Hook
 * 负责将当前 3D 视口中物体的实时姿态“录制”到时间轴序列的指定时间点上
 * 
 * @param {SceneObject | undefined} targetObject - 正在编辑的主物体
 * @param {CustomAnimation | undefined} targetAnim - 当前活动的时间轴动画序列
 * @returns {Object} - 包含 recordCurrentState 手动触发录制的方法
 */
export const useTimelineRecorder = (
    targetObject: SceneObject | undefined,
    targetAnim: CustomAnimation | undefined
) => {
    const updateObject = useStore(state => state.updateObject);
    const selectedMeshId = useStore(state => state.selectedMeshId);
    const duration = targetAnim?.duration || 5;

    /**
     * 执行录像动作：捕获姿态并写入动画轨道
     */
    const recordCurrentState = useCallback(() => {
        const state = useStore.getState();
        const { scene, timelineCurrentTime: tTime } = state;
        if (!scene || !targetAnim || !targetObject) return;

        // 获取经过循环处理后的视觉进度百分比/时间点
        const visualProgress = calculateVisualProgress(tTime, duration, targetAnim.loopType);

        // 确定录制目标：是整个 SceneObject 还是其内部的特定 Mesh
        const targetNodeId = selectedMeshId || targetObject.id;
        const threeNode = scene.getObjectByProperty('uuid', targetNodeId);
        if (!threeNode) return;

        const newKey = createKeyframeFromObject(threeNode, visualProgress);

        const tracks = [...(targetAnim.tracks || [])];
        // 查找或新建针对特定子目标的轨道
        let trackIndex = tracks.findIndex(t => t.targetId === (selectedMeshId || undefined));

        if (trackIndex === -1) {
            tracks.push({
                id: Math.random().toString(36).substr(2, 9),
                targetId: selectedMeshId || undefined,
                keyframes: [newKey]
            });
        } else {
            const track = { ...tracks[trackIndex] };
            const existingKeys = [...track.keyframes];
            // 覆盖极短时间间隔内的关键帧，防止冗余
            const keyIdx = existingKeys.findIndex(k => Math.abs(k.time - visualProgress) < 0.005);
            if (keyIdx > -1) {
                existingKeys[keyIdx] = { ...existingKeys[keyIdx], ...newKey };
            } else {
                existingKeys.push(newKey);
                existingKeys.sort((a, b) => a.time - b.time);
            }
            track.keyframes = existingKeys;
            tracks[trackIndex] = track;
        }

        // 持久化到物体数据中
        updateObject(targetObject.id, {
            customAnimations: targetObject.customAnimations?.map(a => a.id === targetAnim.id ? { ...a, tracks } : a)
        });
    }, [selectedMeshId, targetObject, targetAnim, duration, updateObject]);

    return { recordCurrentState };
};
