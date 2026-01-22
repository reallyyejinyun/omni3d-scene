import request from './request';
import type { PageData, PageParams } from '../types';
import { baseUrl } from '@/config/baseUrl';

export interface Project {
    id: string;
    name: string;
    description?: string;
    thumbnail?: string;
    status: 'draft' | 'published';
    tags?: string[];
    createTime?: string;
    updateTime?: string;
    sceneData?: string;
}

/**
 * 项目资源管理服务
 */
export const ProjectService = {
    /**
     * 分页查询项目列表
     * @param {PageParams} [params] - 分页与筛选参数
     * @returns {Promise<PageData<Project>>}
     */
    async getProjects(params?: PageParams): Promise<PageData<Project>> {
        const page = await request.get<any, PageData<any>>('/projects', { params });
        return {
            ...page,
            records: (page.records || []).map(item => ({
                ...item,
                id: String(item.id),
                thumbnail: item.thumbnail?.startsWith('/uploads/') ? `${baseUrl}${item.thumbnail}` : (item.thumbnail || '/images/project_thumb.png'),
                tags: item.tags ? (typeof item.tags === 'string' ? item.tags.split(',') : item.tags) : []
            }))
        };
    },

    /**
     * 创建新项目
     * @param {Partial<Project>} data - 项目基础信息
     * @returns {Promise<Project>}
     */
    async createProject(data: Partial<Project>): Promise<Project> {
        return request.post('/projects', data);
    },

    /**
     * 删除指定项目
     * @param {string} id - 项目ID
     * @returns {Promise<boolean>}
     */
    async deleteProject(id: string): Promise<boolean> {
        return request.delete(`/projects/${id}`);
    },

    /**
     * 更新项目信息（包括场景 JSON 数据）
     * @param {string} id - 项目ID
     * @param {Partial<Project>} data - 更新内容
     * @returns {Promise<boolean>}
     */
    async updateProject(id: string, data: Partial<Project>): Promise<boolean> {
        return request.put(`/projects/${id}`, data);
    },

    /**
     * 根据 ID 获取项目详情（用于编辑器加载场景）
     * @param {number | string} id - 项目ID
     * @returns {Promise<Project>}
     */
    async getById(id: number | string): Promise<Project> {
        const item = await request.get<any, any>(`/projects/${id}`);
        return {
            ...item,
            id: String(item.id),
            thumbnail: item.thumbnail?.startsWith('/uploads/') ? `${baseUrl}${item.thumbnail}` : (item.thumbnail || '/images/project_thumb.png'),
            tags: item.tags ? (typeof item.tags === 'string' ? item.tags.split(',') : item.tags) : []
        };
    },

    /**
     * 上传/更新项目封面缩略图
     * @param {string} id - 项目ID
     * @param {File} file - 图片文件
     * @returns {Promise<string>} - 保存后的图片URL
     */
    async uploadThumbnail(id: string, file: File): Promise<string> {
        const formData = new FormData();
        formData.append('file', file);
        return request.post(`/projects/${id}/thumbnail`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
};
