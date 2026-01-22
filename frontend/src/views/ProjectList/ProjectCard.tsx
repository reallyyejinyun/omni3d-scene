import { memo } from "react";
import { MoreVertical, ExternalLink, Play, Edit, Trash2 } from 'lucide-react';
import { ProjectService } from "@/api/project";
import { Card, Tag, Button, Dropdown, Modal, message } from 'antd';

export const ProjectCard = memo(({ project, onClick, onPreview, onRefresh }: { project: any, onClick: () => void, onPreview: (id: string) => void, onRefresh?: () => void }) => {
    const handleDelete = () => {
        Modal.confirm({
            title: '删除项目',
            content: `确定要删除项目 "${project.name}" 吗？此操作不可恢复。`,
            okText: '确定删除',
            okType: 'danger',
            cancelText: '取消',
            centered: true,
            onOk: async () => {
                try {
                    await ProjectService.deleteProject(project.id);
                    message.success('项目已成功删除');
                    onRefresh?.();
                } catch (error) {
                    message.error('删除项目失败，请重试');
                }
            }
        });
    };

    const items = [
        {
            key: 'preview',
            label: '场景预览',
            icon: <Play size={14} />,
            onClick: (e: any) => {
                e.domEvent.stopPropagation();
                onPreview(project.id);
            }
        },
        {
            key: 'edit',
            label: '重新编辑',
            icon: <Edit size={14} />,
            onClick: (e: any) => {
                e.domEvent.stopPropagation();
                onClick();
            }
        },
        {
            type: 'divider' as const,
        },
        {
            key: 'delete',
            label: '删除项目',
            icon: <Trash2 size={14} />,
            danger: true,
            onClick: (e: any) => {
                e.domEvent.stopPropagation();
                handleDelete();
            }
        },
    ];

    return (
        <Card
            hoverable
            onClick={onClick}
            className="group bg-white/[0.03] border-white/5 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all cursor-pointer relative"
            styles={{ body: { padding: '16px', backgroundColor: 'transparent' } }}
            cover={
                <div className="aspect-[16/10] bg-gray-900 relative overflow-hidden">
                    <img
                        src={project.thumbnail}
                        alt={project.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <Button
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                onPreview(project.id);
                            }}
                            icon={<ExternalLink size={12} />}
                            className="bg-white text-black border-none font-bold text-[10px] h-7 flex items-center gap-1 hover:bg-gray-200"
                        >
                            预览
                        </Button>
                    </div>
                    {/* “更多”按钮需要放在最后（或设置更高 z-index）以防止被 inset-0 的遮挡层盖住 */}
                    <div
                        className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Dropdown menu={{ items }} placement="bottomRight" trigger={['click']}>
                            <Button
                                type="text"
                                icon={<MoreVertical size={16} className="text-white" />}
                                className="bg-black/40 backdrop-blur-md rounded-lg flex items-center justify-center hover:bg-black/60 border-none h-8 w-8"
                            />
                        </Dropdown>
                    </div>
                </div>
            }
        >
            <h4 className="font-bold text-white mb-2 group-hover:text-purple-400 transition-colors line-clamp-1">{project.name}</h4>
            <div className="flex items-center justify-between">
                <div className="flex gap-1.5 flex-wrap">
                    {project.tags.map((tag: string) => (
                        <Tag key={tag} className="m-0 px-1.5 py-0 bg-white/5 border-white/10 rounded text-gray-400 text-[9px] leading-relaxed">
                            {tag}
                        </Tag>
                    ))}
                </div>
                <span className="text-[10px] text-gray-500">{project.updated}</span>
            </div>
        </Card>
    );
});
