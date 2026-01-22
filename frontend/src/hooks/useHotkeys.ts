import { useEffect } from 'react';
import { useStore } from '@/store';
import { TransformMode } from '@/types';

/**
 * 编辑器全局快捷键监听器
 * 管理包括 W/E/R 模式切换、撤销/重做、删除、克隆等核心交互快捷键
 */
export const useHotkeys = () => {
    const selectedId = useStore(state => state.selectedId);
    const selectedMeshId = useStore(state => state.selectedMeshId);
    const setTransformMode = useStore(state => state.setTransformMode);
    const removeObject = useStore(state => state.removeObject);
    const duplicateObject = useStore(state => state.duplicateObject);
    const undo = useStore(state => state.undo);
    const redo = useStore(state => state.redo);
    const setState = useStore(state => state.setState);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // 输入状态屏蔽
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) return;

            const isCtrl = e.ctrlKey || e.metaKey;

            // 撤销/重做 (Ctrl+Z / Ctrl+Shift+Z / Ctrl+Y)
            if (isCtrl && e.key.toLowerCase() === 'z') {
                e.preventDefault();
                if (e.shiftKey) redo();
                else undo();
            }
            if (isCtrl && e.key.toLowerCase() === 'y') {
                e.preventDefault();
                redo();
            }

            // 变换模式切换 (W/E/R)
            if (e.key === 'w') setTransformMode(TransformMode.TRANSLATE);
            if (e.key === 'e') setTransformMode(TransformMode.ROTATE);
            if (e.key === 'r') setTransformMode(TransformMode.SCALE);

            // 克隆 (Ctrl+D)
            if (isCtrl && e.key.toLowerCase() === 'd') {
                e.preventDefault();
                if (selectedId) duplicateObject(selectedId, selectedMeshId);
            }

            // 删除 (Delete/Backspace)
            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (selectedId) removeObject(selectedId, selectedMeshId);
            }

            // 视口聚焦 (F)
            if (e.key === 'f') {
                if (selectedId) {
                    setState({ focusTrigger: Date.now() });
                }
            }

            // 面板切换 (Alt+1/2/3)
            if (e.altKey && e.key === '1') {
                e.preventDefault();
                setState({ leftSidebarVisible: !useStore.getState().leftSidebarVisible });
            }
            if (e.altKey && e.key === '2') {
                e.preventDefault();
                setState({ bottomPanelVisible: !useStore.getState().bottomPanelVisible });
            }
            if (e.altKey && e.key === '3') {
                e.preventDefault();
                setState({ rightSidebarVisible: !useStore.getState().rightSidebarVisible });
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedId, selectedMeshId, setTransformMode, removeObject, duplicateObject, undo, redo, setState]);
};
