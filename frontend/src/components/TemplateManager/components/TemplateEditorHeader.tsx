import React from 'react';
import { Sparkles, X } from 'lucide-react';
import { useStore } from '@/store';

interface TemplateEditorHeaderProps {
}
/**
 * 模板编辑器头部
 * @param param0 
 * @returns 
 */
const TemplateEditorHeader: React.FC<TemplateEditorHeaderProps> = () => {

    const setVisible = useStore(state => state.setTemplateManagerVisible);

    return (
        <div className="h-16 border-b border-white/10 px-6 flex items-center justify-between bg-[#222]">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                    <Sparkles className="text-purple-400" size={20} />
                </div>
                <div>
                    <h2 className="text-white font-bold">标签模板管理中心</h2>
                    <p className="text-[10px] text-gray-500">可视化编辑 HTML/CSS 标签组件</p>
                </div>
            </div>
            <button
                onClick={() => setVisible(false)}
                className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors text-gray-400"
            >
                <X size={20} />
            </button>
        </div>
    );
};

export default React.memo(TemplateEditorHeader);
