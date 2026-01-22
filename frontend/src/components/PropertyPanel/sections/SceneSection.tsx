import React from 'react';
import { Globe, Sun, Layers, MousePointer2, Camera, Plus, Trash2, MapPin } from 'lucide-react';
import PropertySection from '../common/PropertySection';
import PropertyField from '../common/PropertyField';
import AssetPicker from '../common/AssetPicker';
import { useStore } from '@/store';
import { BACKGROUND_TYPE, ENVIRONMENT_TYPE, ENV_PRESETS, type CameraBookmark } from '@/types';
import type { BackgroundType, EnvPreset } from '@/types';
import { ENV_PRESET_LABELS } from '@/constants';
/**
 * 场景常规属性分组
 * @returns 
 */
const SceneSection: React.FC = () => {
    const sceneConfig = useStore(state => state.sceneConfig);
    const updateSceneConfig = useStore(state => state.updateSceneConfig);
    const camera = useStore(state => state.camera);
    const cameraBookmarks = useStore(state => state.cameraBookmarks);
    const setState = useStore(state => state.setState);

    const handleBackgroundTypeChange = React.useCallback((type: BackgroundType) => {
        const isUrlType = type === BACKGROUND_TYPE.IMAGE || type === BACKGROUND_TYPE.PANORAMA;
        const isColor = sceneConfig.backgroundValue.startsWith('#');

        const updates: any = { backgroundType: type };
        if (isUrlType && isColor) {
            updates.backgroundValue = ''; // 切换到图片/HDR时，如果是颜色值则清空
        } else if (type === BACKGROUND_TYPE.COLOR && !isColor) {
            updates.backgroundValue = '#111111'; // 切换到颜色时，如果不是颜色值则设为默认
        }
        updateSceneConfig(updates);
    }, [sceneConfig.backgroundValue, updateSceneConfig]);

    // 保存当前视角为书签
    const saveBookmark = React.useCallback(() => {
        if (!camera) return;

        const newBookmark: CameraBookmark = {
            id: Math.random().toString(36).substr(2, 9),
            name: `书签 ${cameraBookmarks.length + 1}`,
            position: [camera.position.x, camera.position.y, camera.position.z],
            target: [0, 0, 0] // 默认回零点，真实场景需要从 OrbitControls 获取
        };
        setState({ cameraBookmarks: [...cameraBookmarks, newBookmark] });
    }, [camera, cameraBookmarks, setState]);

    // 移除书签
    const removeBookmark = React.useCallback((id: string) => {
        setState({ cameraBookmarks: cameraBookmarks.filter(b => b.id !== id) });
    }, [cameraBookmarks, setState]);

    // 跳转到书签
    const applyBookmark = React.useCallback((bookmark: CameraBookmark) => {
        if (camera) {
            camera.position.set(bookmark.position[0], bookmark.position[1], bookmark.position[2]);
            setState({ focusTrigger: Date.now() }); // 借用 focusTrigger 强制更新一段逻辑
        }
    }, [camera, setState]);


    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar">
            <PropertySection title="场景背景" icon={<Globe size={12} />}>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] opacity-50 uppercase font-bold tracking-wider">背景类型</label>
                        <select
                            value={sceneConfig.backgroundType}
                            onChange={(e) => handleBackgroundTypeChange(e.target.value as BackgroundType)}
                            className="w-full bg-black/60 border border-white/10 rounded-md px-3 py-2 text-xs text-white focus:border-blue-500 outline-none"
                        >
                            <option value={BACKGROUND_TYPE.COLOR}>纯色</option>
                            <option value={BACKGROUND_TYPE.IMAGE}>普通图片</option>
                            <option value={BACKGROUND_TYPE.PANORAMA}>全景</option>
                            <option value={BACKGROUND_TYPE.SKY}>天空盒</option>
                            <option value={BACKGROUND_TYPE.CUBEMAP}>六面图 (CubeMap)</option>
                            <option value={BACKGROUND_TYPE.NONE}>无(透明)</option>
                        </select>
                    </div>

                    {sceneConfig.backgroundType === BACKGROUND_TYPE.COLOR && (
                        <PropertyField
                            label="背景颜色"
                            type="color"
                            inline
                            value={sceneConfig.backgroundValue}
                            onChange={(val) => updateSceneConfig({ backgroundValue: val })}
                        />
                    )}

                    {(sceneConfig.backgroundType === BACKGROUND_TYPE.IMAGE || sceneConfig.backgroundType === BACKGROUND_TYPE.PANORAMA || sceneConfig.backgroundType === BACKGROUND_TYPE.CUBEMAP) && (
                        <AssetPicker
                            label={
                                sceneConfig.backgroundType === BACKGROUND_TYPE.PANORAMA ? "全景资源 URL" :
                                    sceneConfig.backgroundType === BACKGROUND_TYPE.CUBEMAP ? "六面图 (用逗号分隔 6 个 URL)" : "图片资源 URL"
                            }
                            type={sceneConfig.backgroundType === BACKGROUND_TYPE.PANORAMA ? 'hdr' : 'image'}
                            value={sceneConfig.backgroundValue}
                            onChange={(val) => updateSceneConfig({ backgroundValue: val })}
                        />
                    )}

                    {sceneConfig.backgroundType === BACKGROUND_TYPE.SKY && (
                        <div className="space-y-3">
                            <label className="text-[10px] opacity-50 uppercase">太阳位置</label>
                            <div className="grid grid-cols-3 gap-2">
                                <PropertyField
                                    label="X"
                                    type="number"
                                    value={sceneConfig.sunPosition[0]}
                                    onChange={(val) => updateSceneConfig({ sunPosition: [val, sceneConfig.sunPosition[1], sceneConfig.sunPosition[2]] })}
                                />
                                <PropertyField
                                    label="Y"
                                    type="number"
                                    value={sceneConfig.sunPosition[1]}
                                    onChange={(val) => updateSceneConfig({ sunPosition: [sceneConfig.sunPosition[0], val, sceneConfig.sunPosition[2]] })}
                                />
                                <PropertyField
                                    label="Z"
                                    type="number"
                                    value={sceneConfig.sunPosition[2]}
                                    onChange={(val) => updateSceneConfig({ sunPosition: [sceneConfig.sunPosition[0], sceneConfig.sunPosition[1], val] })}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </PropertySection>

            <PropertySection title="环境照明" icon={<Sun size={12} />}>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] opacity-50 uppercase font-bold tracking-wider">环境来源</label>
                        <select
                            value={sceneConfig.environmentType}
                            onChange={(e) => updateSceneConfig({ environmentType: e.target.value })}
                            className="w-full bg-black/60 border border-white/10 rounded-md px-3 py-2 text-xs text-white focus:border-blue-500 outline-none"
                        >
                            <option value={ENVIRONMENT_TYPE.PRESET}>官方预设</option>
                            <option value={ENVIRONMENT_TYPE.IMAGE}>普通贴图</option>
                            <option value={ENVIRONMENT_TYPE.NONE}>无（仅环境光）</option>
                        </select>
                    </div>

                    {sceneConfig.environmentType === ENVIRONMENT_TYPE.PRESET && (
                        <div className="space-y-2">
                            <label className="text-[10px] opacity-50 uppercase">选择预设</label>
                            <select
                                value={sceneConfig.environmentValue}
                                onChange={(e) => updateSceneConfig({ environmentValue: e.target.value as EnvPreset })}
                                className="w-full bg-black/60 border border-white/10 rounded-md px-3 py-2 text-xs text-white focus:border-blue-500 outline-none"
                            >
                                {ENV_PRESETS.map(preset => (
                                    <option key={preset} value={preset}>{ENV_PRESET_LABELS[preset] || preset}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {sceneConfig.environmentType === ENVIRONMENT_TYPE.IMAGE && (
                        <AssetPicker
                            label="环境贴图 URL"
                            type="image"
                            value={sceneConfig.environmentValue}
                            onChange={(val) => updateSceneConfig({ environmentValue: val })}
                        />
                    )}

                    <PropertyField
                        label="曝光强度"
                        type="range"
                        min={0}
                        max={5}
                        step={0.1}
                        value={sceneConfig.exposure}
                        onChange={(val) => updateSceneConfig({ exposure: val })}
                    />
                </div>
            </PropertySection>

            <PropertySection title="操作设置" icon={<MousePointer2 size={12} />}>
                <div className="space-y-3">
                    <PropertyField
                        label="位移吸附"
                        type="number"
                        min={0}
                        step={0.1}
                        value={sceneConfig.snapTranslation}
                        onChange={(val) => updateSceneConfig({ snapTranslation: val })}
                    />
                    <PropertyField
                        label="旋转吸附(度)"
                        type="number"
                        min={0}
                        step={1}
                        value={sceneConfig.snapRotation}
                        onChange={(val) => updateSceneConfig({ snapRotation: val })}
                    />
                    <div className="mt-2 text-[10px] text-gray-500 bg-gray-500/10 p-2 rounded leading-relaxed">
                        提示: 设置为 0 可关闭吸附。
                    </div>
                </div>
            </PropertySection>

            <PropertySection title="视角书签" icon={<Camera size={12} />}>
                <div className="space-y-3">
                    <button
                        onClick={saveBookmark}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs py-2 rounded-md transition-all shadow-lg shadow-blue-500/20"
                    >
                        <Plus size={14} /> 保存当前视角
                    </button>

                    <div className="space-y-1 mt-2">
                        {cameraBookmarks.length === 0 && (
                            <div className="text-[10px] text-gray-500 text-center py-4 italic">暂无书签</div>
                        )}
                        {cameraBookmarks.map(bookmark => (
                            <div key={bookmark.id} className="group flex items-center gap-2 p-2 rounded-md hover:bg-white/5 transition-all">
                                <MapPin size={12} className="text-blue-500" />
                                <span className="text-xs text-gray-300 flex-1 truncate">{bookmark.name}</span>
                                <button
                                    onClick={() => applyBookmark(bookmark)}
                                    className="opacity-0 group-hover:opacity-100 p-1 text-[10px] bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white rounded transition-all"
                                >
                                    应用
                                </button>
                                <button
                                    onClick={() => removeBookmark(bookmark.id)}
                                    className="opacity-0 group-hover:opacity-100 p-1 text-[10px] bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded transition-all"
                                >
                                    <Trash2 size={10} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </PropertySection>

            <PropertySection title="渲染辅助" icon={<Layers size={12} />}>
                <div className="space-y-3">
                    <PropertyField
                        label="实时阴影"
                        type="checkbox"
                        inline
                        value={sceneConfig.shadows}
                        onChange={(val) => updateSceneConfig({ shadows: val })}
                    />
                    <PropertyField
                        label="平面接触阴影"
                        type="checkbox"
                        inline
                        value={sceneConfig.contactShadows}
                        onChange={(val) => updateSceneConfig({ contactShadows: val })}
                    />
                    <PropertyField
                        label="显示网格辅助"
                        type="checkbox"
                        inline
                        value={sceneConfig.gridVisible}
                        onChange={(val) => updateSceneConfig({ gridVisible: val })}
                    />
                </div>
            </PropertySection>
        </div>
    );
};

export default React.memo(SceneSection);
