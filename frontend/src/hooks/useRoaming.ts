import { useEffect } from 'react';
import { useStore } from '@/store';

/**
 * 相机漫游核心控制器
 * 监测漫游状态并根据航点配置自动触发航点切换
 */
export const useRoaming = () => {
    const isRoaming = useStore(state => state.isRoaming);
    const roamingNodes = useStore(state => state.roamingNodes);
    const activeRoamingIndex = useStore(state => state.activeRoamingIndex);
    const activeRoamingStartTime = useStore(state => state.activeRoamingStartTime);
    const setRoamingIndex = useStore(state => state.setRoamingIndex);

    useEffect(() => {
        let timer: any;
        if (isRoaming && roamingNodes.length > 1) {
            const currentNode = roamingNodes[activeRoamingIndex];

            // 计算阶段耗时并计算剩余等待时间
            const elapsed = performance.now() - activeRoamingStartTime;
            const totalWait = (currentNode.travelTime + currentNode.duration) * 1000;
            const remaining = Math.max(0, totalWait - elapsed);

            timer = setTimeout(() => {
                // 循环切换航点
                setRoamingIndex((activeRoamingIndex + 1) % roamingNodes.length);
            }, remaining);
        }
        return () => clearTimeout(timer);
    }, [isRoaming, activeRoamingIndex, roamingNodes, activeRoamingStartTime, setRoamingIndex]);
};
