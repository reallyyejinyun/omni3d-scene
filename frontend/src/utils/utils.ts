import { type DataSource, type DataTag } from '@/types';
import * as THREE from 'three';

/**
 * 从本地存储加载缓存数据
 * @param key 缓存键
 * @returns 
 */
export function loadLocalCacheData(key: string) {
    try {
        return JSON.parse(localStorage.getItem(key) || '{}');
    } catch (error) {
        console.error('Failed to load local cache data:', error);
        return null;
    }
}

/**
 * 递归解析 API 响应，将其扁平化为 DataTag 数组
 */
export const flattenDataSourceResponse = (obj: any, existingTags: DataTag[], prefix = ''): DataTag[] => {
    let tags: DataTag[] = [];
    if (!obj) return tags;

    for (const key in obj) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        const value = obj[key];

        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            // 递归处理嵌套对象
            tags = tags.concat(flattenDataSourceResponse(value, existingTags, fullKey));
        } else {
            // 终端字段处理
            const existing = existingTags.find(t => t.key === fullKey);
            tags.push({
                id: existing?.id || THREE.MathUtils.generateUUID(),
                key: fullKey,
                label: existing?.label || fullKey,
                value: Array.isArray(value) ? (Array.isArray(value) ? `Array(${value.length})` : String(value)) : value
            });
        }
    }
    return tags;
};