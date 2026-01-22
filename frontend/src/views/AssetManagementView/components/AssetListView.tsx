import React, { memo } from 'react';
import { Table, Button, Space, Tag, Dropdown } from 'antd';
import { Box, MoreHorizontal, Edit, Trash2, Download, ExternalLink } from 'lucide-react';
import { type Asset } from '@/api/asset';
import EmptyState from '@/components/common/EmptyState';

interface AssetListViewProps {
    assets: Asset[];
    onEdit: (asset: Asset) => void;
    onDelete: (id: string) => void;
    onPreview: (asset: Asset) => void;
    onUpload?: () => void;
}

const AssetListView: React.FC<AssetListViewProps> = ({ assets, onEdit, onDelete, onPreview, onUpload }) => {
    const columns = [
        {
            title: '素材',
            key: 'asset',
            render: (_: any, record: Asset) => (
                <div className="flex items-center gap-4 cursor-pointer" onClick={() => onPreview(record)}>
                    <div className="w-16 h-10 bg-black/40 rounded-lg overflow-hidden border border-white/5">
                        <img src={record.thumbnail} className="w-full h-full object-cover opacity-60" />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-white">{record.name}</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest">{record.type}</div>
                    </div>
                </div>
            )
        },
        {
            title: '分类',
            dataIndex: 'categoryId',
            key: 'category',
            render: (category: string) => (
                <Tag color="purple" bordered={false} className="bg-purple-500/10 text-purple-400 capitalize">
                    {category}
                </Tag>
            )
        },
        {
            title: '大小',
            key: 'size',
            render: () => <span className="text-gray-500 text-xs">2.4 MB</span>
        },
        {
            title: '更新时间',
            key: 'updated',
            render: () => <span className="text-gray-500 text-xs">昨天 14:20</span>
        },
        {
            title: '操作',
            key: 'actions',
            align: 'right' as const,
            render: (_: any, record: Asset) => (
                <Space>
                    <Button
                        type="text"
                        size="small"
                        icon={<ExternalLink size={16} />}
                        onClick={() => onPreview(record)}
                        className="text-gray-400 hover:text-white"
                    />
                    <Button
                        type="text"
                        size="small"
                        icon={<Edit size={16} />}
                        onClick={() => onEdit(record)}
                        className="text-gray-400 hover:text-white"
                    />
                    <Button
                        type="text"
                        size="small"
                        danger
                        icon={<Trash2 size={16} />}
                        onClick={() => onDelete(record.id)}
                        className="hover:bg-red-500/10"
                    />
                    <Dropdown
                        menu={{
                            items: [
                                { key: 'download', label: '下载原文件', icon: <Download size={14} /> },
                                { type: 'divider' },
                                { key: 'delete', label: '彻底删除', icon: <Trash2 size={14} />, danger: true, onClick: () => onDelete(record.id) },
                            ]
                        }}
                    >
                        <Button type="text" size="small" icon={<MoreHorizontal size={16} />} className="text-gray-500" />
                    </Dropdown>
                </Space>
            )
        }
    ];

    return (
        <Table
            dataSource={assets}
            columns={columns}
            rowKey="id"
            pagination={false}
            className="custom-antd-table"
            locale={{
                emptyText: (
                    <EmptyState
                        icon={<Box size={40} />}
                        title="素材库空空如也"
                        description="当前没有任何素材。您可以切换到网格视图查看，或点击下方按钮开始上传。"
                        actionText="上传新素材"
                        onAction={onUpload}
                    />
                )
            }}
        />
    );
};

export default memo(AssetListView);
