import React, { useState, useEffect, useCallback, memo } from 'react';
import { AssetService, type Asset, type AssetUploadParams } from '@/api/asset';
import { message, Spin } from 'antd';
import { Loader2 } from 'lucide-react';
import Pagination from '@/components/common/Pagination';

import AssetToolbar from './components/AssetToolbar';
import AssetGridView from './components/AssetGridView';
import AssetListView from './components/AssetListView';
import AssetPreviewModal from './components/AssetPreviewModal';
import AssetEditModal from './components/AssetEditModal';
import AssetUploadModal from './components/AssetUploadModal';

const AssetManagementView: React.FC = () => {
    // 基础状态
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryId, setCategoryId] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // 分页状态
    const [pagination, setPagination] = useState({
        current: 1,
        size: 12,
        total: 0
    });

    // 弹窗状态
    const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);
    const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    // 数据获取
    const fetchAssets = useCallback(async (current: number, size: number, query: string, catId: string) => {
        setLoading(true);
        try {
            const res = await AssetService.queryAssets({
                search: query,
                categoryId: catId,
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
            message.error('加载素材失败');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAssets(1, pagination.size, searchQuery, categoryId);
    }, [searchQuery, categoryId]); // 当搜索词或分类变化时，重置到第一页

    // 分页切换
    const handlePageChange = useCallback((current: number, size: number) => {
        fetchAssets(current, size, searchQuery, categoryId);
    }, [fetchAssets, searchQuery, categoryId]);

    // 事件处理业务逻辑 (自治逻辑下沉或维持在容器层)
    const handleUploadComplete = useCallback(async (data: AssetUploadParams) => {
        try {
            await AssetService.uploadAsset(data);
            message.success('素材上传成功');
            fetchAssets(1, pagination.size, searchQuery, categoryId);
        } catch (err) {
            message.error('上传失败');
        }
    }, [fetchAssets, pagination.size, searchQuery, categoryId]);

    const handleDelete = useCallback(async (id: string) => {
        try {
            await AssetService.deleteAsset(id);
            message.success('素材已删除');
            fetchAssets(pagination.current, pagination.size, searchQuery, categoryId);
        } catch (err) {
            message.error('删除失败');
        }
    }, [fetchAssets, pagination, searchQuery, categoryId]);

    const handleUpdate = useCallback(async (id: string, updates: Partial<Asset>, thumbnail?: File) => {
        try {
            await AssetService.updateAsset(id, updates, thumbnail);
            message.success('属性已更新');
            fetchAssets(pagination.current, pagination.size, searchQuery, categoryId);
        } catch (err) {
            message.error('更新失败');
        }
    }, [fetchAssets, pagination, searchQuery, categoryId]);

    return (
        <div className="flex-1 flex flex-col min-h-0 bg-transparent">
            <AssetToolbar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                categoryId={categoryId}
                onCategoryChange={setCategoryId}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onUpload={() => setIsUploadOpen(true)}
            />

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pb-4">
                {loading ? (
                    <div className="h-64 flex flex-col items-center justify-center text-gray-400 gap-3">
                        <Spin indicator={<Loader2 className="animate-spin text-purple-500" size={32} />} />
                        <span className="text-xs uppercase tracking-widest font-bold">同步中...</span>
                    </div>
                ) : (
                    <>
                        {viewMode === 'grid' ? (
                            <AssetGridView
                                assets={assets}
                                onEdit={setEditingAsset}
                                onDelete={handleDelete}
                                onPreview={setPreviewAsset}
                                onUpload={() => setIsUploadOpen(true)}
                            />
                        ) : (
                            <AssetListView
                                assets={assets}
                                onEdit={setEditingAsset}
                                onDelete={handleDelete}
                                onPreview={setPreviewAsset}
                                onUpload={() => setIsUploadOpen(true)}
                            />
                        )}
                    </>
                )}
            </div>

            <div className="border-t border-white/5 bg-black/20">
                <Pagination
                    current={pagination.current}
                    size={pagination.size}
                    total={pagination.total}
                    onChange={handlePageChange}
                />
            </div>

            {/* 弹窗层 */}
            <AssetPreviewModal
                asset={previewAsset}
                open={!!previewAsset}
                onClose={() => setPreviewAsset(null)}
            />

            <AssetEditModal
                asset={editingAsset}
                open={!!editingAsset}
                onClose={() => setEditingAsset(null)}
                onSave={handleUpdate}
            />

            <AssetUploadModal
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
                onUpload={handleUploadComplete}
            />
        </div>
    );
};

export default memo(AssetManagementView);
