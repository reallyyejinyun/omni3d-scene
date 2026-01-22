import React from 'react';
import { Save } from 'lucide-react';

interface EditorToolbarProps {
    name: string;
    onNameChange: (name: string) => void;
    activeTab: 'html' | 'css';
    onTabChange: (tab: 'html' | 'css') => void;
    onSave: () => void;
}
/**
 * 标签模板编辑工具栏
 * @param param0 
 * @returns 
 */
const EditorToolbar: React.FC<EditorToolbarProps> = ({
    name,
    onNameChange,
    activeTab,
    onTabChange,
    onSave
}) => {
    return (
        <div className="h-14 border-b border-white/5 px-6 flex items-center justify-between bg-[#1a1a1a]">
            <div className="flex items-center gap-6">
                <input
                    value={name}
                    onChange={(e) => onNameChange(e.target.value)}
                    className="bg-transparent text-white text-sm font-bold focus:outline-none border-b border-transparent focus:border-purple-500/50 transition-all px-1 pb-1"
                    placeholder="模板名称"
                />
                <div className="flex bg-white/5 p-1 rounded-lg">
                    <button
                        onClick={() => onTabChange('html')}
                        className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all ${activeTab === 'html' ? 'bg-[#333] text-white shadow-sm' : 'text-gray-500 hover:text-white'
                            }`}
                    >
                        HTML
                    </button>
                    <button
                        onClick={() => onTabChange('css')}
                        className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all ${activeTab === 'css' ? 'bg-[#333] text-white shadow-sm' : 'text-gray-500 hover:text-white'
                            }`}
                    >
                        CSS
                    </button>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={onSave}
                    className="h-9 px-4 bg-purple-600 hover:bg-purple-500 text-white text-xs rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-purple-900/20 active:scale-95"
                >
                    <Save size={14} /> 保存配置
                </button>
            </div>
        </div>
    );
};

export default React.memo(EditorToolbar);
