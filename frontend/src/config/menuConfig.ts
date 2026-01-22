import { Box, Sun, Type, FileCode, Circle, Cone, Cylinder, Disc, Image as ImageIcon, Lightbulb, Zap, LayoutGrid } from 'lucide-react';
import { ObjectType } from '@/types';

export const ADD_OBJECT_CATEGORIES = [
    {
        id: 'geometry',
        label: '基础几何体',
        icon: Box,
        items: [
            { icon: Box, label: "立方体", type: ObjectType.BOX },
            { icon: Circle, label: "球体", type: ObjectType.SPHERE },
            { icon: Cylinder, label: "圆柱体", type: ObjectType.CYLINDER },
            { icon: Cone, label: "圆锥体", type: ObjectType.CONE },
            { icon: Disc, label: "圆环", type: ObjectType.TORUS },
            { icon: LayoutGrid, label: "平面", type: ObjectType.PLANE },
        ]
    },
    {
        id: 'light',
        label: '光源系统',
        icon: Lightbulb,
        items: [
            { icon: Lightbulb, label: "点光源", type: ObjectType.LIGHT_POINT },
            { icon: Sun, label: "平行光", type: ObjectType.LIGHT_DIR },
            { icon: Zap, label: "聚光灯", type: ObjectType.LIGHT_SPOT },
        ]
    },
    {
        id: 'advanced',
        label: '高级/外部',
        icon: FileCode,
        items: [
            { icon: Type, label: "CSS3D 标签", type: ObjectType.LABEL },
            { icon: ImageIcon, label: "精灵 / 广告牌", type: ObjectType.SPRITE },
            { icon: FileCode, label: "导入模型 (GLTF/GLB)", type: ObjectType.GLTF },
        ]
    }
] as const;
