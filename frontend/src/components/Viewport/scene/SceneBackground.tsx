import React, { useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { Sky, Environment } from '@react-three/drei';
import { useStore } from '@/store';
import { BACKGROUND_TYPE, ENVIRONMENT_TYPE, type EnvPreset } from '@/types';
import { ENV_PRESET_URLS } from '@/constants';
import { textureLoader } from '@/utils';

/**
 * 处理复杂背景逻辑的独立组件
 */
const SceneBackground: React.FC = () => {
    const backgroundType = useStore(state => state.sceneConfig.backgroundType);
    const backgroundValue = useStore(state => state.sceneConfig.backgroundValue);
    const environmentType = useStore(state => state.sceneConfig.environmentType);
    const environmentValue = useStore(state => state.sceneConfig.environmentValue);
    const sunPosition = useStore(state => state.sceneConfig.sunPosition);
    const { scene } = useThree();

    useEffect(() => {
        switch (backgroundType) {
            case BACKGROUND_TYPE.COLOR:
                scene.background = new THREE.Color(backgroundValue);
                break;
            case BACKGROUND_TYPE.NONE:
                scene.background = null;
                break;
            case BACKGROUND_TYPE.PANORAMA:
            case BACKGROUND_TYPE.IMAGE:
                scene.background = null;
                if (!backgroundValue) break;

                textureLoader.load(backgroundValue, (tex) => {
                    let t = tex.clone();
                    t.mapping = backgroundType === BACKGROUND_TYPE.PANORAMA
                        ? THREE.EquirectangularReflectionMapping
                        : THREE.UVMapping;
                    scene.background = t;
                }, () => {
                    scene.background = null;
                });
                break;
        }
    }, [backgroundType, backgroundValue, scene]);

    useEffect(() => {
        switch (environmentType) {
            case ENVIRONMENT_TYPE.IMAGE:
                scene.environment = null;
                if (!environmentValue) break;

                textureLoader.load(environmentValue, (envTex) => {
                    let t = envTex.clone();
                    t.mapping = THREE.EquirectangularReflectionMapping;
                    scene.environment = t;
                }, () => {
                    scene.environment = null;
                });
                break;
            case ENVIRONMENT_TYPE.NONE:
                scene.environment = null;
                break;
            case ENVIRONMENT_TYPE.PRESET:
                let url = ENV_PRESET_URLS[environmentValue as EnvPreset];
                if (!url) break;
                textureLoader.load(url, (envTex) => {
                    let t = envTex.clone();
                    t.mapping = THREE.EquirectangularReflectionMapping;
                    scene.environment = t;
                }, () => {
                    scene.environment = null;
                });
                break;
            default:
                break;
        }
    }, [environmentType, environmentValue, scene]);

    return (
        <>
            {backgroundType === BACKGROUND_TYPE.SKY && <Sky sunPosition={sunPosition} />}
            {backgroundType === BACKGROUND_TYPE.CUBEMAP && backgroundValue && (
                <Environment
                    background
                    files={backgroundValue.split(',').map(s => s.trim())}
                />
            )}
        </>
    );
};

export default React.memo(SceneBackground);
