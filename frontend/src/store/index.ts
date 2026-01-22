import { create } from 'zustand';
import {
    ObjectType, TransformMode,
    type SceneObject, type RoamingNode,
    type EditorState, type SceneConfig, type ObjectEvent,
    type LabelTemplate
} from '@/types';
import { DEFAULT_MODELS, DEFAULT_OBJECT_CONFIG, INITIAL_STATE, typeLabels } from '@/constants';
import * as THREE from 'three';
import { cloneNode, recordHistory, findAndRemoveObject, findObjectRecursive, revertObject, updateRecursive, findNodeInTree, recalculateRoamingTimes, refreshIds, duplicateNodeRecursive } from './utils';

/**
 * 编辑器核心操作接口定义
 */
export interface EditorActions {
    setObjects: (objects: SceneObject[]) => void;
    addObject: (type: ObjectType, url?: string) => void;
    updateObject: (id: string, updates: Partial<SceneObject>, meshId?: string | null) => void;
    setLoadStatus: (id: string, status: 'pending' | 'loading' | 'success' | 'error') => void;
    removeObject: (id: string, meshId?: string | null) => void;
    duplicateObject: (id: string, meshId?: string | null) => void;
    handleSelect: (id: string | null, meshId?: string | null) => void;
    addRoamingNode: (position: RoamingNode['position'], target: RoamingNode['target'], orbitControlTarget: RoamingNode['orbitControlTarget']) => void;
    removeRoamingNode: (id: string) => void;
    updateRoamingNode: (id: string, updates: Partial<RoamingNode>) => void;
    toggleRoaming: () => void;
    setRoamingIndex: (index: number) => void;
    setTransformMode: (mode: TransformMode) => void;
    updateSceneConfig: (updates: Partial<SceneConfig>) => void;
    setState: (state: Partial<EditorState>) => void;
    executeAction: (action: ObjectEvent) => void;
    undo: () => void;
    redo: () => void;
    addLabelTemplate: (template: LabelTemplate) => void;
    updateLabelTemplate: (id: string, updates: Partial<LabelTemplate>) => void;
    removeLabelTemplate: (id: string) => void;
    setCss3dLabelVisible: (visible: boolean) => void;
    setTemplateManagerVisible: (visible: boolean) => void;
    setModelSelectorVisible: (visible: boolean) => void;
    updateDataSourceValues: (sourceId: number, values: Record<string, any>) => void;
}

export type EditorStore = EditorState & EditorActions;

/**
 * 编辑器全局状态存储库
 */
