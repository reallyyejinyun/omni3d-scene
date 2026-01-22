import React, { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/store';

/**
 * 摄像机管理器：处理聚焦和视角切换
 */
const CameraManager: React.FC = () => {
    const { camera, controls } = useThree() as any;
    const focusTrigger = useStore(state => state.focusTrigger);
    const selectedId = useStore(state => state.selectedId);
    const selectedMeshId = useStore(state => state.selectedMeshId);
    const lastFocusTrigger = useRef(0);

    useEffect(() => {
        if (focusTrigger > 0 && focusTrigger !== lastFocusTrigger.current && selectedId) {
            lastFocusTrigger.current = focusTrigger;

            // 寻找目标对象
            const rootObj = (camera.parent as THREE.Scene).getObjectByProperty('uuid', selectedId);
            if (!rootObj) return;

            let targetObj = rootObj;
            if (selectedMeshId) {
                const subMesh = rootObj.getObjectByProperty('uuid', selectedMeshId);
                if (subMesh) targetObj = subMesh;
            }

            // 计算包围盒
            const box = new THREE.Box3().setFromObject(targetObj);
            const center = new THREE.Vector3();
            box.getCenter(center);
            const size = new THREE.Vector3();
            box.getSize(size);

            const maxDim = Math.max(size.x, size.y, size.z);
            const fov = camera.fov * (Math.PI / 180);
            let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
            cameraZ *= 2.5; // 稍微退后一点

            if (controls) {
                // 平滑移动相机 (简单实现)
                const targetPos = center.clone().add(new THREE.Vector3(cameraZ, cameraZ, cameraZ));

                // 设置目标
                controls.target.copy(center);
                camera.position.copy(targetPos);
                controls.update();
            }
        }
    }, [focusTrigger, selectedId, selectedMeshId, camera, controls]);

    return null;
};

export default CameraManager;
