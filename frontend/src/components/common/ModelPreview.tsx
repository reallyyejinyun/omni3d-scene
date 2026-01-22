import React, { memo } from "react";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Stage, Gltf, Center, OrbitControls } from "@react-three/drei";
import { useProgress } from "@react-three/drei";
import { Progress } from "antd";

/**
 * 局部 Loading 组件：利用 useProgress 监控资源加载状态
 */
const LoadingOverlay: React.FC = () => {
    const { active, progress } = useProgress();

    if (!active) return null;

    return (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0a0a0a]/80 backdrop-blur-md transition-all duration-500">
            <div className="w-48 space-y-3 text-center">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <span>系统预热中</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <Progress
                    percent={progress}
                    showInfo={false}
                    strokeColor={{ '0%': '#9333ea', '100%': '#3b82f6' }}
                    railColor="rgba(255,255,255,0.05)"
                    strokeWidth={4}
                />
                <p className="text-[9px] text-gray-600 italic font-medium">正在解析 PBR 纹理与几何拓扑...</p>
            </div>
        </div>
    );
};


interface ModelPreviewProps {
    src: string;
}
/**
 * 模型预览组件
 */
const ModelPreview: React.FC<ModelPreviewProps> = memo(({ src }) => {
    return (
        <>
            {/* 第二阶段：资源加载 UI (Overlay 方式) */}
            <LoadingOverlay />

            {/* Canvas 始终保持挂载，不被 Suspense 卸载 */}
            <Canvas
                shadows
                camera={{ position: [0, 0, 5], fov: 45 }}
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: true }}
            >
                {/* 将 Suspense 放在 Canvas 内部最深处 */}
                <Suspense fallback={null}>
                    <Stage environment="city" intensity={0.5} shadows="contact">
                        <Center>
                            <Gltf src={src} castShadow receiveShadow />
                        </Center>
                    </Stage>
                </Suspense>
                <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} />
            </Canvas>
        </>
    )
})

export default ModelPreview