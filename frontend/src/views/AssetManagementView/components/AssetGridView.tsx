import React, { memo } from 'react';
import { Button, Dropdown } from 'antd';
import { MoreHorizontal, Edit, Trash2, ExternalLink } from 'lucide-react';
import { type Asset } from '@/api/asset';

import EmptyState from '@/components/common/EmptyState';
import { PackageOpen } from 'lucide-react';

interface AssetGridViewProps {
    assets: Asset[];
    onEdit: (asset: Asset) => void;
    onDelete: (id: string) => void;
    onPreview: (asset: Asset) => void;
    onUpload?: () => void;
}

const AssetGridView: React.FC<AssetGridViewProps> = ({ assets, onEdit, onDelete, onPreview, onUpload }) => {
    if (assets.length === 0) {
        return (
            <EmptyState
                icon={<PackageOpen size={40} />}
                title="素材库空空如也"
                description="还没有上传任何 3D 模型或贴图。点击下方按钮上传您的第一个素材组件。"
                actionText="上传新素材"
                onAction={onUpload}
            />
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {assets.map((asset) => (
                <div
                    key={asset.id}
                    className="group bg-white/5 border border-white/5 rounded-2xl overflow-hidden hover:border-purple-500/50 hover:bg-white/[0.08] transition-all flex flex-col cursor-pointer"
                    onClick={() => onPreview(asset)}
                >
                    <div className="aspect-video bg-black/40 relative overflow-hidden">
                        <img
                            src={asset.thumbnail || asset.url}
                            alt={asset.name}
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1" onClick={(e) => e.stopPropagation()}>
                            <Button
                                size="small"
                                type="text"
                                icon={<Edit size={14} className="text-white" />}
                                onClick={(e) => { e.stopPropagation(); onEdit(asset); }}
                                className="bg-white/10 hover:bg-white/20 backdrop-blur-md"
                            />
                            <Button
                                size="small"
                                type="text"
                                danger
                                icon={<Trash2 size={14} />}
                                onClick={(e) => { e.stopPropagation(); onDelete(asset.id); }}
                                className="bg-red-500/20 hover:bg-red-500/40 backdrop-blur-md border-none"
                            />
                        </div>

                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/40 backdrop-blur-md rounded text-[10px] text-gray-400 border border-white/10 italic">
                            {asset.categoryId}
                        </div>
                    </div>

                    <div className="p-4 flex items-center justify-between">
                        <div className="min-w-0">
                            <h4 className="text-sm font-bold text-white truncate font-sans">{asset.name}</h4>
                            <p className="text-[10px] text-gray-500 uppercase mt-0.5 tracking-wider font-sans">{asset.type} • 2.4 MB</p>
                        </div>
                        <Dropdown
                            menu={{
                                items: [
                                    {
                                        key: 'preview',
                                        label: '预览模型',
                                        icon: <ExternalLink size={14} />,
                                        onClick: ({ domEvent }) => { domEvent.stopPropagation(); onPreview(asset); }
                                    },
                                    {
                                        key: 'edit',
                                        label: '编辑全息',
                                        icon: <Edit size={14} />,
                                        onClick: ({ domEvent }) => { domEvent.stopPropagation(); onEdit(asset); }
                                    },
                                    { type: 'divider' },
                                    {
                                        key: 'delete',
                                        label: '删除素材',
                                        icon: <Trash2 size={14} />,
                                        danger: true,
                                        onClick: ({ domEvent }) => { domEvent.stopPropagation(); onDelete(asset.id); }
                                    },
                                ]
                            }}
                            trigger={['click']}
                        >
                            <Button
                                type="text"
                                icon={<MoreHorizontal size={16} />}
                                className="text-gray-500 hover:text-white"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </Dropdown>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default memo(AssetGridView);
