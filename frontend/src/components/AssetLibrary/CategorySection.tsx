import React from 'react';
import { Plus } from 'lucide-react';
import { useStore } from '@/store';
import { ADD_OBJECT_CATEGORIES } from '@/config/menuConfig';
import { ObjectType } from '@/types';

/**
 * 对象分类及工具组件
 */
const CategorySection: React.FC = () => {
    const addObject = useStore(state => state.addObject);
    const setModelSelectorVisible = useStore(state => state.setModelSelectorVisible);
    return (
        <>
            {ADD_OBJECT_CATEGORIES.map((category) => (
                <div key={category.id} className="space-y-3 mt-4">
                    <div className="flex items-center gap-2 px-1">
                        <category.icon size={14} className="text-blue-400" />
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{category.label}</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {category.items.map((item) => (
                            <button
                                key={item.label}
                                onClick={() => {
                                    if (item.type === ObjectType.GLTF) {
                                        setModelSelectorVisible(true);
                                    } else {
                                        addObject(item.type as ObjectType);
                                    }
                                }}
                                className="group relative flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 border border-white/5 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all"
                            >
                                <div className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-lg mb-2 group-hover:scale-110 transition-transform">
                                    <item.icon size={18} className="text-gray-300 group-hover:text-blue-400" />
                                </div>
                                <span className="text-[10px] text-gray-400 group-hover:text-white font-medium">{item.label}</span>
                                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Plus size={10} className="text-blue-400" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </>
    );
};

export default React.memo(CategorySection);
