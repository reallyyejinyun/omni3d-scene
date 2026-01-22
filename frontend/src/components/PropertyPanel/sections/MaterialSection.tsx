import React from 'react';
import { Palette } from 'lucide-react';
import PropertySection from '../common/PropertySection';
import PropertyField from '../common/PropertyField';
import AssetPicker from '../common/AssetPicker';
import type { SceneObject } from '@/types';
import type { SceneGraphNode } from '@/types';

interface MaterialSectionProps {
    targetObject: SceneObject | SceneGraphNode;
    onUpdate: (updates: Partial<SceneObject>) => void;
}

import { useSubUpdate } from '@/hooks/useSubUpdate';

/**
 * 材质属性分组
 * @param param0 
 * @returns 
 */
const MaterialSection: React.FC<MaterialSectionProps> = ({ targetObject, onUpdate }) => {
    const [material, updateMat] = useSubUpdate(targetObject as any, 'material', onUpdate, {} as any);

    if (!material) return null;

    return (
        <PropertySection title="材质编辑" icon={<Palette size={12} />}>
            <div className="space-y-4">
                <AssetPicker
                    label="颜色贴图 (Map)"
                    value={material.mapUrl || ''}
                    onChange={(val) => updateMat({ mapUrl: val })}
                />

                <PropertyField
                    label="基础颜色"
                    type="color"
                    inline
                    value={material.color}
                    onChange={(val) => updateMat({ color: val })}
                    bindingKey="material.color"
                />

                <PropertyField
                    label="金属度"
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={material.metalness}
                    onChange={(val) => updateMat({ metalness: val })}
                    bindingKey="material.metalness"
                />

                <PropertyField
                    label="粗糙度"
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={material.roughness}
                    onChange={(val) => updateMat({ roughness: val })}
                    bindingKey="material.roughness"
                />

                <PropertyField
                    label="透明度"
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={material.opacity}
                    onChange={(val) => updateMat({ opacity: val })}
                    bindingKey="material.opacity"
                />

                <PropertyField
                    label="自发光"
                    type="color"
                    inline
                    value={material.emissive}
                    onChange={(val) => updateMat({ emissive: val })}
                    bindingKey="material.emissive"
                />

                <PropertyField
                    label="自发光强度"
                    type="range"
                    min={0}
                    max={10}
                    step={0.1}
                    value={material.emissiveIntensity}
                    onChange={(val) => updateMat({ emissiveIntensity: val })}
                    bindingKey="material.emissiveIntensity"
                />

                <div className="grid grid-cols-2 gap-4">
                    <PropertyField
                        label="透明混合"
                        type="checkbox"
                        inline
                        value={material.transparent}
                        onChange={(val) => updateMat({ transparent: val })}
                        bindingKey="material.transparent"
                    />
                    <PropertyField
                        label="网格模式"
                        type="checkbox"
                        inline
                        value={material.wireframe}
                        onChange={(val) => updateMat({ wireframe: val })}
                        bindingKey="material.wireframe"
                    />
                </div>
            </div>
        </PropertySection>
    );
};

export default React.memo(MaterialSection);
