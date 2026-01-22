import React, { useState, useCallback, memo, useEffect } from 'react';
import { useStore } from '@/store';
import { Package } from 'lucide-react';
import { ObjectType } from '@/types';
import { Modal, Typography } from 'antd';
import FilterBar from './FilterBar';
import { AssetService, type Asset } from '@/api/asset';
import Pagination from '../common/Pagination';

// 引入拆分后的子组件
import AssetGrid from './components/AssetGrid';
import AssetPreview from './components/AssetPreview';
import ModelSelectorFooter from './components/ModelSelectorFooter';
import { CATEGORIE_ENUM } from '@/constants';

const { Title, Text } = Typography;

/**
 * 模型选择器
 */
const ModelSelector: React.FC = () => {
    // Store 订阅
    const modelSelectorVisible = useStore(state => state.modelSelectorVisible);
    const setModelSelectorVisible = useStore(state => state.setModelSelectorVisible);
    const addObject = useStore(state => state.addObject);

    // 本地状态
    const [searchQuery, setSearchQuery] = useState('');
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

    // 分页状态
    const [pagination, setPagination] = useState({
        current: 1,
        size: 20,
        total: 0
    });

    // 资产加载逻辑
    const fetchAssets = useCallback(async (current: number, size: number, query: string) => {
        setLoading(true);
        try {
            const res = await AssetService.queryAssets({
                search: query,
                categoryId: CATEGORIE_ENUM.model,
                current,
                size
            });
            setAssets(res.records);
            setPagination({
                current: res.current,
                size: res.size,
                total: res.total
            });
        } catch (err) {
            console.error('Failed to fetch assets:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!modelSelectorVisible) return;

        const timer = setTimeout(() => {
            fetchAssets(1, pagination.size, searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, modelSelectorVisible, fetchAssets, pagination.size]);

    const handlePageChange = useCallback((current: number, size: number) => {
        fetchAssets(current, size, searchQuery);
    }, [fetchAssets, searchQuery]);

    // 事件处理
    const handleClose = useCallback(() => {
        setModelSelectorVisible(false);
        setSelectedAsset(null);
    }, [setModelSelectorVisible]);

    const handleConfirmAdd = useCallback(() => {
        if (selectedAsset) {
            addObject(ObjectType.GLTF, selectedAsset.url);
            setModelSelectorVisible(false);
            setSelectedAsset(null);
        }
    }, [selectedAsset, addObject, setModelSelectorVisible]);

    const handleSelectAsset = useCallback((asset: Asset) => {
        setSelectedAsset(asset);
    }, []);

    return (
        <Modal
            open={modelSelectorVisible}
            onCancel={handleClose}
            width={selectedAsset ? 1100 : 900}
            centered
            footer={
                <ModelSelectorFooter
                    hasSelected={!!selectedAsset}
                    onConfirm={handleConfirmAdd}
                />
            }
            title={
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
                        <Package size={20} />
                    </div>
                    <div>
                        <Title level={4} style={{ margin: 0, color: 'white' }}>高级资产库</Title>
                        <Text type="secondary" style={{ fontSize: '12px' }}>在库中挑选模型，预览并调整角度后添加至场景</Text>
                    </div>
                </div>
            }
            styles={{
                content: { backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px' },
                header: { backgroundColor: 'transparent', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'white' },
                footer: { borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }
            } as any}
        >
            <div className="flex flex-col h-[580px] mt-4">
                <div className="flex gap-6 flex-1 min-h-0">
                    {/* 左侧：列表区域 */}
                    <div className={`flex flex-col gap-4 transition-all duration-300 ${selectedAsset ? 'w-3/5' : 'w-full'}`}>
                        <FilterBar
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                        />

                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                            <AssetGrid
                                assets={assets}
                                loading={loading}
                                selectedAssetId={selectedAsset?.id}
                                onSelect={handleSelectAsset}
                                layout={selectedAsset ? 'compact' : 'standard'}
                            />
                        </div>
                    </div>

                    {/* 右侧：预览区域 */}
                    {selectedAsset && <AssetPreview asset={selectedAsset} />}
                </div>

                {/* 分页区域 */}
                <div className="mt-4 border-t border-white/5 pt-4">
                    <Pagination
                        current={pagination.current}
                        size={pagination.size}
                        total={pagination.total}
                        onChange={handlePageChange}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default memo(ModelSelector);
