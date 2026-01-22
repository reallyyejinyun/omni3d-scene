import React, { useCallback } from 'react';
import { Plus, Trash2, Copy } from 'lucide-react';
import { type LabelTemplate } from '@/types';
import { useStore } from '@/store';
import { TemplateService } from '@/api/template';
import { message } from 'antd';

interface TemplateSidebarProps {
    editingId: string | null;
    onSelect: (id: string | null) => void;
}
/**
 * 模板列表
 * @param param0 
 * @returns 
 */
const TemplateSidebar: React.FC<TemplateSidebarProps> = ({
    editingId,
    onSelect
}) => {
    const templates = useStore(state => state.labelTemplates);
    const addTemplate = useStore(state => state.addLabelTemplate);
    const removeTemplate = useStore(state => state.removeLabelTemplate);

    const handleCreate = useCallback(() => {
        onSelect('new');
    }, [onSelect]);

    const handleDuplicate = useCallback(async (t: LabelTemplate) => {
        const newTemplate = {
            ...t,
            id: `template_${Date.now()}`, // 此临时 ID 会被后端覆盖
            name: `${t.name} (副本)`
        };
        try {
            const saved = await TemplateService.saveTemplate(newTemplate);
            addTemplate(saved);
            message.success('复制成功');
        } catch (error) {
            message.error('复制失败');
        }
    }, [addTemplate]);

    const handleRemove = useCallback(async (id: string) => {
        try {
            // 如果是临时ID (未保存到后端的)，直接前端删除
            if (!id.startsWith('template_')) {
                await TemplateService.deleteTemplate(id);
            }
            removeTemplate(id);
            if (editingId === id) onSelect(null);
            message.success('删除成功');
        } catch (error) {
            message.error('删除失败');
        }
    }, [editingId, removeTemplate, onSelect]);

    return (
        <div className="w-64 border-right border-white/10 bg-[#161616] flex flex-col">
            <div className="p-4 border-b border-white/10">
                <button
                    onClick={handleCreate}
                    className="w-full h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center gap-2 text-white text-xs transition-all"
                >
                    <Plus size={14} /> 新置模板
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                {templates.map((t: LabelTemplate) => (
                    <div
                        key={t.id}
                        onClick={() => onSelect(t.id)}
                        className={`group p-3 rounded-xl cursor-pointer transition-all border ${editingId === t.id
                            ? 'bg-purple-500/20 border-purple-500/30 ring-1 ring-purple-500/20 shadow-lg'
                            : 'hover:bg-white/5 border-transparent text-gray-400 hover:text-white'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium truncate pr-4">{t.name}</span>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDuplicate(t); }}
                                    className="p-1 hover:text-white transition-colors"
                                >
                                    <Copy size={12} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleRemove(t.id); }}
                                    className="p-1 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        </div>
                        <div className="text-[9px] opacity-40 uppercase tracking-tighter">ID: {t.id}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default React.memo(TemplateSidebar);
