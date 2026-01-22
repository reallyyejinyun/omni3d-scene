import React from 'react';
import { Sparkles, Activity, Aperture, SunDim, Droplets } from 'lucide-react';
import PropertySection from '../common/PropertySection';
import PropertyField from '../common/PropertyField';
import { useStore } from '@/store';

/**
 * 后期处理配置模块
 */
const PostProcessingSection: React.FC = () => {
    const config = useStore(state => state.sceneConfig.postProcessing);
    const updateSceneConfig = useStore(state => state.updateSceneConfig);

    const updatePost = React.useCallback((updates: any) => {
        updateSceneConfig({
            postProcessing: {
                ...config,
                ...updates
            }
        });
    }, [config, updateSceneConfig]);

    const updateEffect = React.useCallback((effect: string, updates: any) => {
        updatePost({
            [effect]: {
                ...(config as any)[effect],
                ...updates
            }
        });
    }, [config, updatePost]);

    if (!config) return null;

    return (
        <div className="space-y-1">
            <PropertySection title="后期处理开关" icon={<Sparkles size={12} />}>
                <PropertyField
                    label="开启后期处理"
                    type="checkbox"
                    inline
                    value={config.enabled}
                    onChange={(val) => updatePost({ enabled: val })}
                />
                {config.enabled && (
                    <PropertyField
                        label="抗锯齿 (MSAA)"
                        type="select"
                        value={config.multisampling.toString()}
                        onChange={(val) => updatePost({ multisampling: parseInt(val) })}
                    >
                        <option value="0">关闭</option>
                        <option value="2">2x</option>
                        <option value="4">4x</option>
                        <option value="8">8x</option>
                    </PropertyField>
                )}
            </PropertySection>

            {config.enabled && (
                <>
                    <PropertySection title="辉光 (Bloom)" icon={<Activity size={12} />}>
                        <div className="space-y-3">
                            <PropertyField
                                label="开启"
                                type="checkbox"
                                inline
                                value={config.bloom.enabled}
                                onChange={(val) => updateEffect('bloom', { enabled: val })}
                            />
                            {config.bloom.enabled && (
                                <>
                                    <PropertyField
                                        label="强度"
                                        type="range"
                                        min={0}
                                        max={5}
                                        step={0.1}
                                        value={config.bloom.intensity}
                                        onChange={(val) => updateEffect('bloom', { intensity: val })}
                                    />
                                    <PropertyField
                                        label="半径"
                                        type="range"
                                        min={0}
                                        max={1}
                                        step={0.01}
                                        value={config.bloom.radius}
                                        onChange={(val) => updateEffect('bloom', { radius: val })}
                                    />
                                    <PropertyField
                                        label="阈值"
                                        type="range"
                                        min={0}
                                        max={1}
                                        step={0.01}
                                        value={config.bloom.threshold}
                                        onChange={(val) => updateEffect('bloom', { threshold: val })}
                                    />
                                </>
                            )}
                        </div>
                    </PropertySection>

                    <PropertySection title="环境光遮蔽 (SSAO)" icon={<Aperture size={12} />}>
                        <div className="space-y-3">
                            <PropertyField
                                label="开启"
                                type="checkbox"
                                inline
                                value={config.ssao.enabled}
                                onChange={(val) => updateEffect('ssao', { enabled: val })}
                            />
                            {config.ssao.enabled && (
                                <>
                                    <PropertyField
                                        label="强度"
                                        type="range"
                                        min={0}
                                        max={2}
                                        step={0.1}
                                        value={config.ssao.intensity}
                                        onChange={(val) => updateEffect('ssao', { intensity: val })}
                                    />
                                    <PropertyField
                                        label="半径"
                                        type="range"
                                        min={0}
                                        max={0.5}
                                        step={0.01}
                                        value={config.ssao.radius}
                                        onChange={(val) => updateEffect('ssao', { radius: val })}
                                    />
                                </>
                            )}
                        </div>
                    </PropertySection>

                    <PropertySection title="亮度 / 对比度" icon={<SunDim size={12} />}>
                        <div className="space-y-3">
                            <PropertyField
                                label="开启"
                                type="checkbox"
                                inline
                                value={config.brightnessContrast.enabled}
                                onChange={(val) => updateEffect('brightnessContrast', { enabled: val })}
                            />
                            {config.brightnessContrast.enabled && (
                                <>
                                    <PropertyField
                                        label="亮度"
                                        type="range"
                                        min={-1}
                                        max={1}
                                        step={0.01}
                                        value={config.brightnessContrast.brightness}
                                        onChange={(val) => updateEffect('brightnessContrast', { brightness: val })}
                                    />
                                    <PropertyField
                                        label="对比度"
                                        type="range"
                                        min={-1}
                                        max={1}
                                        step={0.01}
                                        value={config.brightnessContrast.contrast}
                                        onChange={(val) => updateEffect('brightnessContrast', { contrast: val })}
                                    />
                                </>
                            )}
                        </div>
                    </PropertySection>

                    <PropertySection title="色相 / 饱和度" icon={<Droplets size={12} />}>
                        <div className="space-y-3">
                            <PropertyField
                                label="开启"
                                type="checkbox"
                                inline
                                value={config.hueSaturation.enabled}
                                onChange={(val) => updateEffect('hueSaturation', { enabled: val })}
                            />
                            {config.hueSaturation.enabled && (
                                <>
                                    <PropertyField
                                        label="色相"
                                        type="range"
                                        min={-Math.PI}
                                        max={Math.PI}
                                        step={0.01}
                                        value={config.hueSaturation.hue}
                                        onChange={(val) => updateEffect('hueSaturation', { hue: val })}
                                    />
                                    <PropertyField
                                        label="饱和度"
                                        type="range"
                                        min={-1}
                                        max={1}
                                        step={0.01}
                                        value={config.hueSaturation.saturation}
                                        onChange={(val) => updateEffect('hueSaturation', { saturation: val })}
                                    />
                                </>
                            )}
                        </div>
                    </PropertySection>

                    <PropertySection title="暗角 (Vignette)" icon={<Aperture size={12} />}>
                        <div className="space-y-3">
                            <PropertyField
                                label="开启"
                                type="checkbox"
                                inline
                                value={config.vignette.enabled}
                                onChange={(val) => updateEffect('vignette', { enabled: val })}
                            />
                            {config.vignette.enabled && (
                                <>
                                    <PropertyField
                                        label="偏移量"
                                        type="range"
                                        min={0}
                                        max={1}
                                        step={0.01}
                                        value={config.vignette.offset}
                                        onChange={(val) => updateEffect('vignette', { offset: val })}
                                    />
                                    <PropertyField
                                        label="深度"
                                        type="range"
                                        min={0}
                                        max={1}
                                        step={0.01}
                                        value={config.vignette.darkness}
                                        onChange={(val) => updateEffect('vignette', { darkness: val })}
                                    />
                                </>
                            )}
                        </div>
                    </PropertySection>
                </>
            )}
        </div>
    );
};

export default React.memo(PostProcessingSection);
