import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useStore } from '@/store';
import * as THREE from 'three';
import { type SceneObject, type CustomAnimation } from '@/types';
import { findActiveAnimations, findObjectRecursive } from '@/utils';

const lerp = (a: number, b: number, alpha: number) => a + (b - a) * alpha;

/**
 * 辅助函数：重置状态
 */
const resetToStaticState = (node: THREE.Object3D, obj: SceneObject) => {
    // 默认回退：从节点当前的 userData 或传入的 obj 根部查找
    let targetData: { position?: number[], rotation?: number[], scale?: number[] } = obj;

    // 如果该节点是子节点 (ID 不等于模型根 ID)，则去结构树里搜它的初始静态值
    if (node.uuid !== obj.id && obj.structure) {
        const findInTree = (n: any, id: string): any => {
            if (n.id === id) return n;
            for (const c of (n.children || [])) {
                const found = findInTree(c, id);
                if (found) return found;
            }
            return null;
        };
        const subData = findInTree(obj.structure, node.uuid);
        if (subData) targetData = subData;
    }

    const pos = targetData.position || [0, 0, 0];
    const rot = targetData.rotation || [0, 0, 0];
    const sca = targetData.scale || [1, 1, 1];

    node.position.set(pos[0], pos[1], pos[2]);
    node.rotation.set(rot[0], rot[1], rot[2]);
    node.scale.set(sca[0], sca[1], sca[2]);
    node.visible = (targetData as any).visible !== false;

    const opacity = (targetData as any).material?.opacity ?? 1;
    node.traverse(c => {
        if ((c as any).material) {
            const mats = Array.isArray((c as any).material) ? (c as any).material : [(c as any).material];
            mats.forEach((mat: any) => { mat.opacity = opacity; mat.transparent = opacity < 1; });
        }
    });
};

/**
 * 核心逻辑：应用单路轨道插值状态
 */
const applySnapshotAnimation = (node: THREE.Object3D, anim: CustomAnimation, track: { keyframes: any[] }, time: number) => {
    const { duration, loopType, easing: defaultEasing } = anim;
    const { keyframes } = track;
    if (duration <= 0 || !keyframes?.length) return;

    let t = time / duration;
    if (loopType === 'loop') {
        t %= 1;
    } else if (loopType === 'pingpong') {
        const cycle = Math.floor(t);
        const p = t % 1;
        t = (cycle % 2 === 0) ? p : (1 - p);
    } else {
        t = Math.min(Math.max(t, 0), 1);
    }

    let prev = keyframes[0], next = keyframes[0];
    for (let i = 0; i < keyframes.length; i++) {
        if (keyframes[i].time <= t) prev = keyframes[i];
        if (keyframes[i].time >= t) { next = keyframes[i]; break; }
    }

    const alpha = (() => {
        if (next.time === prev.time) return 0;
        const ease = next.easing || defaultEasing || 'linear';
        const raw = (t - prev.time) / (next.time - prev.time);
        switch (ease) {
            case 'easeIn': return raw * raw;
            case 'easeOut': return raw * (2 - raw);
            case 'easeInOut': return raw < 0.5 ? 2 * raw * raw : -1 + (4 - 2 * raw) * raw;
            case 'step': return raw >= 0.99 ? 1 : 0;
            default: return raw;
        }
    })();

    if (prev.position && next.position) node.position.set(
        lerp(prev.position[0], next.position[0], alpha),
        lerp(prev.position[1], next.position[1], alpha),
        lerp(prev.position[2], next.position[2], alpha)
    );
    if (prev.rotation && next.rotation) node.rotation.set(
        lerp(prev.rotation[0], next.rotation[0], alpha),
        lerp(prev.rotation[1], next.rotation[1], alpha),
        lerp(prev.rotation[2], next.rotation[2], alpha)
    );
    if (prev.scale && next.scale) node.scale.set(
        lerp(prev.scale[0], next.scale[0], alpha),
        lerp(prev.scale[1], next.scale[1], alpha),
        lerp(prev.scale[2], next.scale[2], alpha)
    );
    if (prev.opacity !== undefined && next.opacity !== undefined) {
        const op = lerp(prev.opacity, next.opacity, alpha);
        node.traverse(c => {
            if ((c as any).material) {
                const mats = Array.isArray((c as any).material) ? (c as any).material : [(c as any).material];
                mats.forEach((mat: any) => { mat.opacity = op; mat.transparent = op < 1; });
            }
        });
    }
    if (prev.visible !== undefined && next.visible !== undefined) node.visible = alpha < 0.5 ? prev.visible : next.visible;
};

/**
 * 编辑模式管理器：仅受动画帧编辑面板控制
 */
