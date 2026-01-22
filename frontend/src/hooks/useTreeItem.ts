import { useState, useCallback } from 'react';

interface UseTreeItemProps {
    initialName: string;
    onUpdate: (updates: any) => void;
}

/**
 * 树结构节点项交互 Hook
 * 管理节点重命名状态、输入控制、回车确认及 Esc 取消逻辑
 * 
 * @param {string} initialName - 节点的初始显示名称
 * @param {Function} onUpdate - 重命名完成后的更新回调
 * @returns {Object} - 包含编辑状态、草稿名称、以及启动/提交/取消编辑的方法
 */
export const useTreeItem = ({ initialName, onUpdate }: UseTreeItemProps) => {
    // 是否处于重命名编辑模式
    const [isEditing, setIsEditing] = useState(false);
    // 实时录入的草稿名称
    const [editingName, setEditingName] = useState(initialName);

    /**
     * 进入编辑模式
     */
    const startEditing = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation(); // 阻止触发节点的选中逻辑
        setIsEditing(true);
        setEditingName(initialName);
    }, [initialName]);

    /**
     * 取消编辑并重置状态
     */
    const cancelEditing = useCallback(() => {
        setIsEditing(false);
        setEditingName(initialName);
    }, [initialName]);

    /**
     * 提交重命名修改
     */
    const submitRename = useCallback(() => {
        const trimmed = editingName.trim();
        // 仅在非空且内容确实发生变化时触发更新
        if (trimmed && trimmed !== initialName) {
            onUpdate({ name: trimmed });
        }
        setIsEditing(false);
    }, [editingName, initialName, onUpdate]);

    /**
     * 键盘交互：回车提交，Esc 取消
     */
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            submitRename();
        } else if (e.key === 'Escape') {
            cancelEditing();
        }
    }, [submitRename, cancelEditing]);

    return {
        isEditing,
        editingName,
        setEditingName,
        startEditing,
        submitRename,
        cancelEditing,
        handleKeyDown
    };
};
