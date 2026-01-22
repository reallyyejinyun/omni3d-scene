import React, { useState, useEffect, useCallback } from 'react';
import { Input, InputNumber, Slider, Checkbox, Select, ColorPicker, Typography, Space } from 'antd';
import type { Color } from 'antd/es/color-picker';
import { Database } from 'lucide-react';
import { showDataBindingModal } from '@/components/DataBindingModal';
import { useStore } from '@/store';

const { Text } = Typography;

interface PropertyFieldProps<T = any> {
    label: string;
    value: T;
    onChange: (value: T) => void;
    type?: 'text' | 'number' | 'range' | 'color' | 'checkbox' | 'select';
    min?: number;
    max?: number;
    step?: number;
    className?: string;
    inline?: boolean;
    children?: React.ReactNode;
    placeholder?: string;
    options?: { label: string; value: any }[];
    bindingKey?: string; // 数据绑定标识符，如 "position.0"
}
/**
 * 属性字段渲染器
 * @param param0 
 * @returns 
 */
const RenderInput: React.FC<PropertyFieldProps> = ({ type, value, onChange, min, max, step, children, placeholder, options }) => {
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleCommit = useCallback((val?: any) => {
        const commitValue = val !== undefined ? val : localValue;
        if (commitValue !== value) {
            onChange(commitValue);
        }
    }, [localValue, value, onChange]);

    switch (type) {
        case 'color':
            return (
                <ColorPicker
                    value={localValue}
                    onChange={(color: Color) => setLocalValue(color.toHexString())}
                    onChangeComplete={(color: Color) => handleCommit(color.toHexString())}
                    size="small"
                    showText
                    className="!bg-black/20 !border-white/10"
                />
            );
        case 'checkbox':
            return (
                <Checkbox
                    checked={localValue === true}
                    onChange={(e) => {
                        const val = e.target.checked;
                        setLocalValue(val);
                        onChange(val);
                    }}
                />
            );
        case 'range':
            return (
                <Space size={8} className="w-full">
                    <Slider
                        min={min}
                        max={max}
                        step={step}
                        value={typeof localValue === 'number' ? localValue : 0}
                        onChange={(val) => setLocalValue(val)}
                        onAfterChange={handleCommit}
                        className="flex-1 !m-0 !min-w-[100px]"
                    />
                    <Text className="!text-[10px] !text-blue-400 !font-bold !min-w-[30px] !text-right">
                        {localValue}
                    </Text>
                </Space>
            );
        case 'select':
            return (
                <Select
                    size="small"
                    value={localValue}
                    onChange={(val) => {
                        setLocalValue(val);
                        onChange(val);
                    }}
                    className="w-full !bg-black/20"
                    variant="filled"
                    placeholder={placeholder}
                    options={options}
                >
                    {!options && children}
                </Select>
            );
        case 'number':
            return (
                <InputNumber
                    size="small"
                    placeholder={placeholder}
                    min={min}
                    max={max}
                    step={step}
                    value={localValue}
                    onChange={(val) => setLocalValue(val)}
                    onBlur={() => handleCommit()}
                    onPressEnter={() => handleCommit()}
                    className="w-full !bg-black/20 !text-white !border-white/10"
                    variant="filled"
                />
            );
        default:
            return (
                <Input
                    size="small"
                    placeholder={placeholder}
                    value={localValue}
                    onChange={(e) => setLocalValue(e.target.value)}
                    onBlur={() => handleCommit()}
                    onPressEnter={() => handleCommit()}
                    className="w-full !bg-black/20 !text-white !border-white/10"
                    variant="filled"
                />
            );
    }
};

/**
 * 懒更新属性组件
 * 在输入时仅更新本地状态，在失焦(onBlur)或回车(Enter)时才触发外部 onChange 同步到全局 Store
 * 
 */
const PropertyField: React.FC<PropertyFieldProps> = (props) => {
    const { label, className = '', inline = false, bindingKey } = props;

    const updateObject = useStore((state) => state.updateObject);
    const selectedId = useStore((state) => state.selectedId);
    const selectedMeshId = useStore((state) => state.selectedMeshId);
    const object = useStore(state => state.objects.find(o => o.id === selectedId));

    // 如果是子网格，绑定 Key 需要带上 meshId 前缀
    const actualBindingKey = (selectedMeshId && bindingKey) ? `${selectedMeshId}:${bindingKey}` : bindingKey;

    // 从 Store 中获取当前的绑定状态
    const binding = actualBindingKey ? object?.dataBindings?.[actualBindingKey] : undefined;

    const handleOpenBinding = useCallback(async () => {
        if (!selectedId || !actualBindingKey) return;

        const result = await showDataBindingModal({
            propertyName: label,
            initialBinding: binding
        });

        if (result !== undefined) {
            const currentBindings = { ...(object?.dataBindings || {}) };
            if (result) {
                currentBindings[actualBindingKey] = result;
            } else {
                delete currentBindings[actualBindingKey];
            }

            updateObject(selectedId, {
                dataBindings: currentBindings
            });
        }
    }, [selectedId, actualBindingKey, object, label, binding, updateObject]);

    return (
        <div className={`space-y-1.5 ${className} ${inline ? 'flex items-center justify-between gap-4 space-y-0' : ''}`}>
            {label && (
                <div className="flex items-center gap-1.5 group">
                    {bindingKey && (
                        <Database
                            size={10}
                            className={`cursor-pointer transition-colors ${binding?.enabled ? 'text-blue-400 opacity-100' : 'text-gray-600 opacity-0 group-hover:opacity-100 hover:text-blue-400'}`}
                            onClick={handleOpenBinding}
                        />
                    )}
                    <Text className="!text-[10px] !opacity-70 !font-bold !tracking-wider !uppercase !whitespace-nowrap !text-gray-400">
                        {label}
                    </Text>
                </div>
            )}
            <div className={inline ? 'flex-1 flex justify-end' : 'w-full'}>
                <RenderInput {...props} />
            </div>
        </div>
    );
};

export default React.memo(PropertyField);
