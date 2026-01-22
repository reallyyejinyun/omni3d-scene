import React from 'react';
import { Typography, Space } from 'antd';

const { Text } = Typography;
/**
 * 属性分组
 * @param param0 
 * @returns 
 */
const PropertySection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => {
    return (
        <div className="border-b border-white/5 last:border-0 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.02]">
                <Space size={8}>
                    {icon}
                    <Text className="!text-[10px] !font-bold !uppercase !tracking-widest !opacity-60 !text-white">
                        {title}
                    </Text>
                </Space>
            </div>
            <div className="p-4 space-y-4">
                {children}
            </div>
        </div>
    );
};

export default React.memo(PropertySection);
