import request from './request';
import { type DataSource } from '@/types';

/**
 * 数据源管理 API
 */
export const dataSourceApi = {
    /**
     * 获取数据源列表
     */
    list: (): Promise<DataSource[]> => {
        return request.get('/data-sources');
    },

    /**
     * 根据 ID 获取数据源
     */
    getById: (id: number): Promise<DataSource> => {
        return request.get(`/data-sources/${id}`);
    },

    /**
     * 保存(新增)数据源
     */
    save: (data: Partial<DataSource>): Promise<boolean> => {
        return request.post('/data-sources', data);
    },

    /**
     * 更新数据源
     */
    update: (data: DataSource): Promise<boolean> => {
        return request.put('/data-sources', data);
    },

    /**
     * 删除数据源
     */
    delete: (id: number): Promise<boolean> => {
        return request.delete(`/data-sources/${id}`);
    }
};
