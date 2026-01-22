import { useCallback, useEffect } from 'react';
import { useStore } from '@/store';
import type { SceneGraphNode, SceneObject } from '@/types';
import { findNodeInTree } from '@/utils';

/**
 * 物体数据绑定解析 Hook (高性能版)
 * 职责：
 * 1. 订阅全局实时数据源 dataSourceValues。
 * 2. 局部解析物体的 dataBindings (多重绑定) 配置。
 * 3. 计算最终渲染所需的“有效属性”。
 */
export const useObjectDataBinding = (obj: SceneObject | null) => {
    const labelTemplates = useStore(state => state.labelTemplates);
    const dataSourceValues = useStore(state => state.dataSourceValues);

    const updateObject = useStore(state => state.updateObject);

    // const updateObject = useCallback((id: string, props: any, meshId?: string) => {
    //     handleUpdateObject(id, { ...props, updated: false }, meshId)
    // }, [handleUpdateObject])

    if (!obj) return;
    useEffect(() => {
        // if (obj.updated === false) return;
        console.log(obj, obj.updated, "useObjectDataBinding");


        // 2. 处理多重 dataBindings (高性能实时映射)
        if (obj.dataBindings) {
            Object.entries(obj.dataBindings).forEach(([bindingKey, binding]) => {
                if (!binding.enabled) return;

                const sourceVals = dataSourceValues[binding.dataSourceId];
                if (!sourceVals) return;

                const rawValue = sourceVals[binding.tagKey];
                if (rawValue === undefined) return;

                let finalValue = rawValue;
                if (binding.expression) {
                    try {
                        // eslint-disable-next-line no-new-func
                        const fn = new Function('value', `return ${binding.expression}`);
                        finalValue = fn(rawValue);
                    } catch (e) { return; }
                }

                // 解析路径: [meshId:]path
                let propertyPath = bindingKey;
                let targetMeshId: string | null = null;
                if (bindingKey.includes(':')) {
                    const parts = bindingKey.split(':');
                    targetMeshId = parts[0];
                    propertyPath = parts[1];
                }

                let targetNode: SceneGraphNode | null = null;
                if (targetMeshId && obj.structure) {
                    targetNode = findNodeInTree(obj.structure, targetMeshId);
                    if (!targetNode) return;
                }
                if (propertyPath === 'position' && Array.isArray(finalValue)) updateObject(obj.id, { position: [finalValue[0] ?? 0, finalValue[1] ?? 0, finalValue[2] ?? 0] }, targetMeshId)
                else if (propertyPath === 'rotation' && Array.isArray(finalValue)) updateObject(obj.id, { rotation: [finalValue[0] ?? 0, finalValue[1] ?? 0, finalValue[2] ?? 0] }, targetMeshId)
                else if (propertyPath === 'scale' && Array.isArray(finalValue)) updateObject(obj.id, { scale: [finalValue[0] ?? 0, finalValue[1] ?? 0, finalValue[2] ?? 0] }, targetMeshId)
                else if (propertyPath === 'visible') updateObject(obj.id, { visible: finalValue }, targetMeshId)
                else if (propertyPath === 'material.color') updateObject(obj.id, { material: { ...(targetNode?.material || obj.material), color: finalValue } }, targetMeshId)
                else if (propertyPath === 'material.emissive') updateObject(obj.id, { material: { ...(targetNode?.material || obj.material), emissive: finalValue } }, targetMeshId)
                else if (propertyPath === 'material.metalness') updateObject(obj.id, { material: { ...(targetNode?.material || obj.material), metalness: finalValue } }, targetMeshId)
                else if (propertyPath === 'material.roughness') updateObject(obj.id, { material: { ...(targetNode?.material || obj.material), roughness: finalValue } }, targetMeshId)
                else if (propertyPath === 'material.emissiveIntensity') updateObject(obj.id, { material: { ...(targetNode?.material || obj.material), emissiveIntensity: finalValue } }, targetMeshId)
                else if (propertyPath === 'material.transparent') updateObject(obj.id, { material: { ...(targetNode?.material || obj.material), transparent: finalValue } }, targetMeshId)
                else if (propertyPath === 'material.wireframe') updateObject(obj.id, { material: { ...(targetNode?.material || obj.material), wireframe: finalValue } }, targetMeshId)
                else if (propertyPath === 'material.opacity') updateObject(obj.id, { material: { ...(targetNode?.material || obj.material), opacity: finalValue } }, targetMeshId)
                else if (propertyPath === 'intensity') updateObject(obj.id, { intensity: finalValue }, targetMeshId)
            });
        }
        return () => { };
    }, [obj.dataBindings, labelTemplates, dataSourceValues]);


    useEffect(() => {
        // 1. 处理 labelBinding (标签模板)
        if (obj.labelBinding) {
            const template = labelTemplates.find(t => t.id === obj.labelBinding?.templateId);
            if (template) {
                let html = template.html;
                Object.entries(obj.labelBinding.fieldMappings).forEach(([field, mapping]) => {
                    let fieldVal = '';

                    if (typeof mapping === 'string') {
                        fieldVal = mapping;
                    } else if (mapping && typeof mapping === 'object') {
                        // 处理实际数据源绑定
                        const sourceVals = dataSourceValues[mapping.dataSourceId];
                        const rawValue = sourceVals ? sourceVals[mapping.tagKey] : undefined;

                        if (rawValue !== undefined) {
                            if (mapping.expression) {
                                try {
                                    // eslint-disable-next-line no-new-func
                                    const fn = new Function('value', `return ${mapping.expression}`);
                                    fieldVal = String(fn(rawValue));
                                } catch (e) {
                                    fieldVal = 'Error';
                                }
                            } else {
                                fieldVal = String(rawValue);
                            }
                        } else {
                            fieldVal = `[${mapping.tagKey}]`;
                        }
                    }

                    html = html.replace(new RegExp(`{{${field}}}`, 'g'), fieldVal);
                });

                // 更新场景中的 HTML 标签内容
                if (obj.htmlLabel !== html) {
                    updateObject(obj.id, { htmlLabel: html });
                }

                // 动态注入模板关联的 CSS 样式
                const styleId = `template-style-${template.id}`;
                if (!document.getElementById(styleId)) {
                    const style = document.createElement('style');
                    style.id = styleId;
                    style.innerHTML = template.css;
                    document.head.appendChild(style);
                }
            }
        }
    }, [obj.labelBinding, labelTemplates, dataSourceValues])

};

