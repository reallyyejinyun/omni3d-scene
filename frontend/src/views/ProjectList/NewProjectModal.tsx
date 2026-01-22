import React, { useState, memo } from 'react';
import { Box, ArrowRight } from 'lucide-react';
import { Modal, Input, Button, Card, Typography, Row, Col } from 'antd';

const { Text, Title } = Typography;

interface NewProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (data: any) => void;
}

const TEMPLATES = [
    { id: 'blank', name: '空白场景', desc: '从零开始构建你的 3D 世界', icon: <Box size={24} />, color: 'from-gray-500 to-slate-600' },
];

const NewProjectModal: React.FC<NewProjectModalProps> = ({ isOpen, onClose, onCreate }) => {
    const [name, setName] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState('blank');

    const handleSubmit = () => {
        if (!name.trim()) return;
        onCreate({ name, templateId: selectedTemplate });
        setName(''); // 重置名称
    };

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            title={
                <div className="flex flex-col py-2">
                    <Title level={4} style={{ margin: 0, color: 'white' }}>创建新项目</Title>
                    <Text type="secondary" style={{ fontSize: '12px' }}>选择一个起点，开始您的 3D 可视化流程</Text>
                </div>
            }
            footer={[
                <Button key="back" type="text" onClick={onClose} style={{ color: '#9ca3af' }}>
                    取消
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    size="large"
                    onClick={handleSubmit}
                    disabled={!name.trim()}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 border-none rounded-xl px-8 font-bold flex items-center gap-2"
                >
                    立即创建 <ArrowRight size={16} />
                </Button>,
            ]}
            width={600}
            centered
            className="dark-modal"
            styles={{
                content: { backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' },
                header: { backgroundColor: 'transparent', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'white' },
            } as any}
        >
            <div className="space-y-8 py-6">
                {/* Name Input */}
                <div className="space-y-4">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block ml-1">项目名称</label>
                    <Input
                        size="large"
                        autoFocus
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="输入您的项目名称..."
                        className="bg-white/5 border-white/10 text-white rounded-xl py-4 text-lg hover:border-purple-500/50 focus:border-purple-500/50"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                    />
                </div>

                {/* Template Selection */}
                <div className="space-y-4">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block ml-1">选择场景模版</label>
                    <Row gutter={[16, 16]}>
                        {TEMPLATES.map((tmpl) => (
                            <Col span={8} key={tmpl.id}>
                                <Card
                                    hoverable
                                    onClick={() => setSelectedTemplate(tmpl.id)}
                                    className={`relative transition-all border-2 overflow-hidden ${selectedTemplate === tmpl.id
                                        ? 'bg-purple-500/10 border-purple-500'
                                        : 'bg-white/5 border-transparent hover:border-white/20'
                                        }`}
                                    styles={{ body: { padding: '20px', backgroundColor: 'transparent' } }}
                                >
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tmpl.color} flex items-center justify-center text-white mb-4`}>
                                        {tmpl.icon}
                                    </div>
                                    <h4 className="font-bold text-sm text-white mb-1">{tmpl.name}</h4>
                                    <p className="text-[11px] text-gray-500 leading-tight">{tmpl.desc}</p>

                                    {selectedTemplate === tmpl.id && (
                                        <div className="absolute top-4 right-4 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center border-2 border-[#1a1a1a]">
                                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                        </div>
                                    )}
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </div>
        </Modal>
    );
};

export default memo(NewProjectModal);
