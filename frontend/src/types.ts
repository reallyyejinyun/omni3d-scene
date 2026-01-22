import * as THREE from 'three';
import type { OrbitControls } from 'three/examples/jsm/Addons.js';

// 分页数据通用接口
export interface PageData<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
}

// 分页请求参数通用接口
export interface PageParams {
  current?: number;
  size?: number;
  [key: string]: any;
}

// 对象类型枚举
export const ObjectType = {
  BOX: 'BOX',
  SPHERE: 'SPHERE',
  CYLINDER: 'CYLINDER',
  TORUS: 'TORUS',
  CONE: 'CONE',
  PLANE: 'PLANE',
  LIGHT_POINT: 'LIGHT_POINT',
  LIGHT_DIR: 'LIGHT_DIR',
  LIGHT_SPOT: 'LIGHT_SPOT',
  GLTF: 'GLTF',
  LABEL: 'LABEL',
  SPRITE: 'SPRITE'
} as const;

export type ObjectType = typeof ObjectType[keyof typeof ObjectType];

// 导出格式枚举
export const ExportFormat = {
  JSON: 'json',
  JS: 'js',
  HTML: 'html'
} as const;

export type ExportFormat = typeof ExportFormat[keyof typeof ExportFormat];

// 变换模式枚举
export const TransformMode = {
  TRANSLATE: 'translate',
  ROTATE: 'rotate',
  SCALE: 'scale'
} as const;

export type TransformMode = typeof TransformMode[keyof typeof TransformMode];

// 数据绑定目标枚举
export const DataBindingTarget = {
  POSITION: 'position',
  ROTATION: 'rotation',
  SCALE: 'scale',
  COLOR: 'color',
  TEXT: 'text',
  LABEL: 'label'
} as const;

export type DataBindingTarget = typeof DataBindingTarget[keyof typeof DataBindingTarget];

// 材质配置接口
export interface MaterialConfig {
  color?: string;
  metalness?: number;
  roughness?: number;
  opacity?: number;
  transparent?: boolean;
  wireframe?: boolean;
  emissive?: string;
  emissiveIntensity?: number;
  mapUrl?: string; // 纹理URL
  map?: THREE.Texture; // 纹理
}

// 漫游节点接口
export interface RoamingNode {
  id: string;
  position: [number, number, number];
  target: [number, number, number, number];
  orbitControlTarget: [number, number, number];
  duration: number; // 停留时间（秒）
  speed: number;    // 飞行速度系数
  travelTime: number; // 预计算的飞行耗时（秒）
}

// 场景图节点接口（用于解析模型结构）
export interface SceneGraphNode {
  id: string; // 唯一标识
  name: string;
  type: THREE.Object3D['type'];
  children?: SceneGraphNode[];
  visible?: boolean;
  position?: number[];
  rotation?: number[];
  scale?: number[];
  material?: MaterialConfig; // 模型内部材质覆盖
  intensity?: number;
  distance?: number;
  decay?: number;
  castShadow?: boolean;
  receiveShadow?: boolean;
  locked?: boolean;
  userData: Record<string, any>;
  sourceNodeId?: string; // 克隆时的源节点 ID (用于强关联)
  originalName?: string; // 模型原始名称，由于 name 为可重命名，映射时需依赖原名
}

// 场景对象接口
export interface SceneObject {
  id: string;
  name: string;
  type: ObjectType;
  //是否以及被更新
  updated: boolean;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color?: string;
  htmlLabel?: string;
  material?: MaterialConfig;
  url?: string; // GLTF模型或贴图URL
  label?: string; // HTML标签内容
  visible: boolean;
  structure?: SceneGraphNode; // 解析后的模型结构树
  activeAnimations?: string[]; // 当前正在播放的多个动画名称 (多选)
  loadStatus?: 'pending' | 'loading' | 'success' | 'error'; // 资源加载状态
  intensity?: number; // 灯光强度
  distance?: number; // 灯光距离
  decay?: number; // 灯光衰减
  castShadow?: boolean; // 是否产生阴影
  receiveShadow?: boolean; // 是否接收阴影
  dataBindings?: Record<string, PropertyBinding>; // 属性绑定关系，Key 为属性路径如 "position.0", "material.color"
  locked?: boolean; // 是否锁定变换
  children?: SceneObject[]; // 子对象列表
  labelBinding?: LabelBinding; // 标签模板绑定关系

