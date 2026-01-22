import React, { memo } from 'react';

interface BackgroundLayerProps {
    isHovered: boolean;
}

const BackgroundLayer: React.FC<BackgroundLayerProps> = ({ isHovered }) => {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            <div
                className="absolute inset-0 bg-cover bg-center scale-110 blur-[2px] opacity-40 transition-transform duration-[10s] ease-linear"
                style={{
                    backgroundImage: `url('/images/portal_bg.png')`,
                    transform: isHovered ? 'scale(1.15) translate(-10px, -10px)' : 'scale(1.1) translate(0, 0)'
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/20 via-[#050505]/80 to-[#050505]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]" />
        </div>
    );
};

export default memo(BackgroundLayer);
