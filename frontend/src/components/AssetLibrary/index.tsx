import React, { useState } from 'react';
import CategorySection from './CategorySection';
import EnvironmentSection from './EnvironmentSection';
import MaterialSection from './MaterialSection';
import { CollapsibleSection } from './components/CollapsibleSection';

/**
 * 资源库组件 (Asset Library)
 * 提供可视化资源选择，支持一键添加至场景
 */
const AssetLibrary: React.FC = () => {
    const [expandedSections, setExpandedSections] = useState({
        quickAdd: true,
        environment: false,
        material: false
    });

    const toggleSection = (key: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="flex flex-col h-full bg-transparent overflow-hidden">
            <div className="flex-1 relative min-h-0">
                <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-4 space-y-6 pb-24">
                    {/* 1. 基础工具 */}
                    <CollapsibleSection
                        title="场景实例"
                        isOpen={expandedSections.quickAdd}
                        onToggle={() => toggleSection('quickAdd')}
                    >
                        <CategorySection />
                    </CollapsibleSection>

                    {/* 2. 环境预设 */}
                    <CollapsibleSection
                        title="环境预设"
                        isOpen={expandedSections.environment}
                        onToggle={() => toggleSection('environment')}
                    >
                        <EnvironmentSection />
                    </CollapsibleSection>

                    {/* 3. 材质预设 */}
                    <CollapsibleSection
                        title="材质预设"
                        isOpen={expandedSections.material}
                        onToggle={() => toggleSection('material')}
                    >
                        <MaterialSection />
                    </CollapsibleSection>
                </div>
            </div>
        </div>
    );
};



export default React.memo(AssetLibrary);
