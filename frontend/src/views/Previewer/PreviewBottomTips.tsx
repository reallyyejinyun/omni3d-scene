import React from 'react';
import { useStore } from '@/store';
import { Typography } from 'antd';

const { Text } = Typography;

/**
 * 底部操作提示组件
 */
const PreviewBottomTips: React.FC = () => {
    const hasRoaming = useStore(state => state.roamingNodes.length >= 2);

    return (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-[100]">
            <div className="px-5 py-2 bg-black/50 backdrop-blur-md rounded-full border border-white/5 shadow-xl">
                <Text className="!text-[10px] !font-bold !text-white/30 !tracking-[0.1em] !uppercase">
                    鼠标左键旋转 · 右键平移 · 滚轮缩放 {hasRoaming && '· 空格键漫游'}
                </Text>
            </div>
        </div>
    );
};

export default React.memo(PreviewBottomTips);
