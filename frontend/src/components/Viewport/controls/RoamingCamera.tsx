import React, { memo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { type RoamingNode } from '@/types';
import { useStore } from '@/store';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface RoamingCameraProps {
    active: boolean;
    nodes: RoamingNode[];
    index: number;
}

// 性能优化：复用对象避免 GC 压力
const _startPos = new THREE.Vector3();
const _endPos = new THREE.Vector3();
const _startQuat = new THREE.Quaternion();
const _endQuat = new THREE.Quaternion();

/**
 * 漫游摄像机组件：时间驱动的线性插值漫游点位
 */
const RoamingCamera: React.FC<RoamingCameraProps> = ({ active, nodes, index }) => {
    const { camera, controls } = useThree();
    const activeRoamingStartTime = useStore(state => state.activeRoamingStartTime);
    useFrame(() => {
        if (!active || nodes.length < 2 || !camera) return;

        const currentNode = nodes[index];
        if (!currentNode) return;

        // 获取起始航位 (当前点的前一个点)
        const prevIdx = (index - 1 + nodes.length) % nodes.length;
        const prevNode = nodes[prevIdx];

        // 计算当前阶段进度 (0.0 - 1.0)
        // 使用 performance.now() 确保精度，与 Store 同步
        const elapsed = (performance.now() - activeRoamingStartTime) / 1000;
        const travelTime = currentNode.travelTime || 0.1;
        const t = Math.min(1, elapsed / travelTime);

        // 使用 scratch 变量进行插值计算，避免每帧分配内存
        _startPos.set(...prevNode.position);
        _endPos.set(...currentNode.position);
        _startQuat.set(...prevNode.target);
        _endQuat.set(...currentNode.target);

        // 核心逻辑：基于时间比例的确定性插值
        camera.position.copy(_startPos).lerp(_endPos, t);
        camera.quaternion.copy(_startQuat).slerp(_endQuat, t);
    });

    // 漫游停止时，同步 OrbitControls 的 target
    React.useEffect(() => {
        if (!active && camera && controls instanceof OrbitControls) {

            // 同步到全局状态
            controls.target.copy(new THREE.Vector3(...nodes[index].orbitControlTarget));
            controls.update();
        }
    }, [active, camera, controls, index, nodes]);

    return null;
};

export default memo(RoamingCamera);
