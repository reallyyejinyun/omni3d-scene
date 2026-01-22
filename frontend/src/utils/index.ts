import * as THREE from 'three';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import { type SceneGraphNode, type MaterialConfig, type SceneObject, type CustomAnimation } from '../types';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

// 全局纹理加载器缓存，避免重复加载
export const textureCache = new Map<string, THREE.Texture>();
const loader = new THREE.TextureLoader();
export const hdrLoader = new RGBELoader();
export const textureLoader = {
    load(url: string, callBack: (texture: THREE.Texture) => void, onError?: (err: any) => void) {
        if (!url) {
            onError?.('Empty URL');
            return;
        }
        if (textureCache.has(url)) {
            callBack(textureCache.get(url)!);
            return;
        }
        if (url.toLowerCase().endsWith('.hdr')) {
            this.textureLoadHDR(url, callBack, onError);
        } else {
            this.textureLoad(url, callBack, onError);
        }
    },
    textureLoad(url: string, callBack?: (texture: THREE.Texture) => void, onError?: (err: any) => void) {
        loader.load(url, (t) => {
            t.colorSpace = THREE.SRGBColorSpace;
            t.needsUpdate = true;
            textureCache.set(url, t);
            callBack?.(t);
        }, undefined, (err) => {
            onError?.(err);
        });
    },
    textureLoadHDR(url: string, callBack?: (texture: THREE.Texture) => void, onError?: (err: any) => void) {
        hdrLoader.load(url, (t) => {
            t.mapping = THREE.EquirectangularReflectionMapping;
            t.colorSpace = THREE.LinearSRGBColorSpace;
            t.needsUpdate = true;
            textureCache.set(url, t);
            callBack?.(t);
        }, undefined, (err) => {
            onError?.(err);
        });
    }
}

/**
 * 智能克隆函数：自动检测并处理蒙皮网格 (SkinnedMesh)
 */
export const smartClone = (object: THREE.Object3D) => {
    let hasSkinnedMesh = false;
    object.traverse((node) => {
        if ((node as THREE.SkinnedMesh).isSkinnedMesh) hasSkinnedMesh = true;
    });

    if (hasSkinnedMesh) {
        return SkeletonUtils.clone(object);
    }
    return object.clone();
}

/**
 * 将材质配置应用到 Three.js 材质对象
 */
export const applyMaterialConfig = (material: THREE.Material, config: MaterialConfig) => {
    if (!material) return material;

    const m = material as any;

    // 基础颜色与属性
    if (m.color && m.color.isColor) {
        m.color.set(config.color);
    }
    if (m.emissive && m.emissive.isColor) {
        m.emissive.set(config.emissive);
    }

    m.metalness = config.metalness !== undefined ? config.metalness : m.metalness;
    m.roughness = config.roughness !== undefined ? config.roughness : m.roughness;
    m.opacity = config.opacity !== undefined ? config.opacity : m.opacity;
    m.transparent = config.transparent !== undefined ? config.transparent : m.transparent;
    m.wireframe = config.wireframe !== undefined ? config.wireframe : m.wireframe;

    // 贴图处理
    if (config.mapUrl) {
        textureLoader.load(config.mapUrl, (t) => {
            t.wrapS = t.wrapT = THREE.RepeatWrapping;
            m.map = t;
            if (m.map) m.map.url = config.mapUrl;
            m.needsUpdate = true;
        });
    } else {
        m.map = null;
    }
    m.needsUpdate = true;
    return m;
};

/**
 * 递归同步 Three.js 对象的属性 (Diff & Patch)
 * @param node 
 * @param structNode 
 */
