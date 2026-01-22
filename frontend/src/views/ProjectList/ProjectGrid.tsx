import React, { memo, useCallback } from 'react';

import EmptyState from '@/components/common/EmptyState';
import { PackageOpen } from 'lucide-react';
import { ProjectCard } from './ProjectCard';

interface ProjectGridProps {
    projects: any[];
    onProjectClick: (id: string) => void;
    onNewProject?: () => void;
    onRefresh?: () => void;
}

const ProjectGrid: React.FC<ProjectGridProps> = ({ projects, onProjectClick, onNewProject, onRefresh }) => {


    /**
     * 处理预览跳转
     */
    const handlePreview = useCallback((id: string) => {
        window.open(`/preview/${id}`, '_blank');
    }, []);
    return (
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-white">
                    我的项目 <span className="text-sm font-normal text-gray-500 ml-2">({projects.length})</span>
                </h2>
            </div>

            {projects.length === 0 ? (
                <EmptyState
                    icon={<PackageOpen size={40} />}
                    title="暂无可用的项目"
                    description="您还没有创建任何 3D 场景项目。点击下方按钮，开始您的第一个数字孪生之旅吧。"
                    actionText="创建新项目"
                    onAction={onNewProject}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {projects.map(project => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onClick={() => onProjectClick(project.id)}
                            onPreview={handlePreview}
                            onRefresh={onRefresh}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default memo(ProjectGrid);
