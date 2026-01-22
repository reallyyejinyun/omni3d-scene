import React, { useState, useCallback } from 'react';
import { MousePointer2 } from 'lucide-react';
import { useStore } from '@/store';
import type { RoamingNode } from '@/types';
import * as THREE from 'three';

// 导入拆分后的子组件
import RoamingHeader from './RoamingHeader';
import WaypointCard from './WaypointCard';
import RoamingEditModal from './RoamingEditModal';

/**
 * 助手函数：获取当前相机的位置和方向
 */
const getCameraPositionAndDirection = (camera: THREE.Camera | null): Omit<RoamingNode, 'id' | 'orbitControlTarget'> => {
    if (!camera) return {
        position: [0, 0, 0],
        target: [0, 0, 0, 1],
        duration: 1,
        speed: 1,
        travelTime: 0
    };
    return {
        position: [camera.position.x, camera.position.y, camera.position.z],
        target: [camera.quaternion.x, camera.quaternion.y, camera.quaternion.z, camera.quaternion.w],
        duration: 1,
        speed: 1,
        travelTime: 0
    };
};

/**
 * 漫游面板组件：管理相机飞行路径航点
 */
const RoamingPanel: React.FC = () => {
    const roamingNodes = useStore(state => state.roamingNodes);
    const camera = useStore(state => state.camera);
    const controls = useStore(state => state.controls);
    const addRoamingNode = useStore(state => state.addRoamingNode);

    const [editingNode, setEditingNode] = useState<RoamingNode | null>(null);

    const handleAddRoamingNode = useCallback(() => {
        const { position, target } = getCameraPositionAndDirection(camera);
        let orbitControlTarget = controls?.target;
        if (!orbitControlTarget) orbitControlTarget = new THREE.Vector3(0, 0, 0);
        addRoamingNode(position, target, [orbitControlTarget.x, orbitControlTarget.y, orbitControlTarget.z]);
    }, [camera, addRoamingNode]);

    return (
        <div className="h-full bg-transparent flex flex-col overflow-hidden z-20 relative">
            <RoamingHeader onAddNode={handleAddRoamingNode} />

            {/* 航点列表 */}
            <div className="flex-1 flex gap-4 p-5 overflow-x-auto items-center custom-scrollbar">
                {roamingNodes.map((node, idx) => (
                    <WaypointCard
                        key={node.id}
                        node={node}
                        index={idx}
                        onEdit={setEditingNode}
                    />
                ))}

                {/* 空状态提示 */}
                {roamingNodes.length === 0 && (
                    <div className="w-full flex flex-col items-center justify-center text-xs opacity-20 italic py-8 border-2 border-dashed border-white/5 rounded-2xl">
                        <MousePointer2 size={24} className="mb-2" />
                        未定义漫游点。点击上方按钮记录当前视角。
                    </div>
                )}
            </div>

            {/* 编辑弹窗 */}
            {editingNode && (
                <RoamingEditModal
                    node={editingNode}
                    onClose={() => setEditingNode(null)}
                    onUpdate={setEditingNode}
                />
            )}
        </div>
    );
};

export default React.memo(RoamingPanel);
