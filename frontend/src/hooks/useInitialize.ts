import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '@/store';
import { ProjectService } from '@/api/project';
import { TemplateService } from '@/api/template';
import { message } from 'antd';
import { INITIAL_STATE, STORAGE_KEYS } from '@/constants';
import { loadLocalCacheData } from '@/utils/utils';

/**
 * 核心初始化钩子
 * 负责从远程/本地加载项目场景配置、标签模板等初始数据
 * @returns {Object} { loading: boolean } - 加载状态
 */
export const useInitialize = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const setState = useStore(state => state.setState);

    useEffect(() => {
        /**
         * 异步加载所有配置
         */
        const loadConfigs = async () => {
            try {
                // 加载标签模板 (从后端接口)
                try {
                    const templates = await TemplateService.getTemplates();
                    if (templates && templates.length > 0) {
                        setState({ labelTemplates: templates });
                    } else {
                        // 如果后端没数据，尝试加载本地默认配置
                        try {
                            const module = await import(/* @vite-ignore */ `/config/labelTemplates.js?t=${Date.now()}`);
                            if (Array.isArray(module.default)) {
                                setState({ labelTemplates: module.default });
                            }
                        } catch (e) { /* ignore */ }
                    }
                } catch (e) {
                    console.error('Fetch templates failed:', e);
                }

                // 根据 ID 加载云端或初始化本地场景
                if (id) {
                    try {
                        const project = await ProjectService.getById(id);
                        if (project && project.sceneData) {
                            const data = JSON.parse(project.sceneData);
                            localStorage.setItem('sceneData', JSON.stringify(data));
                            setState({
                                roamingNodes: data.roamingNodes || [],
                                sceneConfig: data.sceneConfig || {},
                                objects: data.objects || [],
                                past: [],
                                future: []
                            });
                        } else {
                            setState({
                                ...INITIAL_STATE,
                                past: [],
                                future: []
                            });
                        }
                    } catch (error) {
                        message.error('加载项目失败，请重试');
                    }
                } else {

                    // 从本地存储加载
                    const roamingNodes = loadLocalCacheData(STORAGE_KEYS.ROAMING_NODES);
                    const sceneConfig = loadLocalCacheData(STORAGE_KEYS.SCENE_CONFIG);
                    const sceneData = loadLocalCacheData(STORAGE_KEYS.SCENE_DATA);

                    setState({
                        roamingNodes: roamingNodes || [],
                        sceneConfig: sceneConfig || {},
                        objects: sceneData || []
                    });
                }
            } catch (error) {
                console.error('Core init failed:', error);
            } finally {
                setLoading(false);
            }
        };

        loadConfigs();
    }, [id, setState]);

    return { loading };
};