export const applyVisibility = (node: THREE.Object3D, structNode: SceneGraphNode) => {
    if (structNode.name === node.name) node.uuid = structNode.id
    // 1. 同步自身属性
    if (node.visible !== !!structNode.visible) {
        node.visible = !!structNode.visible;
    }
    if (node.name !== structNode.name) {
        node.name = structNode.name;
    }

    // 同步阴影
    if (structNode.castShadow !== undefined) node.castShadow = structNode.castShadow;
    if (structNode.receiveShadow !== undefined) node.receiveShadow = structNode.receiveShadow;

    // 同步灯光属性
    const anyNode = node as any;
    if (structNode.intensity !== undefined) anyNode.intensity = structNode.intensity;
    if (structNode.distance !== undefined) anyNode.distance = structNode.distance;
    if (structNode.decay !== undefined) anyNode.decay = structNode.decay;

    if (structNode.position) {
        node.position.set(structNode.position[0], structNode.position[1], structNode.position[2]);
        node.updateMatrix();
    }
    if (structNode.rotation) {
        node.rotation.set(structNode.rotation[0], structNode.rotation[1], structNode.rotation[2]);
        node.updateMatrix();
    }
    if (structNode.scale) {
        node.scale.set(structNode.scale[0], structNode.scale[1], structNode.scale[2]);
        node.updateMatrix();
    }
    if (structNode.locked !== undefined) node.userData.locked = structNode.locked;

    // 应用材质覆盖
    if (structNode.material && (node as THREE.Mesh).material) {
        const mesh = node as THREE.Mesh;
        if (Array.isArray(mesh.material)) {
            mesh.material = mesh.material.map(m => applyMaterialConfig(m.clone(), structNode.material!));
        } else {
            mesh.material = applyMaterialConfig(mesh.material.clone(), structNode.material!);
        }
    }

    diffChildren(node, structNode);

};

/**
 * @description diff children
 * @param node 
 * @param structNode 
 */
export const diffChildren = (node: THREE.Object3D, structNode: SceneGraphNode) => {
    // 2. 对子节点进行 Diff
    const structChildren = structNode.children || [];
    const threeChildren = [...node.children];

    // 2.1 移除操作：优化移除逻辑
    // 只有当该节点既没有匹配的 ID，也没有匹配的名称，且没有匹配的原始名称时，才删除
    threeChildren.forEach(threeChild => {
        const inStructById = structChildren.find(sc => sc.id === threeChild.uuid);
        const inStructByName = structChildren.find(sc => sc.name === threeChild.name);
        // 新增：强关联校验，如果是原始节点，即使改名了，通过 originalName 也能认出来
        const inStructByOriginal = structChildren.find(sc => !sc.sourceNodeId && sc.originalName === threeChild.name);

        if (!inStructById && !inStructByName && !inStructByOriginal) {
            node.remove(threeChild);
            if ((threeChild as any).geometry) (threeChild as any).geometry.dispose();
            if ((threeChild as any).material) {
                const mats = Array.isArray((threeChild as any).material) ? (threeChild as any).material : [(threeChild as any).material];
                mats.forEach((m: any) => m.dispose());
            }
        }
    });

    // 2.2 新增与更新操作
    structChildren.forEach(structChild => {
        let threeChild = threeChildren.find(c => c.uuid === structChild.id);

        // 如果 ID 没匹配上 (比如重新加载模型后 UUID更新)
        if (!threeChild) {
            // 首先尝试通过原始名称匹配 (针对原始节点改名场景)
            if (!structChild.sourceNodeId) {
                threeChild = threeChildren.find(c => c.name === structChild.originalName);
            }

            // 其次尝试通过当前名称匹配 (兼容逻辑)
            if (!threeChild) {
                threeChild = threeChildren.find(c => c.name === structChild.name);
            }

            // 如果匹配到了，强制同步 UUID 以建立后续的强关联
            if (threeChild) {
                threeChild.uuid = structChild.id;
            }
        }

        // 如果节点在 Three.js 中确实不存在 -> 执行新增 (Clone 或 Create)
        if (!threeChild) {
            // 强关联克隆：优先通过 sourceNodeId 查找模板
            let sourceInfo = structChild.sourceNodeId ? threeChildren.find(c => c.uuid === structChild.sourceNodeId) : null;

            // 兜底：如果 sourceNodeId 没找到（比如由于重载导致源节点 UUID 变了），通过原始名称寻找模板
            if (!sourceInfo && structChild.originalName) {
                sourceInfo = threeChildren.find(c => c.name === structChild.originalName);
            }

            if (sourceInfo) {
                threeChild = smartClone(sourceInfo);
                threeChild.uuid = structChild.id;
                threeChild.name = structChild.name;
                node.add(threeChild);
            } else if (structChild.type === 'Group') {
                threeChild = new THREE.Group();
                threeChild.uuid = structChild.id;
                threeChild.name = structChild.name;
                node.add(threeChild);
            }
        }

        // 递归处理子节点
        if (threeChild) {
            applyVisibility(threeChild, structChild);
        }
    });

}
/**
 * 递归检查路径上是否有任何父级被锁定 (锁定继承)
 */
