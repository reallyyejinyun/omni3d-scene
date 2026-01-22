import React from 'react';
import { Download, ChevronDown, FileJson, FileType, Globe } from 'lucide-react';
import { ExportFormat } from '@/types';
import { Dropdown, Button, Space, type MenuProps } from 'antd';

interface PublishMenuProps {
    onPublish: (format: ExportFormat) => void;
}

export const PublishMenu: React.FC<PublishMenuProps> = ({ onPublish }) => {
    const items: MenuProps['items'] = [
        {
            key: ExportFormat.JSON,
            icon: <FileJson size={14} />,
            label: '导出 JSON 描述',
            onClick: () => onPublish(ExportFormat.JSON)
        },
        {
            key: ExportFormat.JS,
            icon: <FileType size={14} />,
            label: '导出 JS 脚本',
            onClick: () => onPublish(ExportFormat.JS)
        },
        {
            key: ExportFormat.HTML,
            icon: <Globe size={14} />,
            label: '导出 HTML (即将支持)',
            onClick: () => onPublish(ExportFormat.HTML),
            disabled: true
        }
    ];

    return (
        <Dropdown menu={{ items }} placement="bottomRight" trigger={['click']}>
            <Button
                type="primary"
                className="!bg-blue-600 hover:!bg-blue-500 !flex !items-center !gap-2 !h-9 !border-blue-500 shadow-md !text-sm !font-semibold"
            >
                <Download size={16} />
                <span>发布</span>
                <ChevronDown size={14} />
            </Button>
        </Dropdown>
    );
};
