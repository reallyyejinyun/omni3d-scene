import React, { useState, useEffect, useCallback } from 'react';
import { Image as ImageIcon, Link, Upload, X, Database as DatabaseIcon } from 'lucide-react';
import { Input, Button, Typography, Space, Image, Popover } from 'antd';

const { Text } = Typography;

interface AssetPickerProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: 'image' | 'hdr' | 'any';
}

/**
 * 资源/贴图选择器组件
 * 集成懒更新逻辑：输入 URL 时失焦或回车才会提交
 */
const AssetPicker: React.FC<AssetPickerProps> = ({ label, value, onChange, placeholder = "输入图片或资源链接...", type = 'image' }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [localUrl, setLocalUrl] = useState(value);

    // 当外部 value 发生变化时，同步本地状态
    useEffect(() => {
        setLocalUrl(value);
    }, [value]);

    const handleCommit = useCallback(() => {
        if (localUrl !== value) {
            onChange(localUrl);
        }
    }, [localUrl, value, onChange]);


    const content = (
        <div className="w-80 space-y-4 p-1">
            <Space.Compact className="w-full">
                <Input
                    placeholder="http://example.com/asset.jpg"
                    value={localUrl}
                    onChange={(e) => setLocalUrl(e.target.value)}
                    onBlur={handleCommit}
                    onPressEnter={() => { handleCommit(); setIsExpanded(false); }}
                    autoFocus
                    variant="filled"
                    className="!bg-black/20 !border-white/10 !text-white"
                />
                <Button
                    type="primary"
                    icon={<X size={14} />}
                    onClick={() => setIsExpanded(false)}
                    className="!bg-blue-600"
                />
            </Space.Compact>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                <Button
                    variant="filled"
                    icon={<Upload size={14} />}
                    className="!bg-white/5 hover:!bg-white/10 !text-gray-400 !text-[11px] !border-none"
                    size="small"
                >
                    本地上传
                </Button>
                <Button
                    variant="filled"
                    icon={<DatabaseIcon size={14} />}
                    className="!bg-white/5 hover:!bg-white/10 !text-gray-400 !text-[11px] !border-none"
                    size="small"
                >
                    素材库
                </Button>
            </div>
        </div>
    );

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <Text className="!text-[10px] !opacity-70 !font-bold !tracking-wider !uppercase !text-gray-400">
                    {label}
                </Text>
                {value && (
                    <Button
                        type="link"
                        danger
                        size="small"
                        className="!p-0 !h-auto !text-[10px] !font-bold"
                        onClick={() => {
                            setLocalUrl('');
                            onChange('');
                        }}
                    >
                        移除
                    </Button>
                )}
            </div>

            <Popover
                content={content}
                trigger="click"
                open={isExpanded}
                onOpenChange={setIsExpanded}
                placement="bottomLeft"
                classNames={{
                    root: "asset-picker-popover"
                }}
                color="#222"
            >
                <div
                    className={`flex items-center gap-3 px-3 py-2 bg-black/40 border ${value ? 'border-blue-500/50' : 'border-white/10'} rounded-lg cursor-pointer hover:border-white/20 transition-all`}
                >
                    {value ?
                        (
                            type === 'image' ?
                                (
                                    <Image
                                        src={value}
                                        alt="preview"
                                        width={32}
                                        height={32}
                                        preview={false}
                                        className="!rounded !object-cover !border !border-white/10"
                                        fallback="https://placehold.co/100x100?text=Error"
                                    />
                                ) :
                                (
                                    <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center text-blue-400">
                                        <Link size={14} />
                                    </div>
                                )
                        ) : (
                            <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-white/20">
                                <ImageIcon size={14} />
                            </div>
                        )}

                    <div className="flex-1 min-w-0">
                        <Text className={`!text-[10px] !font-medium !block truncate ${value ? '!text-white' : '!text-white/30'}`}>
                            {value ? value.split('/').pop() : placeholder}
                        </Text>
                    </div>
                </div>
            </Popover>

            <style>{`
                .asset-picker-popover .ant-popover-inner {
                    padding: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                }
                .asset-picker-popover .ant-popover-arrow::before {
                    background: #222 !important;
                }
            `}</style>
        </div>
    );
};

export default AssetPicker;
