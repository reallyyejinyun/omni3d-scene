import React from 'react';
import {
    Box, Sun, Type, FileCode, Hash,
    Loader2, AlertCircle, CheckCircle2,
    Folder, Component, Cuboid
} from 'lucide-react';
import { ObjectType } from '@/types';

/**
 * 根据对象类型获取对应的图标
 */
export const ObjectIcon: React.FC<{ type: ObjectType; className?: string }> = ({ type, className = "w-4 h-4" }) => {
    switch (type) {
        case ObjectType.BOX: return <Box className={`${className} text-blue-400`} />;
        case ObjectType.LIGHT_POINT:
        case ObjectType.LIGHT_DIR:
        case ObjectType.LIGHT_SPOT:
            return <Sun className={`${className} text-yellow-400`} />;
        case ObjectType.LABEL: return <Type className={`${className} text-purple-400`} />;
        case ObjectType.GLTF: return <FileCode className={`${className} text-green-400`} />;
        default: return <Hash className={`${className} text-gray-400`} />;
    }
};

/**
 * 加载/成功/错误 状态图标
 */
export const StatusIcon: React.FC<{ status?: string; className?: string }> = ({ status, className = "w-3 h-3" }) => {
    if (!status) return null;
    switch (status) {
        case 'loading': return <Loader2 className={`${className} text-blue-400 animate-spin`} />;
        case 'error': return <AlertCircle className={`${className} text-red-500`} />;
        case 'success': return <CheckCircle2 className={`${className} text-green-500`} />;
        default: return null;
    }
};

/**
 * 根据模型内部节点类型获取对应的图标
 */
export const NodeIcon: React.FC<{ type: string; className?: string }> = ({ type, className = "w-3 h-3" }) => {
    switch (type) {
        case 'Group': return <Folder className={`${className} text-yellow-500/80`} />;
        case 'Mesh': return <Cuboid className={`${className} text-blue-400/80`} />;
        default: return <Component className={`${className} text-gray-500`} />;
    }
};
