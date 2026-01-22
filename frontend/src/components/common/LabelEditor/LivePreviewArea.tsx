import React from 'react';
import { Eye, Settings2, X } from 'lucide-react';

interface LivePreviewAreaProps {
    html: string;
    css: string;
    fields: string[];
    onAddField: (field: string) => void;
    onRemoveField: (field: string) => void;
}

const LivePreviewArea: React.FC<LivePreviewAreaProps> = ({
    html,
    css,
    fields,
    onAddField,
    onRemoveField
}) => {
    return (
        <div className="w-[400px] bg-[#141414] flex flex-col p-6">
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">
                <Eye size={12} /> 实时预览
            </div>

            <div className="flex-1 flex items-center justify-center p-8 bg-[#0a0a0a] rounded-2xl border border-white/5 shadow-inner relative overflow-hidden group">
                <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}></div>

                <div className="relative z-10 transition-transform duration-500 group-hover:scale-110">
                    <style>{css}</style>
                    <div dangerouslySetInnerHTML={{ __html: html }} />
                </div>
            </div>

            <div className="mt-8">
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">
                    <Settings2 size={12} /> 动态字段
                </div>
                <div className="flex flex-wrap gap-2">
                    {fields.map((f: string) => (
                        <div key={f} className="px-2 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded text-[10px] flex items-center gap-2">
                            <span>{f}</span>
                            <button
                                onClick={() => onRemoveField(f)}
                                className="hover:text-white"
                            >
                                <X size={10} />
                            </button>
                        </div>
                    ))}
                    <input
                        className="bg-transparent border-b border-white/10 text-[10px] text-white focus:outline-none focus:border-purple-500 w-16"
                        placeholder="+ 字段"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                const val = e.currentTarget.value.trim();
                                if (val) {
                                    onAddField(val);
                                    e.currentTarget.value = '';
                                }
                            }
                        }}
                    />
                </div>
                <p className="mt-3 text-[9px] text-gray-500 italic">
                    在 HTML 中使用 {"{{字段名}}"} 即可实现内容动态绑定
                </p>
            </div>
        </div>
    );
};

export default React.memo(LivePreviewArea);
