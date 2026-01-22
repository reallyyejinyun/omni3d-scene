import React from 'react';
import { Settings, Layers, Box } from 'lucide-react';
import { useStore } from '@/store';
import { Tabs, Typography, Space } from 'antd';

const { Title } = Typography;

interface MainLayoutProps {
    leftSidebar: React.ReactNode;
    assetLibrary: React.ReactNode;
    rightSidebar: React.ReactNode;
    toolbar: React.ReactNode;
    viewport: React.ReactNode;
    bottomPanel: React.ReactNode;
}
/**
 * 编辑器主布局组件
 * @param param0 
 * @returns 
 */
const MainLayout: React.FC<MainLayoutProps> = ({
    leftSidebar,
    assetLibrary,
    rightSidebar,
    toolbar,
    viewport,
    bottomPanel
}) => {
    const leftSidebarVisible = useStore(state => state.leftSidebarVisible);
    const rightSidebarVisible = useStore(state => state.rightSidebarVisible);
    const bottomPanelVisible = useStore(state => state.bottomPanelVisible);
    const bottomPanelHeight = useStore(state => state.bottomPanelHeight);
    const leftTab = useStore(state => state.leftTab);
    const setState = useStore(state => state.setState);

    const leftSidebarItems = [
        {
            key: 'hierarchy',
            label: (
                <Space size={4}>
                    <Layers size={14} />
                    <span>层级</span>
                </Space>
            ),
            children: leftSidebar
        },
        {
            key: 'assets',
            label: (
                <Space size={4}>
                    <Box size={14} />
                    <span>资源库</span>
                </Space>
            ),
            children: assetLibrary
        }
    ];

    return (
        <div className="relative h-screen w-screen overflow-hidden bg-[#0c0c0c] text-gray-200 select-none font-sans">
            {/* 1. 背景层：Canvas 3D 场景全屏 */}
            <div className="absolute inset-0 z-0">
                {viewport}
            </div>

            {/* 2. UI 覆盖层 */}
            <div className="relative z-10 h-full w-full flex flex-col pointer-events-none">

                {/* 顶部工具栏 - 常驻 */}
                <div className="pointer-events-auto">
                    {toolbar}
                </div>

                {/* 中间核心交互区：左右两侧浮现面板 */}
                <div className="flex-1 flex justify-between p-4 gap-4 overflow-hidden">

                    {/* 左侧浮动面板：层级与资产库 */}
                    <aside className={`w-92 h-full pointer-events-auto flex flex-col bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden transition-all duration-500 ease-in-out ${leftSidebarVisible ? 'translate-x-0 opacity-100 visible' : '-translate-x-full opacity-0 invisible'}`}
                    >
                        <Tabs
                            activeKey={leftTab as string}
                            onChange={(key) => setState({ leftTab: key as any })}
                            items={leftSidebarItems}
                            className="flex-1 !h-full !flex !flex-col overflow-hidden"
                            tabBarStyle={{
                                marginBottom: 0,
                                padding: '0 16px',
                                backgroundColor: 'rgba(255,255,255,0.03)',
                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                flexShrink: 0
                            }}
                            centered
                            tabBarGutter={32}
                        />
                    </aside>

                    {/* 右侧浮动面板：属性编辑区 */}
                    <aside className={`w-80 h-full pointer-events-auto flex flex-col bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden transition-all duration-500 ease-in-out ${rightSidebarVisible ? 'translate-x-0 opacity-100 visible' : 'translate-x-full opacity-0 invisible'}`}
                    >
                        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02] flex-shrink-0">
                            <Space size={8}>
                                <Settings size={18} className="text-purple-400" />
                                <Title level={5} className="!m-0 !text-sm !font-bold !tracking-tight !text-white">对象配置</Title>
                            </Space>
                        </div>
                        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                            {rightSidebar}
                        </div>
                    </aside>
                </div>

                {/* 底部悬浮面板 */}
                <div className={`h-0 pointer-events-auto relative transition-all duration-500 ease-in-out ${bottomPanelVisible ? 'translate-y-0 opacity-100 visible' : 'translate-y-full opacity-0 invisible'}`}
                >
                    {/* 悬浮底部面板容器 - 保持在底部稍微偏移位置 */}
                    <div
                        className="absolute bottom-6 left-6 right-6 flex flex-col group/timeline pointer-events-none"
                        style={{ height: bottomPanelHeight }}
                    >
                        {/* 顶部拉伸条 */}
                        <div
                            className="h-1.5 cursor-ns-resize bg-white/5 hover:bg-blue-500/50 transition-colors pointer-events-auto rounded-t-xl"
                            onMouseDown={(e) => {
                                const startY = e.clientY;
                                const startHeight = bottomPanelHeight;

                                const onMouseMove = (moveEvent: MouseEvent) => {
                                    const deltaY = startY - moveEvent.clientY;
                                    const newHeight = Math.max(40, Math.min(window.innerHeight * 0.8, startHeight + deltaY));
                                    setState({ bottomPanelHeight: newHeight });
                                };

                                const onMouseUp = () => {
                                    document.removeEventListener('mousemove', onMouseMove);
                                    document.removeEventListener('mouseup', onMouseUp);
                                    document.body.style.cursor = '';
                                };

                                document.addEventListener('mousemove', onMouseMove);
                                document.addEventListener('mouseup', onMouseUp);
                                document.body.style.cursor = 'ns-resize';
                            }}
                        />

                        {/* 内容区 - 采用玻璃拟态设计 */}
                        <div className="flex-1 overflow-hidden pointer-events-auto bg-black/60 backdrop-blur-xl border border-white/10 rounded-b-xl shadow-2xl">
                            {bottomPanel}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .ant-tabs-nav::before { border-bottom: none !important; }
                .ant-tabs-tab { padding: 12px 0 !important; font-size: 12px !important; font-weight: 700 !important; }
                .ant-tabs-tab-btn { color: #666 !important; transition: all 0.3s !important; }
                .ant-tabs-tab-active .ant-tabs-tab-btn { color: #4096ff !important; }
                .ant-tabs-ink-bar { background: #4096ff !important; height: 1px !important; }
                .ant-tabs-tabpane { flex: 1; height: 100% !important; min-height: 0; overflow: hidden !important; padding: 0 !important; display: flex; flex-direction: column; }
                .ant-tabs-content-holder { flex: 1; min-height: 0; overflow: hidden !important; display: flex; flex-direction: column; }
                .ant-tabs-content { height: 100%; display: flex; flex-direction: column; flex: 1; min-height: 0; overflow: hidden; }
                
                /* 确保内部组件作为 flex-1 能正常滚动 */
                .ant-tabs-tabpane > div { flex: 1; display: flex; flex-direction: column; height: 100%; min-height: 0; overflow: hidden; }
                
                .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
            `}</style>
        </div>
    );
};

export default MainLayout;
