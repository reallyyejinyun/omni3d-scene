import React, { memo } from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

const PortalFooter: React.FC = () => {
    return (
        <footer className="relative z-10 py-12 border-t border-white/5 bg-black/20 flex flex-col items-center">
            <Text className="!text-gray-500 !text-sm">© 2026 Omni3D Team. 版权所有.</Text>
        </footer>
    );
};

export default memo(PortalFooter);
