import React, { useRef, useEffect, memo } from 'react';
import { createPortal } from 'react-dom';
import { Trash2 } from 'lucide-react';
import { type Keyframe } from '@/types';

interface KeyframeEditPortalProps {
    keyframe: Keyframe;
    rect: DOMRect;
    onClose: () => void;
    onRemove: () => void;
    onUpdate: (updates: Partial<Keyframe>) => void;
}

/**
 * 关键帧编辑悬浮窗
 */
const KeyframeEditPortal: React.FC<KeyframeEditPortalProps> = ({
    keyframe,
    rect,
    onClose,
    onRemove,
    onUpdate
}) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const h = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) onClose();
        };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, [onClose]);


    return createPortal(
        <div
            ref={ref}
            style={{
                position: 'fixed',
                left: rect.left + rect.width / 2,
                top: rect.top - 12,
                transform: 'translate(-50%, -100%)',
                zIndex: 9999
            }}
            className="w-56 bg-[#1a1a1a] border border-white/20 rounded-xl shadow-2xl p-4 animate-in slide-in-from-bottom-2 duration-150"
        >
            <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3">
                <span className="text-[10px] text-blue-400 font-bold uppercase">编辑关键帧</span>
                <button
                    onClick={onRemove}
                    className="p-1 hover:bg-red-500/20 text-red-500 rounded transition-colors"
                >
                    <Trash2 size={12} />
                </button>
            </div>

            <div className="space-y-4">
                <RenderVector3 label="位置 (Position)" field="position" onUpdate={onUpdate} value={keyframe.position}></RenderVector3>
                <RenderVector3 label="旋转 (Rotation)" field="rotation" onUpdate={onUpdate} value={keyframe.rotation}></RenderVector3>
                <RenderVector3 label="缩放 (Scale)" field="scale" onUpdate={onUpdate} value={keyframe.scale}></RenderVector3>
                <div className="space-y-1">
                    <label className="text-[9px] text-gray-500 font-bold uppercase block">透明度 (Opacity)</label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={keyframe.opacity ?? 1}
                        onChange={(e) => onUpdate({ opacity: parseFloat(e.target.value) })}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="flex justify-between text-[9px] text-gray-600">
                        <span>0%</span>
                        <span>{((keyframe.opacity ?? 1) * 100).toFixed(0)}%</span>
                        <span>100%</span>
                    </div>
                </div>
            </div>

            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#1a1a1a] border-r border-b border-white/20 rotate-45" />
        </div>,
        document.body
    );
};

interface RenderVector3Props {
    label: string;
    field: 'position' | 'rotation' | 'scale';
    onUpdate: KeyframeEditPortalProps['onUpdate'];
    value?: [number, number, number];
}
const RenderVector3: React.FC<RenderVector3Props> = ((props: RenderVector3Props) => {
    const { label, field, onUpdate, value } = props;
    const val = value || [0, 0, 0];
    const updateAxis = (axis: number, v: string) => {
        const newVal = [...val] as [number, number, number];
        newVal[axis] = parseFloat(v) || 0;
        onUpdate({ [field]: newVal });
    };

    return (
        <div className="space-y-1">
            <label className="text-[9px] text-gray-500 font-bold uppercase block">{label}</label>
            <div className="grid grid-cols-3 gap-1">
                {['X', 'Y', 'Z'].map((axis, i) => (
                    <div key={axis} className="relative">
                        <input
                            type="number"
                            step={field === 'rotation' ? 0.1 : 0.01}
                            value={val[i]}
                            onChange={(e) => updateAxis(i, e.target.value)}
                            className="w-full bg-black/40 border border-white/5 rounded px-1 py-1 text-[10px] text-white outline-none focus:border-blue-500/50"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
});


export default React.memo(KeyframeEditPortal);
