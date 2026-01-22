import React from 'react';
import { Video, Play } from 'lucide-react';
import { useStore } from '@/store';
import { type RoamingNode } from '@/types';

interface RoamingHeaderProps {
    onAddNode: () => void;
}

/**
 * 漫游面板顶部工具栏
 */
const RoamingHeader: React.FC<RoamingHeaderProps> = ({ onAddNode }) => {
    const isRoaming = useStore(state => state.isRoaming);
    const toggleRoaming = useStore(state => state.toggleRoaming);

    return (
        <div className="px-5 py-3 border-b border-white/5 flex items-center gap-4 bg-white/[0.02]">
            <div className="flex items-center gap-2">
                <Video size={16} className="text-orange-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">相机漫游路径</span>
            </div>
            <div className="flex-1 h-[1px] bg-white/5 mx-2" />
            <button
                onClick={onAddNode}
                className="text-[10px] px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-md border border-white/10 transition-colors uppercase font-bold"
            >
                添加当前视角为航点
            </button>
            <button
                onClick={toggleRoaming}
                className={`text-[10px] px-5 py-1.5 rounded-md border flex items-center gap-2 transition-all font-bold uppercase ${isRoaming
                        ? 'bg-red-500 text-white border-red-400 shadow-lg shadow-red-500/20'
                        : 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/20 hover:brightness-110'
                    }`}
            >
                {isRoaming ? (
                    <>
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" /> 停止漫游
                    </>
                ) : (
                    <>
                        <Play size={12} fill="currentColor" /> 开始漫游序列
                    </>
                )}
            </button>
        </div>
    );
};

export default React.memo(RoamingHeader);
