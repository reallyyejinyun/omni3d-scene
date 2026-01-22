import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button, Typography, Tag, Space, Input } from 'antd';

const { Text } = Typography;

interface PropertyHeaderProps {
    typeLabel: string;
    name: string;
    id: string;
    onDelete: () => void;
}

/**
 * 属性面板头部组件：展示对象类型、名称和ID，并提供删除功能
 */
const PropertyHeader: React.FC<PropertyHeaderProps> = ({
    typeLabel,
    name,
    id,
    onDelete
}) => {
    return (
        <div className="p-4 flex flex-col gap-3 border-b border-white/5 bg-white/[0.01]">
            <div className="flex items-center justify-between">
                <Space align="center" size={8}>
                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                    <Tag
                        color="blue"
                        variant="filled"
                        className="!text-[10px] !uppercase !font-bold !text-blue-400/80 !tracking-widest !bg-blue-500/10 !m-0"
                    >
                        {typeLabel}
                    </Tag>
                </Space>
                <Button
                    type="text"
                    danger
                    icon={<Trash2 size={14} />}
                    onClick={onDelete}
                    className="!flex !items-center !justify-center hover:!bg-red-500/10"
                    title="删除对象"
                />
            </div>

            <Space orientation="vertical" size={4} className="w-full">
                <Input
                    variant="borderless"
                    value={name}
                    readOnly
                    className="!px-0 !text-sm !font-bold !cursor-default"
                    placeholder="名称"
                />
                <Text
                    copyable={{ text: id }}
                    className="!text-[10px] !text-gray-500 !font-mono !block truncate"
                >
                    ID: {id}
                </Text>
            </Space>
        </div>
    );
};

export default React.memo(PropertyHeader);
