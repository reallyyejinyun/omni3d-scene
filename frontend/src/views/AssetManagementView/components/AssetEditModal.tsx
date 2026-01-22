import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';
import { Edit, Upload, ImageIcon } from 'lucide-react';
import { type Asset } from '@/api/asset';

interface AssetEditModalProps {
    asset: Asset | null;
    open: boolean;
    onClose: () => void;
    onSave: (id: string, updates: Partial<Asset>, thumbnail?: File) => void;
}

const AssetEditModal: React.FC<AssetEditModalProps> = ({ asset, open, onClose, onSave }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

    useEffect(() => {
        if (asset) {
            form.setFieldsValue({
                name: asset.name,
                categoryId: asset.categoryId,
            });
            setThumbnailPreview(asset.thumbnail || null);
            setThumbnailFile(null);
        }
    }, [asset, form]);

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                message.error('封面图片不能超过 2MB');
                return;
            }
            setThumbnailFile(file);
            const url = URL.createObjectURL(file);
            setThumbnailPreview(url);
        }
    };

    const handleSubmit = async () => {
        if (!asset) return;
        try {
            const values = await form.validateFields();
            setLoading(true);
            await onSave(asset.id, values, thumbnailFile || undefined);
            setLoading(false);
            onClose();
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            onOk={handleSubmit}
            confirmLoading={loading}
            title={
                <div className="flex items-center gap-2">
                    <Edit className="text-purple-400" size={18} />
                    <span className="font-sans font-bold text-white">编辑素材属性</span>
                </div>
            }
            okText="保存更改"
            cancelText="取消"
            centered
            className="premium-form-modal"
            okButtonProps={{
                className: "bg-purple-600 hover:bg-purple-500 rounded-lg h-9 shadow-lg shadow-purple-600/20"
            }}
        >
            <Form
                form={form}
                layout="vertical"
                className="mt-6"
                requiredMark={false}
            >
                {/* 封面编辑区域 */}
                <div className="mb-6">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">资产封面</label>
                    <div className="flex items-center gap-4">
                        <div className="w-24 h-24 bg-white/5 rounded-xl border border-white/10 overflow-hidden relative group">
                            {thumbnailPreview ? (
                                <img src={thumbnailPreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-600">
                                    <ImageIcon size={24} />
                                    <span className="text-[10px] mt-1 uppercase font-bold">无封面</span>
                                </div>
                            )}
                            <div
                                onClick={() => document.getElementById('edit-thumb-input')?.click()}
                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer text-white"
                            >
                                <Upload size={16} />
                            </div>
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-gray-400 mb-2">推荐比例 1:1，最大支持 2MB 的图片文件。</p>
                            <Button
                                size="small"
                                ghost
                                className="border-white/10 text-gray-400 hover:text-white"
                                onClick={() => document.getElementById('edit-thumb-input')?.click()}
                            >
                                选择新封面
                            </Button>
                            <input
                                id="edit-thumb-input"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleThumbnailChange}
                            />
                        </div>
                    </div>
                </div>

                <Form.Item
                    name="name"
                    label={<span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">素材名称</span>}
                    rules={[{ required: true, message: '请输入素材名称' }]}
                >
                    <Input className="bg-white/5 border-white/10 text-white rounded-xl h-12" />
                </Form.Item>

                <Form.Item
                    name="categoryId"
                    label={<span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">所属分类</span>}
                >
                    <Select className="premium-select h-12">
                        <Select.Option value="model">3D 模型</Select.Option>
                        <Select.Option value="texture">贴图/图片</Select.Option>
                        <Select.Option value="hdr">环境光 (HDR)</Select.Option>
                        <Select.Option value="video">视频素材</Select.Option>
                        <Select.Option value="other">其他</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AssetEditModal;
