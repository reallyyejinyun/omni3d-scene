import React, { useEffect, useState, memo } from 'react';
import { Modal, Button, Tag, Space } from 'antd';
import { Orbit, Package } from 'lucide-react';
import { type Asset } from '@/api/asset';
import ModelPreview from '@/components/common/ModelPreview';

interface AssetPreviewModalProps {
    asset: Asset | null;
    open: boolean;
    onClose: () => void;
}



const AssetPreviewModal: React.FC<AssetPreviewModalProps> = ({ asset, open, onClose }) => {
    const [shouldRender, setShouldRender] = useState(true);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (open) {
            // 保留一个短延迟，确保 Modal 动画稳定（解决threejs预览场景尺寸不对的问题）
            timer = setTimeout(() => {
                setShouldRender(true);
            }, 500);
        } else {
            setShouldRender(false);
        }
        return () => {
            clearTimeout(timer);
            setShouldRender(false);
        };
    }, [open]);


    if (!asset) return null;

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            width={1000}
            centered
            destroyOnClose // 保持彻底销毁
            className="premium-3d-modal"
            title={
                <div className="flex items-center gap-2">
                    <Package className="text-purple-400" size={18} />
                    <span className="font-sans font-bold text-white tracking-tight">{asset.name} - 实时资产快照</span>
                </div>
            }
        >
            <div className="flex gap-6 h-[600px] py-4">
                {/* 3D Viewport Area */}
                <div className="flex-1 bg-black/40 rounded-3xl border border-white/5 relative overflow-hidden group">
                    {/* 第一阶段：系统稳定等待 */}
                    {shouldRender && (
                        <>
                            <ModelPreview src={asset.url} />
                        </>
                    )}

                    <div className="absolute top-4 left-4 z-10">
                        <Tag icon={<Orbit size={12} />} color="purple" bordered={false} className="bg-purple-600/10 text-purple-400 backdrop-blur-md px-3 py-1 font-bold">
                            WEBGL 2.0 ACCELERATED
                        </Tag>
                    </div>
                </div>

                {/* Info Sidebar */}
                <div className="w-72 flex flex-col justify-between py-2">
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-3">资产属性</h3>
                            <div className="space-y-2">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="text-gray-500 text-[9px] uppercase font-bold mb-1">物理材质</div>
                                    <div className="text-sm font-bold text-white">4K PBR Data</div>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="text-gray-500 text-[9px] uppercase font-bold mb-1">优化等级</div>
                                    <div className="text-sm font-bold text-green-500 flex items-center gap-2">
                                        Level 3 (Web-Ready)
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-500/10 to-transparent p-4 rounded-2xl border border-purple-500/10 backdrop-blur-sm">
                            <p className="text-xs text-gray-500 leading-relaxed italic">
                                "左键旋转，右键平移。此模型已针对移动端渲染管线完成拓扑压缩。"
                            </p>
                        </div>
                    </div>

                    <Space orientation="vertical" className="w-full" size="small">
                        <Button type="primary" block size="large" className="bg-gradient-to-r from-purple-600 to-blue-600 border-none font-bold rounded-xl h-12 shadow-md hover:scale-[1.02] transition-transform">
                            下载原文件 (GLB)
                        </Button>
                        <Button block size="large" className="bg-white/5 border-white/10 hover:bg-white/10 rounded-xl h-12" onClick={onClose}>
                            关闭查看
                        </Button>
                    </Space>
                </div>
            </div>
        </Modal>
    );
};

export default memo(AssetPreviewModal);
