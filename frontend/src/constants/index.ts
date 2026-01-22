import * as THREE from 'three';
import {
    ObjectType, TransformMode,
    BACKGROUND_TYPE, ENVIRONMENT_TYPE,
    type EditorState, type SceneObject, type SceneConfig,
    type EnvPreset
} from "@/types";

/**
 * 通用常量定义
 */

// 存储键名
export const STORAGE_KEYS = {
    SCENE_DATA: 'omni3d_scene_data',
    SCENE_CONFIG: 'omni3d_scene_config',
    ROAMING_NODES: 'omni3d_roaming_nodes',
} as const;

// 默认模型地址
export const DEFAULT_MODELS = {
    XIAOMI_SU7: '/models/xiaomisu7.glb',
} as const;

/**
 * 默认场景全局配置
 */
export const DEFAULT_SCENE_CONFIG: SceneConfig = {
    backgroundType: BACKGROUND_TYPE.COLOR,
    backgroundValue: '#111111',
    environmentType: ENVIRONMENT_TYPE.PRESET,
    environmentValue: 'city',
    exposure: 1.0,
    shadows: false,
    contactShadows: false,
    gridVisible: true,
    sunPosition: [100, 20, 100],
    postProcessing: {
        enabled: false,
        multisampling: 8,
        bloom: {
            enabled: false,
            intensity: 1.0,
            radius: 0.4,
            threshold: 0.9,
        },
        ssao: {
            enabled: false,
            intensity: 1.0,
            radius: 0.1,
            samples: 16,
        },
        vignette: {
            enabled: false,
            offset: 0.3,
            darkness: 0.5,
        },
        brightnessContrast: {
            enabled: false,
            brightness: 0.0,
            contrast: 0.0,
        },
        hueSaturation: {
            enabled: false,
            hue: 0.0,
            saturation: 0.0,
        },
    },
    snapTranslation: 0,
    snapRotation: 0,
    cameraPosition: [10, 10, 10],
    cameraRotation: [0, 0, 0],
    cameraTarget: [0, 0, 0],
    cameraFov: 45,
    cameraNear: 0.1,
    cameraFar: 1000,
};

/**
 * 创建对象时的默认配置
 */
