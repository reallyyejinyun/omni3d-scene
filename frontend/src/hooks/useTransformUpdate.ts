import { useCallback } from 'react';
import { type SceneObject, type SceneGraphNode } from '@/types';

/**
 * 变换属性同步更新 Hook
 * 专用于属性面板中 X/Y/Z 输入组件的数值同步，支持对位置、旋转、缩放数组的单个索引进行精准更新
 * 
 * @param {SceneGraphNode | SceneObject} targetObject - 目标节点或物体对象
 * @param {Function} onUpdate - 更新后的数据回调函数
 * @returns {Object} - 包含 handleTransformChange 处理函数
 */
export const useTransformUpdate = (
    targetObject: SceneGraphNode | SceneObject,
    onUpdate: (updates: Partial<SceneObject>) => void
) => {
    /**
     * 响应属性轴变动并合成新数组
     * @param {number} axis - 数组索引 (0:X, 1:Y, 2:Z)
     * @param {number} val - 新的属性值
     * @param {string} field - 修改的字段名 ('position'|'rotation'|'scale')
     */
    const handleTransformChange = useCallback((
        axis: number,
        val: number,
        field: 'position' | 'rotation' | 'scale'
    ) => {
        // 浅拷贝当前属性数组，若不存在则初始化全为 0
        const currentArr = (targetObject[field] ? [...targetObject[field]] : [0, 0, 0]) as [number, number, number];

        // 缩放属性的特殊处理：默认值应为 1 而非 0
        if (field === 'scale' && !targetObject[field]) {
            currentArr[0] = 1;
            currentArr[1] = 1;
            currentArr[2] = 1;
        }

        currentArr[axis] = val;
        // 提交增量更新
        onUpdate({ [field]: currentArr } as Partial<SceneObject>);
    }, [targetObject, onUpdate]);

    return { handleTransformChange };
};
