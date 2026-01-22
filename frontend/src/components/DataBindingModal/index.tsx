import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Button,
    Modal as AntModal,
    Tree as AntTree,
    Input as AntInput,
    Space as AntSpace,
    Typography as AntTypography,
    Tag as AntTag,
    Empty as AntEmpty,
    Alert as AntAlert,
    Divider as AntDivider,
    Card as AntCard,
    message
} from 'antd';
import { Database, Zap, Eye, Code, Search, Trash2 } from 'lucide-react';
import { type DataSource, type DataTag, type PropertyBinding } from '@/types';
import { dataSourceApi } from '@/api/dataSource';

const { Text } = AntTypography;

interface DataBindingModalProps {
    open: boolean;
    onCancel: () => void;
    onSave: (binding: PropertyBinding | null) => void;
    initialBinding?: PropertyBinding | null;
    propertyName: string;
}

/**
 * 数据绑定弹窗
 */
const DataBindingModal: React.FC<DataBindingModalProps> = ({
    open,
    onCancel,
    onSave,
    initialBinding,
    propertyName
}) => {
    const [dataSources, setDataSources] = useState<DataSource[]>([]);
    const [selectedKey, setSelectedKey] = useState<string | null>(initialBinding?.tagKey || null);
    const [selectedSourceId, setSelectedSourceId] = useState<number | null>(initialBinding?.dataSourceId || null);
    const [expression, setExpression] = useState<string>(initialBinding?.expression || '');
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    // 加载数据源
    useEffect(() => {
        if (open) {
            const fetchSources = async () => {
                setLoading(true);
                try {
                    const list = await dataSourceApi.list();
                    setDataSources(list);
                } catch (error) {
                    console.error('Failed to fetch data sources:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchSources();
        }
    }, [open]);

    // 格式化 Tree 数据
    const treeData = useMemo(() => {
        return dataSources.map(source => {
            const tags: DataTag[] = source.config ? JSON.parse(source.config) : [];
            return {
                title: source.name,
                key: `source-${source.id}`,
                icon: <Database size={14} className="text-purple-400" />,
                children: tags.map(tag => ({
                    title: tag.label || tag.key,
                    key: `${source.id}|${tag.key}`,
                    isLeaf: true,
                    icon: <Zap size={12} className="text-yellow-400" />,
                    sourceId: source.id,
                    tagKey: tag.key,
                    originalValue: tag.value
                }))
            };
        });
    }, [dataSources]);

    // 搜索过滤 Tree 数据
    const filteredTreeData = useMemo(() => {
        if (!searchValue) return treeData;
        const filter = (nodes: any[]): any[] => {
            return nodes.reduce((acc, node) => {
                const titleMatch = node.title.toLowerCase().includes(searchValue.toLowerCase());
                const children = node.children ? filter(node.children) : [];
                if (titleMatch || children.length > 0) {
                    acc.push({ ...node, children });
                }
                return acc;
            }, []);
        };
        return filter(treeData);
    }, [treeData, searchValue]);

    // 计算当前选中节点的信息
    const selectedNodeInfo = useMemo(() => {
        if (!selectedKey || !selectedSourceId) return null;
        const source = dataSources.find(s => s.id === selectedSourceId);
        if (!source) return null;
        const tags: DataTag[] = source.config ? JSON.parse(source.config) : [];
        const tag = tags.find(t => t.key === selectedKey);
        return tag || null;
    }, [selectedKey, selectedSourceId, dataSources]);

    // 实时预览计算
    const previewValue = useMemo(() => {
        if (!selectedNodeInfo) return '未选择数据源';
        const rawValue = selectedNodeInfo.value;
        if (!expression) return String(rawValue);

        try {
            // 使用简单的 Function 构造器执行表达式
            // eslint-disable-next-line no-new-func
            const fn = new Function('value', `return ${expression}`);
            return String(fn(rawValue));
        } catch (e) {
            return '表达式错误';
        }
    }, [selectedNodeInfo, expression]);

    const handleSelect = useCallback((_: any[], info: any) => {
        if (info.node.isLeaf) {
            setSelectedKey(info.node.tagKey);
            setSelectedSourceId(info.node.sourceId);
        }
    }, []);

    const handleConfirm = useCallback(() => {
        if (!selectedKey || !selectedSourceId) {
            message.warning('请先选择一个数据字段');
            return;
        }
        onSave({
            enabled: true,
            dataSourceId: selectedSourceId,
            tagKey: selectedKey,
            expression: expression
        });
    }, [onSave, selectedKey, selectedSourceId, expression]);

    const handleClear = useCallback(() => {
        onSave(null);
    }, [onSave]);

    return (
        <AntModal
            title={
                <AntSpace>
                    <Zap size={18} className="text-yellow-400" />
                    <span>数据绑定 - {propertyName}</span>
                </AntSpace>
            }
            open={open}
            onCancel={onCancel}
            width={"70%"}
            className="custom-modal"
            destroyOnHidden
            footer={[
                <Button key="cancel" onClick={onCancel} className="!bg-white/5 !border-white/10 !text-gray-400 hover:!text-white">
                    取消
                </Button>,
                initialBinding && (
                    <Button
                        key="clear"
                        danger
                        type="text"
                        icon={<Trash2 size={14} />}
                        onClick={handleClear}
                        className="hover:!bg-red-500/10"
                    >
                        清除绑定
                    </Button>
                ),
                <Button key="submit" type="primary" onClick={handleConfirm} className="!bg-blue-600 hover:!bg-blue-500 !border-none">
                    应用绑定
                </Button>
            ].filter(Boolean)}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-2 h-[500px]">
                {/* 第一部分：数据源与标签选择 */}
                <div className="flex flex-col border-r border-white/5 pr-4 space-y-4">
                    <AntDivider orientation={"left" as any} className="!m-0 !border-white/5">
                        <Text className="!text-[10px] !text-gray-500 !font-bold !uppercase">1. 选择数据标签</Text>
                    </AntDivider>

                    <AntInput
                        prefix={<Search size={14} className="text-gray-600" />}
                        placeholder="搜索数据源或标签..."
                        size="small"
                        className="!bg-white/5 !border-white/10 !rounded-lg"
                        value={searchValue}
                        onChange={e => setSearchValue(e.target.value)}
                    />

                    <div className="flex-1 bg-black/20 rounded-xl border border-white/5 overflow-y-auto custom-scrollbar p-2">
                        {dataSources.length === 0 && !loading ? (
                            <AntEmpty image={AntEmpty.PRESENTED_IMAGE_SIMPLE} description="暂无数据源" />
                        ) : (
                            <AntTree
                                showIcon
                                treeData={filteredTreeData}
                                onSelect={handleSelect}
                                defaultExpandAll
                                className="!bg-transparent !text-gray-400"
                                selectedKeys={selectedKey && selectedSourceId ? [`${selectedSourceId}|${selectedKey}`] : []}
                            />
                        )}
                    </div>
                </div>

                {/* 第二部分：数据处理逻辑 */}
                <div className="flex flex-col border-r border-white/5 pr-4 space-y-4">
                    <AntDivider orientation={"left" as any} className="!m-0 !border-white/5">
                        <Text className="!text-[10px] !text-gray-500 !font-bold !uppercase">2. 数据处理表达式</Text>
                    </AntDivider>

                    <AntCard className="!bg-white/5 !border-white/10 !rounded-xl" styles={{ body: { padding: 16 } }}>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Code size={14} className="text-blue-400" />
                                <Text className="!text-xs !text-gray-300">JavaScript 表达式</Text>
                            </div>
                            <AntInput.TextArea
                                rows={4}
                                placeholder="输入处理逻辑，例如: value * 1.5 或 value ? '运行' : '停止'"
                                className="!bg-black/20 !border-white/10 !text-blue-300 !font-mono !text-xs"
                                value={expression}
                                onChange={e => setExpression(e.target.value)}
                            />
                            <div className="bg-blue-500/5 p-3 rounded-lg border border-blue-500/10">
                                <Text className="!text-[10px] !text-gray-500 !leading-relaxed">
                                    提示：变量 <AntTag className="!m-0 !px-1 !py-0 !text-[10px] !bg-blue-500/20 !border-none !text-blue-400">value</AntTag> 代表接口返回的原始值。您可以编写任何合法的 JS 表达式来转换数据。
                                </Text>
                            </div>
                        </div>
                    </AntCard>
                </div>

                {/* 第三部分：实时预览 */}
                <div className="flex flex-col space-y-4">
                    <AntDivider orientation={"left" as any} className="!m-0 !border-white/5">
                        <Text className="!text-[10px] !text-gray-500 !font-bold !uppercase">3. 实时预览</Text>
                    </AntDivider>

                    <div className="flex-1 space-y-4">
                        <AntCard className="!bg-white/5 !border-white/10 !rounded-xl overflow-hidden" styles={{ body: { padding: 0 } }}>
                            <div className="bg-purple-500/10 px-4 py-3 border-b border-white/5 flex items-center justify-between">
                                <AntSpace>
                                    <Eye size={14} className="text-purple-400" />
                                    <Text className="!text-xs !text-gray-300 !font-bold">应用效果</Text>
                                </AntSpace>
                                {selectedNodeInfo && <AntTag color="green" bordered={false} className="!m-0 !text-[10px]">实时连接中</AntTag>}
                            </div>
                            <div className="p-6 flex flex-col items-center justify-center min-h-[120px] bg-gradient-to-br from-white/[0.02] to-transparent">
                                <Text className="!text-3xl !font-bold !text-white !mb-2">
                                    {previewValue}
                                </Text>
                                <Text className="!text-[10px] !text-gray-600">最终应用到属性 <span className="text-blue-400">{propertyName}</span> 的值</Text>
                            </div>
                        </AntCard>

                        <div className="space-y-3">
                            <Text className="!text-[10px] !text-gray-500 !font-bold !uppercase">当前状态</Text>
                            <div className="bg-black/40 rounded-xl p-3 border border-white/5 space-y-2">
                                <div className="flex justify-between">
                                    <Text className="!text-[10px] !text-gray-600">原始数据:</Text>
                                    <Text className="!text-[10px] !text-gray-400">{selectedNodeInfo ? String(selectedNodeInfo.value) : '-'}</Text>
                                </div>
                                <div className="flex justify-between">
                                    <Text className="!text-[10px] !text-gray-600">目标属性:</Text>
                                    <Text className="!text-[10px] !text-blue-400">{propertyName}</Text>
                                </div>
                            </div>
                        </div>

                        {!selectedKey && (
                            <AntAlert
                                title="未绑定数据"
                                description="请从左侧列表中选择一个数据标签以建立实时连接。"
                                type="info"
                                showIcon
                                className="!bg-blue-500/5 !border-blue-500/20 !text-blue-400 !text-xs shadow-lg"
                            />
                        )}
                    </div>
                </div>
            </div>
        </AntModal>
    );
};

export default React.memo(DataBindingModal);

import { createRoot } from 'react-dom/client';
import { ConfigProvider } from 'antd';
import { appTheme } from '@/App';

/**
 * 命令式调用数据绑定弹窗
 */
export const showDataBindingModal = (props: Omit<DataBindingModalProps, 'open' | 'onCancel' | 'onSave'>): Promise<PropertyBinding | null | undefined> => {
    return new Promise((resolve) => {
        const container = document.createElement('div');
        // 为命令式弹窗添加特定类名，确保 Tailwind 样式生效
        container.className = 'data-binding-modal-root';
        document.body.appendChild(container);
        const root = createRoot(container);

        const close = (result?: PropertyBinding | null) => {
            root.unmount();
            if (container.parentNode) {
                document.body.removeChild(container);
            }
            resolve(result);
        };

        root.render(
            <ConfigProvider theme={appTheme}>
                <DataBindingModal
                    {...props}
                    open={true}
                    onCancel={() => close(undefined)}
                    onSave={(binding) => close(binding)}
                />
            </ConfigProvider>
        );
    });
};
