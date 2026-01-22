import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Button, Typography } from 'antd';

const { Title, Paragraph } = Typography;

interface PortalHeroProps {
    onHoverStart: () => void;
    onHoverEnd: () => void;
}

const PortalHero: React.FC<PortalHeroProps> = ({ onHoverStart, onHoverEnd }) => {
    const navigate = useNavigate();

    return (
        <section className="relative z-10 flex flex-col items-center justify-center px-6 text-center pt-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold text-purple-400 uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-bottom-4">
                <ShieldCheck size={12} /> 企业级数字孪生底座
            </div>

            <Title className="!text-7xl md:!text-8xl !font-black !mb-6 !tracking-tighter !leading-tight !max-w-4xl !text-white">
                重定义 <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-purple-500 animate-gradient">3D 可视化</span> 生产力
            </Title>

            <Paragraph className="!text-xl !text-gray-400 !max-w-2xl !mb-12 !leading-relaxed">
                Omni3D 为企业提供零代码到低代码的完整 3D 场景链路。从精美素材库到高性能运行时，让数字孪生从未如此简单。
            </Paragraph>

            <div className="flex items-center gap-6">
                <Button
                    size="large"
                    type="primary"
                    onMouseEnter={onHoverStart}
                    onMouseLeave={onHoverEnd}
                    onClick={() => navigate('/dashboard')}
                    className="group !h-14 !px-8 bg-gradient-to-r from-purple-600 to-blue-600 !border-none !rounded-2xl flex items-center gap-3 !text-lg !font-bold shadow-2xl shadow-purple-500/20 hover:shadow-purple-500/40 transition-all active:scale-95"
                >
                    开始构建你的世界
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>
        </section>
    );
};

export default memo(PortalHero);
