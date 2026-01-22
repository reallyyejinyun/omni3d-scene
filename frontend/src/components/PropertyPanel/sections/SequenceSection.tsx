import React from 'react';
import { PlayCircle, Plus, Trash2, Repeat, Clock, LayoutPanelTop } from 'lucide-react';
import PropertySection from '../common/PropertySection';
import { type SceneObject, type CustomAnimation } from '@/types';
import { useStore } from '@/store';
import { Button, Input, InputNumber, Select, Switch, Space, Typography, Empty } from 'antd';

const { Text } = Typography;

interface SequenceSectionProps {
    object: SceneObject;
}

const findNameInStructure = (n: any, tid: string): string | null => {
    if (n.id === tid) return n.name;
    for (const c of (n.children || [])) {
        const f = findNameInStructure(c, tid); if (f) return f;
    }
    return null;
};
/**
 * 自定义动画序列属性分组
 * @param param0 
 * @returns 
 */
const SequenceSection: React.FC<SequenceSectionProps> = ({ object }) => {
    const setState = useStore(state => state.setState);
    const updateObject = useStore(state => state.updateObject);

    const onUpdate = React.useCallback((updates: Partial<SceneObject>) => {
        updateObject(object.id, updates);
    }, [object.id, updateObject]);

    const addAnimation = React.useCallback(() => {
        const state = useStore.getState();
        const targetId = state.selectedMeshId || null;
        const targetName = targetId && object.structure ? findNameInStructure(object.structure, targetId) : object.name;

        const newAnim: CustomAnimation = {
            id: Math.random().toString(36).substr(2, 9),
            name: `${targetName} 状态序列 ${(object.customAnimations?.length || 0) + 1}`,
            duration: 3,
            loopType: 'loop',
            autoPlay: false,
            easing: 'easeInOut',
            tracks: [
                {
                    id: Math.random().toString(36).substr(2, 9),
                    targetId: targetId || undefined,
                    keyframes: []
                }
            ]
        };
        onUpdate({
            customAnimations: [...(object.customAnimations || []), newAnim]
        });
    }, [object.id, object.name, object.structure, object.customAnimations, onUpdate]);

    const removeAnimation = React.useCallback((id: string) => {
        onUpdate({
            customAnimations: (object.customAnimations || []).filter(a => a.id !== id)
        });
    }, [object.customAnimations, onUpdate]);

    const updateAnimation = React.useCallback((id: string, updates: Partial<CustomAnimation>) => {
        onUpdate({
            customAnimations: (object.customAnimations || []).map(a => a.id === id ? { ...a, ...updates } : a)
        });
    }, [object.customAnimations, onUpdate]);

    const handleEditTimeline = React.useCallback((animId: string) => {
        setState({
            bottomPanelVisible: true,
            timelineVisible: true,
            activeTimelineAnimationId: animId,
            activeTimelineObjectId: object.id
        });
    }, [object.id, setState]);

    return (
        <PropertySection title="动画序列编辑器" icon={<PlayCircle size={12} />}>
            <div className="space-y-4">
                <Button
                    type="primary"
                    icon={<Plus size={14} />}
                    onClick={addAnimation}
                    block
                    className="!bg-blue-600 hover:!bg-blue-500 !flex !items-center !justify-center shadow-lg shadow-blue-500/20"
                >
                    新增状态序列
                </Button>

                <div className="space-y-4">
                    {(!object.customAnimations || object.customAnimations.length === 0) && (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={<Text className="!text-[10px] !text-gray-500">暂无自定义动画</Text>}
                        />
                    )}

                    {object.customAnimations?.map((anim) => (
                        <div key={anim.id} className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-4 group relative border-l-4 border-l-blue-500 transition-all hover:bg-white/[0.05]">
                            <div className="flex items-center gap-2">
                                <div className="flex flex-col flex-1 truncate">
                                    <Input
                                        size="small"
                                        variant="borderless"
                                        value={anim.name}
                                        onChange={(e) => updateAnimation(anim.id, { name: e.target.value })}
                                        className="!p-0 !text-xs !font-bold !text-white w-full truncate border-b !border-transparent hover:!border-blue-500/30 focus:!border-blue-500"
                                        placeholder="名称"
                                    />
                                    {anim.tracks?.length > 0 && (
                                        <Text className="!text-[8px] !text-blue-400/80 !uppercase !tracking-tighter !mt-1">
                                            轨道数: {anim.tracks.length} |
                                            作用于: {anim.tracks.length === 1 ? (findNameInStructure(object.structure || {}, anim.tracks[0].targetId || object.id) || '未知组件') : '多个组件'}
                                        </Text>
                                    )}
                                </div>
                                <Button
                                    type="text"
                                    danger
                                    size="small"
                                    icon={<Trash2 size={12} />}
                                    onClick={() => removeAnimation(anim.id)}
                                    className="!text-red-500/60 hover:!text-red-400 hover:!bg-red-500/10 !flex !items-center !justify-center"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-[10px]">
                                <Space orientation="vertical" size={4} className="w-full">
                                    <Text className="!text-[9px] !opacity-50 !flex !items-center !gap-1"><Clock size={10} /> 时长(秒)</Text>
                                    <InputNumber
                                        size="small"
                                        variant="filled"
                                        min={0}
                                        step={0.1}
                                        value={anim.duration}
                                        onChange={(val) => updateAnimation(anim.id, { duration: val || 0 })}
                                        className="!w-full"
                                    />
                                </Space>
                                <Space orientation="vertical" size={4} className="w-full">
                                    <Text className="!text-[9px] !opacity-50 !flex !items-center !gap-1"><Repeat size={10} /> 模式</Text>
                                    <Select
                                        size="small"
                                        variant="filled"
                                        value={anim.loopType}
                                        onChange={(val) => updateAnimation(anim.id, { loopType: val as any })}
                                        className="!w-full"
                                        options={[
                                            { value: 'loop', label: '循环 (Loop)' },
                                            { value: 'pingpong', label: '往返 (Ping-pong)' },
                                            { value: 'once', label: '单次' }
                                        ]}
                                    />
                                </Space>

                                <div className="col-span-2 flex items-center justify-between bg-black/20 px-3 py-2 rounded-lg border border-white/5">
                                    <Text className="!text-[9px] !text-gray-400 !font-bold !uppercase !tracking-tight">自动播放</Text>
                                    <Switch
                                        size="small"
                                        checked={!!anim.autoPlay}
                                        onChange={(checked) => updateAnimation(anim.id, { autoPlay: checked })}
                                    />
                                </div>
                            </div>

                            <Button
                                block
                                icon={<LayoutPanelTop size={12} />}
                                onClick={() => handleEditTimeline(anim.id)}
                                className="!bg-blue-500/10 hover:!bg-blue-500/20 !border-blue-500/20 !text-blue-400 !text-[10px] !font-bold !flex !items-center !justify-center !h-8"
                            >
                                编辑关键帧时间轴
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </PropertySection>
    );
};

export default React.memo(SequenceSection);
