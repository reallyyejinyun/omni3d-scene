import React from 'react';
import { Layout, Code, Map, Settings2, Database } from 'lucide-react';
import PropertySection from '../common/PropertySection';
import type { SceneObject, PropertyBinding } from '@/types';
import { useStore } from '@/store';
import CodeEditorArea from '../../common/LabelEditor/CodeEditorArea';
import { Select, Button, Space, Typography, Input, InputNumber, Row, Col, Switch, Tooltip } from 'antd';
import { showDataBindingModal } from '@/components/DataBindingModal';

const { Text } = Typography;

interface LabelSectionProps {
    object: SceneObject;
    onUpdate: (updates: Partial<SceneObject>) => void;
}
/**
 * 标签属性分组
 * @param param0 
 * @returns 
 */
const LabelSection: React.FC<LabelSectionProps> = ({ object, onUpdate }) => {
    const labelTemplates = useStore((state: any) => state.labelTemplates);

    const handleTemplateChange = React.useCallback((templateId: string) => {
        if (!templateId) {
            onUpdate({ labelBinding: undefined });
            return;
        }

        const template = labelTemplates.find((t: any) => t.id === templateId);
        if (template) {
            const initialMappings: Record<string, string> = {};
            template.fields.forEach((field: string) => {
                initialMappings[field] = '';
            });
            onUpdate({
                labelBinding: {
                    templateId,
                    fieldMappings: initialMappings
                }
            });
        }
    }, [labelTemplates, onUpdate]);

    const handleMappingChange = React.useCallback((field: string, value: string | PropertyBinding) => {
        if (object.labelBinding) {
            onUpdate({
                labelBinding: {
                    ...object.labelBinding,
                    fieldMappings: {
                        ...object.labelBinding.fieldMappings,
                        [field]: value
                    }
                }
            });
        }
    }, [object.labelBinding, onUpdate]);

    const handleOpenBinding = React.useCallback(async (field: string) => {
        if (!object.labelBinding) return;

        const currentVal = object.labelBinding.fieldMappings[field];
        const initialBinding = (currentVal && typeof currentVal === 'object') ? currentVal : null;

        const result = await showDataBindingModal({
            propertyName: `标签字段: ${field}`,
            initialBinding
        });

        if (result !== undefined) {
            handleMappingChange(field, result || '');
        }
    }, [object.labelBinding, handleMappingChange]);

    const currentBinding = object.labelBinding;
    const currentTemplate = React.useMemo(() =>
        labelTemplates.find((t: any) => t.id === currentBinding?.templateId),
        [labelTemplates, currentBinding?.templateId]
    );

    return (
        <Space orientation="vertical" size={16} className="w-full">
            <PropertySection title="标签模板" icon={<Layout size={12} />}>
                <Space orientation="vertical" size={12} className="w-full">
                    <div className="flex items-center justify-between">
                        <Text className="!text-[10px] !opacity-50 !uppercase !font-bold !tracking-wider">选择预设模板</Text>
                        <Button
                            type="link"
                            size="small"
                            onClick={() => (useStore.getState() as any).setTemplateManagerVisible(true)}
                            icon={<Settings2 size={10} />}
                            className="!text-[10px] !text-purple-400 hover:!text-purple-300 !p-0 !h-auto"
                        >
                            管理模板库
                        </Button>
                    </div>
                    <Select
                        className="w-full"
                        variant="filled"
                        size="small"
                        value={currentBinding?.templateId || ''}
                        onChange={handleTemplateChange}
                        options={[
                            { value: '', label: '自定义HTML (自由编写)' },
                            ...labelTemplates.map((t: any) => ({ value: t.id, label: t.name }))
                        ]}
                    />
                </Space>

                {currentTemplate && (
                    <div className="mt-4 space-y-4 pt-4 border-t border-white/5 animate-in fade-in slide-in-from-top-2 duration-300">
                        <Space size={6} align="center" className="mb-2">
                            <Map size={12} className="text-blue-400" />
                            <Text className="!text-[10px] !font-bold !text-gray-400 !uppercase">数据映射 (Fields)</Text>
                        </Space>

                        {currentTemplate.fields.map((field: string) => (
                            <div key={field} className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <Text className="!text-[10px] !text-blue-300 !font-mono">
                                        {field}
                                    </Text>
                                    <Text type="secondary" italic className="!text-[8px]">模板占位符</Text>
                                </div>
                                <div className="flex-1 flex items-center gap-2 bg-black/20 border border-white/10 rounded px-2 h-8 group/field">
                                    <Tooltip title={typeof currentBinding?.fieldMappings[field] === 'object' ? '点击管理绑定' : '点击建立绑定'}>
                                        <Database
                                            size={12}
                                            className={`cursor-pointer transition-colors ${typeof currentBinding?.fieldMappings[field] === 'object' ? 'text-blue-400' : 'text-gray-600 hover:text-blue-400 opactiy-0 group-hover/field:opacity-100'}`}
                                            onClick={() => handleOpenBinding(field)}
                                        />
                                    </Tooltip>
                                    <Input
                                        size="small"
                                        variant="borderless"
                                        value={typeof currentBinding?.fieldMappings[field] === 'string' ? (currentBinding?.fieldMappings[field] as string) : `已绑定: ${(currentBinding?.fieldMappings[field] as PropertyBinding).tagKey}`}
                                        onChange={(e) => handleMappingChange(field, e.target.value)}
                                        placeholder="输入静态文本或点击左侧图标绑定数据"
                                        className="flex-1 !p-0 !text-white !text-xs"
                                        disabled={typeof currentBinding?.fieldMappings[field] === 'object'}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </PropertySection>

            {!currentBinding && (
                <PropertySection title="自定义HTML" icon={<Code size={12} />}>
                    <Space orientation="vertical" size={12} className="w-full">
                        <div className="flex items-center justify-between">
                            <Text className="!text-[10px] !opacity-50 !uppercase">HTML 源码</Text>
                            <Text className="!text-[8px] !text-blue-500/50">支持 CSS 内联</Text>
                        </div>
                        <CodeEditorArea
                            value={object.label || ''}
                            language="html"
                            height="200px"
                            showLabel={false}
                            onChange={(val) => onUpdate({ label: val || '' })}
                        />
                    </Space>
                </PropertySection>
            )}

            <PropertySection title="显示配置" icon={<Settings2 size={12} />}>
                <Space orientation="vertical" size={16} className="w-full">
                    {/* 引线开关 */}
                    <div className="flex items-center justify-between">
                        <Text className="!text-xs !text-gray-400">显示引线</Text>
                        <Switch
                            size="small"
                            checked={object.labelConfig?.showLine ?? true}
                            onChange={(checked) => onUpdate({
                                labelConfig: {
                                    offset: object.labelConfig?.offset || [3, 3, 0],
                                    showLine: checked
                                }
                            })}
                        />
                    </div>

                    {/* 偏移配置 */}
                    <div className="space-y-2">
                        <Text className="!text-[10px] !opacity-50 !uppercase !font-bold !tracking-wider">偏移位置 (X, Y, Z)</Text>
                        <Row gutter={8}>
                            {['x', 'y', 'z'].map((axis, index) => (
                                <Col span={8} key={axis}>
                                    <Space orientation="vertical" size={2} className="w-full">
                                        <Text className="!text-[9px] !text-gray-500 !uppercase !text-center !font-mono !block w-full">{axis}</Text>
                                        <InputNumber
                                            size="small"
                                            variant="filled"
                                            step={0.1}
                                            value={object.labelConfig?.offset?.[index] ?? (index === 2 ? 0 : 3)}
                                            onChange={(val) => {
                                                const v = val || 0;
                                                const newOffset = [...(object.labelConfig?.offset || [3, 3, 0])] as [number, number, number];
                                                newOffset[index] = v;
                                                onUpdate({
                                                    labelConfig: {
                                                        showLine: object.labelConfig?.showLine ?? true,
                                                        offset: newOffset
                                                    }
                                                });
                                            }}
                                            className="!w-full"
                                        />
                                    </Space>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </Space>
            </PropertySection>
        </Space>
    );
};

export default React.memo(LabelSection);
