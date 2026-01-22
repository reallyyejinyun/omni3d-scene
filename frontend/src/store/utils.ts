import {
    type SceneGraphNode,
    type EditorState,
    type SceneObject,
    type RoamingNode
} from '@/types';
import * as THREE from "three"

/**
 * 递归克隆场景图节点
 * @param {SceneGraphNode} node - 源节点
 * @returns {SceneGraphNode} - 克隆后的新节点
 */
export const cloneNode = (node: SceneGraphNode): SceneGraphNode => {
    const newNode = {
        ...node,
        id: THREE.MathUtils.generateUUID(),
        sourceNodeId: node.id,
        originalName: node.originalName || node.name
    };
    if (newNode.children) {
        newNode.children = newNode.children.map(cloneNode);
    }
    return newNode;
};

/**
 * 在树形结构中更新指定节点的属性
 * @param {SceneGraphNode} node - 根节点
 * @param {string} targetId - 目标节点ID
 * @param {Partial<SceneGraphNode>} updates - 更新的属性包
 * @returns {SceneGraphNode} - 更新后的节点
 */
export const updateNodeInTree = (node: SceneGraphNode, targetId: string, updates: Partial<SceneGraphNode>): SceneGraphNode => {
    if (node.id === targetId) {
        return { ...node, ...updates };
    }
    if (node.children) {
        return { ...node, children: node.children.map((child: SceneGraphNode) => updateNodeInTree(child, targetId, updates)) };
    }
    return node;
};

/**
 * 从树形结构中移除节点
 * @param {SceneGraphNode} node - 根节点
 * @param {string} targetId - 目标节点ID
 * @returns {SceneGraphNode} - 处理后的节点
 */
export const removeNodeFromTree = (node: SceneGraphNode, targetId: string): SceneGraphNode => {
    if (node.children) {
        const index = node.children.findIndex((c: SceneGraphNode) => c.id === targetId);
        if (index !== -1) {
            return {
                ...node,
                children: node.children.filter((c: SceneGraphNode) => c.id !== targetId)
            };
        }
        return {
            ...node,
            children: node.children.map((c: SceneGraphNode) => removeNodeFromTree(c, targetId))
        };
    }
    return node;
};

/**
 * 在模型树中复制指定节点及其子集
 * @param {SceneGraphNode} node - 根节点
 * @param {string} targetId - 目标节点ID
 * @returns {SceneGraphNode} - 处理后的节点
 */
export const duplicateNodeInTree = (node: SceneGraphNode, targetId: string): SceneGraphNode => {
    if (node.children) {
        const childToClone = node.children.find((c: SceneGraphNode) => c.id === targetId);
        if (childToClone) {
            const clonedChild = cloneNode(childToClone);
            clonedChild.name = `${clonedChild.name} (副本)`;
            return {
                ...node,
                children: [...node.children, clonedChild]
            };
        }
        return {
            ...node,
            children: node.children.map((c: SceneGraphNode) => duplicateNodeInTree(c, targetId))
        };
    }
    return node;
};

/**
 * 记录当前快照到撤销历史栈中
 * @param {EditorState} state - 当前状态
 * @returns {Partial<EditorState>} - 包含更新后 past 栈的部分状态
 */
export const recordHistory = (state: EditorState): Partial<EditorState> => {
    const { objects, selectedId, selectedMeshId, sceneConfig, past } = state;
    const newPast = [...past, {
        objects,
        selectedId,
        selectedMeshId,
        sceneConfig
    }].slice(-50); // 限制历史记录上限
    return {
        past: newPast,
        future: []
    };
};

/**
 * 在树形结构中递归查找并移除对象
 */