  // 第四阶段新增：动画与事件
  events?: {
    onClick?: ObjectEvent[];
  };
  customAnimations?: CustomAnimation[]; // 复杂关键帧动画列表
  activeCustomAnimationId?: string | null; // 当前正在运行的自定义动画ID
  activeCustomAnimationStartTime?: number; // 动画开始时间 (用于重置播放)
  sourceObjectId?: string; // 克隆时的源对象 ID (用于强关联)
  labelConfig?: LabelConfig; // 标签配置
}

export interface LabelConfig {
  offset: [number, number, number]; // 偏移量 [x, y, z]
  showLine: boolean; // 是否显示连接线
}

export type ObjectEventAction = 'PLAY_ANIMATION' | 'PLAY_CUSTOM_ANIMATION' | 'TOGGLE_VISIBLE' | 'SET_PROPERTY';

export interface ObjectEvent {
  id: string;
  action: ObjectEventAction;
  sourceMeshId?: string | null
  targetId?: string; // 目标对象ID (留空则为自身)
  targetMeshId?: string | null; // 目标模型内部组件 ID
  value?: any;      // 动作参数 (如动画名称、自定义动画ID、路径等)
}

export type EasingType = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'step';

export interface Keyframe {
  time: number;  // 0-1 进度
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  opacity?: number;
  visible?: boolean;
  easing?: EasingType; // 到达此点之前的缓动方式
}

export interface AnimationTrack {
  id: string;
  targetId?: string; // 动画目标节点 ID (支持 GLTF 内部组件，为空则是根对象)
  keyframes: Keyframe[];
}

export interface CustomAnimation {
  id: string;
  name: string;
  duration: number;
  loopType: 'loop' | 'once' | 'pingpong';
  autoPlay?: boolean; // 是否自动播放
  easing?: EasingType; // 默认缓动方式
  tracks: AnimationTrack[]; // 多轨道支持
}

// 历史记录项接口
export interface HistoryItem {
  objects: SceneObject[];
  selectedId: string | null;
  selectedMeshId?: string | null;
  sceneConfig: SceneConfig;
}

// 场景背景类型
export const BACKGROUND_TYPE = {
  COLOR: 'color',
  IMAGE: 'image',
  //全景
  PANORAMA: 'panorama',
  SKY: 'sky',
  CUBEMAP: 'cubemap',
  NONE: 'none'
} as const;

export type BackgroundType = typeof BACKGROUND_TYPE[keyof typeof BACKGROUND_TYPE];

// 环境贴图类型
export const ENVIRONMENT_TYPE = {
  PRESET: 'preset',
  IMAGE: 'image',
  NONE: 'none'
} as const;

export type EnvironmentType = typeof ENVIRONMENT_TYPE[keyof typeof ENVIRONMENT_TYPE];

// 环境预设列表
export const ENV_PRESETS = ['city', 'apartment', 'lobby', 'night', 'park', 'studio', 'sunset', 'warehouse', 'dawn', 'forest'] as const;

export type EnvPreset = typeof ENV_PRESETS[number];



// 场景配置接口
export interface SceneConfig {
  backgroundType: BackgroundType;
  backgroundValue: string; // 颜色值或资源URL
  environmentType: EnvironmentType | string;
  environmentValue: EnvPreset | string; // 预设名称或资源URL
  exposure: number;       // 曝光强度
  shadows: boolean;       // 是否开启阴影
  contactShadows: boolean;// 是否开启接触阴影
  gridVisible: boolean;   // 是否显示网格 (Grid)
  sunPosition: [number, number, number]; // 太阳位置
  postProcessing: PostProcessingConfig; // 后期处理配置
  snapTranslation: number; // 位移吸附步长 (0为不吸附)
  snapRotation: number;    // 旋转吸附角度 (度, 0为不吸附)
  cameraPosition?: [number, number, number]; // 相机位置
  cameraRotation?: [number, number, number]; // 相机旋转 (弧度)
  cameraTarget?: [number, number, number];   // 控制器目标点 (OrbitControls Target)
  cameraFov?: number; // 相机视野
  cameraNear?: number; // 相机近裁剪面
  cameraFar?: number; // 相机远裁剪面
}

