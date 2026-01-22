import React, { useMemo, useState } from 'react';
import { type SceneObject, ObjectType } from '@/types';
import { useStore } from '@/store';
import { Settings2, Palette, Database, Type, Sun, Zap, Film } from 'lucide-react';
import TransformSection from './sections/TransformSection';
import MaterialSection from './sections/MaterialSection';
import GltfSection from './sections/GltfSection';
import LabelSection from './sections/LabelSection';
import LightSection from './sections/LightSection';
import InteractionSection from './sections/InteractionSection';
import SequenceSection from './sections/SequenceSection';
import { findNodeInTree } from '@/utils';
import SceneAllSection from './sections/SceneAllSection';
import PropertyHeader from './PropertyHeader';
import { Tabs, Tooltip } from 'antd';
import { typeLabels } from '@/constants';

const PropertyPanel: React.FC = () => {
    const selectedId = useStore(state => state.selectedId);
    const selectedMeshId = useStore(state => state.selectedMeshId);
    const updateObject = useStore(state => state.updateObject);
    const removeObject = useStore(state => state.removeObject);

    const [activeTab, setActiveTab] = useState('transform');

    // 当前选中的主对象
    const object = useStore(state => state.objects.find(o => o.id === selectedId));

    // 计算是否是操作的模型下级
    const targetObject = useMemo(() => {
        if (!object) return null;
        if (selectedMeshId && object.structure) {
            const subNode = findNodeInTree(object.structure, selectedMeshId);
            if (subNode) return subNode;
        }
        return object;
    }, [object, selectedMeshId]);

    // 如果未选择任何对象，显示场景全局配置
    if (!object || !targetObject) {
        return <SceneAllSection setActiveTab={setActiveTab} activeTab={activeTab}></SceneAllSection>;
    }

    const isSubMesh = !!selectedMeshId && targetObject !== object;
    const isLight = object.type.startsWith('LIGHT_');

    // 更新函数：支持更新主对象或内部节点
    const onUpdate = (updates: Partial<SceneObject>) => updateObject(object.id, updates, isSubMesh ? selectedMeshId : null);
    // 删除函数
    const onDelete = () => removeObject(object.id, isSubMesh ? selectedMeshId : null);

    // 选项卡配置
    const tabItems = [
        {
            key: 'transform',
            label: <Tooltip title="属性" placement="right"><Settings2 size={14} /></Tooltip>,
            children: <TransformSection targetObject={targetObject} onUpdate={onUpdate} />
        },
        {
            key: 'light',
            label: <Tooltip title="光照" placement="right"><Sun size={14} /></Tooltip>,
            children: <LightSection object={object} onUpdate={onUpdate} />,
            show: !isSubMesh && isLight
        },
        {
            key: 'material',
            label: <Tooltip title="材质" placement="right"><Palette size={14} /></Tooltip>,
            children: <MaterialSection targetObject={targetObject} onUpdate={onUpdate} />,
            show: !!targetObject.material && !isLight
        },
        {
            key: 'anim',
            label: <Tooltip title="动画" placement="right"><Film size={14} /></Tooltip>,
            children: (
                <>
                    {object.type === ObjectType.GLTF && <GltfSection object={object} />}
                    <SequenceSection object={object} />
                </>
            )
        },
        {
            key: 'label',
            label: <Tooltip title="标签" placement="right"><Type size={14} /></Tooltip>,
            children: <LabelSection object={object} onUpdate={onUpdate} />,
            show: object.type === ObjectType.LABEL
        },
        {
            key: 'event',
            label: <Tooltip title="交互" placement="right"><Zap size={14} /></Tooltip>,
            children: <InteractionSection object={object} />
        },
    ].filter(tab => tab.show !== false);

    return (
        <div className="h-full flex flex-col">
            <PropertyHeader
                typeLabel={isSubMesh ? targetObject.type : (typeLabels[object.type] || '未知对象')}
                name={targetObject.name}
                id={targetObject.id}
                onDelete={onDelete}
            />

            <div className="flex-1 flex overflow-hidden">
                <Tabs
                    activeKey={tabItems.find(t => t.key === activeTab) ? activeTab : 'transform'}
                    onChange={setActiveTab}
                    tabPlacement="start"
                    items={tabItems}
                    className="flex-1 property-panel-tabs"
                />
            </div>

            <style>{`
                .property-panel-tabs .ant-tabs-nav {
                    width: 48px;
                    background: rgba(0,0,0,0.2);
                    border-right: 1px solid rgba(255,255,255,0.05) !important;
                }
                .property-panel-tabs .ant-tabs-nav-list {
                    padding: 16px 0;
                    gap: 16px;
                }
                .property-panel-tabs .ant-tabs-tab {
                    padding: 10px !important;
                    margin: 0 !important;
                    display: flex;
                    justify-content: center;
                    border-radius: 8px;
                    transition: all 0.3s;
                }
                .property-panel-tabs .ant-tabs-tab-btn {
                    color: #666 !important;
                }
                .property-panel-tabs .ant-tabs-tab-active {
                    background: #2563eb !important;
                }
                .property-panel-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
                    color: #fff !important;
                }
                .property-panel-tabs .ant-tabs-ink-bar {
                    display: none;
                }
                .property-panel-tabs .ant-tabs-content-holder {
                    overflow-y: auto !important;
                    height: 100%;
                }
                .property-panel-tabs .ant-tabs-content-holder::-webkit-scrollbar { width: 4px; }
                .property-panel-tabs .ant-tabs-content-holder::-webkit-scrollbar-track { background: transparent; }
                .property-panel-tabs .ant-tabs-content-holder::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                .property-panel-tabs .ant-tabs-content-holder::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
                
                .property-panel-tabs .ant-tabs-tabpane {
                    padding: 16px !important;
                    height: auto !important;
                }
            `}</style>
        </div>
    );
};

export default React.memo(PropertyPanel);