export const findAndRemoveObject = (objects: SceneObject[], id: string): [SceneObject[], SceneObject | null] => {
    let removedObj: SceneObject | null = null;

    const process = (list: SceneObject[]): SceneObject[] => {
        return list.reduce((acc, obj) => {
            if (obj.id === id) {
                removedObj = obj;
                return acc;
            }
            if (obj.children && obj.children.length > 0) {
                const newChildren = process(obj.children);
                if (newChildren !== obj.children) {
                    acc.push({ ...obj, children: newChildren });
                    return acc;
                }
            }
            acc.push(obj);
            return acc;
        }, [] as SceneObject[]);
    };

    const newObjects = process(objects);
    return [newObjects, removedObj];
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
 * 预计算漫游航点间的飞行预测耗时
 * @param {RoamingNode[]} nodes - 航点序列
 * @returns {RoamingNode[]} - 包含计算后 travelTime 的航点序列
 */
export const recalculateRoamingTimes = (nodes: RoamingNode[]): RoamingNode[] => {
    if (nodes.length === 0) return [];

    return nodes.map((node, i) => {
        const prevIdx = (i - 1 + nodes.length) % nodes.length;
        const prev = nodes[prevIdx];

        if (nodes.length < 2) return { ...node, travelTime: 0 };

        const p1 = new THREE.Vector3(...prev.position);
        const p2 = new THREE.Vector3(...node.position);
        const dist = p1.distanceTo(p2);

        const travelTime = dist / (10 * (node.speed || 1));

        return { ...node, travelTime };
    });
};

/**
 * 还原选定物体到备份的原始状态（用于时间轴预览结束后的复位）
 */
export const revertObject = (list: SceneObject[], orig: NonNullable<EditorState['timelineOriginalState']>): SceneObject[] => {
    return list.map(obj => {
        if (obj.id === orig.id) {
            return {
                ...obj,
                position: [...orig.position],
                rotation: [...orig.rotation],
                scale: [...orig.scale],
                material: obj.material ? {
                    ...obj.material,
                    transparent: true,
                    opacity: orig.opacity,
                } : obj.material
            };
        }
        if (obj.children) return { ...obj, children: revertObject(obj.children, orig) };
        return obj;
    });
};

/**
 * 递归更新整个场景树中的指定对象
 */
export const updateRecursive = (list: SceneObject[], id: string, updates: Partial<SceneObject>, meshId?: string | null): SceneObject[] => {
    return list.map(obj => {
        if (obj.id === id) {
            if (meshId && obj.structure) {
                return {
                    ...obj,
                    structure: updateNodeInTree(obj.structure, meshId, updates as Partial<SceneGraphNode>)
                };
            }
            return { ...obj, ...updates };
        }
        if (obj.children) {
            return { ...obj, children: updateRecursive(obj.children, id, updates, meshId) };
        }
        return obj;
    });
};

/**
 * 递归复制并刷新的模型组件
 */
export const duplicateNodeRecursive = (list: SceneObject[], id: string, meshId: string): SceneObject[] => {
    return list.map(obj => {
        if (obj.id === id && obj.structure) {
            return {
                ...obj,
                structure: duplicateNodeInTree(obj.structure, meshId)
            };
        }
        if (obj.children) {
            return { ...obj, children: duplicateNodeRecursive(obj.children, id, meshId) };
        }
        return obj;
    });
};

/**
 * 在模型树中查找指定节点
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
 * 刷新对象树中所有节点的 GUID（克隆时使用）
 */
export const refreshIds = (node: SceneObject) => {
    if (node.children) {
        node.children = node.children.map(c => {
            const newChild = { ...c, id: THREE.MathUtils.generateUUID() };
            refreshIds(newChild);
            return newChild;
        });
    }
};

/**
 * 设置深层对象属性值
 */
const setDeepValue = (obj: any, path: string, value: any) => {
    const keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!current[key]) current[key] = {};
        current = current[key];
    }
    current[keys[keys.length - 1]] = value;
};

/**
 * 应用数据绑定到物体列表
 */
export const applyBindingsToObjects = (objects: SceneObject[], dataSourceValues: Record<number, Record<string, any>>): SceneObject[] => {
    return objects.map(obj => {
        let newObj = { ...obj };
        let hasChanges = false;

        if (obj.dataBindings) {
            Object.entries(obj.dataBindings).forEach(([bindingKey, binding]) => {
                if (!binding.enabled) return;

                const sourceValues = dataSourceValues[binding.dataSourceId];
                if (!sourceValues) return;

                const rawValue = sourceValues[binding.tagKey];
                if (rawValue === undefined) return;

                let finalValue = rawValue;
                if (binding.expression) {
                    try {
                        // eslint-disable-next-line no-new-func
                        const fn = new Function('value', `return ${binding.expression}`);
                        finalValue = fn(rawValue);
                    } catch (e) {
                        console.error('Expression error:', e);
                        return;
                    }
                }

                // 处理 bindingKey (格式: [meshId:]path.to.prop)
                let propertyPath = bindingKey;
                let targetNodeId: string | null = null;

                if (bindingKey.includes(':')) {
                    const parts = bindingKey.split(':');
                    targetNodeId = parts[0];
                    propertyPath = parts[1];
                }

                if (targetNodeId && newObj.structure) {
                    const targetNode = findNodeInTree(newObj.structure, targetNodeId);
                    if (targetNode) {
                        const updatedNode = { ...targetNode };
                        setDeepValue(updatedNode, propertyPath, finalValue);
                        newObj.structure = updateNodeInTree(newObj.structure, targetNodeId, updatedNode);
                        hasChanges = true;
                    }
                } else {
                    setDeepValue(newObj, propertyPath, finalValue);
                    hasChanges = true;
                }
            });
        }

        if (obj.children) {
            const nextChildren = applyBindingsToObjects(obj.children, dataSourceValues);
            if (nextChildren !== obj.children) {
                newObj.children = nextChildren;
                hasChanges = true;
            }
        }

        return hasChanges ? newObj : obj;
    });
};