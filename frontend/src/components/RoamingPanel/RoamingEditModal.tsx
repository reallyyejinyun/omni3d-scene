import React from 'react';
import { Edit3, Gauge, Clock, Move } from 'lucide-react';
import { useStore } from '@/store';
import { type RoamingNode } from '@/types';
import Modal from '../common/Modal';

interface RoamingEditModalProps {
    node: RoamingNode;
    onClose: () => void;
    onUpdate: (node: RoamingNode) => void;
}

/**
 * 漫游点属性编辑弹窗
 */
const RoamingEditModal: React.FC<RoamingEditModalProps> = ({ node, onClose, onUpdate }) => {
    const updateRoamingNode = useStore(state => state.updateRoamingNode);
    const camera = useStore(state => state.camera);
    const handlePosChange = (axis: number, val: number) => {
        const newPos = [...node.position] as [number, number, number];
        newPos[axis] = val;
        const newNode = { ...node, position: newPos };
        onUpdate(newNode);
        updateRoamingNode(node.id, { position: newPos });
    };

    const handleTargetChange = (axis: number, val: number) => {
        const newTarget = [...node.target] as [number, number, number, number];
        newTarget[axis] = val;
        const newNode = { ...node, target: newTarget };
        onUpdate(newNode);
        updateRoamingNode(node.id, { target: newTarget });
    };

    const handleOrbitTargetChange = (axis: number, val: number) => {
        const newOrbitTarget = [...node.orbitControlTarget] as [number, number, number];
        newOrbitTarget[axis] = val;
        const newNode = { ...node, orbitControlTarget: newOrbitTarget };
        onUpdate(newNode);
        updateRoamingNode(node.id, { orbitControlTarget: newOrbitTarget });
    };

    const handleCaptureView = React.useCallback(() => {
        if (!camera) return;
        const updates = {
            position: [camera.position.x, camera.position.y, camera.position.z] as [number, number, number],
            target: [camera.quaternion.x, camera.quaternion.y, camera.quaternion.z, camera.quaternion.w] as [number, number, number, number],
        };
        const newNode = { ...node, ...updates };
        onUpdate(newNode);
        updateRoamingNode(node.id, updates);
    }, [camera, node, onUpdate, updateRoamingNode]);

    return (
        <Modal
            title="编辑航点详情"
            icon={<Edit3 size={14} className="text-blue-400" />}
            onClose={onClose}
            maxWidth="max-w-md"
            showOverlay={false}
            draggable={true}
            footer={
                <button
                    onClick={onClose}
                    className="px-6 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold rounded-lg transition-all shadow-lg shadow-blue-500/20"
                >
                    保存并关闭
                </button>
            }
        >
            <div className="space-y-6">
                {/* 位置编辑 */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">空间坐标 (Position)</label>
                        <button
                            onClick={handleCaptureView}
                            className="text-[9px] px-2 py-1 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded transition-all flex items-center gap-1 font-bold"
                        >
                            <Move size={10} /> 捕捉当前视角
                        </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {['X', 'Y', 'Z'].map((axis, i) => (
                            <div key={axis} className="space-y-1">
                                <div className="text-[8px] text-gray-600 font-bold ml-1">{axis}</div>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={node.position[i]}
                                    onChange={(e) => handlePosChange(i, parseFloat(e.target.value))}
                                    className="w-full bg-black/40 border border-white/5 rounded px-2 py-1.5 text-[10px] text-gray-200 outline-none focus:border-blue-500/50"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* 方向/旋转编辑 (四元数) */}
                <div className="space-y-3">
                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">视角方向 (Orientation - Quat)</label>
                    <div className="grid grid-cols-4 gap-2">
                        {['X', 'Y', 'Z', 'W'].map((axis, i) => (
                            <div key={axis} className="space-y-1">
                                <div className="text-[8px] text-gray-600 font-bold ml-1">{axis}</div>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={node.target[i]}
                                    onChange={(e) => handleTargetChange(i, parseFloat(e.target.value))}
                                    className="w-full bg-black/40 border border-white/5 rounded px-2 py-1.5 text-[10px] text-gray-200 outline-none focus:border-blue-500/50"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* 观察目标点编辑 */}
                <div className="space-y-3">
                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">观察中心 (Orbit Target)</label>
                    <div className="grid grid-cols-3 gap-2">
                        {['X', 'Y', 'Z'].map((axis, i) => (
                            <div key={axis} className="space-y-1">
                                <div className="text-[8px] text-gray-600 font-bold ml-1">{axis}</div>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={node.orbitControlTarget[i]}
                                    onChange={(e) => handleOrbitTargetChange(i, parseFloat(e.target.value))}
                                    className="w-full bg-black/40 border border-white/5 rounded px-2 py-1.5 text-[10px] text-gray-200 outline-none focus:border-blue-500/50"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="h-px bg-white/5" />

                {/* 停留时长 */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-gray-500">
                        <div className="flex items-center gap-1.5"><Clock size={12} /> 停留时长 (秒)</div>
                        <span className="text-blue-400">{node.duration}s</span>
                    </div>
                    <input
                        type="range" min="0" max="10" step="0.5"
                        value={node.duration}
                        onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            const newNode = { ...node, duration: val };
                            onUpdate(newNode);
                            updateRoamingNode(node.id, { duration: val });
                        }}
                        className="w-full h-1.5 bg-white/5 rounded-full appearance-none accent-blue-500 cursor-pointer"
                    />
                </div>

                {/* 飞行速度 */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-gray-500">
                        <div className="flex items-center gap-1.5"><Gauge size={12} /> 飞行速度 (倍率)</div>
                        <span className="text-blue-400">{node.speed}x</span>
                    </div>
                    <input
                        type="range" min="0.1" max="5" step="0.1"
                        value={node.speed}
                        onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            const newNode = { ...node, speed: val };
                            onUpdate(newNode);
                            updateRoamingNode(node.id, { speed: val });
                        }}
                        className="w-full h-1.5 bg-white/5 rounded-full appearance-none accent-blue-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[8px] text-gray-600 mt-1 uppercase font-bold">
                        <span>缓慢</span>
                        <span>标准</span>
                        <span>极速</span>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default React.memo(RoamingEditModal);
