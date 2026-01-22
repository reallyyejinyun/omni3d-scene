import React, { useCallback } from 'react';
import { Database, Move } from 'lucide-react';
import PropertySection from '../common/PropertySection';
import PropertyField from '../common/PropertyField';
import { type SceneGraphNode, type SceneObject } from '@/types';
import { Typography, Row, Col } from 'antd';
import { useStore } from '@/store';
import { useTransformUpdate } from '@/hooks/useTransformUpdate';
import { showDataBindingModal } from '@/components/DataBindingModal';

const { Text } = Typography;

interface TransformSectionProps {
    targetObject: SceneGraphNode | SceneObject;
    onUpdate: (updates: Partial<SceneObject>) => void;
}
/**
 * 向量属性分组
 * @param param0 
 * @returns 
 */
const AxisInputs: React.FC<{
    field: 'position' | 'rotation' | 'scale',
    label: string,
    targetObject: SceneGraphNode | SceneObject,
    onTransformChange: (axis: number, val: number, field: 'position' | 'rotation' | 'scale') => void
}> = React.memo(({ field, label, targetObject, onTransformChange }) => {

    let bindingKey = field

    const updateObject = useStore((state) => state.updateObject);
    const selectedId = useStore((state) => state.selectedId);
    const selectedMeshId = useStore((state) => state.selectedMeshId);
    const object = useStore(state => state.objects.find(o => o.id === selectedId));

    // 如果是子网格，绑定 Key 需要带上 meshId 前缀
    const actualBindingKey = (selectedMeshId && bindingKey) ? `${selectedMeshId}:${bindingKey}` : bindingKey;

    // 从 Store 中获取当前的绑定状态
    const binding = actualBindingKey ? object?.dataBindings?.[actualBindingKey] : undefined;

    const handleOpenBinding = useCallback(async () => {
        if (!selectedId || !actualBindingKey) return;

        const result = await showDataBindingModal({
            propertyName: label,
            initialBinding: binding
        });

        if (result !== undefined) {
            const currentBindings = { ...(object?.dataBindings || {}) };
            if (result) {
                currentBindings[actualBindingKey] = result;
            } else {
                delete currentBindings[actualBindingKey];
            }

            updateObject(selectedId, {
                dataBindings: currentBindings
            });
        }
    }, [selectedId, actualBindingKey, object, label, binding, updateObject]);


    return <div className="space-y-2">
        <div className="flex items-center gap-1.5 group">
            <Database
                size={10}
                className={`cursor-pointer transition-colors ${binding?.enabled ? 'text-blue-400 opacity-100' : 'text-gray-600 opacity-0 group-hover:opacity-100 hover:text-blue-400'}`}
                onClick={handleOpenBinding}
            />
            <Text className="!text-[10px] !opacity-50 !font-bold !tracking-wider !flex !items-center !gap-1 !uppercase !text-white">{label}</Text>
        </div>
        <Row gutter={8}>
            {['X', 'Y', 'Z'].map((axisLabel, idx) => (
                <Col span={8} key={axisLabel}>
                    <PropertyField
                        label=""
                        type="number"
                        value={targetObject[field]?.[idx] ?? (field === 'scale' ? 1 : 0)}
                        onChange={(val) => onTransformChange(idx, val, field)}
                        className="!space-y-0"
                        placeholder={axisLabel}
                    />
                </Col>
            ))}
        </Row>

    </div>
});

/**
 * 变换属性分组
 * @param param0 
 * @returns 
 */
const TransformSection: React.FC<TransformSectionProps> = ({ targetObject, onUpdate }) => {
    const { handleTransformChange } = useTransformUpdate(targetObject, onUpdate);

    return (
        <PropertySection title="变换信息" icon={<Move size={12} />}>
            <div className="space-y-5">
                <AxisInputs field="position" label="位置 (Position)" targetObject={targetObject} onTransformChange={handleTransformChange} />
                <AxisInputs field="rotation" label="旋转 (Rotation)" targetObject={targetObject} onTransformChange={handleTransformChange} />
                <AxisInputs field="scale" label="缩放 (Scale)" targetObject={targetObject} onTransformChange={handleTransformChange} />

                <div className="pt-4 border-t border-white/5">
                    <PropertyField
                        label="是否可见"
                        type="checkbox"
                        inline
                        value={targetObject.visible !== false}
                        onChange={(val) => onUpdate({ visible: val })}
                        bindingKey="visible"
                    />
                </div>
            </div>
        </PropertySection>
    );
};

export default React.memo(TransformSection);
