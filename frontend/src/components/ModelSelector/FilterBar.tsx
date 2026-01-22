import React from 'react';
import { Search } from 'lucide-react';
import { Input } from 'antd';

interface FilterBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

/**
 * 模型筛选栏
 */
const FilterBar: React.FC<FilterBarProps> = ({
    searchQuery,
    onSearchChange,
}) => {
    return (
        <div className="px-6 py-4 bg-white/[0.02] border border-white/5 rounded-xl flex items-center gap-4">
            <Input
                placeholder="搜索模型名称..."
                prefix={<Search className="text-gray-500" size={16} />}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="!bg-white/5 !border-white/5 !rounded-lg !text-gray-200 focus:!border-blue-500/50 transition-all h-10"
                variant="filled"
            />
        </div>
    );
};

export default React.memo(FilterBar);
