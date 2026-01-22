import { Globe, Sparkles } from "lucide-react";
import SceneSection from "./SceneSection";
import PostProcessingSection from "./PostProcessingSection";
import React from "react";
import { Button, Typography, Tooltip } from 'antd';

const { Text } = Typography;

interface SceneAllSectionProps {
    setActiveTab: (tab: string) => void;
    activeTab: string;
}
/**
 * 场景属性分组
 * @param param0 
 * @returns 
 */
const SceneAllSection: React.FC<SceneAllSectionProps> = ({ setActiveTab, activeTab }) => {
    const sceneTabs = [
        { id: 'scene', icon: <Globe size={14} />, label: '常规' },
        { id: 'post', icon: <Sparkles size={14} />, label: '后期' }
    ];
    const safeSceneTab = sceneTabs.find(t => t.id === activeTab) ? activeTab : 'scene';

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 flex items-center gap-2 border-b border-white/5 bg-white/[0.01]">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                <Text className="!text-sm !font-bold !text-white">场景配置</Text>
            </div>
            <div className="flex-1 flex overflow-hidden">
                <div className="w-12 border-r border-white/5 flex flex-col items-center py-4 gap-4 bg-black/20">
                    {sceneTabs.map(tab => (
                        <Tooltip key={tab.id} title={tab.label} placement="right">
                            <Button
                                type={safeSceneTab === tab.id ? 'primary' : 'text'}
                                icon={tab.icon}
                                onClick={() => setActiveTab(tab.id)}
                                className={`!w-10 !h-10 !flex !items-center !justify-center !rounded-lg !transition-all ${safeSceneTab === tab.id
                                    ? '!bg-green-600 !shadow-lg !shadow-green-500/20'
                                    : '!text-gray-500 hover:!text-gray-300 hover:!bg-white/5'
                                    }`}
                            />
                        </Tooltip>
                    ))}
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {safeSceneTab === 'scene' ? <SceneSection /> : <PostProcessingSection />}
                </div>
            </div>
        </div>
    );
}

export default React.memo(SceneAllSection);
