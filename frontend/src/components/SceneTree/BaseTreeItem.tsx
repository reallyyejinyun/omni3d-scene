import React, { memo } from 'react';
import {
    ChevronRight, Copy, Trash2,
    Lock, Unlock, Eye, EyeOff
} from 'lucide-react';
import { useStore } from '@/store';
import { useTreeItem } from '@/hooks/useTreeItem';
import { Button, Tooltip, Input, Typography, Space } from 'antd';

const { Text } = Typography;

/**
 * 容器组件
 */
export const TreeRow: React.FC<{
    objectId: string;
    meshId?: string | null;
    level: number;
    children: React.ReactNode;
    className?: string;
    indentSize?: number;
}> = memo(({ objectId, meshId = null, level, children, className = '', indentSize = 16 }) => {
    const isSelected = useStore(state => state.selectedId === objectId && state.selectedMeshId === meshId);
    const handleSelect = useStore(state => state.handleSelect);

    return (
        <div
            onClick={(e) => { e.stopPropagation(); handleSelect(objectId, meshId); }}
            style={{ paddingLeft: `${(level + 1) * indentSize}px` }}
            className={`flex items-center gap-2 px-4 py-1.5 cursor-pointer transition-all group relative border-l-2 ${isSelected
                ? 'bg-blue-600/20 text-blue-100 border-blue-500'
                : 'hover:bg-white/5 border-transparent text-gray-400 hover:text-gray-200'
                } ${className}`}
        >
            {children}
        </div>
    );
});

/**
 * 展开箭头组件
 */
export const TreeToggle: React.FC<{
    hasChildren: boolean;
    isExpanded: boolean;
    onToggle: (e: React.MouseEvent) => void;
}> = memo(({ hasChildren, isExpanded, onToggle }) => (
    <Button
        type="text"
        size="small"
        icon={<ChevronRight size={12} className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} />}
        onClick={onToggle}
        className={`!p-0 !min-w-[16px] !w-4 !h-4 !flex !items-center !justify-center !text-gray-600 hover:!text-white ${!hasChildren ? '!invisible' : ''}`}
    />
));

/**
 * 标签与重命名组件
 */
interface TreeLabelProps {
    objectId: string;
    meshId?: string | null;
    name: string;
}

export const TreeLabel: React.FC<TreeLabelProps> = memo(({ objectId, meshId = null, name }) => {
    const updateObject = useStore(state => state.updateObject);

    const editing = useTreeItem({
        initialName: name,
        onUpdate: (updates) => updateObject(objectId, updates, meshId)
    });

    const { isEditing, editingName, setEditingName, startEditing, submitRename, handleKeyDown } = editing;

    return (
        <div className="flex-1 flex items-center gap-2 min-w-0">
            {isEditing ? (
                <Input
                    size="small"
                    autoFocus
                    variant="filled"
                    className="!bg-blue-500/20 !border-blue-500 !text-[11px] !px-1 !h-5 !w-full !text-white"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={submitRename}
                    onKeyDown={handleKeyDown}
                    onClick={(e) => e.stopPropagation()}
                />
            ) : (
                <Tooltip title={name} placement="top" mouseEnterDelay={0.5}>
                    <Text
                        className="!text-xs !truncate !font-medium !text-inherit !cursor-pointer flex-1"
                        onDoubleClick={(e) => { e.stopPropagation(); startEditing(); }}
                    >
                        {name}
                    </Text>
                </Tooltip>
            )}
        </div>
    );
});

/**
 * 操作按钮组
 */
export const TreeActionGroup: React.FC<{
    objectId: string;
    meshId?: string | null;
    isVisible: boolean;
    isLocked: boolean;
    isRootNode?: boolean;
}> = memo(({ objectId, meshId = null, isVisible, isLocked, isRootNode = false }) => {
    const updateObject = useStore(state => state.updateObject);
    const duplicateObject = useStore(state => state.duplicateObject);
    const removeObject = useStore(state => state.removeObject);

    return (
        <Space size={0} className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Tooltip title={isLocked ? "解锁" : "锁定"}>
                <Button
                    type="text"
                    size="small"
                    icon={isLocked ? <Lock size={12} className="text-orange-400" /> : <Unlock size={12} className="text-gray-500" />}
                    onClick={(e) => { e.stopPropagation(); updateObject(objectId, { locked: !isLocked }, meshId); }}
                    className="!p-0 !w-6 !h-6 !flex !items-center !justify-center hover:!text-white"
                />
            </Tooltip>
            <Tooltip title={isVisible ? "隐藏" : "显示"}>
                <Button
                    type="text"
                    size="small"
                    icon={isVisible ? <Eye size={12} className="text-gray-400" /> : <EyeOff size={12} className="text-red-500" />}
                    onClick={(e) => { e.stopPropagation(); updateObject(objectId, { visible: !isVisible }, meshId); }}
                    className="!p-0 !w-6 !h-6 !flex !items-center !justify-center hover:!text-white"
                />
            </Tooltip>
            {!isRootNode && (
                <>
                    <Tooltip title="复制">
                        <Button
                            type="text"
                            size="small"
                            icon={<Copy size={12} className="text-gray-400" />}
                            onClick={(e) => { e.stopPropagation(); duplicateObject(objectId, meshId); }}
                            className="!p-0 !w-6 !h-6 !flex !items-center !justify-center hover:!text-white"
                        />
                    </Tooltip>
                    <Tooltip title="删除">
                        <Button
                            type="text"
                            size="small"
                            danger
                            icon={<Trash2 size={12} />}
                            onClick={(e) => { e.stopPropagation(); removeObject(objectId, meshId); }}
                            className="!p-0 !w-6 !h-6 !flex !items-center !justify-center hover:!text-red-400"
                        />
                    </Tooltip>
                </>
            )}
        </Space>
    );
});
