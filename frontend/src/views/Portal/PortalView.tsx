import React, { useState, useCallback } from 'react';
import BackgroundLayer from './components/BackgroundLayer';
import PortalNavbar from './components/PortalNavbar';
import PortalHero from './components/PortalHero';
import FeatureGrid from './components/FeatureGrid';
import PortalFooter from './components/PortalFooter';

const PortalView: React.FC = () => {
    const [isHovered, setIsHovered] = useState(false);

    const handleHoverStart = useCallback(() => setIsHovered(true), []);
    const handleHoverEnd = useCallback(() => setIsHovered(false), []);

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-purple-500/30">
            {/* Background Layer with Hero Image */}
            <BackgroundLayer isHovered={isHovered} />

            {/* Navigation */}
            <PortalNavbar />

            {/* Hero Section */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center">
                <PortalHero onHoverStart={handleHoverStart} onHoverEnd={handleHoverEnd} />

                {/* Feature Grid */}
                <FeatureGrid />
            </main>

            {/* Footer */}
            <PortalFooter />
        </div>
    );
};

export default PortalView;
