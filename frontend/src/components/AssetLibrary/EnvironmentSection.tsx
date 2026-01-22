import React from 'react';
import { Cloud } from 'lucide-react';
import { useStore } from '@/store';

/**
 * 环境预设组件
 */
const EnvironmentSection: React.FC = () => {
    const environmentValue = useStore(state => state.sceneConfig.environmentValue);
    const updateSceneConfig = useStore(state => state.updateSceneConfig);

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
                <Cloud size={14} className="text-purple-400" />
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">环境预设</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
                {['city', 'night', 'studio', 'park'].map((preset) => (
                    <button
                        key={preset}
                        onClick={() => updateSceneConfig({ environmentValue: preset })}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${environmentValue === preset
                            ? 'bg-purple-500/10 border-purple-500/50 text-white'
                            : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                    >
                        <Cloud size={16} className="mb-1" />
                        <span className="text-[10px] font-medium capitalize">{preset}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default React.memo(EnvironmentSection);
