import React, { useMemo } from 'react';
import { TransformControls } from '@react-three/drei';
import { useStore } from '@/store';
import { checkPathLocked, findObjectRecursive } from '@/utils';

/**
 * 变换控制器包装组件
 * 自治管理当前选中物体的 3D 变换（移动、旋转、缩放）
 */
const TransformControlsWrapper: React.FC = () => {
    const transformMode = useStore(state => state.transformMode);
    const updateObject = useStore(state => state.updateObject);
    const selectedId = useStore(state => state.selectedId);
    const selectedMeshId = useStore(state => state.selectedMeshId);
    const scene = useStore(state => state.scene);
    const objects = useStore(state => state.objects);
    const sceneConfig = useStore(state => state.sceneConfig);
    const { snapTranslation, snapRotation } = sceneConfig;

    // 1. 检查选中状态与锁定状态
    const { isVisible, isLocked } = useMemo(() => {
        if (!selectedId) return { isVisible: false, isLocked: false };

        const obj = findObjectRecursive(objects, selectedId);
        if (!obj) return { isVisible: false, isLocked: false };

        let locked = obj.locked || false;
        if (selectedMeshId && obj.structure) {
            const pathResult = checkPathLocked(obj.structure, selectedMeshId);
            if (pathResult.found && pathResult.pathLocked) {
                locked = true;
            }
        }

        return { isVisible: obj.visible !== false, isLocked: locked };
    }, [selectedId, selectedMeshId, objects]);

    // 2. 早期退出逻辑
    if (!selectedId || !isVisible || isLocked || !scene) return null;

    // 3. 查找场景中的实际三维对象
    const selectObj = scene.getObjectByProperty('uuid', selectedId);
    if (!selectObj || !selectObj.parent) return null;

    let targetObj = selectObj;
    let isSelectedMesh = false;

    if (selectedMeshId) {
        const subMesh = selectObj.getObjectByProperty('uuid', selectedMeshId);
        if (subMesh) {
            targetObj = subMesh;
            isSelectedMesh = true;
        }
    }

    if (!targetObj.parent) return null;

    /**
     * 处理变换完成事件，同步数据到 Store
     */
    const handleTransform = () => {
        useStore.getState().setState({ isTransforming: false });
        if (targetObj) {
            const { position, rotation, scale } = targetObj;
            updateObject(selectedId, {
                position: [position.x, position.y, position.z],
                rotation: [rotation.x, rotation.y, rotation.z],
                scale: [scale.x, scale.y, scale.z]
            }, isSelectedMesh ? selectedMeshId : null);
        }
    };

    return (
        <TransformControls
            raycast={() => null}
            object={targetObj}
            mode={transformMode}
            onMouseDown={() => useStore.getState().setState({ isTransforming: true })}
            onMouseUp={handleTransform}
            translationSnap={snapTranslation || null}
            rotationSnap={snapRotation ? (snapRotation * Math.PI) / 180 : null}
        />
    );
};

export default React.memo(TransformControlsWrapper);
