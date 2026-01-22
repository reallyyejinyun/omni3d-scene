import React from 'react';
import { EffectComposer, Bloom, SSAO, Vignette, BrightnessContrast, HueSaturation } from '@react-three/postprocessing';
import { useStore } from '@/store';

/**
 * 场景后期处理组件
 */
const PostProcessing: React.FC = () => {
    const { sceneConfig } = useStore();
    const config = sceneConfig.postProcessing;

    if (!config || !config.enabled) return null;

    const effects: React.ReactElement[] = [];

    if (config.bloom?.enabled) {
        effects.push(
            <Bloom
                key="bloom"
                intensity={config.bloom.intensity}
                radius={config.bloom.radius}
                luminanceThreshold={config.bloom.threshold}
                mipmapBlur
            />
        );
    }

    if (config.ssao?.enabled) {
        effects.push(
            <SSAO
                key="ssao"
                intensity={config.ssao.intensity}
                radius={config.ssao.radius}
                samples={config.ssao.samples}
            />
        );
    }

    if (config.vignette?.enabled) {
        effects.push(
            <Vignette
                key="vignette"
                offset={config.vignette.offset}
                darkness={config.vignette.darkness}
            />
        );
    }

    if (config.brightnessContrast?.enabled) {
        effects.push(
            <BrightnessContrast
                key="brightnessContrast"
                brightness={config.brightnessContrast.brightness}
                contrast={config.brightnessContrast.contrast}
            />
        );
    }

    if (config.hueSaturation?.enabled) {
        effects.push(
            <HueSaturation
                key="hueSaturation"
                hue={config.hueSaturation.hue}
                saturation={config.hueSaturation.saturation}
            />
        );
    }

    if (effects.length === 0) return null;

    return (
        <EffectComposer multisampling={config.multisampling}>
            {effects}
        </EffectComposer>
    );
};

export default PostProcessing;
