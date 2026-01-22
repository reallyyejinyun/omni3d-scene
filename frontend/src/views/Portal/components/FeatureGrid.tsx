import React, { memo } from 'react';
import { Layout as LayoutIcon, Cpu, Globe } from 'lucide-react';
import { Card, Row, Col, Typography } from 'antd';

const { Title, Text } = Typography;

const FeatureCard = memo(({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
    <Card
        className="!p-4 !rounded-3xl bg-white/[0.03] border-white/10 backdrop-blur-sm group hover:!bg-white/[0.05] hover:!border-purple-500/30 transition-all overflow-hidden relative"
        styles={{ body: { padding: '24px', backgroundColor: 'transparent' } }}
        bordered={false}
    >
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-500/20 transition-all" />
        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
            {React.cloneElement(icon as any, { size: 24 })}
        </div>
        <Title level={4} className="!text-white !mb-3 !font-bold">{title}</Title>
        <Text className="!text-gray-500 !text-sm !leading-relaxed block">{desc}</Text>
    </Card>
));

const FeatureGrid: React.FC = () => {
    return (
        <div className="mt-40 max-w-6xl w-full px-6 pb-20 relative z-10">
            <Row gutter={[32, 32]}>
                <Col xs={24} md={8}>
                    <FeatureCard
                        icon={<LayoutIcon />}
                        title="可视化低代码"
                        desc="无需编写代码，通过直观的拖拽和配置即可完成复杂的交互逻辑绑定。"
                    />
                </Col>
                <Col xs={24} md={8}>
                    <FeatureCard
                        icon={<Cpu />}
                        title="高性能引擎"
                        desc="基于 React-Three-Fiber 深度优化，支持万级对象渲染，确保极其流畅的 60FPS 体验。"
                    />
                </Col>
                <Col xs={24} md={8}>
                    <FeatureCard
                        icon={<Globe />}
                        title="多端无缝集成"
                        desc="一键发布至云端，提供标准的 SDK 和 API，轻松嵌入到您的现有业务系统中。"
                    />
                </Col>
            </Row>
        </div>
    );
};

export default memo(FeatureGrid);
