import React, { memo, useState } from 'react';
import { Input, Button, Radio, Space, Select } from 'antd';
import { Search, LayoutGrid, List, Upload } from 'lucide-react';
import { CATEGORIES } from '@/constants';
interface AssetToolbarProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    categoryId: string;
    onCategoryChange: (value: string) => void;
    viewMode: 'grid' | 'list';
    onViewModeChange: (mode: 'grid' | 'list') => void;
    onUpload: () => void;
}


const AssetToolbar: React.FC<AssetToolbarProps> = ({
    searchQuery,
    onSearchChange,
    categoryId,
    onCategoryChange,
    viewMode,
    onViewModeChange,
    onUpload
}) => {

    let [query, setQuery] = useState(searchQuery)

    return (
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-black/20 backdrop-blur-sm sticky top-0 z-10">
            <div>
                <h1 className="text-2xl font-bold text-white mb-1 font-sans">素材管理</h1>
                <p className="text-sm text-gray-500 font-sans">管理您的 3D 模型、贴图及工程素材</p>
            </div>
            <Space size="middle" align="center">
                <Input
                    placeholder="搜索素材..."
                    prefix={<Search size={16} className="text-gray-500" />}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onPressEnter={() => onSearchChange(query)}
                    onBlur={() => onSearchChange(query)}
                    className="w-64 bg-white/5 border-white/10 hover:border-purple-500/50 focus:border-purple-500 rounded-xl text-white"
                    variant="filled"
                />

                <Select
                    value={categoryId}
                    onChange={onCategoryChange}
                    options={CATEGORIES}
                    className="w-32 premium-select"
                    popupClassName="premium-select-popup"
                />

                <Radio.Group
                    value={viewMode}
                    onChange={(e) => onViewModeChange(e.target.value)}
                    optionType="button"
                    buttonStyle="solid"
                    className="!flex"
                >
                    <Radio.Button
                        value="grid"
                        className="!flex items-center justify-center h-11"
                    >
                        <LayoutGrid size={16} />
                    </Radio.Button>
                    <Radio.Button
                        value="list"
                        className="!flex items-center justify-center h-11"
                    >
                        <List size={16} />
                    </Radio.Button>
                </Radio.Group>

                <Button
                    type="primary"
                    icon={<Upload size={16} />}
                    onClick={onUpload}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 border-none rounded-xl font-bold h-11 px-6 shadow-lg shadow-purple-600/20 flex items-center"
                >
                    上传素材
                </Button>
            </Space>
        </div>
    );
};

export default memo(AssetToolbar);
