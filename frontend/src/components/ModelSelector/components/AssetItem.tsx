import React, { memo } from 'react';
import { type Asset } from '@/api/asset';
import { Typography } from 'antd';

const { Text } = Typography;

interface AssetItemProps {
    asset: Asset;
    isSelected: boolean;
    onClick: () => void;
}
/**
 * 资产项
 */
const AssetItem: React.FC<AssetItemProps> = ({ asset, isSelected, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`group relative bg-white/[0.03] border rounded-xl p-2 cursor-pointer transition-all ${isSelected ? 'border-blue-500 bg-blue-500/5 ring-1 ring-blue-500/20' : 'border-white/5 hover:border-white/10'
                }`}
        >
            <div className="aspect-square bg-black/40 rounded-lg overflow-hidden relative mb-2">
                <img
                    src={asset.thumbnail}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all"
                    alt={asset.name}
                />
            </div>
            <Text className="!text-[10px] !text-gray-400 group-hover:!text-white !font-medium !block truncate px-1">
                {asset.name}
            </Text>
            <Text className="!text-[8px] !text-gray-600 uppercase !block px-1 mt-0.5">
                {asset.type}
            </Text>
        </div>
    );
};

export default memo(AssetItem);
