import React from 'react';
import { Sun } from 'lucide-react';
import PropertySection from '../common/PropertySection';
import PropertyField from '../common/PropertyField';
import type { SceneObject } from '@/types';

interface LightSectionProps {
    object: SceneObject;
    onUpdate: (updates: Partial<SceneObject>) => void;
}
/**
 * 光照属性分组
 * @param param0 
 * @returns 
 */
const LightSection: React.FC<LightSectionProps> = ({ object, onUpdate }) => {
    const handleColorChange = React.useCallback((val: string) => onUpdate({
        material: { ...(object.material || {} as any), color: val }
    }), [object.material, onUpdate]);

    const handleIntensityChange = React.useCallback((val: number) => onUpdate({ intensity: val }), [onUpdate]);
    const handleShadowChange = React.useCallback((val: boolean) => onUpdate({ castShadow: val }), [onUpdate]);
    const handleDistanceChange = React.useCallback((val: number) => onUpdate({ distance: val }), [onUpdate]);
    const handleDecayChange = React.useCallback((val: number) => onUpdate({ decay: val }), [onUpdate]);

    return (
        <PropertySection title="光照配置" icon={<Sun size={12} />}>
            <div className="space-y-4">
                <PropertyField
                    label="光照颜色"
                    type="color"
                    inline
                    value={object.material?.color || '#ffffff'}
                    onChange={handleColorChange}
                    bindingKey="material.color"
                />

                <PropertyField
                    label="光照强度"
                    type="range"
                    min={0}
                    max={10}
                    step={0.1}
                    value={object.intensity ?? 1}
                    onChange={handleIntensityChange}
                    bindingKey="intensity"
                />

                <PropertyField
                    label="开启阴影"
                    type="checkbox"
                    inline
                    value={object.castShadow ?? false}
                    onChange={handleShadowChange}
                />

                {(object.type === 'LIGHT_POINT' || object.type === 'LIGHT_SPOT') && (
                    <>
                        <PropertyField
                            label="影响距离"
                            type="range"
                            min={0}
                            max={100}
                            step={1}
                            value={object.distance ?? 0}
                            onChange={handleDistanceChange}
                            bindingKey="distance"
                        />
                        <PropertyField
                            label="光照衰减"
                            type="range"
                            min={0}
                            max={5}
                            step={0.1}
                            value={object.decay ?? 2}
                            onChange={handleDecayChange}
                            bindingKey="decay"
                        />
                    </>
                )}
            </div>
        </PropertySection>
    );
};

export default React.memo(LightSection);
