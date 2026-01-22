import React, { memo } from 'react';
import {
    Folder, Sparkles, Package, Database
} from 'lucide-react';
import { Typography } from 'antd';

const { Text } = Typography;

interface SidebarItemProps {
    id: string;
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    onClick?: (id: string) => void;
}

const SidebarItem = memo(({ id, icon, label, active, onClick }: SidebarItemProps) => (
    <div
        onClick={() => onClick?.(id)}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${active ? 'bg-purple-600/10 text-purple-400 border border-purple-500/20' : 'hover:bg-white/5'}`}
    >
        {icon}
        <Text className={`!text-sm !font-medium ${active ? '!text-purple-400' : '!text-gray-300'}`}>{label}</Text>
    </div>
));

interface DashboardSidebarProps {
    activeTab: string;
    onTabChange: (id: string) => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ activeTab, onTabChange }) => {
    return (
        <aside className="w-64 border-r border-white/5 flex flex-col bg-black/40 backdrop-blur-xl">
            <div className="h-20 flex items-center px-6 border-b border-white/5 gap-3">
                <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                    <Sparkles size={16} className="text-white" />
                </div>
                <Text className="!text-lg !font-bold !text-white !tracking-tight">Omni3D</Text>
            </div>

            <div className="flex-1 py-6 px-4 space-y-1">
                <SidebarItem id="projects" icon={<Folder size={18} />} label="全部项目" active={activeTab === 'projects'} onClick={onTabChange} />
                <SidebarItem id="assets" icon={<Package size={18} />} label="素材管理" active={activeTab === 'assets'} onClick={onTabChange} />
                <SidebarItem id="datasource" icon={<Database size={18} />} label="数据源管理" active={activeTab === 'datasource'} onClick={onTabChange} />
                <div className="h-px bg-white/5 my-4" />
            </div>
        </aside>
    );
};

export default memo(DashboardSidebar);
export { SidebarItem };
