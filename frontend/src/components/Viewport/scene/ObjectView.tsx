import React, { forwardRef, memo, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { Html, Billboard, Line } from '@react-three/drei';
import { ObjectType, type SceneObject } from '@/types';
import GltfModel from './GltfModel';
import { TexturedMaterial, TexturedSpriteMaterial } from './Materials';
import { useStore } from '@/store';
import * as THREE from 'three';
import { GEOMETRY_ARGS, GEOMETRY_TYPES } from '@/constants';
interface ObjectViewProps {
    obj: SceneObject;
    previewMode: boolean;
}


/**
 * 动态物体视图组件 - 负责具体的视觉表现层
 */
const ObjectView: React.FC<ObjectViewProps> = ({ obj, previewMode }) => {
    const handleSelect = useStore(state => state.handleSelect);
    const commonPrimitiveProps = {
        onClick: (e: any) => {
            if (obj?.locked) return;
            e.stopPropagation();
            handleSelect(obj.id, null);
        }
    };

    switch (obj.type) {
        // 1. 基础几何体
        case ObjectType.BOX:
        case ObjectType.SPHERE:
        case ObjectType.CYLINDER:
        case ObjectType.CONE:
        case ObjectType.TORUS:
        case ObjectType.PLANE: {
            const Geometry: any = GEOMETRY_TYPES[obj.type.toUpperCase()] || GEOMETRY_TYPES.BOX;
            const args = GEOMETRY_ARGS[obj.type];
            return (
                <mesh>
                    <Geometry args={args} />
                    <TexturedMaterial material={{ ...obj.material }} />
                </mesh>
            );
        }

        // 2. 点光源
        case ObjectType.LIGHT_POINT:
            return (
                <>
                    <pointLight
                        intensity={obj.intensity ?? 2}
                        distance={obj.distance ?? 0}
                        decay={obj.decay ?? 2}
                        castShadow={obj.castShadow ?? false}
                        color={obj.color}
                    />
                    {!previewMode && (
                        <mesh {...commonPrimitiveProps}>
                            <sphereGeometry args={[0.1, 8, 8]} />
                            <meshBasicMaterial color="red" wireframe />
                        </mesh>
                    )}
                </>
            );

        // 3. 平行光
        case ObjectType.LIGHT_DIR:
            return (
                <>
                    <directionalLight
                        intensity={obj.intensity ?? 1.5}
                        castShadow={obj.castShadow ?? true}
                        color={obj.color}
                        // 性能优化：限制阴影图的分辨率和相机范围，避免大场景下的无效重算
                        shadow-mapSize={[1024, 1024]}
                        shadow-camera-left={-20}
                        shadow-camera-right={20}
                        shadow-camera-top={20}
                        shadow-camera-bottom={-20}
                    />
                    {!previewMode && (
                        <mesh {...commonPrimitiveProps}>
                            <boxGeometry args={[0.1, 0.1, 0.3]} />
                            <meshBasicMaterial color="red" wireframe />
                        </mesh>
                    )}
                </>
            );

        // 4. 2D 标签 (升级为 CSS3D 精灵标签)
        case ObjectType.LABEL:
            return (
                <>
                    <CSS3DSprite obj={obj} previewMode={previewMode} />
                    {!previewMode && (
                        <mesh {...commonPrimitiveProps}>
                            <sphereGeometry args={[0.05, 8, 8]} />
                            <meshBasicMaterial color="#a855f7" />
                        </mesh>
                    )}
                </>
            );

        // 5. 精灵图 (Sprite)
        case ObjectType.SPRITE:
            return (
                <sprite>
                    <TexturedSpriteMaterial material={obj.material} />
                </sprite>
            );

        // 6. GLTF 模型
        case ObjectType.GLTF:
            return (
                <GltfModel
                    objectId={obj.id}
                    object={obj}
                    previewMode={previewMode}
                />
            );

        default:
            return null;
    }
};



interface CSS3DSpriteProps {
    obj: SceneObject;
    previewMode: boolean;
}
/**
 * CSS3D 精灵标签组件
 */
const CSS3DSprite = memo(forwardRef<HTMLDivElement, CSS3DSpriteProps>(function CSS3DSprite(props, ref) {
    const { obj, previewMode } = props;
    const handleSelect = useStore(state => state.handleSelect);
    const selectedId = useStore(state => state.selectedId);
    const css3dLabelVisible = useStore(state => state.css3dLabelVisible);

    const isSelected = selectedId === obj.id;
    // 从配置中读取偏移，默认为 [3, 3, 0]
    const labelPosition = new THREE.Vector3(...obj.labelConfig?.offset || [3, 3, 0]);
    //获取一个折中的点
    // const middlePoint = new THREE.Vector3(labelPosition.x * 0.2, labelPosition.y * 0.8, labelPosition.z);
    // 是否显示引线，默认为开启
    const showLine = obj.labelConfig?.showLine !== false;

    const { scene } = useThree();
    const occluderRef = useMemo(() => {
        const group = scene.getObjectByName('scene-objects-group');
        return group ? [{ current: group }] : undefined;
    }, [scene]);
    if (!css3dLabelVisible) return null;

    return (
        <group>
            {/* 引线连接：连接原始落点 [0,0,0] 与标签当前位置 */}
            {showLine && (
                <Line
                    points={[[0, 0, 0], labelPosition]}
                    color={obj.color || "#a855f7"}
                    lineWidth={0.6}
                    transparent
                    opacity={0.4}
                    // 禁用射线检测，
                    raycast={() => null}
                />
            )}

            <Html
                position={labelPosition}
                transform
                occlude={isSelected ? false : (occluderRef)}
                sprite
                center
                pointerEvents="auto"
            >
                <div
                    className="bg-black/60 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded text-[10px] text-white whitespace-nowrap cursor-pointer select-none transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-xl"
                    style={{
                        pointerEvents: 'auto',
                        borderColor: isSelected ? obj.color : 'rgba(255,255,255,0.2)',
                        boxShadow: isSelected ? `0 0 20px ${obj.color}44` : 'none'
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        // 预览模式下的物体点击事件执行
                        if (obj.events?.onClick && previewMode) {
                            obj.events.onClick.forEach(event => {
                                if (!event.sourceMeshId) useStore.getState().executeAction(event);
                            });
                        }
                        if (!previewMode) handleSelect(obj.id, null);
                    }}
                >
                    {/* 左侧装饰圆点，颜色与引线一致 */}
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: obj.color || "#a855f7" }} />
                    <div dangerouslySetInnerHTML={{ __html: obj.htmlLabel || "" }} />
                </div>
            </Html>
        </group>
    );
}));

export default React.memo(ObjectView);
