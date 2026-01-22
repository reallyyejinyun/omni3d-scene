import { Form, Input, Button, Typography, Divider, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useState, memo } from 'react';
import { Sparkles, Mail, Lock, ArrowRight, Github, Chrome, ShieldCheck } from 'lucide-react';

const { Title, Text } = Typography;

const LoginView: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const onFinish = (values: any) => {
        setIsLoading(true);
        // 模拟登录延迟
        setTimeout(() => {
            setIsLoading(false);
            message.success('登录成功');
            navigate('/dashboard');
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-30 blur-[2px] transition-transform duration-[20s] ease-linear scale-110"
                    style={{ backgroundImage: `url('/images/portal_bg.png')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#050505] via-[#050505]/80 to-purple-900/20" />

                {/* Animated Orbs */}
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-600/20 blur-[100px] rounded-full animate-pulse delay-700" />
            </div>

            {/* Content Body */}
            <div className="relative z-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/40 mb-6 rotate-3">
                        <Sparkles className="text-white" size={32} />
                    </div>
                    <Title level={2} className="!text-white !font-black !tracking-tighter !mb-2">欢迎回来</Title>
                    <Text className="!text-gray-500 !text-sm">登录您的 Omni3D 账号以继续创作</Text>
                </div>

                <div className="bg-white/[0.03] border border-white/10 backdrop-blur-2xl rounded-[32px] p-8 shadow-2xl overflow-hidden relative group">
                    {/* Top Accent Line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <Form
                        name="login"
                        layout="vertical"
                        initialValues={{ email: '15723568027@163.com', password: '123456' }}
                        onFinish={onFinish}
                        requiredMark={false}
                    >
                        <Form.Item
                            label={<label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">电子邮箱</label>}
                            name="email"
                            rules={[{ required: true, message: '请输入电子邮箱' }, { type: 'email', message: '请输入有效的邮箱地址' }]}
                        >
                            <Input
                                size="large"
                                prefix={<Mail size={18} className="text-gray-500 mr-2" />}
                                placeholder="name@company.com"
                                className="!bg-white/5 !border-white/10 !text-white !rounded-2xl !py-4 hover:!border-purple-500/50 focus:!border-purple-500/50 transition-all font-medium"
                            />
                        </Form.Item>

                        <Form.Item
                            label={
                                <div className="flex items-center justify-between w-full pr-1">
                                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">密码</label>
                                    <a href="#" className="text-[11px] text-purple-400 hover:text-purple-300 transition-colors">忘记密码?</a>
                                </div>
                            }
                            name="password"
                            rules={[{ required: true, message: '请输入密码' }]}
                        >
                            <Input.Password
                                size="large"
                                prefix={<Lock size={18} className="text-gray-500 mr-2" />}
                                placeholder="输入您的密码"
                                className="!bg-white/5 !border-white/10 !text-white !rounded-2xl !py-4 hover:!border-purple-500/50 focus:!border-purple-500/50 transition-all font-medium"
                            />
                        </Form.Item>

                        <Form.Item className="mb-0">
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                loading={isLoading}
                                className="w-full h-14 bg-gradient-to-r from-purple-600 to-blue-600 !border-none rounded-2xl text-white font-bold shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all mt-4"
                            >
                                立即登录
                            </Button>
                        </Form.Item>
                    </Form>

                    {/* <Divider plain className="!my-8 !border-white/5">
                        <span className="text-[11px] uppercase tracking-widest font-bold text-gray-600 bg-[#0a0a0a] px-4">或者通过以下方式</span>
                    </Divider> 

                   <div className="grid grid-cols-2 gap-4 text-white">
                        <Button
                            icon={<Github size={20} />}
                            className="flex items-center justify-center gap-2 h-12 rounded-2xl bg-white/5 border-white/10 hover:!bg-white/10 hover:!border-white/20 !text-white transition-all font-medium text-sm"
                        >
                            GitHub
                        </Button>
                        <Button
                            icon={<Chrome size={20} />}
                            className="flex items-center justify-center gap-2 h-12 rounded-2xl bg-white/5 border-white/10 hover:!bg-white/10 hover:!border-white/20 !text-white transition-all font-medium text-sm"
                        >
                            Google
                        </Button>
                    </div> */}
                </div>

                {/* <p className="mt-10 text-center text-sm text-gray-500">
                    还没有账号? <a href="#" className="font-bold text-white hover:text-purple-400 transition-colors">免费加入</a>
                </p> */}

                {/* <div className="mt-20 flex items-center justify-center gap-8 text-[11px] font-bold text-gray-600 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><ShieldCheck size={12} /> SSL 安全加密</span>
                    <span>服务条款</span>
                    <span>隐私政策</span>
                </div> */}
            </div>
        </div>
    );
};

export default memo(LoginView);
