import React from 'react';
import { Button, Tooltip, Divider as AntDivider } from 'antd';

interface IconButtonProps {
    icon: React.ReactNode;
    active?: boolean;
    onClick: () => void;
    label: string;
    disabled?: boolean;
    className?: string;
}
/**
 * 按钮组件
 * @param param0 
 * @returns 
 */
export const IconButton: React.FC<IconButtonProps> = ({
    icon, active, onClick, label, disabled = false, className = ""
}) => (
    <Tooltip title={label} placement="bottom">
        <Button
            onClick={onClick}
            disabled={disabled}
            type={active ? 'primary' : 'text'}
            icon={icon}
            className={`!flex !items-center !justify-center !w-10 !h-10 !rounded-lg !transition-all ${active
                ? '!bg-blue-600 !shadow-lg !shadow-blue-500/20'
                : '!bg-white/5 !text-gray-400 hover:!bg-white/10 hover:!text-white !border !border-white/5'
                } ${disabled ? '!opacity-20 !cursor-not-allowed' : ''} ${className}`}
        />
    </Tooltip>
);

export const Divider = () => <AntDivider orientation="vertical" className="!h-6 !bg-white/10 !mx-2" />;
