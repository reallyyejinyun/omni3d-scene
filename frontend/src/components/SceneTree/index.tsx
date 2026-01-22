import React from 'react';
import { useStore } from '@/store';
import TreeItem from './TreeItem';

/**
 * 场景大纲树组件
 */
const SceneTree: React.FC = () => {
    const objects = useStore(state => state.objects);
    return (
        <div className="relative flex-1 w-full h-full overflow-hidden">
            <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-4 pt-2 pb-24">
                {objects.length === 0 ? (
                    <p className="text-xs opacity-30 text-center py-8">场景中尚无对象</p>
                ) : (
                    objects.map((obj) => (
                        <TreeItem
                            key={obj.id}
                            id={obj.id}
                            obj={obj}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default React.memo(SceneTree);
