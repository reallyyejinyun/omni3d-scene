import React, { useMemo, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useGLTF, useAnimations } from '@react-three/drei';
import { type SceneGraphNode, type MaterialConfig, type SceneObject } from '@/types';
import { applyVisibility, textureCache, smartClone, checkLockedUpward, parseStructure } from '@/utils';
import { useStore } from '@/store';
import { useObjectDataBinding } from '@/hooks/useObjectDataBinding';


interface GltfModelProps {
    objectId: string;
    object: SceneObject;
    previewMode?: boolean;
}




/**
 * 内部渲染组件，处理具体的 GLTF 模型逻辑
 */
const ModelRenderer: React.FC<GltfModelProps & { onStatusChange: (status: 'loading' | 'success' | 'error') => void }> = ({
    objectId, object, onStatusChange, previewMode
}) => {
    const onSelect = useStore(state => state.handleSelect);
    const updateObject = useStore(state => state.updateObject);
    useObjectDataBinding(object);

    if (!object || !object.url) return null;

    const { scene, animations } = useGLTF(object.url);

    // --- 新增：计算归一化缩放和中心点偏置 ---
    const { autoScale, centerOffset } = useMemo<{
        autoScale: number;
        centerOffset: [number, number, number];
    }>(() => {
        if (!scene) return { autoScale: 1, centerOffset: [0, 0, 0] };

        // 1. 计算包围盒
        const box = new THREE.Box3().setFromObject(scene);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);

        const maxDim = Math.max(size.x, size.y, size.z);

        // 目标：让模型在场景中初始最大占用为 20 个单位
        const targetSize = 20;
        const scale = maxDim > 20 ? targetSize / maxDim : 1;

        // 2. 计算底部中心偏置 (让模型底部对齐 Y=0)
        const offset: [number, number, number] = [
            -center.x * scale,
            -box.min.y * scale,
            -center.z * scale
        ];

        return { autoScale: scale, centerOffset: offset };
    }, [scene]);

    // 克隆模型以支持多个实例
    const clone = useMemo(() => {
        const cloned = smartClone(scene);
        cloned.userData.root = true;
        cloned.userData.isGltfRoot = true;
        return cloned;
    }, [scene]);

    const { actions, names } = useAnimations(animations, clone);

    useEffect(() => {
        if (onStatusChange) onStatusChange('success');
    }, [onStatusChange]);

    // 计算当前需要播放的动画
    useEffect(() => {
        const activeAnimations = object.activeAnimations || [];
        const toPlay = new Set<string>(activeAnimations);

        Object.entries(actions).forEach(([name, action]) => {
            if (toPlay.has(name)) {
                if (!action?.isRunning()) {
                    action?.reset().fadeIn(0.5).play();
                }
            } else {
                if (action?.isRunning()) {
                    action?.fadeOut(0.5);
                }
            }
        });

        return () => {
            Object.values(actions).forEach(action => action?.fadeOut(0.5));
        };
    }, [object.activeAnimations, actions]);

    // 同步结构与属性
    useEffect(() => {
        if (!clone) return;
        if (!previewMode) {
            const newStructure = parseStructure(clone, names, objectId);
            updateObject(objectId, { structure: newStructure });
        }
    }, [clone]);

    useEffect(() => {
        if (clone && object.structure) {
            applyVisibility(clone, object.structure);
        }
    }, [object.structure]);

    return (
        <group scale={[autoScale, autoScale, autoScale]} position={centerOffset}>
            <primitive
                object={clone}
                onClick={(e: any) => {
                    e.stopPropagation();
                    if (checkLockedUpward(e.object)) return;

                    onSelect(objectId, e.object.uuid);

                    if (object.events?.onClick && previewMode) {
                        const events = object.events.onClick;
                        const meshEvents = events.filter(ev => ev.sourceMeshId === e.object.uuid);
                        const globalEvents = events.filter(ev => !ev.sourceMeshId);

                        if (meshEvents.length > 0) {
                            meshEvents.forEach(ev => useStore.getState().executeAction(ev));
                        } else if (globalEvents.length > 0) {
                            globalEvents.forEach(ev => useStore.getState().executeAction(ev));
                        }
                    }
                }}
            />
        </group>
    );
};

/**
 * 简单错误边界
 */
class ModelErrorBoundary extends React.Component<{ children: React.ReactNode, onError: (e: any) => void }, { hasError: boolean }> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    componentDidCatch(error: any) {
        this.props.onError(error);
    }
    render() {
        if (this.state.hasError) return null;
        return this.props.children;
    }
}

/**
 * 带有加载状态标识的 GLTF 模型组件
 */
const GltfModel: React.FC<GltfModelProps> = ({ objectId, object, previewMode }) => {
    const setLoadStatus = useStore(state => state.setLoadStatus);
    const [key, setKey] = useState(0);

    const setStatus = useCallback((s: 'loading' | 'success' | 'error') => {
        setLoadStatus(objectId, s);
    }, [objectId, setLoadStatus]);

    useEffect(() => {
        if (object?.url) {
            setStatus('loading');
            setKey(prev => prev + 1);
        }
    }, [object?.url, setStatus]);

    if (!object?.url) return null;

    if (previewMode) return (
        <React.Suspense fallback={null}>
            <ModelRenderer
                objectId={objectId}
                object={object}
                previewMode={previewMode}
                onStatusChange={setStatus}
            />
        </React.Suspense>
    )

    return (
        <group>
            <ModelErrorBoundary key={key} onError={() => setStatus('error')}>
                <React.Suspense fallback={null}>
                    <ModelRenderer
                        objectId={objectId}
                        object={object}
                        previewMode={previewMode}
                        onStatusChange={setStatus}
                    />
                </React.Suspense>
            </ModelErrorBoundary>
        </group>
    );
};

export default GltfModel;
