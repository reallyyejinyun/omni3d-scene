import React, { useState, useEffect } from 'react';
import { FileCode, Link, Play } from 'lucide-react';
import PropertySection from '../common/PropertySection';
import type { SceneObject } from '@/types';
import { useStore } from '@/store';
import { Input, Tag, Space, Typography, Button, Checkbox } from 'antd';

const { Text } = Typography;

interface GltfSectionProps {
    object: SceneObject;
}
/**
 * gltf 模型属性分组
 * @param param0 
 * @returns 
 */
const GltfSection: React.FC<GltfSectionProps> = ({ object }) => {
    const [localUrl, setLocalUrl] = useState(object.url || '');
    const updateObject = useStore(state => state.updateObject);

    const onUpdate = React.useCallback((updates: Partial<SceneObject>) => {
        updateObject(object.id, updates);
    }, [object.id, updateObject]);

    // 同步外部变更
    useEffect(() => {
        setLocalUrl(object.url || '');
    }, [object.url]);

    const handleBlur = React.useCallback(() => {
        if (localUrl !== object.url) {
            onUpdate({ url: localUrl });
        }
    }, [localUrl, object.url, onUpdate]);

    const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleBlur();
            (e.target as HTMLInputElement).blur();
        }
    }, [handleBlur]);

    const handleAnimationToggle = React.useCallback((name: string) => {
        const currentAnims = object.activeAnimations || [];
        const isActive = currentAnims.includes(name);
        let nextAnims: string[];
        if (isActive) {
            nextAnims = currentAnims.filter(a => a !== name);
        } else {
            nextAnims = [...currentAnims, name];
        }
        onUpdate({
            activeAnimations: nextAnims
        });
    }, [object.activeAnimations, onUpdate]);

    const handleStopAll = React.useCallback(() => onUpdate({ activeAnimations: [] }), [onUpdate]);

    return (
        <Space orientation="vertical" size={16} className="w-full">
            <PropertySection title="内置动画序列" icon={<Play size={12} />}>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Text className="!text-[10px] !opacity-50 !uppercase !tracking-wider">多动画并行播放</Text>
                        <Tag color="blue" bordered={false} className="!text-[8px] !px-1.5 !py-0 !leading-4 !m-0 !font-bold">
                            {(object.activeAnimations?.length || 0)} ACTIVE
                        </Tag>
                    </div>

                    <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar pr-1">
                        {object.structure?.userData?.animations?.map((name: string) => {
                            const isActive = object.activeAnimations?.includes(name)

                            return (
                                <div
                                    key={name}
                                    onClick={() => handleAnimationToggle(name)}
                                    className={`group flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all border ${isActive
                                        ? 'bg-blue-600/20 border-blue-500/50 text-blue-200'
                                        : 'bg-white/[0.03] border-transparent text-gray-500 hover:bg-white/10 hover:text-gray-300'
                                        }`}
                                >
                                    <Text className="!text-xs !truncate !max-w-[140px] !text-inherit">{name}</Text>
                                    <Checkbox checked={isActive} className="pointer-events-none" />
                                </div>
                            );
                        }) || (
                                <div className="py-4 text-center">
                                    <Text italic className="!text-[9px] !text-gray-600">尚未载入模型或未检测到可用动画。</Text>
                                </div>
                            )}
                    </div>

                    {object.activeAnimations && object.activeAnimations.length > 0 && (
                        <Button
                            type="text"
                            danger
                            size="small"
                            block
                            onClick={handleStopAll}
                            className="!text-[10px] !text-red-400/60 hover:!text-red-400 hover:!bg-red-400/10"
                        >
                            停止所有动画
                        </Button>
                    )}
                </div>
            </PropertySection>
        </Space>
    );
};

export default React.memo(GltfSection);
