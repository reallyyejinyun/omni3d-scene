import { useMemo } from 'react';

/**
 * 标签预览逻辑钩子
 * 将 HTML 模板中的 {{key}} 替换为预览用的占位符
 */
export const useTemplatePreview = (html: string, fields: string[]) => {
    const previewHtml = useMemo(() => {
        if (!html) return '';
        let result = html;
        fields.forEach((f: string) => {
            result = result.replace(new RegExp(`{{${f}}}`, 'g'), `${f}`);
        });
        return result;
    }, [html, fields]);

    return previewHtml;
};
