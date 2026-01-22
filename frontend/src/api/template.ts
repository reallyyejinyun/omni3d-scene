import request from './request';
import { type LabelTemplate } from '../types';

/**
 * 标签模板管理服务
 */
export const TemplateService = {
    /**
     * 获取所有标签模板
     */
    async getTemplates(): Promise<LabelTemplate[]> {
        const list = await request.get<any, any[]>('/label-templates');
        return (list || []).map(item => ({
            ...item,
            id: String(item.id),
            fields: item.fields ? item.fields.split(',').filter(Boolean) : []
        }));
    },

    /**
     * 保存标签模板 (新建或更新)
     */
    async saveTemplate(template: LabelTemplate): Promise<LabelTemplate> {
        // 转换 fields 为逗号分隔字符串
        const data = {
            ...template,
            id: isNaN(Number(template.id)) ? undefined : Number(template.id),
            fields: Array.isArray(template.fields) ? template.fields.join(',') : ''
        };
        const res = await request.post<any, any>('/label-templates', data);
        return {
            ...res,
            id: String(res.id),
            fields: res.fields ? res.fields.split(',').filter(Boolean) : []
        };
    },

    /**
     * 删除标签模板
     */
    async deleteTemplate(id: string): Promise<boolean> {
        return request.delete(`/label-templates/${id}`);
    }
};
