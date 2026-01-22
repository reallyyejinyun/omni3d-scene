import React from 'react';
import { Grid, ContactShadows } from '@react-three/drei';
import { useStore } from '@/store';

/**
 * 视口辅助组件
 * @returns 
 */
const ViewportHelpers: React.FC = () => {
    const gridVisible = useStore(state => state.sceneConfig.gridVisible);
    const contactShadows = useStore(state => state.sceneConfig.contactShadows);

    return (
        <>
            {gridVisible && (
                <Grid
                    infiniteGrid
                    fadeDistance={50}
                    cellColor="#333"
                    sectionColor="#555"
                    sectionThickness={1.5}
                    cellSize={1}
                    sectionSize={5}
                />
            )}

            {contactShadows && (
                <ContactShadows
                    opacity={0.4}
                    scale={20}
                    blur={2.4}
                    far={4.5}
                />
            )}
        </>
    );
};

export default React.memo(ViewportHelpers);
