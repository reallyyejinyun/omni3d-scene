import React, { memo } from 'react';
import { Orbit } from 'lucide-react';
import { type Asset } from '@/api/asset';
import ModelPreview from '@/components/common/ModelPreview';
import { Typography, Tag, Space } from 'antd';

const { Title, Paragraph } = Typography;

interface AssetPreviewProps {
    asset: Asset;
}
/**
 * 资产预览
 */
const AssetPreview: React.FC<AssetPreviewProps> = ({ asset }) => {
    return (
        <div className="w-2/5 flex flex-col bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden animate-in slide-in-from-right-4 duration-300">
            <div className="flex-1 relative group">
                <ModelPreview src={asset.url} />

                <div className="absolute top-4 left-4 flex flex-col gap-1">
                    <Tag
                        icon={<Orbit size={12} />}
                        color="blue"
                        variant="filled"
                        className="!bg-blue-600/20 !text-blue-400 !border-blue-500/20 !rounded-lg !text-[10px] !font-bold flex items-center gap-2 !m-0 !py-1"
                    >
                        可交互预览
                    </Tag>
                </div>
            </div>

            <div className="p-6 border-t border-white/5 space-y-4">
                <div>
                    <Title level={4} className="!text-white !mb-2 !font-bold">{asset.name}</Title>
                    <Space size={8}>
                        <Tag color="default" bordered={false} className="!bg-white/5 !text-gray-500 !text-[9px] !font-bold !rounded !m-0">PBR READY</Tag>
                        <Tag color="default" bordered={false} className="!bg-white/5 !text-gray-500 !text-[9px] !font-bold !rounded !m-0">READY TO ADD</Tag>
                    </Space>
                </div>
                <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                    <Paragraph className="!text-[10px] !text-blue-400/80 !leading-relaxed !italic !mb-0">
                        "提示：该模型支持 360 度旋转预览，确认无误后点击下方按钮即可一键添加至场景中心位置。"
                    </Paragraph>
                </div>
            </div>
        </div>
    );
};

export default memo(AssetPreview);
