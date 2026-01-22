import React from 'react';
import { useStore } from '@/store';
import SceneTree from '@/components/SceneTree';
import PropertyPanel from '@/components/PropertyPanel';
import Toolbar from '@/components/Toolbar';
import Viewport from '@/components/Viewport';
import MainLayout from '@/layouts/MainLayout';
import RoamingPanel from '@/components/RoamingPanel';
import AnimationTimeline from '@/components/AnimationTimeline';
import AssetLibrary from '@/components/AssetLibrary';
import { useInitialize } from '@/hooks/useInitialize';
import { useRoaming } from '@/hooks/useRoaming';
import { useHotkeys } from '@/hooks/useHotkeys';
import ModelSelector from '@/components/ModelSelector';
import TemplateManagerModal from '@/components/TemplateManager/TemplateManagerModal';
import DataBindingRunner from '@/components/DataBindingRunner';

/**
 * 编辑器主视图组件
 * 组合侧边栏、工具栏、视口以及底部动画/漫游面板
 * 初始化时自动挂载必要的业务控制器控制逻辑
 */
const EditorView: React.FC = () => {
    const timelineVisible = useStore(state => state.timelineVisible);

    /**
     * 加载全局控制器 (状态初始化、漫游播放、快捷键监听)
     */
    useInitialize();
    useRoaming();
    useHotkeys();

    return (
        <>
            <MainLayout
                leftSidebar={<SceneTree />}
                assetLibrary={<AssetLibrary />}
                toolbar={<Toolbar />}
                viewport={<Viewport />}
                bottomPanel={timelineVisible ? <AnimationTimeline /> : <RoamingPanel />}
                rightSidebar={<PropertyPanel />}
            />
            <ModelSelector />
            <TemplateManagerModal />
            <DataBindingRunner />
        </>
    );
};

export default EditorView;
