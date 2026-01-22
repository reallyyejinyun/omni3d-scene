import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useStore } from '@/store';
import { Code } from 'lucide-react';
import { type LabelTemplate } from '@/types';
import TemplateSidebar from './components/TemplateSidebar';
import TemplateEditorHeader from './components/TemplateEditorHeader';
import EditorToolbar from './components/EditorToolbar';
import CodeEditorArea from '@/components/common/LabelEditor/CodeEditorArea';
import LivePreviewArea from '@/components/common/LabelEditor/LivePreviewArea';
import { useTemplatePreview } from '@/hooks/useTemplatePreview';
import { TemplateService } from '@/api/template';
import { message } from 'antd';

/**
 * 标签模板管理中心 (精简重构版)
 * 核心 Session 状态保留在 Modal 中，通用逻辑抽离为 Hooks/子组件
 */
const TemplateManagerModal: React.FC = () => {
    const isVisible = useStore(state => state.templateManagerVisible);
    const templates = useStore(state => state.labelTemplates);
    const addTemplate = useStore(state => state.addLabelTemplate);
    const updateTemplate = useStore(state => state.updateLabelTemplate);

    // 局部会话状态
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<LabelTemplate | null>(null);
    const [activeTab, setActiveTab] = useState<'html' | 'css'>('html');

    const currentTemplate = useMemo(() =>
        templates.find(t => t.id === editingId),
        [templates, editingId]);

    // 初始化/切换模板逻辑
    useEffect(() => {
        if (currentTemplate) {
            setEditForm({ ...currentTemplate });
        } else if (editingId === 'new') {
            setEditForm({
                id: `template_${Date.now()}`,
                name: '未命名模板',
                html: '<div class="custom-label">\n  {{title}}\n</div>',
                css: '.custom-label {\n  background: #333;\n  padding: 8px;\n  border-radius: 4px;\n  color: white;\n}',
                fields: ['title']
            });
        }
    }, [currentTemplate, editingId]);

    const handleSave = useCallback(async () => {
        if (!editForm) return;
        try {
            const saved = await TemplateService.saveTemplate(editForm);
            if (editingId === 'new') {
                addTemplate(saved);
                setEditingId(saved.id);
            } else {
                updateTemplate(editingId!, saved);
            }
            message.success('模板保存成功');
        } catch (error) {
            message.error('模板保存失败');
        }
    }, [editForm, editingId, addTemplate, updateTemplate]);

    const previewHtml = useTemplatePreview(editForm?.html || '', editForm?.fields || []);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-md transition-all">
            <div className="w-[95vw] h-[90vh] max-w-6xl bg-[#1a1a1a] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">

                <TemplateEditorHeader />

                <div className="flex-1 flex overflow-hidden">
                    <TemplateSidebar
                        editingId={editingId}
                        onSelect={setEditingId}
                    />

                    <div className="flex-1 flex flex-col bg-[#111] overflow-hidden">
                        {!editForm ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-600">
                                <Code size={48} className="mb-4 opacity-20" />
                                <p className="text-sm">选择左侧模板开始编辑，或创建一个新模板</p>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <EditorToolbar
                                    name={editForm.name}
                                    onNameChange={(name) => setEditForm({ ...editForm, name })}
                                    activeTab={activeTab}
                                    onTabChange={setActiveTab}
                                    onSave={handleSave}
                                />

                                <div className="flex-1 flex overflow-hidden">
                                    <CodeEditorArea
                                        value={activeTab === 'html' ? editForm.html : editForm.css}
                                        language={activeTab}
                                        onChange={(val) => {
                                            const v = val || '';
                                            if (activeTab === 'html') setEditForm({ ...editForm, html: v });
                                            else setEditForm({ ...editForm, css: v });
                                        }}
                                    />

                                    <LivePreviewArea
                                        html={previewHtml}
                                        css={editForm.css}
                                        fields={editForm.fields}
                                        onAddField={(f) => setEditForm({ ...editForm, fields: [...editForm.fields, f] })}
                                        onRemoveField={(f) => setEditForm({ ...editForm, fields: editForm.fields.filter(x => x !== f) })}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(TemplateManagerModal);
