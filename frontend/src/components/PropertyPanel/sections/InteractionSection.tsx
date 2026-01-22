import React from 'react';
import { MousePointerClick, Plus, Trash2, Zap } from 'lucide-react';
import PropertySection from '../common/PropertySection';
import { useStore } from '@/store';
import { type SceneObject } from '@/types';
import PropertyField from '../common/PropertyField';
import { findNodeInTree } from '@/store/utils';
import { Button, Typography, Space, Empty, Tag } from 'antd';

const { Text } = Typography;

interface InteractionSectionProps {
    object: SceneObject;
}

const ACTION_OPTIONS = [
    { value: 'PLAY_ANIMATION', label: '播放模型动画' },
    { value: 'PLAY_CUSTOM_ANIMATION', label: '播放自定序列' },
    { value: 'TOGGLE_VISIBLE', label: '切换显示/隐藏' },
    { value: 'SET_PROPERTY', label: '设置属性' }
];

import { useInteractionEvents } from '@/hooks/useInteractionEvents';

/**
 * 交互事件属性分组
 * @param param0 
 * @returns 
 */
const InteractionSection: React.FC<InteractionSectionProps> = ({ object, }) => {
    const objects = useStore(state => state.objects);
    const updateObject = useStore(state => state.updateObject);
    const selectedMeshId = useStore(state => state.selectedMeshId);

    const onUpdate = React.useCallback((updates: Partial<SceneObject>) => {
        updateObject(object.id, updates);
    }, [object.id, updateObject]);

    const { addEvent, removeEvent, updateEvent } = useInteractionEvents(object, onUpdate, selectedMeshId);

    // 获取目标对象的自定义动画列表
    const getTargetAnimations = React.useCallback((targetId?: string) => {
        const target = objects.find(o => o.id === (targetId || object.id));
        return target?.customAnimations || [];
    }, [objects, object.id]);

    return (
        <PropertySection title="交互事件" icon={<MousePointerClick size={12} />}>
            <div className="space-y-4">
                <Button
                    type="primary"
                    icon={<Plus size={14} />}
                    onClick={addEvent}
                    block
                >
                    添加点击事件
                </Button>

                <div className="space-y-4">
                    {(!object.events?.onClick || object.events.onClick.length === 0) && (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={<Text className="!text-gray-500 !text-[10px]">点击上方按钮添加交互逻辑</Text>}
                        />
                    )}

                    {object.events?.onClick?.map((event) => (
                        <div key={event.id} className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-4 group relative transition-all hover:bg-white/[0.05]">
                            <Button
                                type="text"
                                danger
                                size="small"
                                icon={<Trash2 size={12} />}
                                onClick={() => removeEvent(event.id)}
                                className="!absolute !right-2 !top-2 !opacity-0 group-hover:!opacity-100 !transition-opacity"
                            />

                            <Space orientation="vertical" size={12} className="w-full">
                                <div className="flex items-center justify-between">
                                    <Space size={4}>
                                        <Zap size={10} className="text-purple-400" />
                                        <Text className="!text-[10px] !text-purple-400 !font-bold !uppercase !tracking-wider">点击交互</Text>
                                    </Space>
                                </div>

                                <PropertyField
                                    label="执行动作"
                                    type="select"
                                    value={event.action}
                                    onChange={(val) => updateEvent(event.id, { action: val })}
                                    options={ACTION_OPTIONS}
                                />

                                <PropertyField
                                    label="目标对象"
                                    type="select"
                                    value={event.targetId}
                                    onChange={(val) => updateEvent(event.id, { targetId: val })}
                                    options={[
                                        { value: object.id, label: '当前对象 (自身)' },
                                        ...objects.filter(o => o.id !== object.id).map(o => ({ value: o.id, label: o.name }))
                                    ]}
                                />

                                <Space orientation="vertical" size={4} className="w-full">
                                    <PropertyField
                                        label="目标组件 ID"
                                        type="text"
                                        placeholder="留空则控制整体对象.."
                                        value={event.targetMeshId || ''}
                                        onChange={(val) => updateEvent(event.id, { targetMeshId: val || null })}
                                    />
                                    {selectedMeshId && event.targetMeshId !== selectedMeshId && (
                                        <Button
                                            type="link"
                                            size="small"
                                            onClick={() => updateEvent(event.id, { targetMeshId: selectedMeshId })}
                                            className="!text-[10px] !p-0 !h-auto !text-left"
                                        >
                                            将选中组件设为目标
                                        </Button>
                                    )}
                                </Space>

                                <Space orientation="vertical" size={4} className="w-full">
                                    <PropertyField
                                        label="触发网格 ID"
                                        type="text"
                                        placeholder="留空则点击整体触发.."
                                        value={event.sourceMeshId || ''}
                                        onChange={(val) => updateEvent(event.id, { sourceMeshId: val || null })}
                                    />
                                    {selectedMeshId && event.sourceMeshId !== selectedMeshId && (
                                        <Button
                                            type="link"
                                            size="small"
                                            onClick={() => updateEvent(event.id, { sourceMeshId: selectedMeshId })}
                                            className="!text-[10px] !p-0 !h-auto !text-left"
                                        >
                                            使用当前选中网格
                                        </Button>
                                    )}
                                </Space>

                                {event.action === 'PLAY_ANIMATION' && (
                                    <PropertyField
                                        label="内置动画名称"
                                        type="text"
                                        placeholder="输入模型内置动画名称.."
                                        value={event.value}
                                        onChange={(val) => updateEvent(event.id, { value: val })}
                                    />
                                )}

                                {event.action === 'PLAY_CUSTOM_ANIMATION' && (
                                    <PropertyField
                                        label="选择自定序列"
                                        type="select"
                                        value={event.value}
                                        onChange={(val) => updateEvent(event.id, { value: val })}
                                        options={[
                                            { value: '', label: '请选择动画...' },
                                            ...getTargetAnimations(event.targetId).map(anim => ({ value: anim.id, label: anim.name }))
                                        ]}
                                    />
                                )}

                                {event.action === 'SET_PROPERTY' && (
                                    <PropertyField
                                        label="属性路径与值 (JSON)"
                                        type="text"
                                        value={event.value}
                                        onChange={(val) => updateEvent(event.id, { value: val })}
                                        placeholder='{"position": [0, 2, 0]}'
                                    />
                                )}
                            </Space>
                        </div>
                    ))}
                </div>
            </div>
        </PropertySection>
    );
};

export default React.memo(InteractionSection);