const EditSequenceManager: React.FC = () => {
    const objects = useStore(state => state.objects);
    const activeTimelineObjectId = useStore(state => state.activeTimelineObjectId);
    const activeTimelineAnimationId = useStore(state => state.activeTimelineAnimationId);
    const timelineCurrentTime = useStore(state => state.timelineCurrentTime);
    const isTimelinePlaying = useStore(state => state.isTimelinePlaying);
    const isTransforming = useStore(state => state.isTransforming);
    const selectedId = useStore(state => state.selectedId);

    const lastActiveIds = useRef<Set<string>>(new Set());
    const lastTimelineState = useRef({ time: -1, objId: '', animId: '' });

    const activeTimelineAnimator = useMemo(() => {
        if (!activeTimelineObjectId || !activeTimelineAnimationId) return null;

        const obj = findObjectRecursive(objects, activeTimelineObjectId);
        if (!obj) return null;

        const anim = (obj.customAnimations || []).find(a => a.id === activeTimelineAnimationId);
        if (!anim) return null;

        return { obj, anim };
    }, [objects, activeTimelineObjectId, activeTimelineAnimationId]);

    useFrame((state) => {
        if (!activeTimelineAnimator && lastActiveIds.current.size === 0) return;

        const currentActiveIds = new Set<string>();
        const nodeCache = new Map<string, THREE.Object3D>();

        // 判定时间轴是否发生了“变动”
        const timelineTimeChanged = Math.abs(timelineCurrentTime - lastTimelineState.current.time) > 0.0001;
        const timelineTargetChanged = activeTimelineObjectId !== lastTimelineState.current.objId || activeTimelineAnimationId !== lastTimelineState.current.animId;
        const shouldUpdateTimeline = isTimelinePlaying || timelineTimeChanged || timelineTargetChanged;

        if (activeTimelineAnimator) {
            const { obj, anim } = activeTimelineAnimator;

            // 手动变换时跳过
            if (isTransforming && selectedId === obj.id) {
                currentActiveIds.add(obj.id);
            } else {
                if (shouldUpdateTimeline) {
                    anim.tracks?.forEach(track => {
                        const targetNodeId = track.targetId || obj.id;
                        let node = nodeCache.get(targetNodeId);
                        if (!node) {
                            node = state.scene.getObjectByProperty('uuid', targetNodeId);
                            if (node) nodeCache.set(targetNodeId, node);
                        }
                        if (node) {
                            currentActiveIds.add(targetNodeId);
                            applySnapshotAnimation(node, anim, track, timelineCurrentTime);
                        }
                    });
                }
            }
        }

        // 清理逻辑
        // 清理逻辑：需要反查对应的模型对象
        lastActiveIds.current.forEach(id => {
            if (!currentActiveIds.has(id)) {
                const node = state.scene.getObjectByProperty('uuid', id);
                // 这里可能需要全量查找，优化：我们从 activeTimelineAnimator 拿
                if (node && activeTimelineAnimator) {
                    resetToStaticState(node, activeTimelineAnimator.obj);
                }
            }
        });

        lastActiveIds.current = currentActiveIds;
        lastTimelineState.current = {
            time: timelineCurrentTime,
            objId: activeTimelineObjectId || '',
            animId: activeTimelineAnimationId || ''
        };
    });

    return null;
};

/**
 * 预览模式管理器：仅关心 autoplay 和 activeCustomAnimationId
 */
const PreviewSequenceManager: React.FC = () => {
    const objects = useStore(state => state.objects);
    const lastActiveIds = useRef<Set<string>>(new Set());
    const startTimes = useRef<Map<string, number>>(new Map());

    const activeAnimators = useMemo(() => {
        return findActiveAnimations(objects);
    }, [objects]);

    useFrame((state) => {
        if (activeAnimators.length === 0 && lastActiveIds.current.size === 0) return;

        const elapsed = state.clock.getElapsedTime();
        const currentActiveIds = new Set<string>();
        const nodeCache = new Map<string, THREE.Object3D>();

        activeAnimators.forEach(({ obj, anim }) => {
            anim.tracks?.forEach(track => {
                const targetNodeId = track.targetId || obj.id;
                let node = nodeCache.get(targetNodeId);
                if (!node) {
                    node = state.scene.getObjectByProperty('uuid', targetNodeId);
                    if (node) nodeCache.set(targetNodeId, node);
                }

                if (node) {
                    currentActiveIds.add(targetNodeId);
                    let trackUniqId = `${anim.id}-${targetNodeId}`;
                    let st = startTimes.current.get(trackUniqId);
                    if (st === undefined) {
                        st = elapsed;
                        startTimes.current.set(trackUniqId, st);
                    }
                    applySnapshotAnimation(node, anim, track, elapsed - st);
                }
            });
        });

        // 清理逻辑
        lastActiveIds.current.forEach(id => {
            if (!currentActiveIds.has(id)) {
                const node = state.scene.getObjectByProperty('uuid', id);
                // 预览模式需要找到拥有该动画的对象
                const parentObj = activeAnimators.find(a => a.anim.tracks.some(t => (t.targetId || a.obj.id) === id))?.obj;
                if (node && parentObj) resetToStaticState(node, parentObj);
                startTimes.current.delete(id);
            }
        });

        lastActiveIds.current = currentActiveIds;
    });

    return null;
};

/**
 * 视觉序列管理器：执行全量状态快照插值动画
 * 中间层：根据 preview 模式切换不同的执行策略
 */
const SequenceManager: React.FC<{ isPreview?: boolean }> = ({ isPreview = false }) => {
    if (isPreview) {
        return <PreviewSequenceManager />;
    }
    return <EditSequenceManager />;
};

export default SequenceManager;
