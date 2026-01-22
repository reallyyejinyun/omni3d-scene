import React, { useState, useEffect, useCallback } from 'react';
import {
    Modal,
    Form,
    Input,
    Select,
    InputNumber,
    Button,
    Divider,
    Typography,
    Tag,
    Space,
    message,
    Empty
} from 'antd';
import {
    Play,
    Tag as TagIcon,
    Database,
    Info
} from 'lucide-react';
import { type DataSource, type DataTag } from '@/types';
import { dataSourceApi } from '@/api/dataSource';
import axios from 'axios';
import * as THREE from 'three';
import { flattenDataSourceResponse } from '@/utils/utils';

const { Text } = Typography;



interface DataSourceModalProps {
    open: boolean;
    editingSource: DataSource | null;
    onCancel: () => void;
    onSuccess: () => void;
}

const DataSourceModal: React.FC<DataSourceModalProps> = ({
    open,
    editingSource,
    onCancel,
    onSuccess
}) => {
    const [form] = Form.useForm();
    const [localTags, setLocalTags] = useState<DataTag[]>([]);
    const [isParsing, setIsParsing] = useState(false);
    const [loading, setLoading] = useState(false);

    // 回显数据
    useEffect(() => {
        if (open) {
            if (editingSource) {
                form.setFieldsValue({
                    name: editingSource.name,
                    url: editingSource.url,
                    method: editingSource.method || 'GET',
                    refreshInterval: editingSource.refreshInterval || 0,
                });
                setLocalTags(editingSource.config ? JSON.parse(editingSource.config) : []);
            } else {
                form.resetFields();
                setLocalTags([]);
            }
        }
    }, [open, editingSource, form]);

    // 解析逻辑
    const handleParse = useCallback(async () => {
        try {
            const values = await form.validateFields(['url', 'method']);
            setIsParsing(true);
            const hide = message.loading('正在请求并解析字段...', 0);

            try {
                const response = await axios({
                    url: values.url,
                    method: values.method,
                    timeout: 10000
                });

                // 调用外部定义的扁平化解析函数
                const newTags = flattenDataSourceResponse(response.data, localTags);

                setLocalTags(newTags);
                message.success(`解析完成，识别到 ${newTags.length} 个字段`);
            } catch (err: any) {
                message.error(`解析失败: ${err.message || '接口调用异常'}`);
            } finally {
                hide();
                setIsParsing(false);
            }
        } catch (error) {
            // 表单校验失败
        }
    }, [form, localTags]);

    // 提交保存
    const handleSubmit = useCallback(async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();

            const payload: any = {
                ...editingSource,
                name: values.name,
                url: values.url,
                method: values.method,
                refreshInterval: values.refreshInterval,
                config: JSON.stringify(localTags)
            };

            if (editingSource) {
                await dataSourceApi.update(payload);
                message.success('更新成功');
            } else {
                await dataSourceApi.save(payload);
                message.success('创建成功');
            }

            onSuccess();
        } catch (error: any) {
            console.error('Save error:', error);
        } finally {
            setLoading(false);
        }
    }, [form, editingSource, onSuccess]);

    // 修改局部 Tag Label
    const handleUpdateTagLabel = useCallback((tagId: string, newLabel: string) => {
        setLocalTags(prev => prev.map(t => t.id === tagId ? { ...t, label: newLabel } : t));
    }, [setLocalTags]);

    return (
        <Modal
            title={
                <Space size={8}>
                    <Database size={18} className="text-purple-500" />
                    <span className="text-white">{editingSource ? '编辑数据源' : '新建数据源'}</span>
                </Space>
            }
            open={open}
            onCancel={onCancel}
            onOk={handleSubmit}
            confirmLoading={loading}
            width={'70%'}
            className="custom-modal"
            okText="保存数据源并关闭"
            cancelText="取消"
            destroyOnHidden
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-2">
                {/* 左侧：属性设置 */}
                <div className="space-y-4">
                    <Divider orientation={"left" as any} className="!m-0 !border-white/5">
                        <Text className="!text-[10px] !text-gray-500 !font-bold !uppercase">基础信息</Text>
                    </Divider>

                    <Form
                        form={form}
                        layout="vertical"
                        initialValues={{ method: 'GET' }}
                    >
                        <Form.Item
                            name="name"
                            label="名称"
                            rules={[{ required: true, message: '请输入数据源名称' }]}
                        >
                            <Input placeholder="例如：生产线实时监控" className="h-10" />
                        </Form.Item>

                        <Form.Item
                            name="url"
                            label="接口地址"
                            rules={[{ required: true, message: '请输入有效的浏览器 URL' }]}
                        >
                            <Input placeholder="https://api.example.com/status" className="h-10" />
                        </Form.Item>

                        <div className="grid grid-cols-2 gap-4">
                            <Form.Item name="method" label="请求方式">
                                <Select
                                    className="h-10"
                                    options={[{ value: 'GET', label: 'GET' }, { value: 'POST', label: 'POST' }]}
                                />
                            </Form.Item>
                            <Form.Item name="refreshInterval" label="刷新间隔(ms)">
                                <InputNumber className="w-full h-10 flex items-center" placeholder="不自动刷新" />
                            </Form.Item>
                        </div>
                    </Form>

                    <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4 space-y-2">
                        <div className="flex items-center gap-2 text-blue-400">
                            <Info size={14} />
                            <Text className="!text-xs !font-bold !text-blue-400">解析提示</Text>
                        </div>
                        <Text className="!text-[11px] !text-gray-500 !leading-relaxed !block">
                            填写完成后，点击右侧的解析按钮获取接口字段。系统会自动将其映射为数据标签，您可以修改标签名称以便在编辑器中快速识别。
                        </Text>
                    </div>
                </div>

                {/* 右侧：字段解析 */}
                <div className="flex flex-col min-h-[400px]">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-2 flex-1">
                            <Text className="!text-[10px] !text-gray-500 !font-bold !uppercase whitespace-nowrap">解析结果 (TAGS)</Text>
                            <div className="h-px bg-white/5 flex-1" />
                        </div>
                        <Button
                            type="primary"
                            size="small"
                            icon={<Play size={12} />}
                            loading={isParsing}
                            onClick={handleParse}
                            className="!bg-green-600 !border-none hover:!bg-green-500 h-7 px-3 rounded-lg flex-shrink-0"
                        >
                            解析字段
                        </Button>
                    </div>

                    <div className="flex-1 bg-black/20 rounded-2xl border border-white/5 overflow-hidden flex flex-col">
                        {localTags.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-transparent">
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description={<Text className="!text-gray-600 !text-xs">点击“解析字段”开始提取数据</Text>}
                                />
                            </div>
                        ) : (
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                                {localTags.map(tag => (
                                    <div key={tag.id} className="flex flex-col gap-1.5 bg-white/[0.03] p-2.5 rounded-xl border border-white/5 hover:bg-white/[0.05] transition-colors group">
                                        <div className="flex items-center gap-2">
                                            <TagIcon size={12} className="text-purple-400 opacity-60" />
                                            <Input
                                                size="small"
                                                variant="borderless"
                                                className="!p-0 !text-xs !font-bold !text-blue-300 w-full hover:!bg-white/5 !rounded px-1"
                                                value={tag.label}
                                                onChange={e => handleUpdateTagLabel(tag.id, e.target.value)}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between ml-5">
                                            <Text className="!text-[9px] !text-gray-600 !font-mono !truncate" title={tag.key}>Key: {tag.key}</Text>
                                            <Tag color="purple" bordered={false} className="!text-[9px] !m-0 !px-1.5 !leading-4 opacity-70">
                                                Val: {String(tag.value)}
                                            </Tag>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="p-3 border-t border-white/5 bg-white/[0.02]">
                            <Text className="!text-[10px] !text-gray-500">共识别到 {localTags.length} 个可用标签</Text>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default React.memo(DataSourceModal);
