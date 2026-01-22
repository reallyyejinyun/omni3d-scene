import React from 'react';
import { useStore } from '@/store';
import { Button, Space, Typography } from 'antd';

const { Text } = Typography;

/**
 * 预览模式顶部工具栏
 */
const PreviewTopBar: React.FC = () => {
    const isRoaming = useStore(state => state.isRoaming);
    const roamingNodesCount = useStore(state => state.roamingNodes.length);
    const toggleRoaming = useStore(state => state.toggleRoaming);

    return (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-6 px-8 py-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full transition-all hover:bg-black/60 shadow-2xl z-[100] pointer-events-auto">
            <Space size="middle" align="center">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] animate-pulse" />
                    <Text className="!text-[10px] !font-black !text-white/60 !tracking-[2px] !uppercase !whitespace-nowrap">Previewing Scene</Text>
                </div>

                {roamingNodesCount >= 2 && (
                    <>
                        <div className="w-[1px] h-3 bg-white/10" />
                        <Space size="large" align="center">
                            <Text className="!text-[9px] !text-white/30 !uppercase !font-bold !whitespace-nowrap">Auto Tour</Text>
                            <Button
                                size="small"
                                onClick={toggleRoaming}
                                className={`!flex !items-center !gap-2 !px-4 !py-0 !h-7 !rounded-full !text-[10px] !font-bold !transition-all !border ${isRoaming
                                    ? '!bg-red-500/20 !border-red-500/50 !text-red-400'
                                    : '!bg-blue-600/20 !border-blue-500/50 !text-blue-400 hover:!bg-blue-600/40'
                                    }`}
                            >
                                {isRoaming ? (
                                    <>
                                        <div className="w-1.5 h-1.5 rounded-sm bg-red-400" />
                                        STOP
                                    </>
                                ) : (
                                    <>
                                        <div className="w-0 h-0 border-y-[4px] border-y-transparent border-l-[6px] border-l-blue-400" />
                                        START
                                    </>
                                )}
                            </Button>
                        </Space>
                    </>
                )}
            </Space>
        </div>
    );
};

export default React.memo(PreviewTopBar);
