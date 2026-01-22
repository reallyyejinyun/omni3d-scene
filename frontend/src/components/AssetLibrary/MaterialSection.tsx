import React, { useCallback } from 'react';
import { Palette } from 'lucide-react';
import { useStore } from '@/store';

const MATERIAL_PRESETS = [
    { color: '#ffffff', label: '纯白' },
    { color: '#3b82f6', label: '科技蓝' },
    { color: '#10b981', label: '生机绿' },
    { color: '#f59e0b', label: '警戒橙' },
    { color: '#ef4444', label: '警示红' },
    { color: '#111111', label: '玄武岩' },
];

/**
 * 材质快捷预设组件
 */
const MaterialSection: React.FC = () => {
    const selectedId = useStore(state => state.selectedId);
    const updateObject = useStore(state => state.updateObject);

    const handleApplyMaterial = useCallback((color: string) => {
        if (selectedId) {
            updateObject(selectedId, {
                material: {
                    color,
                    roughness: 0.5,
                    metalness: 0.5,
                    transparent: false,
                    opacity: 1,
                    wireframe: false,
                    emissive: '#000000'
                }
            });
        }
    }, [selectedId, updateObject]);

    return (
        <div className="space-y-3 pb-4">
            <div className="flex items-center gap-2 px-1">
                <Palette size={14} className="text-pink-400" />
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">基础材质</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
                {MATERIAL_PRESETS.map((mat) => (
                    <button
                        key={mat.color}
                        onClick={() => handleApplyMaterial(mat.color)}
                        className="group flex flex-col items-center gap-1 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-white/5"
                        title="点击应用到选中物"
                    >
                        <div
                            className="w-full aspect-square rounded shadow-inner"
                            style={{ backgroundColor: mat.color }}
                        />
                        <span className="text-[8px] text-gray-500 group-hover:text-gray-300 transition-colors">{mat.label}</span>
                    </button>
                ))}
            </div>
            <p className="text-[9px] text-gray-600 italic px-1 text-center">选中物体后点击颜色快速应用</p>
        </div>
    );
};

export default React.memo(MaterialSection);
