import React, { useState, useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { textureLoader } from '@/utils';

/**
 * 包装材质逻辑，支持异步贴图加载
 */
export const TexturedMaterial: React.FC<{ material: any }> = ({ material }) => {
    const [texture, setTexture] = useState<THREE.Texture | null>(null);
    const { invalidate } = useThree();

    useEffect(() => {
        if (material?.mapUrl) {
            textureLoader.load(material.mapUrl, (tex) => {
                tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
                setTexture(tex);
                invalidate();
            }, () => {
                setTexture(null);
                invalidate();
            });
        } else {
            setTexture(null);
            invalidate();
        }
    }, [material?.mapUrl, invalidate]);

    if (!material) return null;

    return (
        <meshStandardMaterial
            onUpdate={(self) => {
                self.needsUpdate = true;
            }}
            color={material.color}
            roughness={material.roughness}
            metalness={material.metalness}
            transparent={material.transparent}
            opacity={material.opacity}
            wireframe={material.wireframe}
            emissive={material.emissive}
            map={texture}
            side={THREE.DoubleSide}
        />
    );
};

/**
 * 包装 Sprite 材质逻辑
 */
export const TexturedSpriteMaterial: React.FC<{ material: any }> = ({ material }) => {
    const [texture, setTexture] = useState<THREE.Texture | null>(null);
    const { invalidate } = useThree();

    useEffect(() => {
        if (material?.mapUrl) {
            textureLoader.load(material.mapUrl, (tex) => {
                setTexture(tex);
                invalidate();
            }, () => {
                setTexture(null);
                invalidate();
            });
        } else {
            setTexture(null);
            invalidate();
        }
    }, [material?.mapUrl, invalidate]);

    return (
        <spriteMaterial
            onUpdate={(self) => {
                self.needsUpdate = true;
            }}
            color={material?.color || '#ffffff'}
            map={texture}
            transparent={material?.transparent}
            opacity={material?.opacity}
        />
    );
};