export const useStore = create<EditorStore>((set, get) => ({
    ...INITIAL_STATE,

    /**
     * 重置物体列表
     */
    setObjects: (objects: SceneObject[]) => set({ objects }),

    /**
     * 更新全局状态，包含补丁逻辑（如动画时间轴状态还原）
     */
    setState: (newState: Partial<EditorState>) => set((state: EditorState) => {
        let timelineChanges: Partial<EditorState> = {};
        let currentObjects = state.objects;

        // 处理时间轴选定对象切换时的现场还原
        if (newState.activeTimelineObjectId !== undefined && newState.activeTimelineObjectId !== state.activeTimelineObjectId) {
            if (state.activeTimelineObjectId && state.timelineOriginalState) {
                currentObjects = revertObject(currentObjects, state.timelineOriginalState);
                timelineChanges.timelineOriginalState = null;
            }

            if (newState.activeTimelineObjectId) {
                const target = findObjectRecursive(currentObjects, newState.activeTimelineObjectId);
                if (target) {
                    let material = Array.isArray(target.material) ? target.material[0] : target.material;
                    if (material) {
                        timelineChanges.timelineOriginalState = {
                            id: target.id,
                            position: [...target.position],
                            rotation: [...target.rotation],
                            scale: [...target.scale],
                            opacity: material.opacity
                        }
                    };
                }
            }
        }

        // 时间轴退出时还原物体状态
        if (newState.timelineVisible === false && state.timelineVisible) {
            if (state.activeTimelineObjectId && state.timelineOriginalState) {
                currentObjects = revertObject(currentObjects, state.timelineOriginalState);
                timelineChanges.timelineOriginalState = null;
                timelineChanges.activeTimelineObjectId = null;
                timelineChanges.activeTimelineAnimationId = null;
            }
        }

        // 切换物体或动画时重置播放器
        const isSwitchingObject = newState.activeTimelineObjectId !== undefined && newState.activeTimelineObjectId !== state.activeTimelineObjectId;
        const isSwitchingAnimation = newState.activeTimelineAnimationId !== undefined && newState.activeTimelineAnimationId !== state.activeTimelineAnimationId;
        if (isSwitchingObject || isSwitchingAnimation) {
            timelineChanges.isTimelinePlaying = false;
            timelineChanges.timelineCurrentTime = 0;
        }

        return {
            ...state,
            ...newState,
            ...timelineChanges,
            objects: (newState.objects || currentObjects)
        };
    }),

    /**
     * 向场景添加新物体
     */
    addObject: (type: ObjectType, url?: string) => {
        const state = get();
        const historyUpdate = recordHistory(state);

        const id = THREE.MathUtils.generateUUID();
        const isLight = type.toString().startsWith('LIGHT_');
        const isPrimitive = ([
            ObjectType.BOX, ObjectType.SPHERE, ObjectType.CYLINDER,
            ObjectType.CONE, ObjectType.TORUS, ObjectType.PLANE
        ] as string[]).includes(type);

        const newObj: SceneObject = {
            id,
            name: `${typeLabels[type] || '未知对象'} ${state.objects.length + 1}`,
            type,
            ...DEFAULT_OBJECT_CONFIG,
            rotation: type === ObjectType.PLANE ? [-Math.PI / 2, 0, 0] : DEFAULT_OBJECT_CONFIG.rotation,
            visible: true,
            url: url,
            loadStatus: url ? 'loading' : undefined,
            intensity: isLight ? (type === ObjectType.LIGHT_DIR ? 1.5 : 2) : undefined,
            distance: isLight ? 0 : undefined,
            decay: isLight ? 2 : undefined,
            castShadow: isLight,
            label: type === ObjectType.LABEL ? '<div style="color:white; background:rgba(0,0,0,0.5); padding:5px; border-radius:4px;">新标签</div>' : undefined,
            material: (isPrimitive || type === ObjectType.SPRITE || isLight) ? DEFAULT_OBJECT_CONFIG.material : undefined
        };

        set({
            ...historyUpdate,
            objects: [...state.objects, newObj],
            selectedId: newObj.id,
            selectedMeshId: null
        });
    },

    /**
     * 更新物体及其子网格属性
     */
    updateObject: (id: string, updates: Partial<SceneObject>, meshId?: string | null) => {
        let updated = updates.updated === undefined ? true : updates.updated;
        console.log(updated, "updateObject");

        const state = get();
        const isEditingThis = state.activeTimelineObjectId === id;
        const historyUpdate = isEditingThis ? {} : recordHistory(state);
        set({
            ...historyUpdate,
            objects: updateRecursive(state.objects, id, { ...updates, updated }, meshId)
        });
    },

    /**
     * 更新资源加载状态
     */
    setLoadStatus: (id: string, status) => {
        const objects = get().objects;
        const obj = objects.find(o => o.id === id);
        if (obj && obj.loadStatus === status) return;

        set((state) => ({
            objects: state.objects.map((o) =>
                o.id === id ? { ...o, loadStatus: status } : o
            )
        }));
    },

    /**
     * 移除物体或 GLTF 内部组件
     */
    removeObject: (id: string, meshId?: string | null) => {
        const state = get();
        const historyUpdate = recordHistory(state);

        if (meshId) {
            set({
                ...historyUpdate,
                objects: updateRecursive(state.objects, id, { structure: undefined } as any, meshId), // 内部逻辑由 updateRecursive 处理
                selectedMeshId: state.selectedMeshId === meshId ? null : state.selectedMeshId
            });
        } else {
            const [newObjects] = findAndRemoveObject(state.objects, id);
            set({
                ...historyUpdate,
                objects: newObjects,
                selectedId: state.selectedId === id ? null : state.selectedId,
                selectedMeshId: state.selectedId === id ? null : state.selectedMeshId
            });
        }
    },

    /**
     * 复制物体或组件
     */
    duplicateObject: (id: string, meshId?: string | null) => {
        const state = get();
        const historyUpdate = recordHistory(state);
        const objToDuplicate = findObjectRecursive(state.objects, id);
        if (!objToDuplicate) return;

        if (meshId && objToDuplicate.structure) {
            set({
                ...historyUpdate,
                objects: duplicateNodeRecursive(state.objects, id, meshId)
            });
        } else {
            const newObj = JSON.parse(JSON.stringify(objToDuplicate)) as SceneObject;
            newObj.id = THREE.MathUtils.generateUUID();
            newObj.sourceObjectId = objToDuplicate.id;
            newObj.name = `${newObj.name} (副本)`;
            if (newObj.structure) {
                newObj.structure = cloneNode(newObj.structure);
            }
            refreshIds(newObj);
            set({
                ...historyUpdate,
                objects: [...state.objects, newObj],
                selectedId: newObj.id,
                selectedMeshId: null
            });
        }
    },

    /**
     * 切换选中对象
     */
    handleSelect: (id: string | null, meshIdStr: string | null = null) => {
        set({ selectedId: id, selectedMeshId: meshIdStr });
    },

    /**
     * 添加漫游航点
     */
    addRoamingNode: (position, target, orbitControlTarget) => {
        const state = get();
        const newNode: RoamingNode = {
            id: Math.random().toString(36).substr(2, 9),
            position,
            target,
            orbitControlTarget,
            duration: 1,
            speed: 1,
            travelTime: 0
        };
        const newNodes = [...state.roamingNodes, newNode];
        set({ roamingNodes: recalculateRoamingTimes(newNodes) });
    },

    /**
     * 移除漫游航点
     */
    removeRoamingNode: (id: string) => {
        const state = get();
        const newNodes = state.roamingNodes.filter((n: RoamingNode) => n.id !== id);
        set({ roamingNodes: recalculateRoamingTimes(newNodes) });
    },

    /**
     * 更新航点参数
     */
    updateRoamingNode: (id: string, updates: Partial<RoamingNode>) => {
        const state = get();
        const newNodes = state.roamingNodes.map((n: RoamingNode) => (n.id === id ? { ...n, ...updates } : n));
        set({ roamingNodes: recalculateRoamingTimes(newNodes) });
    },

    /**
     * 开启/关闭漫游模式
     */
    toggleRoaming: () => {
        const { roamingNodes, isRoaming } = get();
        if (roamingNodes.length < 2 && !isRoaming) {
            return;
        }

        const now = performance.now();
        if (!isRoaming) {
            const firstNodeTravelTime = roamingNodes[0]?.travelTime || 0;
            set({
                isRoaming: true,
                activeRoamingIndex: 0,
                activeRoamingStartTime: now - (firstNodeTravelTime * 1000)
            });
        } else {
            set({ isRoaming: false });
        }
    },

    /**
     * 设置当前处于激活状态的航点索引
     */
    setRoamingIndex: (index: number) => set({
        activeRoamingIndex: index,
        activeRoamingStartTime: performance.now()
    }),

    /**
     * 切换变换驱动器模式 (位移/旋转/缩放)
     */
    setTransformMode: (mode: TransformMode) => set({ transformMode: mode }),

    /**
     * 更新全局场景配置
     */
    updateSceneConfig: (updates: Partial<SceneConfig>) => {
        const state = get();
        const historyUpdate = recordHistory(state);
        set({
            ...historyUpdate,
            sceneConfig: { ...state.sceneConfig, ...updates }
        });
    },

    /**
     * 执行交互事件行为
     */
    executeAction: (event) => {
        const { action, targetId, targetMeshId, value } = event;
        const currentId = targetId || get().selectedId;
        if (!currentId) return;

        const { updateObject, objects } = get();
        const target = findObjectRecursive(objects, currentId);
        if (!target) return;

        switch (action) {
            case 'PLAY_ANIMATION':
                {
                    const isPlaying = target.activeAnimations?.includes(value);
                    updateObject(currentId, {
                        activeAnimations: isPlaying ? [] : (value ? [value] : [])
                    }, targetMeshId);
                }
                break;
            case 'PLAY_CUSTOM_ANIMATION':
                {
                    const isPlaying = target.activeCustomAnimationId === value;
                    updateObject(currentId, {
                        activeCustomAnimationId: isPlaying ? null : value,
                        activeCustomAnimationStartTime: isPlaying ? undefined : -1
                    }, targetMeshId);
                }
                break;
            case 'TOGGLE_VISIBLE':
                if (targetMeshId && target.structure) {
                    const node = findNodeInTree(target.structure, targetMeshId);
                    if (node) {
                        updateObject(currentId, { visible: !node.visible }, targetMeshId);
                    }
                } else {
                    updateObject(currentId, { visible: !target.visible });
                }
                break;
            case 'SET_PROPERTY':
                try {
                    const updates = typeof value === 'string' ? JSON.parse(value) : value;
                    updateObject(currentId, updates, targetMeshId);
                } catch (e) {
                    console.error('SET_PROPERTY parse error');
                }
                break;
        }
    },

    /**
     * 撤销操作：回退至上一个历史状态
     */
    undo: () => {
        const { past, future, objects, selectedId, selectedMeshId, sceneConfig } = get();
        if (past.length === 0) return;

        const previous = past[past.length - 1];
        const newPast = past.slice(0, past.length - 1);

        set({
            objects: previous.objects,
            selectedId: previous.selectedId,
            selectedMeshId: previous.selectedMeshId,
            sceneConfig: previous.sceneConfig,
            past: newPast,
            future: [{
                objects,
                selectedId,
                selectedMeshId,
                sceneConfig
            }, ...future]
        });
    },

    /**
     * 重做操作：恢复至撤销前的状态
     */
    redo: () => {
        const { past, future, objects, selectedId, selectedMeshId, sceneConfig } = get();
        if (future.length === 0) return;

        const next = future[0];
        const newFuture = future.slice(1);

        set({
            objects: next.objects,
            selectedId: next.selectedId,
            selectedMeshId: next.selectedMeshId,
            sceneConfig: next.sceneConfig,
            past: [...past, {
                objects,
                selectedId,
                selectedMeshId,
                sceneConfig
            }],
            future: newFuture
        });
    },

    /**
     * 标签模板管理方法
     */
    addLabelTemplate: (template) => set((state) => ({
        labelTemplates: [...state.labelTemplates, template]
    })),

    updateLabelTemplate: (id, updates) => set((state) => ({
        labelTemplates: state.labelTemplates.map(t => t.id === id ? { ...t, ...updates } : t)
    })),

    removeLabelTemplate: (id) => set((state) => ({
        labelTemplates: state.labelTemplates.filter(t => t.id !== id)
    })),

    setCss3dLabelVisible: (visible) => set({ css3dLabelVisible: visible }),
    setTemplateManagerVisible: (visible) => {
        set({ templateManagerVisible: visible })
        set({ css3dLabelVisible: !visible })
    },

    setModelSelectorVisible: (visible) => {
        set({ modelSelectorVisible: visible })
        set({ css3dLabelVisible: !visible })
    },

    updateDataSourceValues: (sourceId, values) => set((state) => ({
        dataSourceValues: {
            ...state.dataSourceValues,
            [sourceId]: values
        }
    })),
}));