export interface PostProcessingConfig {
  enabled: boolean;
  multisampling: number; // 抗锯齿倍率
  bloom: {
    enabled: boolean;
    intensity: number;
    radius: number;
    threshold: number;
  };
  ssao: {
    enabled: boolean;
    intensity: number;
    radius: number;
    samples: number;
  };
  vignette: {
    enabled: boolean;
    offset: number;
    darkness: number;
  };
  brightnessContrast: {
    enabled: boolean;
    brightness: number;
    contrast: number;
  };
  hueSaturation: {
    enabled: boolean;
    hue: number;
    saturation: number;
  };
}

export interface CameraBookmark {
  id: string;
  name: string;
  position: [number, number, number];
  target: [number, number, number];
}

export interface LabelTemplate {
  id: string;
  name: string;
  html: string; // HTML 结构，如 "<div class='title'>{{title}}</div>"
  css: string;  // CSS 样式
  fields: string[]; // 暴露的字段列表，如 ['title', 'value']
}

export interface LabelBinding {
  templateId: string;
  fieldMappings: Record<string, string | PropertyBinding>; // { templateField: mockDataKeyOrTemplate | DatabaseBinding }
}

/**
 * 属性数据绑定配置
 */
export interface PropertyBinding {
  enabled: boolean;
  dataSourceId: number;
  tagKey: string;
  expression?: string; // 数据处理表达式，如 "value * 1.5"
}

// 数据源 Tag 接口
export interface DataTag {
  id: string;
  key: string;      // 原始字段名，如 "temp"
  label: string;    // 显示名称，如 "环境温度"
  value: any;       // 当前实时值
}

// 数据源接口
export interface DataSource {
  id: number;
  name: string;
  url: string;
  method: string;
  headers?: string; // JSON 字符串
  params?: string;  // JSON 字符串
  tags?: string;    // JSON 字符串
  refreshInterval?: number; // 刷新间隔 (秒)
  config?: string;  // 存储解析后的 Tags 等配置 (包含 DataTag 数组)
  createTime?: string;
  updateTime?: string;
}

// 编辑器全局状态接口
export interface EditorState {
  scene: THREE.Scene | null; // 三维场景对象
  camera: THREE.Camera | null; // 相机对象
  gl: THREE.WebGLRenderer | null; // WebGL 渲染器
  controls: OrbitControls | null; // 相机控制对象
  objects: SceneObject[]; // 场景中的对象列表
  selectedId: string | null; // 当前选中的对象ID
  selectedMeshId?: string | null | undefined; // 当前选中的模型内部节点ID
  roamingNodes: RoamingNode[]; // 漫游路径节点列表
  isRoaming: boolean; // 是否处于漫游模式
  activeRoamingIndex: number; // 当前漫游到的节点索引
  activeRoamingStartTime: number; // 漫游开始或切换点位的时间戳
  transformMode: TransformMode; // 当前变换工具模式
  sceneConfig: SceneConfig; // 场景全局配置
  past: HistoryItem[]; // 历史记录栈（用于撤销）
  future: HistoryItem[]; // 未来记录栈（用于重做）
  focusTrigger: number; // 聚焦触发器 (时间戳)
  cameraBookmarks: CameraBookmark[]; // 摄像机书签
  timelineVisible: boolean; // 时间轴是否可见
  activeTimelineAnimationId: string | null; // 时间轴正在编辑的动画ID
  activeTimelineObjectId: string | null; // 时间轴正在编辑的对象ID
  isTimelinePlaying: boolean; // 是否正在播放
  bottomPanelHeight: number; // 底部面板高度
  leftTab: 'hierarchy' | 'assets'; // 左侧面板当前的标签
  leftSidebarVisible: boolean; // 左侧面板是否可见
  rightSidebarVisible: boolean; // 右侧面板是否可见
  bottomPanelVisible: boolean; // 底部面板是否可见
  labelTemplates: LabelTemplate[]; // 预设标签模板库
  css3dLabelVisible: boolean; // 场景中CSS3D标签是否可见
  templateManagerVisible: boolean; // 模板管理器是否可见
  timelineCurrentTime: number; // 时间轴当前指针时间 (s)
  isTransforming: boolean; // 是否正在被变换控制中 (用于避免动画冲突)
  timelineOriginalState: {
    id: string;
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
    opacity: number
  } | null; // 编辑动画帧前的原始状态
  dataSourceValues: Record<number, Record<string, any>>; // 数据源实时值缓存 { sourceId: { tagKey: value } }
  modelSelectorVisible: boolean; // 模型选择器是否可见
}
