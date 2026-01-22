import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';

const DashboardView: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const activeTab = location.pathname.split('/').pop() || 'projects';

    const handleTabChange = (id: string) => {
        navigate(`/dashboard/${id}`);
    };

    return (
        <div className="flex h-screen bg-[#0a0a0a] text-gray-300 font-sans">
            {/* Sidebar */}
            <DashboardSidebar activeTab={activeTab} onTabChange={handleTabChange} />

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-black to-[#0a0a0b]">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardView;
