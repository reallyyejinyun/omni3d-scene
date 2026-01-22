import React from 'react';
import { Trash2, Edit3, Move, Gauge, Clock } from 'lucide-react';
import { useStore } from '@/store';
import { type RoamingNode } from '@/types';
import * as THREE from 'three';

interface WaypointCardProps {
    node: RoamingNode;
    index: number;
    onEdit: (node: RoamingNode) => void;
}

const _position = new THREE.Vector3();
const _target = new THREE.Quaternion();

/**
 * 单个航点卡片组件
 */
const WaypointCard: React.FC<WaypointCardProps> = ({ node, index, onEdit }) => {
    const isRoaming = useStore(state => state.isRoaming);
    const controls = useStore(state => state.controls);
    const activeRoamingIndex = useStore(state => state.activeRoamingIndex);
    const removeRoamingNode = useStore(state => state.removeRoamingNode);

    const isActive = isRoaming && activeRoamingIndex === index;
    const camera = useStore(state => state.camera);

    const handleJump = React.useCallback(() => {
        if (!camera) return;

        // 1. 同步相机位置和旋转
        camera.position.copy(_position.set(...node.position));
        camera.quaternion.copy(_target.set(...node.target));


        if (controls) {
            controls.target.copy(_position.set(...node.orbitControlTarget));
            controls.update();
        }

    }, [camera, node, controls]);

    return (
        <div
            onClick={handleJump}
            className={`flex-shrink-0 w-48 h-32 rounded-xl border p-4 flex flex-col justify-between relative group transition-all cursor-pointer ${isActive
                ? 'bg-blue-500/10 border-blue-500 shadow-lg shadow-blue-500/10'
                : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.05]'
                }`}
        >
            <div>
                <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold ${isActive ? 'text-blue-400' : 'text-gray-500'}`}>
                        航点 #0{index + 1}
                    </span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => onEdit(node)}
                            className="p-1 px-1.5 bg-blue-500/10 text-blue-400 rounded hover:bg-blue-500 hover:text-white transition-all"
                            title="编辑航点"
                        >
                            <Edit3 size={11} />
                        </button>
                        <button
                            onClick={() => removeRoamingNode(node.id)}
                            className="p-1 px-1.5 bg-red-500/10 text-red-400 rounded hover:bg-red-500 hover:text-white transition-all"
                            title="删除航点"
                        >
                            <Trash2 size={11} />
                        </button>
                    </div>
                </div>
                <div className="text-[9px] mt-1 text-gray-400 space-y-1.5">
                    <div className="flex items-center gap-1.5 opacity-60">
                        <Move size={10} />
                        <span className="flex-1">坐标: {node.position[0].toFixed(1)}, {node.position[1].toFixed(1)}, {node.position[2].toFixed(1)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <Clock size={10} className="text-orange-400/60" />
                            <span>停留: {node.duration}s</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Gauge size={10} className="text-blue-400/60" />
                            <span>速度: {node.speed}x</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(WaypointCard);
