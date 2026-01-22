import React from 'react';
import { useParams } from 'react-router-dom';
import { TransformMode, ExportFormat } from '@/types';
import { useStore } from '@/store';
import {
    Move, RotateCw, Maximize,
    Eye, Undo2, Redo2, Save,
    PanelLeft, PanelRight, PanelBottom
} from 'lucide-react';
import { IconButton, Divider } from './IconButton';
import { PublishMenu } from './PublishMenu';
import { ProjectService } from '@/api/project';
import { message, Button, Space } from 'antd';
import { STORAGE_KEYS } from '@/constants';

/**
 * 视口顶部工具栏
 * 包含变换工具切换、历史记录操作、序列化导出及云端同步逻辑
 */
const Toolbar: React.FC = () => {
    const { id } = useParams();
    const transformMode = useStore(state => state.transformMode);
    const setTransformMode = useStore(state => state.setTransformMode);
    const undo = useStore(state => state.undo);
    const redo = useStore(state => state.redo);
    const pastLength = useStore(state => state.past.length);
    const futureLength = useStore(state => state.future.length);
    const objects = useStore(state => state.objects);
    const roamingNodes = useStore(state => state.roamingNodes);
    const sceneConfig = useStore(state => state.sceneConfig);
    const gl = useStore(state => state.gl);
    const scene = useStore(state => state.scene);
    const camera = useStore(state => state.camera);
    const controls = useStore(state => state.controls);
    const leftSidebarVisible = useStore(state => state.leftSidebarVisible);
    const rightSidebarVisible = useStore(state => state.rightSidebarVisible);
    const bottomPanelVisible = useStore(state => state.bottomPanelVisible);
    const setState = useStore(state => state.setState);

    /**
     * 保存场景数据与封面缩略图至云端
     */
    const handleSave = async () => {
        if (!id) {
            message.warning('无法保存：未识别到项目ID');
            return;
        }

        // 收集相机状态
        const currentSceneConfig = { ...sceneConfig };
        if (camera) {
            currentSceneConfig.cameraPosition = [camera.position.x, camera.position.y, camera.position.z];
            currentSceneConfig.cameraRotation = [camera.rotation.x, camera.rotation.y, camera.rotation.z];
        }
        if (controls) {
            currentSceneConfig.cameraTarget = [controls.target.x, controls.target.y, controls.target.z];
        }

        const sceneData = JSON.stringify({
            objects,
            roamingNodes,
            sceneConfig: currentSceneConfig
        });

        const hideLoading = message.loading('正在保存进度...', 0);

        try {
            // 提交场景 JSON
            await ProjectService.updateProject(id, { sceneData });

            // 自动捕获当前视口画面并作为封面上传
            if (gl && scene && camera) {
                try {
                    gl.render(scene, camera);
                    const dataUrl = gl.domElement.toDataURL('image/png');
                    const blob = await (await fetch(dataUrl)).blob();
                    const file = new File([blob], `thumbnail_${id}.png`, { type: 'image/png' });
                    await ProjectService.uploadThumbnail(id, file);
                } catch (imgError) {
                    console.warn('Screenshot upload failed:', imgError);
                }
            }

            hideLoading();
            message.success('场景已保存');
        } catch (error) {
            hideLoading();
            message.error('保存失败，请重试');
        }
    };

    /**
     * 打开新窗口预览当前场景
     */
    const handlePreview = () => {
        // 收集并持久化相机状态
        const currentSceneConfig = { ...sceneConfig };
        if (camera) {
            currentSceneConfig.cameraPosition = [camera.position.x, camera.position.y, camera.position.z];
            currentSceneConfig.cameraRotation = [camera.rotation.x, camera.rotation.y, camera.rotation.z];
        }
        if (controls) {
            currentSceneConfig.cameraTarget = [controls.target.x, controls.target.y, controls.target.z];
        }

        // 同步至本地缓存供快速预览使用
        localStorage.setItem(STORAGE_KEYS.SCENE_DATA, JSON.stringify(objects));
        localStorage.setItem(STORAGE_KEYS.ROAMING_NODES, JSON.stringify(roamingNodes));
        localStorage.setItem(STORAGE_KEYS.SCENE_CONFIG, JSON.stringify(currentSceneConfig));

        const previewPath = '/preview';
        window.open(previewPath, '_blank');
    };

    /**
     * 导出不同格式的资源文件
     * @param {ExportFormat} format - 目标格式 (JSON/JS/HTML)
     */
    const onPublish = (format: ExportFormat) => {
        const sceneData = {
            metadata: { name: "Omni3D Scene", version: "1.0" },
            objects: objects,
            roaming: roamingNodes
        };

        if (format === ExportFormat.JSON) {
            const blob = new Blob([JSON.stringify(sceneData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'scene_config.json';
            a.click();
        } else if (format === ExportFormat.JS) {
            const jsContent = `const sceneConfig = ${JSON.stringify(sceneData, null, 2)};`;
            const blob = new Blob([jsContent], { type: 'application/javascript' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'scene_data.js';
            a.click();
        }
    };

    return (
        <div className="h-14 m-4 flex items-center justify-between bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl px-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] pointer-events-auto">
            <div className="flex items-center gap-1">
                <Divider />
                <IconButton
                    icon={<Undo2 size={18} />}
                    onClick={undo}
                    disabled={pastLength === 0}
                    label="撤销 (Ctrl+Z)"
                />
                <IconButton
                    icon={<Redo2 size={18} />}
                    onClick={redo}
                    disabled={futureLength === 0}
                    label="重做 (Ctrl+Y)"
                />

                <Divider />

                <IconButton
                    icon={<Move size={18} />}
                    active={transformMode === TransformMode.TRANSLATE}
                    onClick={() => setTransformMode(TransformMode.TRANSLATE)}
                    label="移动 (W)"
                />
                <IconButton
                    icon={<RotateCw size={18} />}
                    active={transformMode === TransformMode.ROTATE}
                    onClick={() => setTransformMode(TransformMode.ROTATE)}
                    label="旋转 (E)"
                />
                <IconButton
                    icon={<Maximize size={18} />}
                    active={transformMode === TransformMode.SCALE}
                    onClick={() => setTransformMode(TransformMode.SCALE)}
                    label="缩放 (R)"
                />

                <Divider />

                <IconButton
                    icon={<PanelLeft size={18} />}
                    active={leftSidebarVisible}
                    onClick={() => setState({ leftSidebarVisible: !leftSidebarVisible })}
                    label="层级面板 (Alt+1)"
                />
                <IconButton
                    icon={<PanelBottom size={18} />}
                    active={bottomPanelVisible}
                    onClick={() => setState({ bottomPanelVisible: !bottomPanelVisible })}
                    label="漫游/时间轴面板 (Alt+2)"
                />
                <IconButton
                    icon={<PanelRight size={18} />}
                    active={rightSidebarVisible}
                    onClick={() => setState({ rightSidebarVisible: !rightSidebarVisible })}
                    label="属性面板 (Alt+3)"
                />
            </div>

            <Space size={12}>
                <Button
                    type="primary"
                    size="large"
                    icon={<Save size={16} />}
                    onClick={handleSave}
                    className="!bg-purple-600 hover:!bg-purple-700 !flex !items-center !gap-2 !h-9 !border-purple-600 !text-sm !font-semibold shadow-lg shadow-purple-500/20"
                >
                    保存
                </Button>

                <Button
                    variant="filled"
                    size="large"
                    icon={<Eye size={16} />}
                    onClick={handlePreview}
                    className="!bg-white/5 hover:!bg-white/10 !flex !items-center !gap-2 !h-9 !border-white/5 !text-gray-300 !text-sm !font-semibold"
                >
                    预览
                </Button>

                <PublishMenu onPublish={onPublish} />
            </Space>
        </div>
    );
};

export default React.memo(Toolbar);
