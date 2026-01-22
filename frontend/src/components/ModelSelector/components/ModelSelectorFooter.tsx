import React, { memo } from 'react';
import { Check, Plus } from 'lucide-react';
import { Button, Space, Typography } from 'antd';

const { Text } = Typography;

interface ModelSelectorFooterProps {
    hasSelected: boolean;
    onConfirm: () => void;
}

/**
 * 模型选择器底部
 */
const ModelSelectorFooter: React.FC<ModelSelectorFooterProps> = ({ hasSelected, onConfirm }) => {
    return (
        <div className="w-full flex items-center justify-between">
            <Space size="middle">
                <Text className="!text-[10px] !text-gray-600">云端资源库已同步</Text>
                <Space size={4} className="flex items-center">
                    <Check size={12} className="text-green-500/50" />
                    <Text className="!text-[10px] !text-gray-600">资产状态正常</Text>
                </Space>
            </Space>
            {hasSelected && (
                <Button
                    type="primary"
                    icon={<Plus size={16} />}
                    onClick={onConfirm}
                    className="!h-10 !px-8 !bg-blue-600 hover:!bg-blue-500 !text-white !text-sm !font-bold !rounded-xl !border-none shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
                >
                    确认添加此模型
                </Button>
            )}
        </div>
    );
};

export default memo(ModelSelectorFooter);