export const DEFAULT_OBJECT_CONFIG: Omit<SceneObject, "id" | "name" | "type"> = {
    updated: true,
    position: [0, 0.5, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    visible: true,
    material: {
        color: '#3b82f6',
        metalness: 0.5,
        roughness: 0.2,
        opacity: 1,
        transparent: false,
        wireframe: false,
        emissive: '#000000'
    }
}

/**
 * 初始状态配置
 */
export const INITIAL_STATE: EditorState = {
    objects: [
        {
            id: THREE.MathUtils.generateUUID(),
            name: '初始立方体',
            updated: true,
            type: ObjectType.BOX,
            position: [0, 0.5, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
            color: "#a855f7",
            visible: true,
            material: {
                color: '#3b82f6',
                metalness: 1,
                roughness: 0,
                opacity: 1,
                transparent: false,
                wireframe: false,
                emissive: '#000000',
                // mapUrl: 'http://localhost:5174/venice_sunset_1k.hdr'
                // mapUrl: 'http://localhost:5174/bg.png'
            }
        }
    ],
    gl: null,
    selectedId: null,
    selectedMeshId: null,
    roamingNodes: [],
    isRoaming: false,
    activeRoamingIndex: 0,
    activeRoamingStartTime: 0,
    scene: null,
    camera: null,
    transformMode: TransformMode.TRANSLATE,
    sceneConfig: DEFAULT_SCENE_CONFIG,
    past: [],
    future: [],
    focusTrigger: 0,
    cameraBookmarks: [],
    controls: null,
    timelineVisible: false,
    activeTimelineAnimationId: null,
    activeTimelineObjectId: null,
    isTimelinePlaying: false,
    bottomPanelHeight: 280,
    leftTab: 'hierarchy',
    leftSidebarVisible: true,
    rightSidebarVisible: true,
    bottomPanelVisible: false,
    labelTemplates: [],
    timelineCurrentTime: 0,
    isTransforming: false,
    timelineOriginalState: null,
    modelSelectorVisible: false,
    css3dLabelVisible: true,
    templateManagerVisible: false,
    dataSourceValues: {},
};

// 对象类型对应的中文标签
export const typeLabels: Record<string, string> = {
    [ObjectType.BOX]: '立方体',
    [ObjectType.SPHERE]: '球体',
    [ObjectType.CYLINDER]: '圆柱体',
    [ObjectType.CONE]: '圆锥体',
    [ObjectType.TORUS]: '圆环',
    [ObjectType.PLANE]: '平面',
    [ObjectType.LIGHT_POINT]: '点光源',
    [ObjectType.LIGHT_DIR]: '平行光',
    [ObjectType.LIGHT_SPOT]: '聚光灯',
    [ObjectType.GLTF]: '外部模型',
    [ObjectType.LABEL]: 'HTML标签',
    [ObjectType.SPRITE]: '精灵'
};

// 环境预设中文标签映射
export const ENV_PRESET_LABELS: Record<EnvPreset, string> = {
    city: '城市',
    apartment: '公寓',
    lobby: '大厅',
    night: '夜晚',
    park: '公园',
    studio: '摄影棚',
    sunset: '日落',
    warehouse: '仓库',
    dawn: '黎明',
    forest: '森林'
};

export const ENV_PRESET_URLS: Record<EnvPreset, string> = {
    city: '/env-hdr/city.hdr',
    apartment: '/env-hdr/apartment.hdr',
    lobby: '/env-hdr/lobby.hdr',
    night: '/env-hdr/night.hdr',
    park: '/env-hdr/park.hdr',
    studio: '/env-hdr/studio.hdr',
    sunset: '/env-hdr/sunset.hdr',
    warehouse: '/env-hdr/warehouse.hdr',
    dawn: '/env-hdr/dawn.hdr',
    forest: '/env-hdr/forest.hdr'
};


export const EXTENSION_MAP: Record<string, string> = {
    '.glb': 'model',
    '.gltf': 'model',
    '.obj': 'model',
    '.fbx': 'model',
    '.stl': 'model',
    '.jpg': 'texture',
    '.jpeg': 'texture',
    '.png': 'texture',
    '.webp': 'texture',
    '.gif': 'texture',
    '.hdr': 'hdr',
    '.exr': 'hdr',
    '.mp4': 'video',
    '.webm': 'video',
    '.mov': 'video'
};

export const CATEGORIE_ENUM = {
    model: 'model',
    texture: 'texture',
    hdr: 'hdr',
    video: 'video',
    other: 'other'
}


export const CATEGORIES = [
    { value: 'all', label: '全部素材' },
    { value: CATEGORIE_ENUM.model, label: '3D 模型' },
    { value: CATEGORIE_ENUM.texture, label: '贴图/图片' },
    { value: CATEGORIE_ENUM.hdr, label: '环境光 (HDR)' },
    { value: CATEGORIE_ENUM.video, label: '视频素材' },
    { value: CATEGORIE_ENUM.other, label: '其他' },
];



// 几何体类型常量
export const GEOMETRY_TYPES: Record<string, string> = {
    BOX: 'boxGeometry',
    SPHERE: 'sphereGeometry',
    CYLINDER: 'cylinderGeometry',
    CONE: 'coneGeometry',
    TORUS: 'torusGeometry',
    PLANE: 'planeGeometry'
};

// 几何体默认参数
export const GEOMETRY_ARGS: Record<string, any[]> = {
    [ObjectType.BOX]: [1, 1, 1],
    [ObjectType.SPHERE]: [0.5, 32, 32],
    [ObjectType.CYLINDER]: [0.5, 0.5, 1, 32],
    [ObjectType.CONE]: [0.5, 1, 32],
    [ObjectType.TORUS]: [0.5, 0.2, 16, 100],
    [ObjectType.PLANE]: [1, 1]
};