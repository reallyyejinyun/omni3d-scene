import React from 'react';
import {
    Pause, Play, Square, Zap,
    ChevronUp, ChevronDown, Minimize2
} from 'lucide-react';
import { useStore } from '@/store';
import { calculateVisualProgress } from '@/utils';
import { Button, Tag, Typography, Space, Tooltip } from 'antd';

const { Text } = Typography;

/**
 * 时间数字显示组件
 */
const TimeDisplay: React.FC<{ duration: number; loopType?: string }> = ({ duration, loopType }) => {
    const currentTime = useStore(state => state.timelineCurrentTime);
    const progress = React.useMemo(() => calculateVisualProgress(currentTime, duration, loopType), [currentTime, duration, loopType]);
    const visualTime = progress * duration;

    return (
        <Space size={4} className="pl-4 border-l border-white/10">
            <Text className="!text-[11px] !font-mono !tracking-widest !font-bold !text-white">{visualTime.toFixed(2)}s</Text>
            <Text className="!text-[11px] !opacity-30 !text-white">/</Text>
            <Text className="!text-[11px] !opacity-50 !text-gray-400 !font-mono">{duration.toFixed(1)}s</Text>
        </Space>
    );
};

interface TimelineToolbarProps {
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    onRecord: () => void;
}
/**
 * 时间轴工具栏
 * @param param0 
 * @returns 
 */
const TimelineToolbar: React.FC<TimelineToolbarProps> = ({
    isCollapsed,
    onToggleCollapse,
    onRecord
}) => {
    const objects = useStore(state => state.objects);
    const activeTimelineObjectId = useStore(state => state.activeTimelineObjectId);
    const activeTimelineAnimationId = useStore(state => state.activeTimelineAnimationId);
    const isTimelinePlaying = useStore(state => state.isTimelinePlaying);
    const setState = useStore(state => state.setState);

    const targetObject = objects.find(o => o.id === activeTimelineObjectId);
    const targetAnim = targetObject?.customAnimations?.find(a => a.id === activeTimelineAnimationId);

    if (!targetAnim) return null;

    return (
        <div className="h-10 px-4 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
            <Space size={16} align="center">
                <Tag color="red" variant="filled" className="!text-[10px] !font-bold !m-0 !py-0 !leading-4">MULTI-TRACK</Tag>
                <Text className="!text-xs !font-mono !text-white/80 !max-w-[150px] !truncate">{targetAnim.name}</Text>

                <Space size={2} className="bg-black/40 rounded-lg p-0.5">
                    <Button
                        type={!isTimelinePlaying ? 'primary' : 'text'}
                        size="small"
                        icon={<Pause size={14} />}
                        onClick={() => setState({ isTimelinePlaying: false })}
                        className={`!w-8 !h-8 !flex !items-center !justify-center !border-none ${!isTimelinePlaying ? '!bg-white/10 !text-white' : '!text-gray-400 hover:!bg-white/5'}`}
                    />
                    <Button
                        type={isTimelinePlaying ? 'primary' : 'text'}
                        size="small"
                        icon={<Play size={14} />}
                        onClick={() => {
                            const state = useStore.getState();
                            const p = state.timelineCurrentTime / targetAnim.duration;
                            if (p >= 0.99 && targetAnim.loopType === 'once') {
                                setState({ timelineCurrentTime: 0, isTimelinePlaying: true });
                            } else {
                                setState({ isTimelinePlaying: true });
                            }
                        }}
                        className={`!w-8 !h-8 !flex !items-center !justify-center !border-none ${isTimelinePlaying ? '!bg-blue-600 !text-white shadow-lg' : '!text-gray-400 hover:!bg-white/5'}`}
                    />
                    <Button
                        type="text"
                        size="small"
                        icon={<Square size={14} />}
                        onClick={() => setState({ isTimelinePlaying: false, timelineCurrentTime: 0 })}
                        className="!w-8 !h-8 !flex !items-center !justify-center !text-gray-400 hover:!bg-white/5 !border-none"
                    />
                </Space>

                <Button
                    icon={<Zap size={14} className="fill-red-400" />}
                    onClick={onRecord}
                    className="!bg-red-500/20 hover:!bg-red-500/30 !border-red-500/30 !text-red-400 !flex !items-center !justify-center !h-8 !px-3"
                >
                    <span className="text-[10px] font-bold">打点 (记录选中项)</span>
                </Button>

                <TimeDisplay duration={targetAnim.duration} loopType={targetAnim.loopType} />
            </Space>

            <Space size={4}>
                <Tooltip title={isCollapsed ? "展开面板" : "收起面板"}>
                    <Button
                        type="text"
                        icon={isCollapsed ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        onClick={onToggleCollapse}
                        className="!text-gray-400 hover:!text-white hover:!bg-white/5 !flex !items-center !justify-center"
                    />
                </Tooltip>
                <Tooltip title="关闭时间轴">
                    <Button
                        type="text"
                        danger
                        icon={<Minimize2 size={16} />}
                        onClick={() => setState({ timelineVisible: false })}
                        className="!text-gray-400 hover:!text-red-400 hover:!bg-red-500/10 !flex !items-center !justify-center"
                    />
                </Tooltip>
            </Space>
        </div>
    );
};

export default React.memo(TimelineToolbar);
