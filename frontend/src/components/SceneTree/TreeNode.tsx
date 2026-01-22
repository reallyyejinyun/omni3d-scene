import React, { useState, memo } from 'react';
import { type SceneGraphNode } from '@/types';
import { NodeIcon } from './TreeIcons';
import { TreeRow, TreeToggle, TreeLabel, TreeActionGroup } from './BaseTreeItem';

/**
 * GLTF 内部节点的渲染组件
 */
const TreeNode: React.FC<{
    node: SceneGraphNode;
    objectId: string;
    level: number;
}> = memo(({ node, objectId, level }) => {
    const [expanded, setExpanded] = useState(true);

    return (
        <div>
            <TreeRow
                objectId={objectId}
                meshId={node.id}
                level={level}
                indentSize={12}
            >
                <TreeToggle
                    hasChildren={!!node.children?.length}
                    isExpanded={expanded}
                    onToggle={(e: React.MouseEvent) => { e.stopPropagation(); setExpanded(!expanded); }}
                />

                <span className="flex-shrink-0 opacity-80"><NodeIcon type={node.type} /></span>

                <TreeLabel objectId={objectId} meshId={node.id} name={node.name} />

                <TreeActionGroup
                    objectId={objectId}
                    meshId={node.id}
                    isVisible={node.visible !== false}
                    isLocked={node.locked || false}
                    isRootNode={node.userData.root}
                />
            </TreeRow>

            {/* 递归子节点 */}
            {expanded && node.children?.map(child => (
                <TreeNode
                    key={child.id}
                    node={child}
                    objectId={objectId}
                    level={level + 1}
                />
            ))}
        </div>
    );
});

export default TreeNode;
