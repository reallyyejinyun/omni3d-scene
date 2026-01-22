import { RouterProvider } from 'react-router-dom';
import { router } from '@/router';
import { ConfigProvider, theme } from 'antd';

export const appTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#9333ea', // 紫色主色调
    borderRadius: 12,
    colorBgBase: '#0c0c0c',
    colorTextBase: '#e5e5e5',
    colorBorder: 'rgba(255, 255, 255, 0.1)',
    colorBgContainer: 'rgba(255, 255, 255, 0.05)',
    colorBgElevated: '#1a1a1a',
  },
  components: {
    Button: {
      borderRadius: 10,
      controlHeight: 36,
    },
    Input: {
      colorBgContainer: 'rgba(255, 255, 255, 0.03)',
      colorBorder: 'rgba(255, 255, 255, 0.1)',
    },
    InputNumber: {
      colorBgContainer: 'rgba(255, 255, 255, 0.03)',
      colorBorder: 'rgba(255, 255, 255, 0.1)',
    },
    Select: {
      colorBgContainer: 'rgba(255, 255, 255, 0.03)',
      colorBorder: 'rgba(255, 255, 255, 0.1)',
    },
    Tabs: {
      itemSelectedColor: '#4096ff',
      inkBarColor: '#4096ff',
      itemHoverColor: '#4096ff',
      titleFontSize: 12,
      horizontalItemPadding: '12px 16px',
    }
  }
};

const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={appTheme}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};

export default App;
