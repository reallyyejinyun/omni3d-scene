import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Button, Space } from 'antd';

const PortalNavbar: React.FC = () => {
    const navigate = useNavigate();

    return (
        <nav className="relative z-10 h-20 px-12 flex items-center justify-between border-b border-white/5 backdrop-blur-md bg-black/10">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:rotate-12 transition-transform">
                    <Sparkles className="text-white" size={20} />
                </div>
                <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    Omni3D <span className="text-purple-500">PaaS</span>
                </span>
            </div>

            <Space size={32} align="center">
                <Button type="text" className="!text-gray-400 hover:!text-white font-medium">解决方案</Button>
                <Button type="text" className="!text-gray-400 hover:!text-white font-medium">开发者文档</Button>
                <Button
                    type="text"
                    onClick={() => navigate('/login')}
                    className="!text-purple-400 hover:!text-purple-300 font-medium"
                >
                    登录账号
                </Button>
                <Button
                    type="primary"
                    size="large"
                    onClick={() => navigate('/dashboard')}
                    className="!h-10 !px-6 !bg-white !text-black !font-bold !rounded-full hover:!bg-purple-50 !border-none transition-all active:scale-95"
                >
                    进入控制台
                </Button>
            </Space>
        </nav>
    );
};

export default memo(PortalNavbar);
