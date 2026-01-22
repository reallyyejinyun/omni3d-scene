import React, { memo } from 'react';
import { Box, Plus } from 'lucide-react';

interface EmptyStateProps {
    title: string;
    description: string;
    onAction?: () => void;
    actionText?: string;
    icon?: React.ReactNode;
}
/**
 * 空状态组件
 * @param param0 
 * @returns 
 */
const EmptyState: React.FC<EmptyStateProps> = ({
    title,
    description,
    onAction,
    actionText,
    icon
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-white/5 flex items-center justify-center text-purple-400/50 mb-6 shadow-2xl">
                {icon || <Box size={40} />}
            </div>

            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto mb-8 leading-relaxed">
                {description}
            </p>

            {onAction && (
                <button
                    onClick={onAction}
                    className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-sm font-bold transition-all active:scale-95 group"
                >
                    <Plus size={16} className="text-purple-400 group-hover:rotate-90 transition-transform duration-300" />
                    {actionText}
                </button>
            )}
        </div>
    );
};

export default memo(EmptyState);
