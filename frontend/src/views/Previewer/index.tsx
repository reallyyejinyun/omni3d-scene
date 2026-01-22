import React, { useEffect } from 'react';
import Viewport from '@/components/Viewport/index';
import { useStore } from '@/store';
import { useRoaming } from '@/hooks/useRoaming';
import PreviewLoading from './PreviewLoading';
import PreviewTopBar from './PreviewTopBar';
import PreviewBottomTips from './PreviewBottomTips';
import RoamingIndicator from './RoamingIndicator';
import { useInitialize } from '@/hooks/useInitialize';
import DataBindingRunner from '@/components/DataBindingRunner';

/**
 * 场景预览主视图
 * 负责解析项目场景数据并提供基础交互能力（如漫游播放控制）
 */
const Previewer: React.FC = () => {
  const toggleRoaming = useStore(state => state.toggleRoaming);

  // 初始化加载业务数据
  const { loading } = useInitialize();

  // 注入漫游控制器
  useRoaming();

  useEffect(() => {
    /**
     * 全局预览交互：空格键快速切换漫游状态
     */
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        toggleRoaming();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleRoaming]);

  if (loading) {
    return <PreviewLoading />;
  }

  return (
    <div className="h-screen w-screen bg-black overflow-hidden group relative">
      <Viewport previewMode={true} />

      {/* 抬头显示面板 */}
      <PreviewTopBar />
      <PreviewBottomTips />
      <RoamingIndicator />
      <DataBindingRunner />
    </div>
  );
};

export default Previewer;
