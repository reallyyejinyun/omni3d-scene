import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectListHeader from './ProjectListHeader';
import ProjectGrid from './ProjectGrid';
import NewProjectModal from './NewProjectModal';
import Pagination from '@/components/common/Pagination';
import { ProjectService } from '@/api/project';
import { message } from 'antd';

/**
 * 项目中心主视图
 * 维护场景项目的筛选、展示（网格/列表模式）、分页以及新建入口
 */
const ProjectList: React.FC = () => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const [projects, setProjects] = useState<any[]>([]);
    const [pagination, setPagination] = useState({
        current: 1,
        size: 12,
        total: 0
    });

    /**
     * 获取项目分页列表并同步状态
     */
    const fetchProjects = useCallback(async (current: number, size: number, query: string) => {
        setLoading(true);
        try {
            const data = await ProjectService.getProjects({
                current,
                size,
                name: query
            });
            setProjects(data.records);
            setPagination({
                current: data.current,
                size: data.size,
                total: data.total
            });
        } catch (error) {
            console.error('Fetch projects error:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProjects(1, pagination.size, searchQuery);
    }, []);

    const handleViewModeChange = useCallback((mode: 'grid' | 'list') => {
        setViewMode(mode);
    }, []);

    /**
     * 调用接口创建新项目并刷新列表
     */
    const handleCreateProject = useCallback(async (data: { name: string, templateId: string }) => {
        try {
            await ProjectService.createProject({
                name: data.name,
                status: 'draft',
                thumbnail: '/images/project_thumb.png'
            });
            message.success('项目创建成功');
            setIsCreateModalOpen(false);
            fetchProjects(1, pagination.size, searchQuery);
        } catch (error) {
            console.error('Create project failed:', error);
        }
    }, [fetchProjects, pagination.size, searchQuery]);

    /**
     * 点击卡片进入编辑器模式
     */
    const handleProjectClick = useCallback((id: string) => {
        navigate(`/editor/${id}`);
    }, [navigate]);


    /**
     * 响应搜索栏变动建议
     * @param {string} query - 搜索关键词
     */
    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
        fetchProjects(1, pagination.size, query);
    }, [fetchProjects, pagination.size]);

    /**
     * 响应分页器切换建议
     */
    const handlePageChange = useCallback((current: number, size: number) => {
        fetchProjects(current, size, searchQuery);
    }, [fetchProjects, searchQuery]);

    return (
        <div className="flex flex-col min-h-full">
            <ProjectListHeader
                viewMode={viewMode}
                onViewModeChange={handleViewModeChange}
                onNewProject={() => setIsCreateModalOpen(true)}
                onSearch={handleSearch}
            />

            <div className="flex-1 overflow-auto">
                <ProjectGrid
                    projects={projects}
                    onProjectClick={handleProjectClick}
                    onNewProject={() => setIsCreateModalOpen(true)}
                    onRefresh={() => fetchProjects(pagination.current, pagination.size, searchQuery)}
                />
            </div>

            <div className="border-t border-white/5 bg-black/20">
                <Pagination
                    current={pagination.current}
                    size={pagination.size}
                    total={pagination.total}
                    onChange={handlePageChange}
                />
            </div>

            <NewProjectModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={handleCreateProject}
            />
        </div>
    );
};

export default ProjectList;
