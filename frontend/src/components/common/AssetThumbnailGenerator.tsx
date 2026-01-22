import React, { useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Stage, Gltf, Center } from '@react-three/drei';

interface SceneCaptureProps {
    onCapture: (file: File) => void;
}
/**
 * 场景截图组件
 * @param param0 
 * @returns 
 */
const SceneCapture: React.FC<SceneCaptureProps> = ({ onCapture }) => {
    const { gl, scene, camera } = useThree();

    useEffect(() => {
        // 等待模型加载并完成第一帧渲染
        const timer = setTimeout(() => {
            gl.render(scene, camera);
            const dataUrl = gl.domElement.toDataURL('image/png');

            fetch(dataUrl)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], 'thumbnail.png', { type: 'image/png' });
                    onCapture(file);
                });
        }, 1500); // 等待时间，确保 Stage 辅助灯光和模型定位完成

        return () => clearTimeout(timer);
    }, [gl, scene, camera, onCapture]);

    return null;
};

interface AssetThumbnailGeneratorProps {
    url: string;
    onCapture: (file: File) => void;
}

/**
 * 后台缩略图生成器
 * 将模型渲染在不可见的 512x512 画布中并提取截图
 */
const AssetThumbnailGenerator: React.FC<AssetThumbnailGeneratorProps> = ({ url, onCapture }) => {
    return (
        <div style={{
            width: 512,
            height: 512,
            position: 'fixed',
            top: -10000,
            left: -10000,
            pointerEvents: 'none',
            zIndex: -1
        }}>
            <Canvas
                shadows
                gl={{ preserveDrawingBuffer: true, antialias: true }}
                camera={{ position: [0, 0, 5], fov: 45 }}
            >
                <Stage environment="city" intensity={0.5} shadows="contact" adjustCamera>
                    <Center>
                        <Gltf src={url} />
                    </Center>
                </Stage>
                <SceneCapture onCapture={onCapture} />
            </Canvas>
        </div>
    );
};

export default AssetThumbnailGenerator;
