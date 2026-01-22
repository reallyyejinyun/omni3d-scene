import React, { useState, memo, useEffect } from 'react';
import { Upload as UploadIcon, X, Loader2, CheckCircle2 } from 'lucide-react';
import { Modal, Input, Select, Button, Form, message, Space, Typography } from 'antd';
import AssetThumbnailGenerator from '@/components/common/AssetThumbnailGenerator';
import { CATEGORIES, EXTENSION_MAP } from '@/constants';

const { Title, Text } = Typography;

interface AssetUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (data: { name: string; categoryId: string; file: File; thumbnail?: File }) => void;
}

const AssetUploadModal: React.FC<AssetUploadModalProps> = ({ isOpen, onClose, onUpload }) => {
    const [file, setFile] = useState<File | null>(null);
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [category, setCategory] = useState('model');
    const [uploading, setUploading] = useState(false);
    const [step, setStep] = useState<'select' | 'form' | 'success'>('select');

    const [form] = Form.useForm();

    useEffect(() => {
        if (file) {
            const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
            const url = URL.createObjectURL(file) + (ext === '.glb' ? '#.glb' : '#.gltf');
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [file]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            setFile(selected);
            setThumbnail(null);
            const ext = selected.name.substring(selected.name.lastIndexOf('.')).toLowerCase();
            const autoCategory = EXTENSION_MAP[ext] || 'other';
            setCategory(autoCategory);
            form.setFieldsValue({ name: selected.name.split('.')[0], category: autoCategory });
            setStep('form');
        }
    };

    const onFinish = async (values: any) => {
        if (!file) return;
        setUploading(true);
        try {
            await onUpload({
                name: values.name,
                categoryId: values.category,
                file,
                thumbnail: thumbnail || undefined
            });
            setStep('success');
        } catch (error) {
            console.error('Upload failed:', error);
            message.error('上传失败');
        } finally {
            setUploading(false);
        }
    };

    const reset = () => {
        setFile(null);
        setThumbnail(null);
        setPreviewUrl(null);
        setStep('select');
        form.resetFields();
        onClose();
    };

    const handleThumbnailCapture = (thumbFile: File) => {
        setThumbnail(thumbFile);
    };

    return (
        <Modal
            open={isOpen}
            onCancel={reset}
            footer={null}
            width={step === 'select' ? 500 : 600}
            centered
            title={
                <div className="flex flex-col py-1">
                    <Title level={4} style={{ margin: 0, color: 'white' }}>上传资产</Title>
                    <Text type="secondary" style={{ fontSize: '12px' }}>支持 3D 模型、HDR、贴图及视频素材</Text>
                </div>
            }
            styles={{
                content: { backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px' },
                header: { backgroundColor: 'transparent', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'white' },
            } as any}
        >
            <div className="py-6">
                {step === 'select' && (
                    <div
                        onClick={() => document.getElementById('file-upload')?.click()}
                        className="border-2 border-dashed border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center gap-6 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all cursor-pointer group"
                    >
                        <input
                            id="file-upload"
                            type="file"
                            accept=".gltf,.glb,.obj,.fbx,.hdr,.exr,.jpg,.png,.webp,.mp4"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <UploadIcon className="text-gray-400 group-hover:text-purple-400" size={36} />
                        </div>
                        <div className="text-center">
                            <Text className="!text-sm !font-bold !text-gray-300 block">点击或将文件拖拽至此上传</Text>
                            <Text className="!text-xs !text-gray-600 !mt-2 block">系统将自动识别类型并尝试生成封面 (Max 100MB)</Text>
                        </div>
                    </div>
                )}

                {step === 'form' && (
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        className="space-y-6"
                        requiredMark={false}
                    >
                        {/* 资产信息头 */}
                        <div className="flex items-center gap-4 p-5 bg-white/5 rounded-2xl border border-white/5 relative overflow-hidden group/header">
                            <div
                                onClick={() => document.getElementById('thumb-upload')?.click()}
                                className="w-20 h-20 bg-purple-600/20 rounded-xl flex items-center justify-center text-purple-400 overflow-hidden relative cursor-pointer group/thumb shadow-inner"
                            >
                                <input
                                    id="thumb-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const f = e.target.files?.[0];
                                        if (f) setThumbnail(f);
                                    }}
                                />
                                {thumbnail ? (
                                    <>
                                        <img
                                            src={URL.createObjectURL(thumbnail)}
                                            alt="thumb"
                                            className="w-full h-full object-cover transition-transform group-hover/thumb:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity">
                                            <UploadIcon size={18} className="text-white" />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {category === 'model' ? <Loader2 size={24} className="animate-spin" /> : <UploadIcon size={24} />}
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity">
                                            <span className="text-[10px] text-white font-bold">更换</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <Text className="!text-sm !font-bold !text-white !block truncate">{file?.name}</Text>
                                <Space className="mt-1" split={<span className="w-1 h-1 rounded-full bg-gray-700 block" />}>
                                    <Text className="!text-[10px] !text-gray-500 uppercase tracking-widest">
                                        {file ? (file.size / 1024 / 1024).toFixed(2) : 0} MB
                                    </Text>
                                    <Text className="!text-[10px] !text-purple-400 !font-bold uppercase tracking-widest">
                                        {category}
                                    </Text>
                                </Space>
                            </div>

                            <Button
                                type="text"
                                icon={<X size={20} />}
                                onClick={() => setStep('select')}
                                className="text-gray-500 hover:text-white"
                            />

                            {category === 'model' && previewUrl && !thumbnail && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden">
                                    <AssetThumbnailGenerator url={previewUrl} onCapture={handleThumbnailCapture} />
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <Form.Item
                                name="name"
                                label={<label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">资产名称</label>}
                                rules={[{ required: true, message: '请输入资产名称' }]}
                            >
                                <Input
                                    size="large"
                                    placeholder="输入资产显示名称..."
                                    className="!bg-[#0a0a0a] !border-white/5 !rounded-xl !text-white focus:!border-purple-500/50"
                                />
                            </Form.Item>

                            <Form.Item
                                name="category"
                                label={<label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">所属分类</label>}
                                rules={[{ required: true }]}
                            >
                                <Select
                                    size="large"
                                    options={CATEGORIES}
                                    placeholder="选择分类"
                                    className="premium-select"
                                    onChange={(val) => setCategory(val)}
                                />
                            </Form.Item>
                        </div>

                        <div className="pt-2">
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                block
                                loading={uploading}
                                disabled={category === 'model' && !thumbnail}
                                className="h-14 bg-gradient-to-r from-purple-600 to-blue-600 border-none rounded-2xl text-white font-bold shadow-xl shadow-purple-600/20 hover:scale-[1.01] transition-transform"
                            >
                                {uploading ? "正在上传并分析资源..." : (category === 'model' && !thumbnail) ? "正在生成封面图..." : "确认上传并发布"}
                            </Button>
                        </div>
                    </Form>
                )}

                {step === 'success' && (
                    <div className="py-12 flex flex-col items-center justify-center text-center gap-6 animate-in zoom-in-95 duration-500">
                        <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 shadow-inner">
                            <CheckCircle2 size={56} />
                        </div>
                        <div>
                            <Title level={3} className="!text-white !mb-1">资产上传成功！</Title>
                            <Text className="!text-sm !text-gray-500">资源已解析并录入资产库，您现在可以在场景中使用它了。</Text>
                        </div>
                        <Button
                            size="large"
                            onClick={reset}
                            className="mt-4 px-10 bg-white/5 hover:!bg-white/10 !border-white/10 !text-white rounded-xl font-bold transition-all"
                        >
                            返回素材列表
                        </Button>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default memo(AssetUploadModal);
