import React, { useState, useEffect } from 'react';
import {
    Database,
    Plus,
    Trash2,
    Globe,
    Settings2,
    Search,
    ExternalLink,
    Tag as TagIcon
} from 'lucide-react';
import {
    Button,
    Input,
    Space,
    Typography,
    Modal,
    message,
    Table,
    Tag,
    Tooltip
} from 'antd';
import { type DataSource } from '@/types';
import { dataSourceApi } from '@/api/dataSource';
import DataSourceModal from './components/DataSourceModal';

const { Text, Title } = Typography;

const DataSourceManagementView: React.FC = () => {
    const [dataSources, setDataSources] = useState<DataSource[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingSource, setEditingSource] = useState<DataSource | null>(null);
    const [searchText, setSearchText] = useState('');

    // 加载数据源
    const fetchSources = async () => {
        setLoading(true);
        try {
            const data = await dataSourceApi.list();
            setDataSources(data);
        } catch (error) {
            console.error('Failed to fetch data sources:', error);
            // 错误由拦截器处理
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSources();
    }, []);

    // 删除数据源
    const handleDelete = (id: number) => {
        Modal.confirm({
            title: '确认删除',
            content: '确定要删除这个数据源吗？删除后相关的 3D 对象绑定可能失效。',
            okText: '确定',
            cancelText: '取消',
            okButtonProps: { danger: true },
            onOk: async () => {
                try {
                    await dataSourceApi.delete(id);
                    message.success('删除成功');
                    fetchSources();
                } catch (error) {
                    console.error('Delete error:', error);
                }
            }
        });
    };

    const filteredSources = dataSources.filter(s =>
        s.name.toLowerCase().includes(searchText.toLowerCase()) ||
        s.url.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        {
            title: '数据源名称',
            dataIndex: 'name',
            key: 'name',
            width: 250,
            render: (text: string) => (
                <Space size={12}>
                    <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                        <Globe size={18} />
                    </div>
                    <div className="flex flex-col">
                        <Text className="!text-white !font-bold !text-sm">{text}</Text>
                        <Text className="!text-gray-600 !text-[10px]">Active Data Source</Text>
                    </div>
                </Space>
            )
        },
        {
            title: '接口详情',
            dataIndex: 'url',
            key: 'url',
            render: (url: string, record: DataSource) => (
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Tag
                            color={record.method === 'POST' ? 'blue' : 'green'}
                            bordered={false}
                            className="!m-0 !text-[10px] !px-1.5 !rounded-md font-mono"
                        >
                            {record.method || 'GET'}
                        </Tag>
                        <Text className="!text-gray-400 !text-xs !font-mono !truncate max-w-[300px] cursor-help" title={url}>
                            {url}
                        </Text>
                    </div>
                </div>
            )
        },
        {
            title: '解析标签',
            dataIndex: 'config',
            key: 'tags',
            width: 150,
            render: (config: string) => {
                const tagsLength = config ? JSON.parse(config).length : 0;
                return (
                    <Space size={4} className="bg-white/5 px-3 py-1 rounded-full border border-white/5">
                        <TagIcon size={12} className="text-blue-400" />
                        <Text className="!text-blue-400 !text-[11px] !font-bold">{tagsLength} Tags</Text>
                    </Space>
                );
            }
        },
        {
            title: '更新时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            width: 180,
            render: (time: string) => (
                <Text className="!text-gray-500 !text-xs">
                    {time ? new Date(time).toLocaleString() : '-'}
                </Text>
            )
        },
        {
            title: '操作',
            key: 'action',
            width: 120,
            align: 'right' as const,
            render: (_: any, record: DataSource) => (
                <Space>
                    <Tooltip title="编辑配置">
                        <Button
                            type="text"
                            icon={<Settings2 size={16} />}
                            onClick={() => {
                                setEditingSource(record);
                                setIsModalVisible(true);
                            }}
                            className="!text-gray-400 hover:!text-white hover:!bg-white/10"
                        />
                    </Tooltip>
                    <Tooltip title="查看文档/链接">
                        <Button
                            type="text"
                            icon={<ExternalLink size={16} />}
                            href={record.url}
                            target="_blank"
                            className="!text-gray-400 hover:!text-blue-400 hover:!bg-blue-500/10"
                        />
                    </Tooltip>
                    <Tooltip title="删除">
                        <Button
                            type="text"
                            danger
                            icon={<Trash2 size={16} />}
                            onClick={() => handleDelete(record.id)}
                            className="hover:!bg-red-500/10"
                        />
                    </Tooltip>
                </Space>
            )
        }
    ];

    return (
        <div className="p-8 h-full flex flex-col space-y-6 overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <div className="flex items-center gap-3">
                        <Database size={28} className="text-purple-500" />
                        <Title level={2} className="!text-white !m-0 !text-2xl !font-bold">数据源管理</Title>
                    </div>
                    <Text className="!text-gray-500 ml-10">管理外部数据接口并解析为可绑定的数据标签</Text>
                </div>
                <Button
                    type="primary"
                    size="large"
                    icon={<Plus size={18} />}
                    className="h-12 px-6 rounded-xl font-bold shadow-lg shadow-purple-500/20"
                    onClick={() => {
                        setEditingSource(null);
                        setIsModalVisible(true);
                    }}
                >
                    新建数据源
                </Button>
            </div>

            {/* Toolbar */}
            <div className="flex gap-4">
                <Input
                    prefix={<Search size={16} className="text-gray-500" />}
                    placeholder="输入名称或 URL 搜索..."
                    className="max-w-md h-11 !bg-white/5 !border-white/10 !rounded-xl search-input"
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden shadow-2xl overflow-y-auto custom-scrollbar">
                <Table
                    columns={columns}
                    dataSource={filteredSources}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        className: "px-6 py-4"
                    }}
                    className="custom-antd-table"
                />
            </div>

            {/* Modal Component */}
            <DataSourceModal
                open={isModalVisible}
                editingSource={editingSource}
                onCancel={() => {
                    setIsModalVisible(false);
                    setEditingSource(null);
                }}
                onSuccess={() => {
                    setIsModalVisible(false);
                    setEditingSource(null);
                    fetchSources();
                }}
            />
        </div>
    );
};

export default React.memo(DataSourceManagementView);
