import { useCallback, useMemo } from 'react';

/**
 * 通用子属性更新 Hook
 * 用于处理嵌套对象的更新逻辑，例如 object.material, object.dataBinding 等
 */
export function useSubUpdate<T, K extends keyof T>(
    target: T,
    key: K,
    onUpdate: (updates: Partial<T>) => void,
    defaultValue: Exclude<T[K], undefined>
) {
    // 获取子属性值，如果不存在则使用默认值
    const subValue = useMemo(() => {
        return (target[key] || defaultValue) as Exclude<T[K], undefined>;
    }, [target, key, defaultValue]);

    // 定义更新函数
    const handleSubUpdate = useCallback((updates: Partial<Exclude<T[K], undefined>>) => {
        onUpdate({
            [key]: {
                ...(subValue as any),
                ...(updates as any)
            }
        } as Partial<T>);
    }, [key, subValue, onUpdate]);

    return [subValue, handleSubUpdate] as const;
}
