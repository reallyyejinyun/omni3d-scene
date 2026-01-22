import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, GripHorizontal } from 'lucide-react';
import { useDraggable } from '@/hooks/useDraggable';

interface ModalProps {
    title: string;
    icon?: React.ReactNode;
    subtitle?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    onClose: () => void;
    maxWidth?: string; // e.g. 'max-w-4xl', 'max-w-md'
    maxHeight?: string; // e.g. 'max-h-[80vh]'
    container?: HTMLElement; // Target container for portal
    showOverlay?: boolean; // Whether to show the backdrop overlay
    draggable?: boolean; // Whether the modal can be dragged via header
}

/**
 * 通用全局弹窗组件 - 支持 Portal 渲染、拖拽、蒙层配置
 */
const Modal: React.FC<ModalProps> = ({
    title,
    icon,
    subtitle,
    children,
    footer,
    onClose,
    maxWidth = 'max-w-md',
    maxHeight = 'max-h-[85vh]',
    container = document.body,
    showOverlay = true,
    draggable = false
}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const { position, handleMouseDown } = useDraggable();

    // 点击外部关闭
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    // ESC 键关闭
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return createPortal(
        <div
            className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-all duration-300 ${showOverlay ? 'bg-black/60 backdrop-blur-sm' : 'pointer-events-none'
                } animate-in fade-in`}
            onClick={handleBackdropClick}
        >
            <div
                ref={modalRef}
                style={{
                    transform: draggable && (position.x !== 0 || position.y !== 0) ? `translate(${position.x}px, ${position.y}px)` : undefined
                }}
                className={`relative w-full ${maxWidth} ${maxHeight} bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 pointer-events-auto`}
            >
                {/* 头部 - 拖拽热区 */}
                <div
                    onMouseDown={draggable ? handleMouseDown : undefined}
                    className={`flex items-center justify-between p-5 border-b border-white/5 bg-white/[0.02] select-none ${draggable ? 'cursor-grab active:cursor-grabbing' : ''}`}
                >
                    <div className="flex items-center gap-3">
                        {draggable && <GripHorizontal size={14} className="text-gray-600 mr-1" />}
                        {icon && (
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                {icon}
                            </div>
                        )}
                        <div>
                            <h2 className="text-sm font-bold text-white leading-tight">{title}</h2>
                            {subtitle && <p className="text-[10px] text-gray-500 mt-0.5">{subtitle}</p>}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* 内容区域 */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
                    {children}
                </div>

                {/* 底部按钮区域 */}
                {footer && (
                    <div className="p-4 border-t border-white/5 bg-black/20 flex justify-end gap-3">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        container
    );
};

export default React.memo(Modal);
