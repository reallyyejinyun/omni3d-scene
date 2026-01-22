import React, { useEffect, useRef } from 'react';
import { useStore } from '@/store';
import { dataSourceApi } from '@/api/dataSource';
import { type SceneObject, type DataTag } from '@/types';


// 递归获取所有活跃的数据源 ID
const getActiveSourceIds = (list: SceneObject[], ids: Set<number> = new Set()): Set<number> => {
    list.forEach(obj => {
        if (obj.dataBindings) {
            Object.values(obj.dataBindings).forEach(binding => {
                if (binding.enabled && binding.dataSourceId) {
                    ids.add(binding.dataSourceId);
                }
            });
        }
        if (obj.labelBinding) {
            Object.values(obj.labelBinding.fieldMappings).forEach(mapping => {
                if (mapping && typeof mapping === 'object' && mapping.dataSourceId) {
                    ids.add(mapping.dataSourceId);
                }
            });
        }
        if (obj.children) getActiveSourceIds(obj.children, ids);
    });
    return ids;
};
/**
 * 数据绑定作业运行器
 * 负责根据场景中物体的 dataBindings 配置，定时从后端拉取数据并同步到全局 Store
 */
const DataBindingRunner: React.FC = () => {
    const objects = useStore(state => state.objects);
    const updateDataSourceValues = useStore(state => state.updateDataSourceValues);

    // 存储定时器引用: sourceId -> Timer
    const timers = useRef<Record<number, any>>({});
    // 存储已知数据源的元数据 (防止重复拉取元数据): sourceId -> refreshInterval
    const sourceMetadata = useRef<Record<number, number>>({});



    const startPolling = async (sourceId: number) => {
        // 如果已经有定时器在跑了，就不管
        if (timers.current[sourceId]) return;

        const fetchData = async () => {
            try {
                const source = await dataSourceApi.getById(sourceId);
                if (source.config) {
                    const tags: DataTag[] = JSON.parse(source.config);
                    const values: Record<string, any> = {};
                    tags.forEach(tag => {
                        values[tag.key] = tag.value;
                    });
                    updateDataSourceValues(sourceId, values);
                }

                // 更新刷新间隔缓存（如果发生了变化，重启定时器）
                const newInterval = source.refreshInterval || 5;
                if (sourceMetadata.current[sourceId] !== newInterval) {
                    sourceMetadata.current[sourceId] = newInterval;
                    stopPolling(sourceId);
                    timers.current[sourceId] = setInterval(fetchData, newInterval * 1000);
                }
            } catch (error) {
                console.error(`[DataBindingRunner] Failed to fetch source ${sourceId}:`, error);
            }
        };

        // 立即执行一次获取元数据和初始值
        await fetchData();

        // 开启定时器 (fetchData 内部会根据间隔再次续期，或者这里先给个默认值)
        if (!timers.current[sourceId]) {
            const interval = sourceMetadata.current[sourceId] || 5;
            timers.current[sourceId] = setInterval(fetchData, interval * 1000);
        }
    };

    const stopPolling = (sourceId: number) => {
        if (timers.current[sourceId]) {
            clearInterval(timers.current[sourceId]);
            delete timers.current[sourceId];
        }
    };

    useEffect(() => {
        const activeIds = getActiveSourceIds(objects);

        // 1. 清理不再需要的定时器
        Object.keys(timers.current).forEach(idStr => {
            const id = parseInt(idStr);
            if (!activeIds.has(id)) {
                stopPolling(id);
                delete sourceMetadata.current[id];
            }
        });

        // 2. 启动新的定时器
        activeIds.forEach(id => {
            if (!timers.current[id]) {
                startPolling(id);
            }
        });
    }, [objects]); // 仅在物体列表变化时重新计算所需数据源

    // 卸载时清理所有定时器
    useEffect(() => {
        return () => {
            Object.keys(timers.current).forEach(id => stopPolling(parseInt(id)));
        };
    }, []);

    return null;
};

export default React.memo(DataBindingRunner);
