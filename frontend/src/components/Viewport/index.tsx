import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Stats } from '@react-three/drei';
import { useStore } from '@/store';
import PostProcessing from './scene/PostProcessing';
import CameraManager from './managers/CameraManager';
import SequenceManager from './managers/SequenceManager';
import SceneBackground from './scene/SceneBackground';
import SceneCapture from './scene/SceneCapture';
import ViewportCamera from './controls/ViewportCamera';
import ViewportHelpers from './scene/ViewportHelpers';
import SceneObjects from './scene/SceneObjects';
import TransformControlsWrapper from './controls/TransformControlsWrapper';

/**
 * 3D 视口主渲染组件
 * 基于 react-three-fiber 构建，采用独立子组件订阅状态模式以优化高性能渲染。
 * @param {boolean} previewMode - 是否处于纯预览模式（隐藏 UI 辅助工具）
 */
const Viewport: React.FC<{ previewMode?: boolean }> = ({ previewMode = false }) => {
    const handleSelect = useStore(state => state.handleSelect);
    const shadows = useStore(state => state.sceneConfig.shadows);
    const exposure = useStore(state => state.sceneConfig.exposure);
    const sceneConfig = useStore(state => state.sceneConfig);

    return (
        <Canvas
            shadows={shadows}
            onPointerMissed={() => handleSelect(null, null)}
            className="w-full h-full"
            performance={{ min: 0.5 }}
            dpr={[1, 2]}
            gl={{
                preserveDrawingBuffer: true,
                antialias: true,
                toneMappingExposure: exposure
            }}
            camera={{
                position: sceneConfig.cameraPosition,
                fov: sceneConfig.cameraFov,
                near: sceneConfig.cameraNear,
                far: sceneConfig.cameraFar
            }}
        >
            <SceneBackground />
            <SceneCapture />

            <ViewportCamera />
            <ViewportHelpers />

            <SequenceManager isPreview={previewMode} />
            <SceneObjects previewMode={previewMode} />

            <PostProcessing />

            {!previewMode && (
                <>
                    <Stats className="!left-auto !right-0 !top-auto !bottom-0" />
                    <CameraManager />
                    <TransformControlsWrapper />
                </>
            )}
        </Canvas>
    );
};

export default React.memo(Viewport);
