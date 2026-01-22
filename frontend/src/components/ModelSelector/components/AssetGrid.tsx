import React, { memo } from 'react';
import { Loader2 } from 'lucide-react';
import { type Asset } from '@/api/asset';
import AssetItem from './AssetItem';
import { Spin, Empty, Typography } from 'antd';

const { Text } = Typography;

interface AssetGridProps {
    assets: Asset[];
    loading: boolean;
    selectedAssetId?: string;
    onSelect: (asset: Asset) => void;
    layout: 'compact' | 'standard';
}

/**
 * 资产网格
 */
const AssetGrid: React.FC<AssetGridProps> = ({ assets, loading, selectedAssetId, onSelect, layout }) => {
    if (loading) {
        return (
            <div className="h-64 flex flex-col items-center justify-center gap-3">
                <Spin indicator={<Loader2 className="animate-spin text-blue-500" size={32} />} />
                <Text className="!text-xs !font-bold !tracking-widest !uppercase !text-gray-600">同步云端资产...</Text>
            </div>
        );
    }

    if (assets.length === 0) {
        return (
            <div className="h-64 flex flex-col items-center justify-center">
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={<Text className="!text-gray-500">没有找到匹配的模型</Text>}
                />
            </div>
        );
    }

    return (
        <div className={`grid gap-4 ${layout === 'compact' ? 'grid-cols-2' : 'grid-cols-3 md:grid-cols-4'}`}>
            {assets.map((asset) => (
                <AssetItem
                    key={asset.id}
                    asset={asset}
                    isSelected={selectedAssetId === asset.id}
                    onClick={() => onSelect(asset)}
                />
            ))}
        </div>
    );
};

export default memo(AssetGrid);