export const checkPathLocked = (node: SceneGraphNode | undefined, targetId: string): { found: boolean; pathLocked: boolean } => {
    if (!node) return { found: false, pathLocked: false };

    // 如果当前节点就是目标
    if (node.id === targetId) {
        return { found: true, pathLocked: node.locked || false };
    }

    if (node.children) {
        for (const child of node.children) {
            const result = checkPathLocked(child, targetId);
            if (result.found) {
                // 关键：如果路径上找到了目标，只要当前节点(父级)锁了，或者子级路径锁了，结果就是锁定的
                return {
                    found: true,
                    pathLocked: !!node.locked || result.pathLocked
                };
            }
        }
    }
    return { found: false, pathLocked: false };
};


/**
 * 计算动画播放的视觉进度 (考虑 pingpong 和 loop)
 */
export const calculateVisualProgress = (currentTime: number, duration: number, loopType?: string): number => {
    if (duration <= 0) return 0;
    const t = currentTime / duration;
    if (loopType === 'pingpong') {
        const cycle = Math.floor(t);
        const p = t % 1;
        return (cycle % 2 === 0) ? p : (1 - p);
    } else if (loopType === 'loop') {
        return t % 1;
    }
    return Math.min(Math.max(t, 0), 1);
};

/**
 * 递归检查从当前节点向上到根部是否有任何节点被锁定
 */
export const checkLockedUpward = (node: THREE.Object3D): boolean => {
    if (node.userData.locked) return true;
    if (node.userData.root) return false;
    if (node.parent) return checkLockedUpward(node.parent);
    return false;
};
/**
 * 递归查找节点
 */
export const findNodeInTree = (node: SceneGraphNode, id: string): SceneGraphNode | null => {
    if (node.id === id) return node;
    if (node.children) {
        for (const child of node.children) {
            const found = findNodeInTree(child, id);
            if (found) return found;
        }
    }
    return null;
};

/**
 * 在层级树中递归查找 SceneObject
 */
export const findObjectRecursive = (objects: SceneObject[], id: string): SceneObject | null => {
    for (const obj of objects) {
        if (obj.id === id) return obj;
        if (obj.children) {
            const found = findObjectRecursive(obj.children, id);
            if (found) return found;
        }
    }
    return null;
};

/**
 * @description 递归查找场景中所有正在播放的动画
 * @param arr 
 */
export const findActiveAnimations = (arr: SceneObject[]) => {
    const list: { obj: SceneObject; anim: CustomAnimation }[] = [];
    for (const o of arr) {
        const anims = o.customAnimations || [];
        for (const a of anims) {
            // 预览模式只看 autoPlay 或 当前活跃的动画ID
            if (o.activeCustomAnimationId === a.id || a.autoPlay) {
                list.push({ obj: o, anim: a });
            }
        }
        if (o.children) findActiveAnimations(o.children);
    }
    return list;
};


/**
 * 助手函数：从 Three.js 节点提取材质配置
 */
export const getMaterialConfig = (node: THREE.Object3D): MaterialConfig | undefined => {
    const mesh = node as THREE.Mesh;
    if (!mesh.material) return undefined;
    const mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
    const m = mat as any;
    let map = m.map;
    if (map) {
        textureCache.set(map.uuid, map);
    }
    return {
        color: m.color ? `#${m.color.getHexString()}` : '#ffffff',
        emissive: m.emissive ? `#${m.emissive.getHexString()}` : '#000000',
        metalness: m.metalness ?? 0,
        roughness: m.roughness ?? 1,
        opacity: m.opacity ?? 1,
        transparent: m.transparent ?? false,
        wireframe: m.wireframe ?? false,
        map: map,
        mapUrl: map?.url || map?.uuid
    };
};

/**
 * 助手函数：将模型解析为业务结构树
 */
export const parseStructure = (node: THREE.Object3D, animationNames: string[], rootId?: string): SceneGraphNode => {
    return {
        id: node.uuid,
        name: node.name || node.type,
        originalName: node.name || node.type,
        type: node.type,
        children: node.children.map(c => parseStructure(c, animationNames, rootId)),
        visible: node.visible,
        position: [node.position.x, node.position.y, node.position.z],
        rotation: [node.rotation.x, node.rotation.y, node.rotation.z],
        scale: [node.scale.x, node.scale.y, node.scale.z],
        material: getMaterialConfig(node),
        intensity: (node as any).intensity,
        distance: (node as any).distance,
        decay: (node as any).decay,
        castShadow: node.castShadow,
        receiveShadow: node.receiveShadow,
        locked: node.userData.locked,
        userData: {
            ...node.userData,
            animations: animationNames,
            castShadow: node.castShadow,
            receiveShadow: node.receiveShadow,
            sceneObjectId: rootId
        },
    };
};