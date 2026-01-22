import React from 'react';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import { useStore } from '@/store';
import RoamingCamera from './RoamingCamera';

/**
 * 视口相机组件
 * @returns 
 */
const ViewportCamera: React.FC = () => {
    const isRoaming = useStore(state => state.isRoaming);
    const roamingNodes = useStore(state => state.roamingNodes);
    const activeRoamingIndex = useStore(state => state.activeRoamingIndex);
    const sceneConfig = useStore(state => state.sceneConfig);

    return (
        <>
            <PerspectiveCamera
                makeDefault
                position={sceneConfig.cameraPosition}
                rotation={sceneConfig.cameraRotation}
                fov={sceneConfig.cameraFov}
            />

            {!isRoaming && (
                <OrbitControls
                    makeDefault
                    enableDamping
                    dampingFactor={0.05}
                    target={sceneConfig.cameraTarget || [0, 0, 0]}
                />
            )}

            <RoamingCamera
                active={isRoaming}
                nodes={roamingNodes}
                index={activeRoamingIndex}
            />
        </>
    );
};

export default React.memo(ViewportCamera);
