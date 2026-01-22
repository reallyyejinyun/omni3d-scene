import React, { memo, useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Input, Button, Avatar } from 'antd';

interface ProjectListHeaderProps {
    viewMode: 'grid' | 'list';
    onViewModeChange: (mode: 'grid' | 'list') => void;
    onNewProject: () => void;
    onSearch: (query: string) => void;
}

const ProjectListHeader: React.FC<ProjectListHeaderProps> = ({ onNewProject, onSearch }) => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-black/20">
            <div className="flex-1 max-w-xl">
                <Input
                    size="large"
                    placeholder="搜索我的项目..."
                    prefix={<Search size={16} className="text-gray-500" />}
                    className="bg-white/5 border-white/10 text-white rounded-xl hover:border-purple-500/50 focus:border-purple-500/50"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                    onBlur={() => onSearch(searchQuery)}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onPressEnter={() => onSearch(searchQuery)}
                />
            </div>

            <div className="flex items-center gap-6">
                <Button
                    type="primary"
                    size="large"
                    icon={<Plus size={18} />}
                    onClick={onNewProject}
                    className="bg-purple-600 hover:bg-purple-500 border-none rounded-xl h-11 px-6 font-bold shadow-lg shadow-purple-600/20"
                >
                    新建项目
                </Button>
                <Avatar
                    size={44}
                    className="bg-gradient-to-br from-indigo-500 to-purple-500 border-2 border-white/10 shadow-lg cursor-pointer hover:scale-105 transition-transform"
                />
            </div>
        </header>
    );
};

export default memo(ProjectListHeader);
