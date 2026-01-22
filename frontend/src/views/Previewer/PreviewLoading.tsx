import React from 'react';
import { Spin, Typography, Space } from 'antd';

const { Text } = Typography;

/**
 * 预览加载转场组件
 */
const PreviewLoading: React.FC = () => {
    return (
        <div className="h-screen w-screen flex items-center justify-center bg-black">
            <Space orientation="vertical" align="center" size={24}>
                <Spin size="large" />
                <Text className="!text-sm !font-bold !tracking-widest !opacity-50 !uppercase">
                    正在加载 3D 场景数据...
                </Text>
            </Space>
        </div>
    );
};

export default React.memo(PreviewLoading);
