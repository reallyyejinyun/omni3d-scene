import React from 'react';
import { useStore } from '@/store';
import RenderObject from './RenderObject';

/**
 * 专门负责渲染物体列表的自治组件
 * 只有在 objects 引用变化时才会触发 map 循环
 */
const SceneObjects: React.FC<{ previewMode?: boolean }> = ({ previewMode }) => {
    const objects = useStore(state => state.objects);
    return (
        <group name="scene-objects-group">
            {objects.map((obj) => (
                <RenderObject
                    key={obj.id}
                    id={obj.id}
                    obj={obj}
                    previewMode={previewMode}
                />
            ))}
        </group>
    );
};

export default React.memo(SceneObjects);
