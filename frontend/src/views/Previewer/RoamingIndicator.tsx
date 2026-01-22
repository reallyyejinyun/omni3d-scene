import React from 'react';
import { useStore } from '@/store';

/**
 * 漫游状态进度指示器
 */
const RoamingIndicator: React.FC = () => {
    const isRoaming = useStore(state => state.isRoaming);

    if (!isRoaming) return null;

    return (
        <>
            <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500/20 overflow-hidden z-[110] pointer-events-none">
                <div className="h-full bg-blue-500 w-1/3 animate-[preview-loading_2s_ease-in-out_infinite]" />
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes preview-loading {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(300%); }
                }
            `}} />
        </>
    );
};

export default React.memo(RoamingIndicator);
