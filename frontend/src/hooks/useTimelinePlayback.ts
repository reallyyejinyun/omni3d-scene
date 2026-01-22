import { useEffect } from 'react';
import { useStore } from '@/store';
import { type CustomAnimation } from '@/types';

/**
 * 时间轴自动播放控制器 Hook
 * 当处于录制或预览模式且开启播放时，根据帧率自动推进时间轴指针（timelineCurrentTime）
 * 
 * @param {CustomAnimation | undefined} targetAnim - 当前预览/编辑的目标自定义动画
 */
export const useTimelinePlayback = (targetAnim: CustomAnimation | undefined) => {
    const isTimelinePlaying = useStore(state => state.isTimelinePlaying);
    const setState = useStore(state => state.setState);

    useEffect(() => {
        // 非播放状态或不存在目标动画时终止逻辑
        if (!isTimelinePlaying || !targetAnim) return;

        let lastTime = performance.now();
        let frameId: number;

        /**
         * 循环更新时间偏移量
         */
        const tick = () => {
            const now = performance.now();
            // 计算两帧之间的时间差（秒）并累加至时间轴当前时间
            const delta = (now - lastTime) / 1000;
            lastTime = now;
            const nextTime = useStore.getState().timelineCurrentTime + delta;

            // 如果是单次播放且已到达终点，则停止
            if (targetAnim.loopType === 'once' && nextTime >= targetAnim.duration) {
                setState({ isTimelinePlaying: false, timelineCurrentTime: targetAnim.duration });
                return;
            }

            // 更新时间轴指针状态
            setState({ timelineCurrentTime: nextTime });
            frameId = requestAnimationFrame(tick);
        };

        frameId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frameId);
    }, [isTimelinePlaying, targetAnim?.id, targetAnim?.duration, targetAnim?.loopType, setState]);
};
