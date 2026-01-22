import React, { memo } from 'react';
import { useStore } from '@/store';
import { ObjectIcon, StatusIcon } from './TreeIcons';
import TreeNode from './TreeNode';
import type { SceneObject } from '@/types';
import { TreeRow, TreeToggle, TreeLabel, TreeActionGroup } from './BaseTreeItem';

interface TreeItemProps {
    id: string;
    level?: number;
    obj: SceneObject;
}

/**
 * 单个场景对象的 TreeItem 组件
 */
const TreeItem: React.FC<TreeItemProps> = memo(({
    id,
    level = 0,
    obj
}) => {
    // 仅订阅是否展开状态
    const isShowingStructure = useStore(state => state.selectedId === id);
    const handleSelect = useStore(state => state.handleSelect);

    if (!obj) return null;

    return (
        <div className="flex flex-col">
            <TreeRow
                objectId={id}
                level={level}
            >
                <TreeToggle
                    hasChildren={!!(obj.children?.length || obj.structure)}
                    isExpanded={isShowingStructure}
                    onToggle={(e) => { e.stopPropagation(); handleSelect(id, null); }}
                />

                <span className="flex-shrink-0"><ObjectIcon type={obj.type} /></span>

                <TreeLabel objectId={id} name={obj.name} />

                <StatusIcon status={obj.loadStatus} />

                <TreeActionGroup
                    objectId={id}
                    isVisible={obj.visible !== false}
                    isLocked={obj.locked || false}
                />
            </TreeRow>

            {/* 递归子对象 */}
            {obj.children && obj.children.length > 0 && (
                <div className="flex flex-col">
                    {obj.children.map(child => (
                        <TreeItem key={child.id} id={child.id} level={level + 1} obj={child} />
                    ))}
                </div>
            )}

            {/* GLTF 内部结构 */}
            {isShowingStructure && obj.structure && (
                <div className="border-l border-white/5 ml-4">
                    <TreeNode node={obj.structure} objectId={obj.id} level={level} />
                </div>
            )}
        </div>
    );
});

export default TreeItem;
