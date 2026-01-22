import request from './request';
import type { PageData } from '../types';
import { baseUrl } from '@/config/baseUrl';

export interface AssetCategory {
    id: string;
    name: string;
    icon?: string;
}

export interface Asset {
    id: string;
    name: string;
    type: 'model' | 'image' | 'material' | 'video' | 'hdr' | 'other';
    thumbnail: string;
    url: string;
    categoryId: string;
    size?: number;
    tags?: string[];
}


export type AssetQueryParams = {
    categoryId?: string;
    search?: string;
    current?: number;
    size?: number;
};

export type AssetUploadParams = {
    name: string;
    categoryId: string;
    file: File;
    thumbnail?: File;
};
/**
 * 资产模型管理服务
 */
export const AssetService = {
    /**
     * 根据分类和搜索词分页查询资产
     * @param {Object} params - 查询参数
     * @returns {Promise<PageData<Asset>>}
     */
    async queryAssets(params: AssetQueryParams): Promise<PageData<Asset>> {
        const page = await request.get<any, PageData<any>>('/assets', {
            params: {
                name: params.search,
                categoryId: params.categoryId,
                current: params.current || 1,
                size: params.size || 12
            }
        });

        return {
            ...page,
            records: (page.records || []).map(item => ({
                ...item,
                id: String(item.id),
                // url: item.url?.startsWith('http') ? item.url : `${baseUrl}${item.url}`,
                thumbnail: item.thumbnail && (item.thumbnail?.startsWith('http') ? item.thumbnail : `${baseUrl}${item.thumbnail}`)
            }))
        };
    },

    /**
     * 上传新资产文件
     * @param {File} file - 资源文件
     * @param {Object} data - 资产元数据
     * @returns {Promise<Asset>}
     */
    async uploadAsset(data: AssetUploadParams): Promise<Asset> {
        const formData = new FormData();
        formData.append('file', data.file);
        formData.append('name', data.name);
        formData.append('categoryId', data.categoryId);
        if (data.thumbnail) {
            formData.append('thumbnail', data.thumbnail);
        }

        return request.post('/assets/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    /**
     * 删除指定资产
     * @param {string} id - 资产ID
     * @returns {Promise<boolean>}
     */
    async deleteAsset(id: string): Promise<boolean> {
        return request.delete(`/assets/${id}`);
    },

    /**
     * 更新资产信息
     * @param {string} id - 资产ID
     * @param {Partial<Asset>} updates - 更新内容
     * @param {File} thumbnail - 新封面文件 (可选)
     * @returns {Promise<Asset | null>}
     */
    async updateAsset(id: string, updates: Partial<Asset>, thumbnail?: File): Promise<Asset | null> {
        const formData = new FormData();
        // 将普通 JSON 数据序列化后放入 asset 字段
        formData.append('asset', new Blob([JSON.stringify(updates)], { type: 'application/json' }));

        if (thumbnail) {
            formData.append('thumbnail', thumbnail);
        }

        return request.put(`/assets/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
};
