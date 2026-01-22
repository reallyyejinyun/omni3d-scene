import { useState, useCallback, useRef } from 'react';

/**
 * 通用拖拽管理 Hook
 * 提供基础的鼠标拖拽位置计算逻辑，支持排除交互元素（如按钮、输入框）
 * 
 * @param {number} initialX - 初始 X 坐标
 * @param {number} initialY - 初始 Y 坐标
 * @returns {Object} - 包含当前位置、鼠标按下处理器、是否正在拖拽以及强制设置位置的方法
 */
export const useDraggable = (initialX = 0, initialY = 0) => {
    const [position, setPosition] = useState({ x: initialX, y: initialY });
    const draggingRef = useRef(false);
    const startRef = useRef({ x: 0, y: 0 });

    /**
     * 处理鼠标按下事件，初始化平移偏移量
     */
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        // 屏蔽交互组件，防止因拖拽面板导致子组件无法点击
        if (target.closest('button') || target.closest('input') || target.closest('select') || target.closest('textarea')) {
            return;
        }

        draggingRef.current = true;
        startRef.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        };

        const handleMouseMove = (ev: MouseEvent) => {
            if (!draggingRef.current) return;
            setPosition({
                x: ev.clientX - startRef.current.x,
                y: ev.clientY - startRef.current.y
            });
        };

        const handleMouseUp = () => {
            draggingRef.current = false;
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }, [position]);

    return {
        position,
        handleMouseDown,
        isDragging: draggingRef.current,
        setPosition
    };
};
