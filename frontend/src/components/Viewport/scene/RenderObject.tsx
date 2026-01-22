import React, { useRef, useMemo } from 'react';
import { type SceneObject } from '@/types';
import { useStore } from '@/store';
import { useObjectDataBinding } from '@/hooks/useObjectDataBinding';
import ObjectView from './ObjectView';

interface RenderObjectProps {
    id: string;
    obj: SceneObject;
    previewMode?: boolean;
}

/**
 * 场景物体包装器 - 负责容器管理与递归逻辑
 */
const RenderObject: React.FC<RenderObjectProps> = ({ obj, previewMode = false }) => {
    const meshRef = useRef<any>(null);
    const handleSelect = useStore(state => state.handleSelect);
    const shadowsEnabled = useStore(state => state.sceneConfig.shadows);

    // 计算数据绑定（颜色、缩放、标签、变换等）
    useObjectDataBinding(obj);

    const isLockedInherited = useMemo(() => obj?.locked || false, [obj?.locked]);

    // 构建公共容器属性
    const commonProps: any = useMemo(() => {
        if (!obj) return {};
        return {
            ref: meshRef,
            visible: obj.visible,
            position: obj.position,
            rotation: obj.rotation,
            scale: obj.scale,
            name: obj.name,
            uuid: obj.id,
            castShadow: obj.castShadow ?? shadowsEnabled,
            receiveShadow: obj.receiveShadow ?? shadowsEnabled,
            onClick: (e: any) => {
                if (!previewMode && isLockedInherited) return;
                e.stopPropagation();

                // 预览模式下的物体点击事件执行
                if (obj.events?.onClick && previewMode) {
                    obj.events.onClick.forEach(event => {
                        if (!event.sourceMeshId) useStore.getState().executeAction(event);
                    });
                }
                if (!previewMode) handleSelect(obj.id, null);
            }
        };
    }, [obj, shadowsEnabled, isLockedInherited, handleSelect, previewMode]);

    if (!obj || !obj.visible) return null;

    return (
        <group {...commonProps}>
            {/* 1. 渲染主体视觉视图 */}
            <ObjectView
                obj={obj}
                previewMode={previewMode}
            />
        </group>
    );
};

export default React.memo(RenderObject);
